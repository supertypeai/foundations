import { TypographyInlineCode } from "@supertype/foundations";
import { Steps, Step } from "@supertype/foundations/blocks";

export default function StepsDemo() {
  return (
    <Steps>
      <Step title="Add the package">
        Pin a tag, never <TypographyInlineCode>#main</TypographyInlineCode>.
      </Step>
      <Step title="Import the CSS, in order">
        Or run <TypographyInlineCode>npx foundations init</TypographyInlineCode> to write
        the imports for you.
      </Step>
      <Step title="Bind the fonts">
        With <TypographyInlineCode>.variable</TypographyInlineCode>, never{" "}
        <TypographyInlineCode>.className</TypographyInlineCode>.
      </Step>
    </Steps>
  );
}
