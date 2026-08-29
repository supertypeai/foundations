import { TypographyInlineCode } from "@supertype.ai/foundations";
import {
  extractHeadings,
  createSlugger,
  readingTime,
} from "@supertype.ai/foundations/essay";

/**
 * Plain functions over raw markdown, with no DOM and no compiled MDX, so they
 * run at build time. The `# comment` inside the fence is not treated as a
 * heading.
 */
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

// The same slugger the extractor uses, called directly to show the collision
// rule: a repeated title gets a numeric suffix instead of a duplicate id.
const slug = createSlugger();
const collisions = ["The queue", "The Queue!"].map((label) => [label, slug(label)]);

export default function MarkdownHelpersDemo() {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          extractHeadings(source)
        </p>
        <ul className="space-y-1">
          {headings.map((h) => (
            <li key={h.id} className={h.depth === 3 ? "pl-6" : undefined}>
              <span className="font-mono text-xs text-muted-foreground">h{h.depth}</span>{" "}
              {h.label}{" "}
              <TypographyInlineCode>#{h.id}</TypographyInlineCode>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          createSlugger()
        </p>
        <ul className="space-y-1">
          {collisions.map(([label, id]) => (
            <li key={id}>
              {label} → <TypographyInlineCode>#{id}</TypographyInlineCode>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          readingTime(source)
        </p>
        <p>
          {minutes} min. The fenced block is excluded from the count.
        </p>
      </div>
    </div>
  );
}
