# Admin Panel — Implementation Guide

**Status:** not production-ready. Runs only under local `next dev`.
**Target:** deployable admin panel on Vercel, with bulk import.

## How to use this document

This is a living spec. It has three jobs:

1. Record **why the admin panel is currently broken** and the order in which to fix it.
2. Specify the **import feature**.
3. Maintain the **Admin-editable registry** (§6) — every time a feature is
   built or changed on the public site, add a row describing how that value
   becomes editable here. Front-end work is not finished until its row exists.

Update §7 (Changelog) with each change.

---

## 1. What exists today

| Piece | Path | State |
|---|---|---|
| Login page | `src/app/admin/login/page.tsx` | Works |
| Auth config | `src/lib/auth.ts` | Works (credentials + JWT, 8h) |
| Route guard | `src/app/admin/(protected)/layout.tsx` | Works |
| Dashboard | `src/app/admin/(protected)/dashboard/page.tsx` | Works (read-only) |
| Product list | `src/app/admin/(protected)/models/page.tsx` | Works |
| Product editor | `src/components/admin/ModelEditForm.tsx` | Renders; **saves do not persist when deployed** |
| Products API | `src/app/api/models/route.ts`, `src/app/api/models/[id]/route.ts` | Auth-guarded; **writes fail when deployed** |
| Upload API | `src/app/api/upload/route.ts` | **Writes fail when deployed** |
| Asset serving | `src/app/api/assets/[...key]/route.ts` | Falls back to reading `public/` |
| Import | — | **Does not exist.** Specified in §5 |

Credentials come from `ADMIN_USERNAME` / `ADMIN_PASSWORD` (see
`.dev.vars.example`). There is a single admin identity; no user table.

---

## 2. Why it is broken — root cause

`src/lib/models.ts` and `src/lib/bookings.ts` are written with two storage
paths:

```ts
const db = getCloudflareEnv().DB;
if (db) { /* D1 */ }
return readAllFromDisk();          // fs fallback → content/models/*.json
```

`src/app/api/upload/route.ts` follows the same shape, falling back to
`fs.writeFile` into `public/images/...`.

**The D1 and R2 branches are unreachable.** `wrangler.jsonc` declares
`assets`, `services` and `images` bindings — but no `d1_databases` and no
`r2_buckets`. `getCloudflareEnv()` therefore always returns `{}` (its
`getCloudflareContext()` call throws off-Cloudflare and is swallowed by a
`try/catch`), so `DB` and `MEDIA_BUCKET` are always `undefined`.

Every deployment consequently takes the filesystem path — and serverless
filesystems are read-only and ephemeral, on both Vercel and Cloudflare
Workers. This is the whole bug:

> The admin panel appears to work locally because `next dev` has a real
> writable disk. Deployed, every save silently fails or is discarded on the
> next invocation.

Fixing "the admin panel on Vercel" means **replacing the storage layer**, not
patching the UI.

### Secondary blockers

| # | Issue | Fix |
|---|---|---|
| 2.1 | All deploy scripts are Cloudflare (`opennextjs-cloudflare build/deploy`) | Add Vercel-compatible scripts; `next build` already works |
| 2.2 | `.dev.vars` is a Wrangler convention; Vercel reads `.env.local` / dashboard vars | Add `.env.example`, document Vercel env setup |
| 2.3 | `NEXTAUTH_URL` is fixed; Vercel preview URLs change per deploy | Derive from `VERCEL_URL`, or set per environment |
| 2.4 | `@opennextjs/cloudflare` is a **runtime** dependency imported by `cloudflare-env.ts` | Keep, but isolate behind the storage adapter (§4.1) |
| 2.5 | `src/app/admin/(protected)/layout.tsx` begins with a UTF-8 BOM | Strip it |
| 2.6 | No CSRF/rate limiting on admin routes; single shared credential | §4.4 |

---

## 3. Decision required before coding

