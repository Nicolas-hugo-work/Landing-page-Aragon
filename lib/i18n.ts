// Textos ES / EN. *palabra* = énfasis, \n = salto de línea
export type Lang = "es" | "en";

const es = {
  "meta.title": "Aragon — Agencia de software a medida",
  "meta.desc": "Aplicaciones web y móviles, software a medida, ERP, IA y automatización, diseñados y construidos por un solo equipo senior.",
  "skip": "Saltar al contenido",
  "nav.services": "Servicios",
  "nav.approach": "Enfoque",
  "nav.process": "Proceso",
  "nav.contact": "Contacto",
  "nav.cta": "Hablemos",
  "hero.eyebrow": "Agencia de software · Web, móvil e IA",
  "hero.title": "Software *a medida*\npara empresas que *no paran*",
  "hero.sub": "Aplicaciones web y móviles, sistemas a medida e integraciones de IA, diseñadas y construidas por un solo equipo senior. De la idea a producción, sin caos.",
  "hero.cta": "Agenda una llamada",
  "hero.scroll": "Desliza",
  "services.eyebrow": "Servicios",
  "services.title": "Lo que *construimos*",
  "services.lead": "Cuatro capacidades, un mismo equipo. Sin intermediarios entre quien entiende tu negocio y quien escribe el código.",
  "s1.title": "Desarrollo web y móvil",
  "s1.desc": "Plataformas web, apps iOS y Android y productos SaaS rápidos, seguros y listos para crecer con tu negocio.",
  "s2.title": "Software a medida y ERP",
  "s2.desc": "Sistemas internos que se adaptan a cómo trabaja tu empresa: ERP, CRM, paneles de gestión e integraciones con lo que ya usas.",
  "s2.tag": "Integraciones",
  "s3.title": "IA y automatización",
  "s3.desc": "Agentes, asistentes y flujos automáticos que eliminan tareas repetitivas y dejan a tu equipo el trabajo que importa.",
  "s3.tag": "Agentes",
  "s4.title": "Diseño UX/UI y producto",
  "s4.desc": "Investigación, prototipos e interfaces claras. Validamos la idea antes de escribir código y lanzamos MVPs que se pueden medir.",
  "manifesto.eyebrow": "Enfoque",
  "manifesto.text": "No vendemos horas de desarrollo. Construimos *software* que tu equipo usa cada día y que tu negocio puede *medir*.",
  "pr1.title": "Un solo equipo senior",
  "pr1.desc": "Las mismas personas desde la primera reunión hasta el lanzamiento.",
  "pr2.title": "El código es tuyo",
  "pr2.desc": "Repositorio, documentación y propiedad intelectual a tu nombre.",
  "pr3.title": "Avances visibles",
  "pr3.desc": "Demos en cada sprint para que decidas con producto real, no con promesas.",
  "process.eyebrow": "Proceso",
  "process.title": "Cómo *trabajamos*",
  "process.lead": "Cuatro fases, un objetivo: que el software llegue a producción y se use.",
  "p1.title": "Descubrir",
  "p1.desc": "Entendemos tu negocio, tus usuarios y tus números. Sales con un alcance claro, prioridades y un presupuesto honesto.",
  "p2.title": "Diseñar",
  "p2.desc": "Prototipos navegables que tu equipo puede probar antes de invertir en desarrollo.",
  "p3.title": "Construir",
  "p3.desc": "Desarrollo por sprints con avances visibles, demos periódicas y código revisado y probado.",
  "p4.title": "Evolucionar",
  "p4.desc": "Medimos el uso real, corregimos rápido y seguimos mejorando.",
  "cta.title": "¿Tienes un *proyecto*\nen mente?",
  "cta.sub": "Cuéntanos qué necesitas y te proponemos el primer paso, sin compromiso.",
  "cta.btn": "Agenda una llamada",
  "cta.mail": "o escríbenos a",
  "footer.rights": "Todos los derechos reservados.",
  "footer.made": "Diseñado y construido por Aragon.",
};

export type Key = keyof typeof es;

