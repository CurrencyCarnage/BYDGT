---
title: 'Keep navbar products synchronized with available catalog models'
type: 'bugfix'
created: '2026-07-28'
status: 'draft'
context:
  - 'C:/Users/Houpa/Desktop/Bmad/docs/byd-gt-phase-tracker.md'
  - 'C:/Users/Houpa/Desktop/Bmad/docs/handoff.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Products mega-menu reads a separate four-item `MEGA_MODELS` constant while the live catalog now contains five available products, so Sealion 06 EV is absent and the existing four-per-page arrow remains disabled.

**Approach:** Synchronize the shared desktop and mobile navbar product list with `/api/models`, while retaining an immediate five-model fallback and the existing curated imagery for known products. Continue to paginate the desktop preview in groups of four and list every available product in the mobile accordion.

## Boundaries & Constraints

**Always:** Show only models whose catalog record is available; keep model names in Latin characters in both locales; use localized taglines; preserve the current first-four ordering, curated menu imagery, four-card pagination, external sibling arrow column, and mobile product list; use a catalog model's hero image as the safe preview fallback for future products.

**Ask First:** Any redesign of the mega-menu, changes to catalog/API schemas, changes to product availability semantics, or replacement of current curated assets.

**Never:** Remove or bypass `visibleModels` pagination; overlay the arrow on cards; make the whole locale layout dynamic; couple this fix to ModelShowcase; hide the existing four products while the model request is loading or when it fails.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Current inventory | API returns five available models | First four remain on page one; arrow is enabled; page two shows Sealion 06 EV | N/A |
| Future inventory | API returns more available models | All available models appear across four-item desktop pages and in the full mobile list | Unknown models use their catalog hero image |
| Availability change | API returns unavailable models | Unavailable records do not appear in either navbar presentation | Clamp the active page if the list shrinks |
| API failure | Request rejects or returns invalid data | Existing products remain visible and usable | Keep the five-model fallback; do not blank the menu |

</frozen-after-approval>

## Code Map

- `src/components/layout/Navbar.tsx` — owns navbar model data, desktop mega-menu pagination, product cards, and mobile product accordion.
- `src/app/api/models/route.ts` — existing read-only model inventory endpoint used by the catalog/admin system.
- `content/models/sealion-06-ev.json` — fifth available model currently missing from the navbar source.

## Tasks & Acceptance

**Execution:**
- [ ] `src/components/layout/Navbar.tsx` — introduce a typed navbar model shape, add Sealion 06 EV to the resilient initial data, load available inventory from `/api/models`, merge catalog content with curated known-model previews, and drive desktop/mobile rendering from synchronized state.
- [ ] `src/components/layout/Navbar.tsx` — guard pagination when inventory changes and preserve the existing visible/disabled arrow treatment.

**Acceptance Criteria:**
- Given the five current available catalog models, when the English or Georgian Products menu is opened, then all five Latin model names are reachable.
- Given the initial desktop page, when the menu loads five models, then four cards render and the right-side arrow is enabled.
- Given the enabled arrow, when it is activated, then the next product group renders without overlapping the cards.
- Given a mobile viewport, when Products is expanded, then all available products render without pagination.
- Given the models endpoint fails, when the menu is opened, then the known five-model fallback remains functional.

## Spec Change Log

## Verification

**Commands:**
- `npx tsc --noEmit --incremental false` — expected: no TypeScript errors.
- `npm run lint` — expected: no ESLint errors or warnings.
- `git diff --check` — expected: no whitespace errors.

**Manual checks:**
- Open `/en` and `/ka`, hover Products at desktop width, confirm four cards on page one and Sealion 06 EV on page two.
- Expand Products on mobile and confirm all five models, Latin names, correct localized links, and no pagination control.
