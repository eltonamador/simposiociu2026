import Link from "next/link";
import { Icon } from "@/components/icons";
import { Button } from "@/components/primitives";
import { CTABanner } from "@/components/cta-banner";
import {
  HeroSection,
  StatsBar,
  SobreSection,
  ProgramaContent,
  FeaturedSpeakerCard,
  SpeakerCard,
} from "@/components/sections";
import { SPEAKERS } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <SobreSection inline />

      <section className="section">
        <div className="section-head">
          <span className="kicker">Programação · 3 dias</span>
          <h2>De 24 a 26 de junho de 2026, no Anfiteatro da UNIFAP.</h2>
          <p>
            Cada dia combina palestras técnicas, painéis tecnológicos e momentos de networking com
            patrocinadores e parceiros. A seguir, o resumo de cada dia — clique para ver a programação
            completa.
          </p>
        </div>
        <ProgramaContent compact />
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/programa">
            <Button variant="secondary" iconRight={<Icon.Arrow />}>Ver programação completa</Button>
          </Link>
        </div>
      </section>

      <section className="section section--alt">
        <div className="section-inner">
          <div className="section-head">
            <span className="kicker">Quem vai palestrar</span>
            <h2>Referências nacionais e oficiais do CBMAP.</h2>
            <p>
              Oito palestras técnicas conduzidas por oficiais e instrutores de Santa Catarina, Distrito
              Federal, Minas Gerais e do próprio Amapá.
            </p>
          </div>
          <FeaturedSpeakerCard />
          <div className="speakers-grid">
            {SPEAKERS.filter(s => !s.featured).slice(0, 6).map(s => <SpeakerCard key={s.name} s={s} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/palestrantes">
              <Button variant="secondary" iconRight={<Icon.Arrow />}>Ver todos os palestrantes</Button>
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