Pick a persistence target. Everything downstream depends on it.

| Option | Fits Vercel | Media storage | Notes |
|---|---|---|---|
| **Vercel Postgres + Vercel Blob** | Native | Blob | Recommended. Least glue, same vendor as hosting |
| Supabase (Postgres + Storage) | Yes | Storage | Good if a richer admin/user model is wanted later |
| Turso (libSQL) + S3/R2 | Yes | S3-compatible | Closest to the existing D1-flavoured SQL |
| Stay on Cloudflare | No | R2 | Requires adding the missing D1/R2 bindings instead — do this only if Vercel is dropped |

The rest of this document assumes **Vercel Postgres + Vercel Blob**. Swap the
driver in §4.1 if another option is chosen; nothing above the adapter changes.

---

## 4. Phase 1 — make it deployable

### 4.1 Introduce a storage adapter

Create `src/lib/storage/index.ts` exporting one interface, and move all
persistence behind it:

```ts
export interface ContentStore {
  listModels(): Promise<CarModel[]>;
  getModel(id: string): Promise<CarModel | undefined>;
  createModel(model: CarModel): Promise<CarModel>;
  updateModel(id: string, model: CarModel): Promise<CarModel>;
  deleteModel(id: string): Promise<void>;

  listBookings(from?: string): Promise<TestDriveBooking[]>;
  saveBooking(booking: TestDriveBooking): Promise<void>;

  putAsset(key: string, body: ArrayBuffer, contentType: string): Promise<string>;
  deleteAsset(key: string): Promise<void>;
}
```

Implementations:

- `src/lib/storage/postgres.ts` — production
- `src/lib/storage/fs.ts` — the current filesystem code, **used only when
  `NODE_ENV !== "production"`**, so local development keeps working with no
  database

Select at module load:

```ts
export const store: ContentStore =
  process.env.DATABASE_URL ? postgresStore : fsStore;
```

Then reduce `src/lib/models.ts` and `src/lib/bookings.ts` to thin re-exports
so no call site changes. Delete `src/lib/cloudflare-env.ts` and drop
`@opennextjs/cloudflare` from `dependencies` once nothing imports it.

Keep `models.data` as a JSON/JSONB column keyed by `id`, matching today's
shape — the existing `CarModel` type and `ModelEditForm` then need no changes.

```sql
CREATE TABLE models (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  id          TEXT PRIMARY KEY,
  data        JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE app_meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

Port the seed/migration logic from `ensureD1()` in `src/lib/models.ts` —
including `preserveCommercialTerms()`, which protects admin-entered prices
from being overwritten by seed data. **Do not lose that behaviour.**

Run it as a one-shot migration script, not on every request as `ensureD1`
does today.

### 4.2 Media uploads

Replace the `fs.writeFile` branch in `src/app/api/upload/route.ts` with
`putAsset()`. Store the returned absolute URL on the model record. Keep the
existing `hero` / `silhouette` / `heroVideo` key scheme so current paths stay
valid. Once uploads return absolute URLs, `src/app/api/assets/[...key]` is
only needed for legacy records — keep it reading from `public/` until they are
migrated.

Enforce on upload: max size (suggest 10 MB image / 50 MB video), an allow-list
of `image/jpeg|png|webp|avif` and `video/mp4`, and validation of the real
content type rather than trusting `file.type`.

### 4.3 Vercel configuration

Environment variables (Production + Preview + Development):

```
DATABASE_URL=            # Vercel Postgres
BLOB_READ_WRITE_TOKEN=   # Vercel Blob
ADMIN_USERNAME=
ADMIN_PASSWORD=          # bcrypt hash once §4.4 lands
NEXTAUTH_SECRET=         # openssl rand -base64 32
NEXTAUTH_URL=            # https://<prod-domain>
RESEND_API_KEY=
RESEND_FROM=
RESEND_ADMIN_EMAIL=
```

For preview deployments, resolve the URL dynamically:

```ts
const url =
  process.env.NEXTAUTH_URL ??
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`);
```

