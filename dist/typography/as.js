import { jsx as _jsx } from "react/jsx-runtime";
/** The cast lives here once instead of in each primitive; a per-tag generic would
 * only narrow `ref`, at the price of a generic in four public signatures. `as`
 * is not forwarded — on the DOM node it is an unknown attribute. */
export function TextAs({ as = "span", ...props }) {
    const As = as;
    return _jsx(As, { ...props });
}
