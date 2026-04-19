import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <PublicLayout>
      <div className="page-shell section-space max-w-4xl">
        <span className="section-kicker">Get in touch</span>
        <h1 className="mt-3 font-display text-4xl md:text-6xl">Contact</h1>
        <p className="mt-4 max-w-2xl font-serif text-lg leading-8 text-muted-foreground">
          For story pitches, partnerships, corrections, or just to say hello.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="editorial-panel rounded-[1.5rem] p-6">
            <Mail className="mt-0.5 h-5 w-5 text-primary" />
            <div className="mt-5">
              <div className="font-semibold">Email</div>
              <a href="mailto:hello@hamrokatha.com" className="mt-2 block text-sm text-muted-foreground hover:text-primary">hello@hamrokatha.com</a>
              <div className="mt-2 text-xs text-muted-foreground">For pitches, write &quot;Pitch:&quot; in the subject line.</div>
            </div>
          </div>
          <div className="editorial-panel rounded-[1.5rem] p-6">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div className="mt-5">
              <div className="font-semibold">Editorial office</div>
              <div className="mt-2 text-sm text-muted-foreground">Patan, Lalitpur, Nepal</div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
