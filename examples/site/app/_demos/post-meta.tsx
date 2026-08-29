import {
  PostMetaRow,
  PostDate,
  MetaDot,
  ReadTime,
  TagPills,
} from "@supertype/foundations/essay";

/**
 * The byline row under a title. Each part is a separate component, so a listing
 * card can show the date and tags without the reading time.
 */
export default function PostMetaDemo() {
  return (
    <div className="space-y-6">
      {/* Article header: full month name, default size. */}
      <PostMetaRow>
        <PostDate date="2026-03-14" format="long" />
        <MetaDot />
        <ReadTime minutes={7} />
        <MetaDot />
        <TagPills tags={["infrastructure", "postgres"]} />
      </PostMetaRow>

      {/* Listing card: abbreviated date, small size. */}
      <PostMetaRow size="sm">
        <PostDate date="2026-03-14" />
        <MetaDot />
        <ReadTime minutes={7} />
      </PostMetaRow>
    </div>
  );
}
