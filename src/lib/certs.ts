import type { CollectionEntry } from "astro:content";
import { formatYearMonth } from "./date";

type CertData = CollectionEntry<"certs">["data"];

// Dates, never a derived "active" or "expired": a static build cannot know the
// day of the visit. See docs/adr/0002-certs-show-dates-not-state.md. A cert
// that does not expire shows its issue month alone, never "Present".
export function formatCertDates({
  issued,
  expires,
}: Pick<CertData, "issued" | "expires">): string {
  return expires === undefined
    ? formatYearMonth(issued)
    : `${formatYearMonth(issued)} — ${formatYearMonth(expires)}`;
}

// Newest first. `issued` is zero-padded YYYY-MM, so string order is date order.
// Takes collection entries, as `getCollection("certs")` returns them.
export function sortCerts<Entry extends { data: Pick<CertData, "issued"> }>(
  entries: readonly Entry[],
): Entry[] {
  return entries.toSorted((a, b) =>
    b.data.issued < a.data.issued ? -1 : b.data.issued > a.data.issued ? 1 : 0,
  );
}
