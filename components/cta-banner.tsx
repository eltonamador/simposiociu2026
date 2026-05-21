import Link from "next/link";
import { Icon } from "./icons";
import { Button } from "./primitives";

export function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="cta-inner">
        <div>
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px",
              borderRadius: 999, background: "rgba(225,30,44,.12)",
              border: "1px solid rgba(225,30,44,.3)", color: "var(--red-300)",
              fontFamily: "var(--font-mono)", fontSize: 11,
              textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 18,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red-500)", boxShadow: "0 0 10px var(--red-500)" }}></span>
            Inscrições abertas
          </span>
          <h2>Garanta sua vaga.<br /><em>É gratuito.</em></h2>
          <p>
            Preencha o formulário oficial em 4 etapas. Você receberá o protocolo na hora e a confirmação
            por e-mail.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/inscricao" style={{ display: "block" }}>
            <Button variant="primary" block iconRight={<Icon.Arrow />}>Inscreva-se gratuitamente</Button>
          </Link>
          <div className="meta">Vagas limitadas · Encerramento em breve</div>
        </div>
      </div>
    </section>
  );
}
