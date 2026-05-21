import { CTABanner } from "@/components/cta-banner";
import { Icon } from "@/components/icons";
import { Button } from "@/components/primitives";

export const metadata = { title: "Local · I Simpósio CBMAP 2026" };

export default function LocalPage() {
  return (
    <>
      <section className="section">
        <div className="section-head">
          <span className="kicker">Local do evento</span>
          <h2>Anfiteatro da UNIFAP · Macapá / AP</h2>
          <p>
            O simpósio acontece no Anfiteatro da Universidade Federal do Amapá — espaço amplo,
            acessível e com toda a infraestrutura técnica necessária para os três dias de programação.
          </p>
        </div>

        <div className="local-grid">
          <div className="local-map" aria-label="Mapa esquemático do local do evento"></div>

          <div className="local-card">
            <h3>Anfiteatro da UNIFAP</h3>
            <p className="addr">
              Universidade Federal do Amapá · Campus Marco Zero do Equador<br />
              Rod. Juscelino Kubitschek, KM-02 — Jardim Marco Zero · Macapá / AP
            </p>

            <div className="local-info-grid">
              <Row Icon={Icon.Calendar} label="Datas" value="24, 25 e 26 de junho de 2026" />
              <Row Icon={Icon.MapPin} label="Cidade" value="Macapá · Amapá" />
              <Row Icon={Icon.Users} label="Público-alvo" value="Bombeiros militares e civis, defesa civil, órgãos públicos e profissionais da área" />
              <Row Icon={Icon.Info} label="Acessibilidade" value="Local com rampas, banheiros adaptados e estacionamento." />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="https://www.google.com/maps/search/Anfiteatro+UNIFAP+Macapá" target="_blank" rel="noreferrer">
                <Button variant="secondary" icon={<Icon.MapPin />}>Abrir no Google Maps</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <CTABanner />
    </>
  );
}

function Row({ Icon: I, label, value }: { Icon: React.ComponentType; label: string; value: string }) {
  return (
    <div className="local-info-row">
      <div className="ico"><I /></div>
      <div>
        <div className="lbl">{label}</div>
        <div className="v">{value}</div>
      </div>
    </div>
  );
}
