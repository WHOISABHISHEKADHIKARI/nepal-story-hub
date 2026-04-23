import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
export const Route = createFileRoute("/contact")({
    component: ContactPage,
});
function ContactPage() {
    return (_jsx(PublicLayout, { children: _jsxs("div", { className: "page-shell section-space max-w-4xl", children: [_jsx("span", { className: "section-kicker", children: "Get in touch" }), _jsx("h1", { className: "mt-3 font-display text-4xl md:text-6xl", children: "Contact" }), _jsx("p", { className: "mt-4 max-w-2xl font-serif text-lg leading-8 text-muted-foreground", children: "For story pitches, partnerships, corrections, or just to say hello." }), _jsxs("div", { className: "mt-10 grid gap-5 md:grid-cols-2", children: [_jsxs("div", { className: "editorial-panel rounded-[1.5rem] p-6", children: [_jsx(Mail, { className: "mt-0.5 h-5 w-5 text-primary" }), _jsxs("div", { className: "mt-5", children: [_jsx("div", { className: "font-semibold", children: "Email" }), _jsx("a", { href: "mailto:hello@hamrokatha.com", className: "mt-2 block text-sm text-muted-foreground hover:text-primary", children: "hello@hamrokatha.com" }), _jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: "For pitches, write \"Pitch:\" in the subject line." })] })] }), _jsxs("div", { className: "editorial-panel rounded-[1.5rem] p-6", children: [_jsx(MapPin, { className: "mt-0.5 h-5 w-5 text-primary" }), _jsxs("div", { className: "mt-5", children: [_jsx("div", { className: "font-semibold", children: "Editorial office" }), _jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: "Patan, Lalitpur, Nepal" })] })] })] })] }) }));
}