Add `.env.example` mirroring `.dev.vars.example`, and add build scripts that
do not shell out to Wrangler. Keep the Cloudflare scripts if that deploy
target is still live; they do not conflict.

Admin routes must not be statically optimised — add
`export const dynamic = "force-dynamic"` to `src/app/admin/(protected)/layout.tsx`.

### 4.4 Security hardening

- Store `ADMIN_PASSWORD` as a bcrypt hash; compare with `bcrypt.compare` in
  `authorize()`. Plaintext comparison there today.
- Add rate limiting to `/api/auth/*` (5 attempts / 15 min / IP).
- Add a `role` claim to the JWT now, even with one user, so §5 can gate import
  behind it without reissuing sessions later.
- Verify every mutating route calls `getServerSession` — `POST /api/models`
  does; re-check each new route.

**Exit criteria for Phase 1:** log in on a Vercel preview deployment, edit a
product, hard-refresh, and see the change persist.

---

## 5. Phase 2 — import

### 5.1 Scope

Bulk-create and bulk-update products from a file. Import is **additive and
reversible**; it never deletes products.

### 5.2 Formats

| Format | Use | Priority |
|---|---|---|
| JSON (array of `CarModel`) | Round-trips the existing export shape exactly; the safest path | **First** |
| CSV / XLSX | What a dealer actually maintains; flat columns mapped to nested fields | Second |

Ship JSON first — it needs no column mapping and can be validated against the
existing `CarModel` type.

### 5.3 Flow

```
Upload file
  → Parse + validate         (no writes)
  → Preview / dry-run report (create / update / skip / error, per row)
  → Operator confirms
  → Apply in a transaction
  → Write import record
  → Show result + undo option
```

**The dry-run step is mandatory.** Never write on upload.

### 5.4 Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/admin/import/validate` | Parse + validate, return report. No writes |
| `POST` | `/api/admin/import/commit` | Apply a previously validated batch by token |
| `GET` | `/api/admin/import/history` | List past imports |
| `POST` | `/api/admin/import/[id]/rollback` | Restore the snapshot from one import |

All require a valid session; reject otherwise with 401.

### 5.5 Validation rules

Per row, before anything is written:

- `id` present, matches `/^[a-z0-9-]+$/` after the same sanitisation as
  `createModel()` in `src/lib/models.ts`
- `name.en` present (mirrors the check in `POST /api/models`)
- `basePrice` numeric and ≥ 0 when present; `currency` a 3-letter code
- Localised fields carry both `en` and `ka`, or inherit `en` with a warning
- Referenced media URLs resolve, or the row is flagged (warning, not error)
- Unknown columns collected and reported rather than dropped silently
- Duplicate `id`s **within the file** are a hard error

Report shape:

```ts
type ImportReport = {
  token: string;                  // opaque handle for /commit, TTL 15 min
  summary: { create: number; update: number; skip: number; error: number };
  rows: Array<{
    line: number;
    id: string | null;
    action: "create" | "update" | "skip" | "error";
    messages: Array<{ level: "error" | "warning"; text: string }>;
    diff?: Record<string, { from: unknown; to: unknown }>;
  }>;
};
```

Show `diff` in the preview for updates — the operator must see what changes
before committing.

### 5.6 Conflict policy

Operator chooses per import:

- **Create only** — skip existing `id`s
- **Update only** — skip unknown `id`s
- **Upsert** — both (default)

For updates, **merge rather than replace**: an absent column must not blank an
existing field. Reuse `preserveCommercialTerms()` semantics — prices set in
the admin panel survive unless the file explicitly carries a new value.

### 5.7 Atomicity and rollback

Wrap the commit in a single transaction. Before applying, snapshot every
affected row into an `imports` table:

