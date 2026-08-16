import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getLocalizedValue, type NewsPost } from "@/lib/types";

export default function NewsArticle({ post, locale, backLabel, galleryLabel }: { post: NewsPost; locale: string; backLabel: string; galleryLabel: string }) {
  const body = getLocalizedValue(post.body, locale);
  return <article>
    <header className="mx-auto max-w-4xl px-5 pb-10 pt-36 text-center md:pt-44">
      <Link
        href="/news"
        className="inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-[0.14em] text-byd-red transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-byd-red"
      >
        ← {backLabel}
      </Link>
      <time dateTime={post.publishedAt ?? undefined} className="mt-8 block text-xs uppercase tracking-[0.14em] text-white/45">{post.publishedAt ? new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(post.publishedAt)) : ""}</time>
      <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-6xl">{getLocalizedValue(post.title, locale)}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">{getLocalizedValue(post.excerpt, locale)}</p>
    </header>
    {post.coverImage && <div className="section-container"><div className="relative aspect-[16/8] overflow-hidden bg-[#242627]"><Image src={post.coverImage.url} alt={getLocalizedValue(post.coverImage.alt, locale)} fill priority className="object-cover" sizes="100vw" /></div></div>}
    <div className="mx-auto max-w-[75ch] px-5 py-14 md:py-20">{body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="mb-7 whitespace-pre-line text-base leading-8 text-white/75 md:text-lg">{paragraph}</p>)}</div>
    {!!post.gallery.length && <section className="section-container pb-20" aria-labelledby="news-gallery"><h2 id="news-gallery" className="mb-6 text-2xl font-bold text-white">{galleryLabel}</h2><div className="grid gap-4 md:grid-cols-2">{post.gallery.map((image, index) => <div key={`${image.url}-${index}`} className="relative aspect-[4/3] overflow-hidden bg-[#242627]"><Image src={image.url} alt={getLocalizedValue(image.alt, locale)} fill className="object-cover" sizes="(max-width: 767px) 100vw, 50vw" /></div>)}</div></section>}
  </article>;
}
