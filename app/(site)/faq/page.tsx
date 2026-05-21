import { CTABanner } from "@/components/cta-banner";
import { FaqList } from "@/components/sections";

export const metadata = { title: "FAQ · I Simpósio CBMAP 2026" };

export default function FAQPage() {
  return (
    <>
      <section className="section section--narrow">
        <div className="section-head">
          <span className="kicker">Perguntas frequentes</span>
          <h2>Tire suas dúvidas antes da inscrição</h2>
          <p>
            Reunimos as dúvidas mais comuns sobre o simpósio. Caso não encontre o que precisa, entre em
            contato pelos canais oficiais do CBMAP.
          </p>
        </div>
        <FaqList />
      </section>
      <CTABanner />
    </>
  );
}
