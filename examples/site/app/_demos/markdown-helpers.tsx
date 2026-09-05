import { TypographyEyebrow, TypographyInlineCode } from "@supertype.ai/foundations";
import {
  extractHeadings,
  createSlugger,
  readingTime,
} from "@supertype.ai/foundations/essay";

/** Plain functions over raw markdown, so they run at build time. */
const SOURCE = `## The queue

Three months, one migration, and a queue that would not drain.

\`\`\`bash
# not a heading
psql -c 'select 1'
\`\`\`

### Draining it

The slot was the problem all along.

## The measure`;

const headings = extractHeadings(SOURCE);
const minutes = readingTime(SOURCE);

// A repeated title gets a numeric suffix instead of a duplicate id.
const slug = createSlugger();
const collisions = ["The queue", "The Queue!"].map((label) => [
  label,
  slug(label),
]);

export default function MarkdownHelpersDemo() {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <TypographyEyebrow as="p" tone="muted" className="mb-2">
          extractHeadings(source)
        </TypographyEyebrow>
        <ul className="space-y-1">
          {headings.map((h) => (
            <li key={h.id} className={h.depth === 3 ? "pl-6" : undefined}>
              <span className="font-mono text-xs text-muted-foreground">
                h{h.depth}
              </span>{" "}
              {h.label} <TypographyInlineCode>#{h.id}</TypographyInlineCode>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <TypographyEyebrow as="p" tone="muted" className="mb-2">
          createSlugger()
        </TypographyEyebrow>
        <ul className="space-y-1">
          {collisions.map(([label, id]) => (
            <li key={id}>
              {label}: <TypographyInlineCode>#{id}</TypographyInlineCode>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <TypographyEyebrow as="p" tone="muted" className="mb-2">
          readingTime(source)
        </TypographyEyebrow>
        <p>{minutes} min. The fenced block is excluded from the count.</p>
      </div>
    </div>
  );
}
