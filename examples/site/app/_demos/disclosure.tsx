import { Disclosure, DisclosureGroup } from "@supertype.ai/foundations/blocks";

/**
 * Built on the native <details> element: no JavaScript, and correct before
 * hydration. `type="single"` uses the browser's shared `name` attribute, so it
 * holds no client state and adds nothing to the bundle.
 */
export default function DisclosureDemo() {
  return (
    <DisclosureGroup type="single" defaultValue="Retries">
      <Disclosure title="Retries">Three attempts, exponential backoff.</Disclosure>
      <Disclosure title="Timeouts">30s, then the job is requeued.</Disclosure>
      <Disclosure title="Dead letters">Kept for 14 days, then dropped.</Disclosure>
    </DisclosureGroup>
  );
}
