import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">About us</span>
        <h1 className="font-display text-4xl md:text-5xl mt-2 leading-tight">
          A publication that believes Nepal's story belongs to Nepalis.
        </h1>
        <div className="prose-editorial mt-8">
          <p>
            Hamro Katha — "our story" — was started with a simple idea: the country
            deserves storytelling that comes from the inside. Travel writing without the
            tourist gaze. Cultural essays that don't romanticize. Business reporting
            that takes farmers and shopkeepers as seriously as tech founders.
          </p>
          <h2>What we publish</h2>
          <p>
            Long reads on the things that matter — agriculture, climate, culture,
            entrepreneurship, daily life, and the unfamous corners of Nepal. We
            publish in English to reach a wider audience, but we welcome stories
            translated from Nepali, Maithili, Newari, and other languages.
          </p>
          <h2>Who writes for us</h2>
          <p>
            Anyone who has something honest and well-told to say. Nepali residents,
            diaspora writers, foreign correspondents who've earned the right to write
            about Nepal — all welcome. We review every submission carefully and give
            real editorial feedback.
          </p>
          <h2>How we stay independent</h2>
          <p>
            We're community-funded and ad-supported. No single outlet, sponsor, or
            party shapes our editorial agenda. Featured posts and partnerships, when
            we add them, will always be marked clearly.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
