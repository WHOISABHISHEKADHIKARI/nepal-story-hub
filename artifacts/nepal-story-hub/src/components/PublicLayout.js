import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
export function PublicLayout({ children }) {
    return (_jsxs("div", { className: "min-h-screen flex flex-col text-foreground", children: [_jsx(SiteHeader, {}), _jsx("main", { className: "flex-1 pb-8", children: children }), _jsx(SiteFooter, {})] }));
}
