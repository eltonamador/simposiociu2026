"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { Button } from "./primitives";
import { EVENT, FAQ_ITEMS, SCHEDULE, SPEAKERS, Speaker } from "@/lib/data";

function useCountdown(iso: string) {
  const target = React.useMemo(() => new Date(iso).getTime(), [iso]);
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

export function HeroSection() {
  const cd = useCountdown(EVENT.isoStart);
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <span className="tag"><span className="pulse"></span> Inscrições abertas · Vagas limitadas</span>
          <h1>
            <em>1º Simpósio Estadual</em>
            <br />de Combate a Incêndio Urbano
            <span className="sub-line">do Estado do Amapá · CBMAP · 2026</span>
          </h1>
          <p className="hero-lede">
            Três dias de imersão técnica reunindo bombeiros militares, profissionais da defesa civil,
            brigadistas e especialistas do Brasil para discutir as práticas mais atuais em combate a
            incêndio urbano. Promovido pelo <strong>Corpo de Bombeiros Militar do Amapá</strong>.
          </p>
          <div className="hero-cta">
            <Link href="/inscricao"><Button variant="primary" iconRight={<Icon.Arrow />}>Fazer inscrição gratuita</Button></Link>
            <Link href="/programa"><Button variant="ghost">Ver programação</Button></Link>
          </div>
          <div className="hero-meta">
            <div>
              <div className="lbl"><Icon.Calendar /> Datas</div>
              <div className="val">24, 25 e 26 de junho</div>
              <div className="sub">2026 · 3 dias</div>
            </div>
            <div>
              <div className="lbl"><Icon.MapPin /> Local</div>
              <div className="val">Anfiteatro da UNIFAP</div>
              <div className="sub">Macapá · Amapá</div>
            </div>
            <div>
              <div className="lbl"><Icon.Users /> Público</div>
              <div className="val">Aprox. 400 vagas</div>
              <div className="sub">Acesso gratuito</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-logo-wrap">
            <Image src="/assets/logo-simposio.png" alt="Marca oficial do I Simpósio" width={420} height={420} priority />
            <div className="hero-countdown" aria-label="Contagem regressiva para o evento">
              <div className="seg"><div className="num">{String(cd.days).padStart(2, "0")}</div><div className="lbl">Dias</div></div>
              <div className="sep">:</div>
              <div className="seg"><div className="num">{String(cd.hours).padStart(2, "0")}</div><div className="lbl">Horas</div></div>
              <div className="sep">:</div>
              <div className="seg"><div className="num">{String(cd.minutes).padStart(2, "0")}</div><div className="lbl">Min</div></div>
              <div className="sep">:</div>
              <div className="seg"><div className="num">{String(cd.seconds).padStart(2, "0")}</div><div className="lbl">Seg</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsBar() {
  return (
    <div className="stats-bar">
      <div><div className="num">3<span className="unit">dias</span></div><div className="lbl">de programação</div></div>
      <div><div className="num">8+</div><div className="lbl">palestras técnicas</div></div>
      <div><div className="num">4</div><div className="lbl">corporações nacionais</div></div>
      <div><div className="num">100%</div><div className="lbl">presencial · gratuito</div></div>
    </div>
  );
}

export function SobreSection({ inline }: { inline?: boolean }) {
  const Body = (
    <>
      <div className="section-head">
        <span className="kicker">Sobre o simpósio</span>
        <h2>Conhecimento técnico, troca de experiência e elevação do padrão operacional.</h2>
        <p>
          O I Simpósio Estadual de Combate a Incêndio Urbano marca o início de um espaço permanente
          de qualificação técnica no Amapá — voltado a quem está na linha de frente das ocorrências
          urbanas, de novas tecnologias a doutrina operacional.
        </p>
      </div>
      <div className="about-grid">
        <div className="about-body">
          <p>
            Realizado pelo <strong>Corpo de Bombeiros Militar do Amapá (CBMAP)</strong>, o evento reúne
            <strong> oficiais e instrutores convidados</strong> de Santa Catarina, Distrito Federal, Minas
            Gerais e do próprio Amapá para apresentar estudos de caso, doutrinas e experiências em
            <strong> combate a incêndio em edificações, veículos elétricos, painéis solares, ventilação
            tática </strong> e <strong>operações com auto escada mecânica</strong>.
          </p>
          <p>
            Mais do que palestras, o simpósio é um <strong>espaço de articulação técnica</strong> entre
            corporações, defesa civil, brigadistas, segurança do trabalho, engenharia, saúde e iniciativa
            privada — promovendo padronização de boas práticas e fortalecendo a resposta do sistema de
            proteção e socorro do estado.
          </p>
          <p>
            O encontro acontece no <strong>Anfiteatro da UNIFAP</strong>, em Macapá, com programação
            técnica em dois turnos, painéis tecnológicos com empresas parceiras e demonstração prática
            em pátio aberto.
          </p>
        </div>
        <div className="about-side">
          <div className="about-quote">
            <div className="q">Lema do CBMAP</div>
            <div className="v">&quot;{EVENT.lema}&quot;</div>
          </div>
          <div className="feature-list">
            <FeatureRow Icon={Icon.Flame} title="Combate técnico atualizado"
              desc="Painéis solares, veículos elétricos, espumas e ventilação tática." />
            <FeatureRow Icon={Icon.Users} title="Articulação multi-institucional"
              desc="Bombeiros, defesa civil, brigadistas, engenharia e saúde." />
            <FeatureRow Icon={Icon.Shield} title="Certificação por presença integral"
              desc="Registro de presença diário por QR Code no local." />
            <FeatureRow Icon={Icon.Calendar} title="Painel tecnológico"
              desc="Demonstrações de empresas convidadas no segundo dia." />
          </div>
        </div>
      </div>
      <p className="lema">{EVENT.lema}</p>
    </>
  );
  return (
    <section className={inline ? "section section--alt" : "section"}>
      {inline ? <div className="section-inner">{Body}</div> : Body}
    </section>
  );
}

function FeatureRow({ Icon: I, title, desc }: { Icon: React.ComponentType; title: string; desc: string }) {
  return (
    <div className="feature-row">
      <div className="ico"><I /></div>
      <div>
        <div className="tit">{title}</div>
        <div className="des">{desc}</div>
      </div>
    </div>
  );
}

export function ProgramaContent({ compact }: { compact?: boolean }) {
  const [day, setDay] = React.useState(1);
  const dayMeta = [
    { n: 1, d: "24 jun", sub: "Quarta-feira · Abertura + 4 palestras" },
    { n: 2, d: "25 jun", sub: "Quinta-feira · 3 palestras + painel tecnológico" },
    { n: 3, d: "26 jun", sub: "Sexta-feira · Palestra · Mesa redonda · Encerramento" },
  ];
  const rows = SCHEDULE.filter(r => r.day === day);
  const visible = compact ? rows.slice(0, 5) : rows;

  return (
    <>
      <div className="day-tabs">
        {dayMeta.map(m => (
          <button key={m.n} className={`day-tab ${m.n === day ? "is-active" : ""}`} onClick={() => setDay(m.n)}>
            <span className="ix">Dia {String(m.n).padStart(2, "0")}</span>
            <span className="d">{m.d}</span>
            <span className="sub">{m.sub}</span>
          </button>
        ))}
      </div>
      <div className="schedule">
        {visible.map((r, i) => {
          const tagClass =
            r.tag === "Palestra" || r.tag === "Painel" ? "schedule-tag--keynote" :
            r.tag === "Intervalo" ? "schedule-tag--break" :
            r.tag === "Refeição" ? "schedule-tag--meal" :
            r.tag === "Cerimônia" || r.tag === "Abertura" ? "schedule-tag--cerimonia" :
            r.tag === "Demo" ? "schedule-tag--demo" : "";
          return (
            <div key={i} className={`schedule-row ${r.headline ? "is-headline" : ""}`}>
              <div className="schedule-time">{r.time}</div>
              <div className="schedule-content">
                <div className="ttl">{r.title}</div>
                <div className="des">{r.desc}</div>
                <div className="who">{r.who}</div>
              </div>
              <span className={`schedule-tag ${tagClass}`}>{r.tag}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function FeaturedSpeakerCard() {
  const f = SPEAKERS.find(s => s.featured)!;
  return (
    <div className="featured-speaker">
      <div className="ft-image" role="img" aria-label="Foto do palestrante destaque"></div>
      <div className="ft-text">
        <span className="ft-tag">Palestra destaque · Dia 01</span>
        <h3>{f.topic}</h3>
        <div className="ft-meta">
          <span className="name">{f.name}</span>
          <span className="corp">{f.corp}</span>
        </div>
        <ul>
          <li>Comandante do 15º BBM — Rio do Sul / SC</li>
          <li>Presidente do Comitê Nacional de Combate a Incêndio da LIGABOM</li>
          <li>Instrutor de Combate a Incêndio desde 2012</li>
          <li>Bacharel em Direito (2015) · Perito em Incêndios e Explosões</li>
          <li>Catedrático de incêndio veicular nos Cursos de Perícia em SC</li>
        </ul>
      </div>
    </div>
  );
}

export function SpeakerCard({ s }: { s: Speaker }) {
  return (
    <div className="speaker-card">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="speaker-avatar">{initials(s.name)}</div>
        <div>
          <div className="name">{s.name}</div>
          <div className="corp">{s.corp}</div>
        </div>
      </div>
      <div className="role">{s.role}</div>
      <div className="topic">
        <span className="l">Palestra · Dia {String(s.day).padStart(2, "0")}</span>
        {s.topic}
      </div>
    </div>
  );
}

export function FaqList() {
  const [open, setOpen] = React.useState(0);
  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((it, i) => (
        <div key={i} className={`faq-item ${open === i ? "is-open" : ""}`}>
          <button className="faq-question" onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{it.q}</span>
            <span className="plus">+</span>
          </button>
          <div className="faq-answer">{it.a}</div>
        </div>
      ))}
    </div>
  );
}
