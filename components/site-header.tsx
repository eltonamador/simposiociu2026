"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Icon } from "./icons";
import { Button } from "./primitives";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/programa", label: "Programação" },
  { href: "/palestrantes", label: "Palestrantes" },
  { href: "/local", label: "Local" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="site-header">
      <Link href="/" className="site-logo" onClick={() => setOpen(false)}>
        <Image src="/assets/logo-simposio.png" alt="Brasão I Simpósio CBMAP" width={64} height={64} priority />
        <div className="txt">
          <span className="e1">CBMAP · 24–26 jun 2026</span>
          <span className="e2">I Simpósio Estadual</span>
        </div>
      </Link>

      <button className="site-nav-mobile-toggle" onClick={() => setOpen(o => !o)} aria-label="Menu">
        {open ? <Icon.X /> : <Icon.Menu />}
      </button>

      <nav className={`site-nav ${open ? "is-open" : ""}`}>
        {NAV.map(it => (
          <Link
            key={it.href}
            href={it.href}
            className={pathname === it.href ? "is-active" : ""}
            onClick={() => setOpen(false)}
          >
            {it.label}
          </Link>
        ))}
        <Link href="/inscricao" onClick={() => setOpen(false)}>
          <Button variant="primary">Inscreva-se</Button>
        </Link>
      </nav>
    </header>
  );
}
