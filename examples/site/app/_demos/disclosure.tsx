import { Disclosure, DisclosureGroup } from "@supertype.ai/foundations/blocks";

/** Native <details>: no JavaScript, and correct before hydration. */
export default function DisclosureDemo() {
  return (
    <DisclosureGroup type="single" defaultValue="Retries">
      <Disclosure title="Retries">Three attempts, then backoff.</Disclosure>
      <Disclosure title="Timeouts">30s, then the job is requeued.</Disclosure>
      <Disclosure title="Dead letters">Kept 14 days, then dropped.</Disclosure>
    </DisclosureGroup>
  );
}