```sql
CREATE TABLE imports (
  id           TEXT PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by   TEXT NOT NULL,
  filename     TEXT NOT NULL,
  mode         TEXT NOT NULL,      -- create | update | upsert
  summary      JSONB NOT NULL,
  snapshot     JSONB NOT NULL,     -- prior state of touched rows
  rolled_back  BOOLEAN NOT NULL DEFAULT false
);
```

Rollback restores `snapshot` and marks the row. Media uploaded by a rolled-back
import is left in place — orphaned blobs are cheaper than broken references.

### 5.8 Limits

- Max 5 MB / 500 rows per file initially
- Reject files whose row count exceeds the limit rather than truncating
- Stream-parse CSV; do not read whole files into memory
- Commits above ~100 rows should report progress, since Vercel serverless
  functions have an execution ceiling — chunk into batches of 50 if needed

### 5.9 UI

Route: `src/app/admin/(protected)/import/page.tsx`; add to `AdminSidebar.tsx`.

1. Drop zone + format picker + conflict-policy radio
2. Validation report — summary counts, then a per-row table; errors first
3. Confirm button, disabled while any hard error exists
4. Result screen with an **Undo** button and a link to import history
5. Downloadable error report (CSV) so the operator can fix and re-upload

Provide a **Download template** link generating a file from the current
`CarModel` shape, so the expected columns are never guessed.

---

## 6. Admin-editable registry

Everything the public site renders that a non-developer should be able to
change. **Add a row whenever a feature is built.**

Status: `DB` = already database-backed · `HARD` = hardcoded, needs migrating ·
`TODO` = planned

| # | Value | Source today | Status | How it becomes editable |
|---|---|---|---|---|
| 1 | Products (name, specs, colours, variants, price) | `models` table / `content/models/*.json` | DB | Already in `ModelEditForm`. Just needs Phase 1 to persist |
| 2 | Product media (hero, silhouette, video) | `public/images/models/**` | HARD | Phase 1 §4.2 — move to Blob, store URL on the model |
| 3 | Test-drive products & versions | `testDriveModels` in `src/lib/test-drive.ts` | HARD | Derive from the `models` table instead of a parallel constant. Same ids already |
| 4 | Trim levels | `officialTrimLabels` in `src/lib/test-drive.ts` | HARD | Move onto `CarModel.configurations.variants`; `getTrimsForVersion()` reads from the store. Removes the second source of truth |
| 5 | Booking time slots (`09:00`–`19:00`) | `TIME_SLOTS` in `src/lib/test-drive.ts` | HARD | `settings` table, key `booking.timeSlots`. Admin screen: opening hours + slot length, generate the list |
| 6 | Booking window (min/max date) | `src/lib/date.ts` | HARD | Same `settings` table — `booking.leadTimeDays`, `booking.horizonDays` |
| 7 | Booked slots / bookings list | `bookings` table / `content/bookings/*.json` | DB | Needs a read-only admin screen: filter by date, export CSV, mark handled |
| 8 | Showroom address & map pin | `SHOWROOM` in `src/lib/test-drive.ts` | HARD | `settings`, key `showroom` |
| 9 | Navbar labels (EN/KA) | `src/lib/i18n/{en,ka}.json` | HARD | Translation editor — see §6.1 |
| 10 | Navbar width-sizer strings | `NAV_LABEL_SIZERS` in `src/components/layout/Navbar.tsx` | HARD | Delete once §6.1 lands; generate from the two catalogues at build time |
| 11 | CTA labels (`bookTestDrive`, `bookService`) | `common` in the message files | HARD | §6.1 |
| 12 | Service CTA target (`/services#service`) | `Navbar.tsx` | HARD | `settings`, key `nav.serviceCtaHref` |
| 13 | Services page copy, FAQ, categories | `landing.servicesPage.*` | HARD | §6.1 |
| 14 | Product-finder result set | `landing.servicesPage.results.*` | HARD | Own table once the real catalogue exists. Blocked on data |
| 15 | News articles | `src/lib/news.ts` | HARD | `news` table + admin CRUD. Highest-value addition after products |
| 16 | Service section pages (Service, Spare Parts, Accessories, Product Finder) | copy in `servicePages.*`; images in `src/lib/service-pages.ts` | HARD | §6.2 — dedicated editor, the first screen that manages both text and images |
| 17 | Spare Parts & Accessories catalogue (products, specs, options, fitment) | `CATALOG_ITEMS` in `src/lib/service-catalog.ts` | HARD | §6.3 — full CRUD, and the second consumer of the import pipeline (§5) |

