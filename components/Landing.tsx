"use client";

/*
  ARAGON — Landing (Next.js + React + TypeScript)
  Skills: landing (estructura + GSAP), epic-design (capas de profundidad + técnicas), copywriting (textos ES/EN)
  Inspiración visual: estudio digital con tipografía 3D inflada (paleta propia: verde esmeralda + lima sobre gris perla)

  Técnicas aplicadas (catálogo epic-design):
    - Palabra 3D inflada (SVG + filtro de iluminación) que se deshace en partículas al pasar el cursor
    - Entrada "inflado" de letras con rebote elástico
    - Parallax de ratón por capas (palabra, brillo de fondo, texto)
    - Masked line reveal en el titular
    - Word-by-word scroll lighting en el manifiesto
    - Cascading card stack (tarjetas sticky) en el proceso
    - Bleed typography 3D en el pie
    - Marquee infinito (CSS) y cursor circular que sigue al ratón
    - prefers-reduced-motion + reducción en dispositivos táctiles (pointer: coarse)
*/

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Boxes, ChevronDown, MonitorSmartphone, PenTool, Sparkles, type LucideIcon } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { PuffyWord } from "./PuffyWord";
import { Dock } from "./Dock";
import { Rich } from "./Rich";
import { CONTACT_EMAIL, MARQUEE, TAGLINES, parseRich, type Key, type Lang } from "@/lib/i18n";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/* ═════════ Datos de secciones ═════════ */
type Tag = string | { key: Key };

const SERVICES: { icon: LucideIcon; title: Key; desc: Key; tags: Tag[] }[] = [
  { icon: MonitorSmartphone, title: "s1.title", desc: "s1.desc", tags: ["React", "Next.js", "Flutter", "Node.js"] },
  { icon: Boxes, title: "s2.title", desc: "s2.desc", tags: ["ERP", "CRM", "APIs", { key: "s2.tag" }] },
  { icon: Sparkles, title: "s3.title", desc: "s3.desc", tags: ["LLMs", { key: "s3.tag" }, "RPA", "Data"] },
  { icon: PenTool, title: "s4.title", desc: "s4.desc", tags: ["Discovery", "Figma", "MVP", "Design systems"] },
];

const PRINCIPLES: [Key, Key][] = [
  ["pr1.title", "pr1.desc"],
  ["pr2.title", "pr2.desc"],
  ["pr3.title", "pr3.desc"],
];

const STEPS: { title: Key; desc: Key; tone: string }[] = [
  { title: "p1.title", desc: "p1.desc", tone: "emerald" },
  { title: "p2.title", desc: "p2.desc", tone: "ink" },
  { title: "p3.title", desc: "p3.desc", tone: "lime" },
  { title: "p4.title", desc: "p4.desc", tone: "white" },
];

/* ═════════ Piezas pequeñas ═════════ */
function Eyebrow({ children, className = "", enter = false }: { children: React.ReactNode; className?: string; enter?: boolean }) {
  return (
    <span className={`eyebrow ${className}`} data-enter={enter || undefined}>
      <span className="dot" aria-hidden="true" />
      {children}
    </span>
  );
}

function CtaButton({ href, label }: { href: string; label: string }) {
  return (
    <a className="btn-primary" href={href}>
      <span className="label">{label}</span>
      <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
    </a>
  );
}

/* ═════════ Manifiesto: cada palabra en un <span> para la iluminación por scroll ═════════ */
function Manifesto({ lang, text }: { lang: Lang; text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".w",
          { opacity: 0.16 },
          {
            opacity: 1, stagger: 0.08, ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 45%", scrub: true },
          },
        );
      });
    },
    { scope: ref, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <p className="manifesto-text" ref={ref}>
      {parseRich(text).map((seg, i) => {
        const words = seg.text.split(/(\s+)/).map((part, j) =>
          /^\s+$/.test(part) || !part ? <Fragment key={j}>{part}</Fragment> : <span className="w" key={j}>{part}</span>,
        );
        return seg.em ? <em key={i}>{words}</em> : <Fragment key={i}>{words}</Fragment>;
      })}
    </p>
  );
}