const en: Record<Key, string> = {
  "meta.title": "Aragon — Custom software agency",
  "meta.desc": "Web and mobile apps, custom software, ERP, AI and automation, designed and built by one senior team.",
  "skip": "Skip to content",
  "nav.services": "Services",
  "nav.approach": "Approach",
  "nav.process": "Process",
  "nav.contact": "Contact",
  "nav.cta": "Let's talk",
  "hero.eyebrow": "Software agency · Web, mobile & AI",
  "hero.title": "Custom *software*\nfor companies that *never stop*",
  "hero.sub": "Web and mobile apps, custom systems and AI integrations, designed and built by one senior team. From idea to production, without the chaos.",
  "hero.cta": "Book a call",
  "hero.scroll": "Scroll",
  "services.eyebrow": "Services",
  "services.title": "What we *build*",
  "services.lead": "Four capabilities, one team. No middlemen between the people who understand your business and the people who write the code.",
  "s1.title": "Web & mobile development",
  "s1.desc": "Web platforms, iOS and Android apps and SaaS products that are fast, secure and ready to grow with your business.",
  "s2.title": "Custom software & ERP",
  "s2.desc": "Internal systems shaped around how your company works: ERP, CRM, management dashboards and integrations with the tools you already use.",
  "s2.tag": "Integrations",
  "s3.title": "AI & automation",
  "s3.desc": "Agents, assistants and automated workflows that remove repetitive tasks and leave your team the work that matters.",
  "s3.tag": "Agents",
  "s4.title": "UX/UI & product design",
  "s4.desc": "Research, prototypes and clear interfaces. We validate the idea before writing code and launch MVPs you can measure.",
  "manifesto.eyebrow": "Approach",
  "manifesto.text": "We don't sell development hours. We build *software* your team uses every day and your business can *measure*.",
  "pr1.title": "One senior team",
  "pr1.desc": "The same people from the first meeting to launch day.",
  "pr2.title": "You own the code",
  "pr2.desc": "Repository, documentation and intellectual property in your name.",
  "pr3.title": "Visible progress",
  "pr3.desc": "Demos every sprint, so you decide with a real product, not promises.",
  "process.eyebrow": "Process",
  "process.title": "How we *work*",
  "process.lead": "Four phases, one goal: software that reaches production and gets used.",
  "p1.title": "Discover",
  "p1.desc": "We learn your business, your users and your numbers. You leave with a clear scope, priorities and an honest budget.",
  "p2.title": "Design",
  "p2.desc": "Clickable prototypes your team can test before investing in development.",
  "p3.title": "Build",
  "p3.desc": "Sprint-based development with visible progress, regular demos and reviewed, tested code.",
  "p4.title": "Evolve",
  "p4.desc": "We measure real usage, fix fast and keep improving.",
  "cta.title": "Got a *project*\nin mind?",
  "cta.sub": "Tell us what you need and we'll propose the first step, no strings attached.",
  "cta.btn": "Book a call",
  "cta.mail": "or write to us at",
  "footer.rights": "All rights reserved.",
  "footer.made": "Designed and built by Aragon.",
};

export const DICT: Record<Lang, Record<Key, string>> = { es, en };

export const MARQUEE: Record<Lang, string[]> = {
  es: ["Desarrollo web", "Apps móviles", "Software a medida", "ERP", "Inteligencia artificial", "Automatización", "Diseño UX/UI"],
  en: ["Web development", "Mobile apps", "Custom software", "ERP", "Artificial intelligence", "Automation", "UX/UI design"],
};

// Eslogan que se muestra siempre en ambos idiomas (pie de página)
export const TAGLINES = {
  es: "Software a medida para empresas que no paran.",
  en: "Custom software for companies that never stop.",
};

export const CONTACT_EMAIL = "hola@aragon.dev"; // inferred: correo de ejemplo, reemplazar por el real

export type Segment = { text: string; em: boolean };

// "Lo que *construimos*" → [{text:"Lo que ", em:false}, {text:"construimos", em:true}]
export function parseRich(value: string): Segment[] {
  return value
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), em: true }
        : { text: part, em: false },
    );
}
