import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="site-logo">
            <Image src="/assets/logo-simposio.png" alt="Marca do simpósio" width={56} height={56} />
            <div className="txt">
              <span className="e1">CBMAP · 2026</span>
              <span className="e2">I Simpósio Estadual</span>
            </div>
          </Link>
          <p>
            Realização do <b style={{ color: "var(--text-2)" }}>Corpo de Bombeiros Militar do Amapá</b>.
            Evento gratuito, presencial, voltado à qualificação técnica em combate a incêndio urbano.
          </p>
        </div>

        <div className="footer-col">
          <h4>Evento</h4>
          <ul>
            <li><Link href="/programa">Programação</Link></li>
            <li><Link href="/palestrantes">Palestrantes</Link></li>
            <li><Link href="/local">Local</Link></li>
            <li><Link href="/inscricao">Inscrição</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Informações</h4>
          <ul>
            <li><Link href="/faq">FAQ</Link></li>
            <li>Política de privacidade</li>
            <li>LGPD</li>
            <li>Acessibilidade</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contato</h4>
          <ul>
            <li>simposio@cbmap.ap.gov.br</li>
            <li>@cbmap.oficial</li>
            <li>Macapá / AP · Brasil</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 CBMAP · I SIMPÓSIO ESTADUAL · TODOS OS DIREITOS RESERVADOS</span>
        <span>VIDAS ALHEIAS E RIQUEZAS SALVAR</span>
      </div>
    </footer>
  );
}
