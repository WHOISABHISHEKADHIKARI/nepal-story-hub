import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      <div className="page-shell section-space max-w-4xl">
        <div className="editorial-panel rounded-[2rem] px-6 py-10 md:px-10 md:py-12">
          <span className="section-kicker">About us</span>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            A publication that believes Nepal&apos;s story belongs first to Nepalis.
          </h1>
          <div className="prose-editorial mt-8 max-w-none">
            <p>
              Hamro Katha - &quot;our story&quot; - was started with a simple idea: the country
              deserves storytelling that comes from the inside. Travel writing without the
              tourist gaze. Cultural essays that do not romanticize. Business reporting
              that takes farmers and shopkeepers as seriously as tech founders.
            </p>
            <h2>What we publish</h2>
            <p>
              Long reads on the things that matter - agriculture, climate, culture,
              entrepreneurship, daily life, and the unfamous corners of Nepal. We
              publish in English to reach a wider audience, but we welcome stories
              translated from Nepali, Maithili, Newari, and other languages.
            </p>
            <h2>Who writes for us</h2>
            <p>
              Anyone who has something honest and well-told to say. Nepali residents,
              diaspora writers, foreign correspondents who have earned the right to write
              about Nepal - all welcome. We review every submission carefully and give
              real editorial feedback.
            </p>
            <h2>How we stay independent</h2>
            <p>
              We are community-funded and ad-supported. No single outlet, sponsor, or
              party shapes our editorial agenda. Featured posts and partnerships, when
              we add them, will always be marked clearly.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