/* ═════════ Página ═════════ */
export function Landing() {
  const { lang, t } = useLanguage();
  const root = useRef<HTMLDivElement>(null);
  const marquee = MARQUEE[lang];

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [lang]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, fine: "(pointer: fine)" }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
        if (!motion) return;

        // 1 · Estados iniciales (evita FOUC en lo que está fuera de pantalla)
        gsap.set(".feature-card", { opacity: 0, y: 55, rotateX: 18 });
        gsap.set(".reveal", { opacity: 0, y: 40 });

        // 2 · Entrada del hero: letras que se inflan + masked line reveal
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => document.documentElement.classList.add("hero-done"),
        });
        tl.fromTo(".hero .eyebrow", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
          .fromTo(
            ".puff-hero .puff-letter",
            { opacity: 0, scale: 0.35, transformOrigin: "50% 60%" },
            { opacity: 1, scale: 1, duration: 1.2, stagger: 0.08, ease: "elastic.out(1, 0.55)" },
            "-=0.3",
          )
          .fromTo(".hero .line-inner", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, duration: 1, stagger: 0.12, ease: "power4.out" }, "-=0.9")
          .fromTo(".hero .subtitle", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.6")
          .fromTo(".hero .cta-wrap", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
          .fromTo(".scroll-down", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
          .fromTo(".dock", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.6)" }, "-=0.4");

        // 3 · Parallax de ratón por capas + cursor circular (solo con puntero fino)
        let onMove: ((e: MouseEvent) => void) | undefined;
        if (fine) {
          const layers = [
            { el: ".hero-glow", x: -30, y: -14 },
            { el: ".puff-hero", x: 18, y: 10 },
            { el: ".hero-copy", x: 6, y: 4 },
          ].map((l) => ({
            ...l,
            toX: gsap.quickTo(l.el, "x", { duration: 0.8, ease: "power3" }),
            toY: gsap.quickTo(l.el, "y", { duration: 0.8, ease: "power3" }),
          }));
          const cursorX = gsap.quickTo(".cursor", "x", { duration: 0.35, ease: "power3" });
          const cursorY = gsap.quickTo(".cursor", "y", { duration: 0.35, ease: "power3" });
          const cursor = document.querySelector<HTMLElement>(".cursor");
          onMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            layers.forEach((l) => { l.toX(x * l.x); l.toY(y * l.y); });
            cursorX(e.clientX);
            cursorY(e.clientY);
            const target = e.target as HTMLElement | null;
            cursor?.classList.toggle("is-hover", !!target?.closest("a, button"));
            cursor?.classList.add("is-visible");
          };
          window.addEventListener("mousemove", onMove);
        }

        // 4 · Salida del hero al hacer scroll
        gsap.to(".hero-inner", {
          yPercent: -14, opacity: 0.2, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });

        // 5 · Tarjetas de servicios
        ScrollTrigger.batch(".feature-card", {
          start: "top 85%",
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.11, ease: "power2.out",
              onComplete: () => { gsap.set(batch, { clearProps: "transform" }); },
            }),
        });

        // 6 · Revelado de encabezados y bloques
        ScrollTrigger.batch(".reveal", {
          start: "top 88%",
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }),
        });

        // 7 · Cascading card stack del proceso
        const steps = gsap.utils.toArray<HTMLElement>(".step");
        steps.forEach((step, i) => {
          const next = steps[i + 1];
          if (!next) return;
          gsap.to(step, {
            scale: 0.93, ease: "none",
            scrollTrigger: { trigger: next, start: "top 90%", end: "top 25%", scrub: true },
          });
        });

        // 8 · Palabra 3D del pie: las letras saltan al entrar en pantalla
        gsap.fromTo(
          ".puff-footer .puff-letter",
          { yPercent: 45, opacity: 0, transformOrigin: "50% 100%" },
          {
            yPercent: 0, opacity: 1, duration: 1, stagger: 0.07, ease: "back.out(1.7)",
            scrollTrigger: { trigger: "footer", start: "top 75%" },
          },
        );

        return () => {
          if (onMove) window.removeEventListener("mousemove", onMove);
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">{t("skip")}</a>
      <div className="cursor" aria-hidden="true" />
      <Dock />

      <main id="main">
        {/* ═════════ HERO ═════════ */}
        <section className="scene hero" id="top" data-scene="hero">
          <div className="hero-glow" data-depth="0" aria-hidden="true" />

          <div className="hero-inner" data-depth="4">
            <Eyebrow enter>{t("hero.eyebrow")}</Eyebrow>
            <PuffyWord id="hero" interactive className="puff-hero" />
            <div className="hero-copy">
              <h1>
                {t("hero.title").split("\n").map((line, i) => (
                  <span className="line" key={i}>
                    <span className="line-inner">
                      <Rich value={line} />
                    </span>
                  </span>
                ))}
              </h1>
              <p className="subtitle" data-enter>{t("hero.sub")}</p>
              <span className="cta-wrap" data-enter>
                <CtaButton href="#contacto" label={t("hero.cta")} />
              </span>
            </div>
          </div>

          <a className="scroll-down" href="#servicios" data-enter>
            <span>{t("hero.scroll")}</span>
            <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
          </a>
        </section>

        {/* ═════════ MARQUEE ═════════ */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marquee, ...marquee].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        {/* ═════════ SERVICIOS ═════════ */}
        <section className="block features" id="servicios" data-scene="services">
          <div className="container">
            <div className="section-head">
              <div>
                <Eyebrow className="reveal">{t("services.eyebrow")}</Eyebrow>
                <h2 className="reveal"><Rich value={t("services.title")} /></h2>
              </div>
              <p className="reveal">{t("services.lead")}</p>
            </div>

            <div className="features-grid">
              {SERVICES.map(({ icon: Icon, title, desc, tags }, i) => (
                <article className="feature-card" key={title}>
                  <div className="feature-top">
                    <div className="feature-icon" aria-hidden="true">
                      <Icon size={26} strokeWidth={1.7} color="#fff" />
                    </div>
                    <span className="feature-num">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{t(title)}</h3>
                  <p>{t(desc)}</p>
                  <ul className="tags">
                    {tags.map((tag) => {
                      const label = typeof tag === "string" ? tag : t(tag.key);
                      return <li key={label}>{label}</li>;
                    })}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ MANIFIESTO ═════════ */}
        <section className="block manifesto" id="enfoque" data-scene="manifesto">
          <div className="manifesto-glow" aria-hidden="true" />
          <div className="container">
            <Eyebrow>{t("manifesto.eyebrow")}</Eyebrow>
            <Manifesto lang={lang} text={t("manifesto.text")} />
            <div className="principles">
              {PRINCIPLES.map(([title, desc], i) => (
                <div className="principle reveal" key={title}>
                  <span className="principle-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{t(title)}</h3>
                  <p>{t(desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ PROCESO ═════════ */}
        <section className="block process" id="proceso" data-scene="process">
          <div className="container">
            <div className="section-head">
              <div>
                <Eyebrow className="reveal">{t("process.eyebrow")}</Eyebrow>
                <h2 className="reveal"><Rich value={t("process.title")} /></h2>
              </div>
              <p className="reveal">{t("process.lead")}</p>
            </div>

            <div className="steps">
              {STEPS.map((step, i) => (
                <article className={`step step--${step.tone}`} key={step.title} style={{ "--i": i } as React.CSSProperties}>
                  <div>
                    <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{t(step.title)}</h3>
                  </div>
                  <div className="step-body">
                    <p>{t(step.desc)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════ CTA FINAL ═════════ */}
        <section className="scene closing-cta" id="contacto" data-scene="contact">
          <div className="container">
            <div className="cta-panel" data-depth="4">
              <div className="cta-glow-bg" data-depth="0" aria-hidden="true" />
              <h2 className="reveal"><Rich value={t("cta.title")} /></h2>
              <p className="reveal">{t("cta.sub")}</p>
              <div className="reveal">
                <CtaButton href={`mailto:${CONTACT_EMAIL}?subject=Proyecto`} label={t("cta.btn")} />
              </div>
              <p className="mail reveal">
                {t("cta.mail")} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ═════════ FOOTER ═════════ */}
      <footer>
        <div className="container">
          <div className="footer-top">
            {/* Eslogan siempre visible en ambos idiomas */}
            <div className="footer-tagline">
              <p lang="es">{TAGLINES.es}</p>
              <p lang="en">{TAGLINES.en}</p>
            </div>
            <nav className="footer-links" aria-label="Footer">
              <a href="#servicios">{t("nav.services")}</a>
              <a href="#enfoque">{t("nav.approach")}</a>
              <a href="#proceso">{t("nav.process")}</a>
              <a href="#contacto">{t("nav.contact")}</a>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Aragon. {t("footer.rights")}</span>
            <span>{t("footer.made")}</span>
          </div>
        </div>
        <div className="bleed" aria-hidden="true">
          <PuffyWord id="footer" className="puff-footer" />
        </div>
      </footer>
    </div>
  );
}
