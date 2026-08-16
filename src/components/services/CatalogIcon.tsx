import type { ReactNode } from "react";

/* Category line icons. Product photography does not exist yet, so each
   category gets a consistent mark rather than a broken image frame. */
const PATHS: Record<string, ReactNode> = {
  filters: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 5h17l-6.5 7.4V20l-4 1.4v-9L3.5 5Z" />
    </>
  ),
  brakes: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3.1" />
      <path strokeLinecap="round" d="M12 3.8v3.1M12 17.1v3.1M20.2 12h-3.1M6.9 12H3.8" />
    </>
  ),
  fluids: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.2s5.4 5.9 5.4 9.4a5.4 5.4 0 1 1-10.8 0C6.6 9.1 12 3.2 12 3.2Z"
      />
    </>
  ),
  electrical: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.4 2.6 5.2 13.4h5.6l-.8 8 8.2-10.8h-5.6l.8-8Z" />
    </>
  ),
  exterior: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.4 15.4h17.2m-15.6 0-1.2-4.2 2.6-4.4h10.4l2.6 4.4-1.2 4.2m-11.6 0v2.4m9.6-2.4v2.4"
      />
      <circle cx="7.6" cy="15.4" r="1.5" />
      <circle cx="16.4" cy="15.4" r="1.5" />
    </>
  ),
  protection: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.8 20 6v6.1c0 4.4-3.3 7.6-8 9.1-4.7-1.5-8-4.7-8-9.1V6l8-3.2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.9 12.1 2.2 2.2 4-4.4" />
    </>
  ),
  storage: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.4 8.2h17.2v11.2H3.4V8.2Zm0 0L5.8 4.6h12.4l2.4 3.6M12 8.2v11.2" />
    </>
  ),
  comfort: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.4 20.4v-3.2h11.2v3.2M7.6 17.2V6.8a2.4 2.4 0 0 1 2.4-2.4h4a2.4 2.4 0 0 1 2.4 2.4v10.4"
      />
    </>
  ),
  charging: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.4 3.4v4.2M14.6 3.4v4.2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.2 7.6h11.6v4.2a5.8 5.8 0 0 1-5.8 5.8 5.8 5.8 0 0 1-5.8-5.8V7.6Zm5.8 11.6v2.4"
      />
    </>
  ),
};

export default function CatalogIcon({ category }: { category: string }) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.3}
      aria-hidden="true"
    >
      {PATHS[category] ?? PATHS.protection}
    </svg>
  );
}
