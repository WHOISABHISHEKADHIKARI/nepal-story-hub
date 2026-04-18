import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Get in touch</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Contact</h1>
        <p className="mt-4 text-muted-foreground font-serif text-lg">
          For story pitches, partnerships, corrections, or just to say hello.
        </p>

        <div className="mt-10 space-y-6">
          <div className="flex items-start gap-4 p-5 bg-card border border-border/60 rounded-lg">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-semibold">Email</div>
              <a href="mailto:hello@hamrokatha.com" className="text-sm text-muted-foreground hover:text-primary">hello@hamrokatha.com</a>
              <div className="text-xs text-muted-foreground mt-1">For pitches, write "Pitch:" in the subject line.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 bg-card border border-border/60 rounded-lg">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-semibold">Editorial office</div>
              <div className="text-sm text-muted-foreground">Patan, Lalitpur, Nepal</div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
