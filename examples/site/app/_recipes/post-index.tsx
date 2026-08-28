import {
  TypographyEyebrow,
  TypographyH1,
  TypographyH3,
  TypographyProse,
  TypographyLink,
} from "@supertype/foundations";
import { PostMetaRow, PostDate, MetaDot, ReadTime, TagPills } from "@supertype/foundations/essay";

/**
 * An article index. The meta row is the reason to import from /essay here
 * instead of writing it by hand: `PostDate` uses `formatPostDate`, the same
 * function an OG image would call, so a card and its social preview always
 * print the same date.
 */
const POSTS = [
  {
    slug: "forty-workspaces",
    title: "What we learned shipping to forty workspaces",
    excerpt: "Three months, one migration, and a queue that would not drain.",
    date: "2026-03-14",
    minutes: 7,
    tags: ["infrastructure", "postgres"],
  },
  {
    slug: "slot-hygiene",
    title: "Slot hygiene, or how we filled a disk on a Sunday",
    excerpt: "An abandoned replication slot is a disk-usage graph with one direction.",
    date: "2026-02-02",
    minutes: 4,
    tags: ["postgres", "incidents"],
  },
];

export default function PostIndex() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <TypographyEyebrow>Notes</TypographyEyebrow>
      <TypographyH1 className="mt-2">Writing</TypographyH1>

      <div className="mt-10 space-y-10">
        {POSTS.map((post) => (
          <article key={post.slug}>
            <TypographyH3>
              <TypographyLink href={`/notes/${post.slug}`}>{post.title}</TypographyLink>
            </TypographyH3>

            <PostMetaRow size="sm" className="mt-2">
              <PostDate date={post.date} />
              <MetaDot />
              <ReadTime minutes={post.minutes} />
              <MetaDot />
              <TagPills tags={post.tags} />
            </PostMetaRow>

            <TypographyProse className="mt-3">{post.excerpt}</TypographyProse>
          </article>
        ))}
      </div>
    </section>
  );
}
