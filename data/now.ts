export type NowTag = "Project" | "Learning" | "Writing";
export type NowStatus = "next" | "now" | "shipped";

export interface NowItem {
  title: string;
  tag: NowTag;
  status: NowStatus;
  note?: string;
  href?: string; // optional link, e.g. a case study or blog post
}

export const nowUpdated = "October 2026";

export const nowItems: NowItem[] = [
  // Now
 { status: "now", tag: "Project", title: "Buydair launch", note: "Waiting on Paystack verification, then live payments" },
  { status: "now", tag: "Project", title: "Offline CBT: autosave & terminal switching", href: "/work/offline-cbt" },
  { status: "now", tag: "Learning", title: "Python, and going deeper into AI" },

  // Next
  { status: "next", tag: "Project", title: "Buydair Learn v2", note: "Age-based courses, starting small" },
  { status: "next", tag: "Project", title: "Buydair auto top-up", note: "Scheduled airtime and data for self or family" },
  { status: "next", tag: "Writing", title: "How Buydair makes sure a payment never happens twice" },

  // Shipped
  { status: "shipped", tag: "Project", title: "New developer portfolio, with the Ask Peter assistant" },
  { status: "shipped", tag: "Project", title: "Buydair admin dashboard & Family feature", href: "/work/buydair" },
  { status: "shipped", tag: "Project", title: "True Worshippers Church platform", href: "/work/true-worshippers-church" },
];