import { Disclosure, DisclosureGroup } from "@supertype/foundations/blocks";

/**
 * A <details> element, so it needs no JavaScript and is correct before
 * hydration. Single-open mode uses the shared `name` attribute browsers support
 * natively, so it costs no state and adds nothing to the client bundle.
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
