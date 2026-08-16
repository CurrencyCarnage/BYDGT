import type { NewsPost } from "@/lib/types";
import NewsCard from "./NewsCard";

export default function NewsGrid({ posts, locale, readLabel, emptyLabel }: { posts: NewsPost[]; locale: string; readLabel: string; emptyLabel: string }) {
  if (!posts.length) return <div className="border border-white/10 bg-[#191B1C] px-6 py-20 text-center text-white/55">{emptyLabel}</div>;
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{posts.map((post, index) => <NewsCard key={post.slug} post={post} locale={locale} readLabel={readLabel} priority={index === 0} />)}</div>;
}
