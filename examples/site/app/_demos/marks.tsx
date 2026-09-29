import {
  CAP_TRIM,
  Mark,
  Marked,
  TypographyCaption,
  TypographyLabel,
  TypographyP,
} from "@supertype.ai/foundations";
import { Badge, Button } from "@supertype.ai/foundations/blocks";
import { Icons } from "../_components/icons";

export default function Marks() {
  return (
    <div className="space-y-6">
      {/* Before the words, and after them. */}
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <TypographyLabel mark={<Icons.Clock />}>Nothing collected yet</TypographyLabel>
        <TypographyCaption markEnd={<Icons.ChevronDown />}>90 days</TypographyCaption>
      </div>

      {/* A second line starts under the first, not under the mark. */}
      <TypographyCaption as="p" size="2xs" className="max-w-56" mark={<span className="size-4 rounded border" />}>
        Create tasks, which post to Slack, and change their status and due date
      </TypographyCaption>

      {/* A title and the lines under it. */}
      <Marked mark={<Icons.CheckCircle />} title={<TypographyLabel>Discount applied</TypographyLabel>}>
        <TypographyCaption as="p">20% off the first year, applied to every seat.</TypographyCaption>
      </Marked>

      {/* Inside a sentence. */}
      <TypographyP>
        Open the <Mark><Icons.Settings /></Mark> settings menu to change it.
      </TypographyP>

      {/* Taller than the line, so not a mark: the words centre on it. */}
      <div className="flex items-center gap-2">
        <span aria-hidden className="size-8 rounded-full bg-muted" />
        <TypographyLabel className={CAP_TRIM}>Ada Lovelace</TypographyLabel>
      </div>

      {/* Controls size their own. */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" tone="muted" size="xs">
          <Icons.Mail />
          CC a reply
        </Badge>
        <Badge variant="outline" tone="muted">
          <Icons.CalendarDays />
          Invite as a guest
        </Badge>
        <Button size="sm" variant="outline">
          <Icons.Copy />
          Copy address
        </Button>
      </div>
    </div>
  );
}
