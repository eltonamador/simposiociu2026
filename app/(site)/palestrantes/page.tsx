import { CTABanner } from "@/components/cta-banner";
import { FeaturedSpeakerCard, SpeakerCard } from "@/components/sections";
import { SPEAKERS } from "@/lib/data";

export const metadata = { title: "Palestrantes · I Simpósio CBMAP 2026" };

export default function PalestrantesPage() {
  return (
    <>
      <section className="section">
        <div className="section-head">
          <span className="kicker">Palestrantes</span>
          <h2>Oito especialistas. Quatro corporações. Um simpósio.</h2>
          <p>
            Convidados de Santa Catarina, Distrito Federal, Minas Gerais e do próprio Amapá vão
            compartilhar doutrina operacional, estudos de caso e novas práticas em combate a incêndio
            urbano.
          </p>
        </div>
        <FeaturedSpeakerCard />
        <div className="speakers-grid">
          {SPEAKERS.filter(s => !s.featured).map(s => <SpeakerCard key={s.name} s={s} />)}
        </div>
      </section>
      <CTABanner />
    </>
  );
}
