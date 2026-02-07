import rawContent from "@/data/site-content.json";
import type { SiteContent } from "@/models/content";

export function getSiteContent(): SiteContent {
  return rawContent as SiteContent;
}