### 6.2 Service page editor

The four pages at `/services/{service,spare-parts,accessories,product-finder}`
share one template (`src/components/services/ServicePageTemplate.tsx`) and one
content shape. That shape is already the schema for the admin form:

| Field | Type | Source today |
|---|---|---|
| `eyebrow`, `title`, `lead` | short text ×2 locales | `servicePages.<id>.*` |
| `primaryCta` | short text ×2 locales | `servicePages.<id>.primaryCta` |
| `bodyTitle`, `body` | text / long text ×2 locales | `servicePages.<id>.*` |
| `highlights.a|b|c` | 3 × {title, body} ×2 locales | `servicePages.<id>.highlights` |
| `points.a|b|c` | 3 × short text ×2 locales | `servicePages.<id>.points` |
| `ctaTitle`, `ctaBody` | text ×2 locales | `servicePages.<id>.*` |
| `meta.title`, `meta.description` | SEO ×2 locales | `servicePages.<id>.meta` |
| `hero`, `feature` | image slot | `SERVICE_PAGES` in `src/lib/service-pages.ts` |

Storage: one row per page.

```sql
CREATE TABLE service_pages (
  id          TEXT PRIMARY KEY,     -- service | spare-parts | accessories | product-finder
  content     JSONB NOT NULL,       -- { en: {...}, ka: {...} }
  hero_url    TEXT,                 -- overrides the bundled hero image
  feature_url TEXT,                 -- overrides the bundled feature image
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Images are already wired for this.** `ServiceImageSlot` in
`src/lib/service-pages.ts` carries `{ desktop, mobile, override? }`, and
`SlotImage` in the template prefers `override` when set. The admin panel only
needs to write a URL into `hero_url` / `feature_url` — no template change. A
cleared override falls back to the shipped asset, so a bad upload cannot leave
a page with no artwork.

**Text follows the translation editor (§6.1)**, not a bespoke form. The
`servicePages` namespace is structured exactly like the rest of the message
files, so once DB overrides merge over file defaults, these pages are editable
with no extra work. Build §6.1 first; a standalone form here would be thrown
away.

Until then the pages render from `src/lib/i18n/{en,ka}.json` and are
developer-edited. Copy currently in place is **placeholder** — written to be
presentable and structurally correct, not signed off by marketing.

Adding a fifth service page is: one entry in `SERVICE_PAGES`, one
`servicePages.<id>` block in both locales, one route file copied from an
existing one, and one entry in `serviceSectionLinks` in `Navbar.tsx`. Fold
those four steps into the admin panel's "add page" action when §6.1 lands.

### 6.1 Translation editing

Items 9, 11, 13 are all the same problem: copy lives in two large JSON files
that only a developer can edit.

Target: a `translations` table `(locale, key_path, value, updated_at)`, seeded
from `src/lib/i18n/*.json`, with the message loader in `src/i18n/request.ts`
merging DB overrides over the file defaults. Files stay as the fallback, so a
DB outage cannot blank the site.

Admin screen: searchable key list, EN and KA side by side, "missing
translation" filter, and a diff-against-default view.

This unblocks half the registry — schedule it directly after import.

### 6.3 Service catalogue (parts & accessories)

`/services/spare-parts` and `/services/accessories` render a filterable grid,
and each item has a detail page at `/services/<shop>/<slug>` with specs, an
option selector and an enquiry CTA. **There is no checkout and no price** —
every route ends in a `mailto` carrying the SKU and the selected options.

Source: `CATALOG_ITEMS` in `src/lib/service-catalog.ts`. The `CatalogItem`
type is already the table schema:

```sql
CREATE TABLE catalog_items (
  slug         TEXT NOT NULL,
  shop         TEXT NOT NULL,          -- spare-parts | accessories
  category     TEXT NOT NULL,
  sku          TEXT NOT NULL,
  name         JSONB NOT NULL,         -- { en, ka }
  summary      JSONB NOT NULL,
  description  JSONB NOT NULL,
  specs        JSONB NOT NULL,         -- [{ label:{en,ka}, value:{en,ka} }]
  options      JSONB NOT NULL,         -- [{ id, label, values[] }]
  fitment      JSONB NOT NULL,         -- model ids
  availability TEXT NOT NULL,          -- in-stock | to-order
  image_url    TEXT,                   -- null → category icon fallback
  sort_order   INTEGER NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (shop, slug)
);

CREATE TABLE catalog_categories (
  shop       TEXT NOT NULL,
  id         TEXT NOT NULL,
  label      JSONB NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (shop, id)
);
```

Admin screens needed:

1. **Item list** — filter by shop and category, search by SKU or name,
   reorder, toggle availability
2. **Item editor** — the fields above, with a repeatable row editor for
   `specs` and a nested one for `options`; EN and KA side by side
3. **Category manager** — add/rename/reorder per shop
4. **Bulk import** — this is the natural second consumer of §5. A parts
   catalogue arrives as a spreadsheet, so CSV matters more here than it does
   for products. Reuse the same validate → preview → commit → rollback flow

Notes for whoever builds it:

- **Product photography does not exist yet.** `CatalogIcon.tsx` draws a
  per-category line icon so nothing renders as a broken frame. Add
  `image_url` to the item and prefer it when set, exactly as
  `ServiceImageSlot` does for the service pages (§6.2) — icon stays the
  fallback, so a missing image can never break a card.
- `fitment` currently holds raw model ids as text chips. Once §4.1 lands it
  should be a foreign key onto `models`, so the admin picks from real
  products and the detail page can link to them.
- All product copy lives in the item row, **not** in the message files.
  Product content is data; only the surrounding chrome (`serviceShop.*`) is
  translation-editor territory. Do not merge the two.
- The enquiry address is hardcoded as `ENQUIRY_ADDRESS` in
  `CatalogDetail.tsx` — move it to `settings`, key `contact.partsEmail`.
- Everything in `CATALOG_ITEMS` today is **placeholder data** written to
  exercise the layout. None of it is real stock, and none of it is priced.

---

## 7. Changelog

| Date | Change |
|---|---|
| 2026-08-16 | Initial document. Root cause identified (§2), Vercel migration plan (§4), import spec (§5), registry seeded with rows 1–15 |
| 2026-08-16 | Services split into four standalone pages. Added registry row 16 and the service page editor spec (§6.2). Image override path already implemented in `ServiceImageSlot`; text editing deferred to §6.1 |
| 2026-08-16 | Spare Parts and Accessories became browsable catalogues with detail pages (enquiry, not checkout). Added registry row 17 and the catalogue CRUD/import spec (§6.3) |

---

## 8. Suggested order

1. **Phase 1** (§4) — storage adapter, Vercel config, security. Nothing else works until this does
2. **Import, JSON only** (§5, without CSV) — the whole flow with the simplest parser
3. **Registry items 3–6** — collapses the `test-drive.ts` constants into the store, and settles trims as one source of truth
4. **Translation editor** (§6.1) — unblocks items 9, 11, 13
5. **CSV/XLSX import** (§5.2) — once the JSON pipeline is proven
6. **News CRUD** (item 15)
