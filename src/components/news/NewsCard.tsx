import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getLocalizedValue, type NewsPost } from "@/lib/types";

export default function NewsCard({
  post,
  locale,
  readLabel,
  priority = false,
}: {
  post: NewsPost;
  locale: string;
  readLabel: string;
  priority?: boolean;
}) {
  const title = getLocalizedValue(post.title, locale);

  return (
    <article className="group flex h-full flex-col border border-white/10 bg-[#191B1C]">
      {post.coverImage && (
        <div className="relative aspect-[16/10] overflow-hidden bg-[#242627]">
          <Image
            src={post.coverImage.url}
            alt={getLocalizedValue(post.coverImage.alt, locale)}
            fill
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.025]"
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <time
          dateTime={post.publishedAt ?? undefined}
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-byd-red"
        >
          {post.publishedAt
            ? new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(post.publishedAt))
            : ""}
        </time>
        <h2 className="mt-3 text-xl font-bold leading-tight text-white">{title}</h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-white/55">{getLocalizedValue(post.excerpt, locale)}</p>
        <Link
          href={`/news/${post.slug}`}
          aria-label={`${readLabel}: ${title}`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:text-byd-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-byd-red"
        >
          {readLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
