import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <PublicLayout>
      <div className="page-shell section-space max-w-5xl">
        <span className="section-kicker">Get in touch</span>
        <h1 className="mt-3 font-display text-4xl md:text-6xl">Contact the newsroom</h1>
        <p className="mt-4 max-w-2xl font-serif text-lg leading-8 text-muted-foreground">
          Pitches, corrections, collaborations, field notes, or a simple hello. We prefer clear emails and specific ideas.
        </p>

        <div className="contact-strip mt-10">
          <div className="essay-panel">
            <Mail className="mt-0.5 h-5 w-5 text-primary" />
            <div className="mt-5">
              <div className="font-display text-3xl">Email</div>
              <a href="mailto:hello@hamrokatha.com" className="mt-2 block text-base text-muted-foreground hover:text-primary">hello@hamrokatha.com</a>
              <div className="mt-3 text-sm leading-7 text-muted-foreground">For story ideas, use a subject line that starts with &quot;Pitch:&quot; and include the angle, reporting access, and why the story matters now.</div>
            </div>
          </div>
          <div className="essay-panel">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div className="mt-5">
              <div className="font-display text-3xl">Editorial office</div>
              <div className="mt-2 text-base text-muted-foreground">Patan, Lalitpur, Nepal</div>
              <div className="mt-3 text-sm leading-7 text-muted-foreground">We work close to the street: cafes, courtyards, and field reporting conversations count as part of the newsroom.</div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
