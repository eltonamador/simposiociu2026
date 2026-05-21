import { CTABanner } from "@/components/cta-banner";
import { ProgramaContent } from "@/components/sections";

export const metadata = { title: "Programação · I Simpósio CBMAP 2026" };

export default function ProgramaPage() {
  return (
    <>
      <section className="section">
        <div className="section-head">
          <span className="kicker">Programação completa</span>
          <h2>3 dias de programação técnica</h2>
          <p>
            Palestras com referências nacionais, painéis tecnológicos com empresas parceiras e
            demonstração prática em pátio aberto. Programação sujeita a pequenos ajustes.
          </p>
        </div>
        <ProgramaContent />
      </section>
      <CTABanner />
    </>
  );
}
