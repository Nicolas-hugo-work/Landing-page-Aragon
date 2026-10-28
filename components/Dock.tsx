"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import type { Key } from "@/lib/i18n";

const LINKS: [string, Key][] = [
  ["#servicios", "nav.services"],
  ["#enfoque", "nav.approach"],
  ["#proceso", "nav.process"],
  ["#contacto", "nav.contact"],
];

// Píldora flotante inferior: logo + idioma + menú desplegable hacia arriba
export function Dock() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="dock" ref={ref}>
      <nav id="dock-menu" className={`dock-menu ${open ? "is-open" : ""}`} aria-label="Principal" aria-hidden={!open}>
        {LINKS.map(([href, key]) => (
          <a key={href} href={href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            {t(key)}
          </a>
        ))}
        <a className="btn-primary dock-cta" href="#contacto" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          {t("nav.cta")}
          <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
        </a>
      </nav>

      <div className="dock-bar">
        <a className="dock-logo" href="#top" aria-label="Aragon">aragon</a>
        <div className="lang" role="group" aria-label="Idioma / Language">
          {(["es", "en"] as const).map((l) => (
            <button key={l} type="button" data-lang={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`dock-toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-controls="dock-menu"
          aria-label={open ? "Cerrar menú / Close menu" : "Abrir menú / Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </div>
  );
}
