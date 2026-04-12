import { useState, useEffect, useRef } from "react";
import { Play, RotateCcw } from "lucide-react";

type Lang     = "pt-br" | "en";
type Brand    = "tangerine" | "joy" | "grinch" | "blue_sky";
type Mode     = "light" | "dark";
type Surface  = "positive" | "negative";

const BRANDS: { id: Brand; label: string; hex: string }[] = [
  { id: "tangerine", label: "Tangerine", hex: "#ffae03" },
  { id: "joy",       label: "Joy",       hex: "#e7398a" },
  { id: "grinch",    label: "Grinch",    hex: "#58bd59" },
  { id: "blue_sky",  label: "Blue Sky",  hex: "#265ed9" },
];

// bg token → matching txtOn token → label shown inside swatch
const SWATCHES = [
  { bg: "--foundation-bg-primary",                  txtOn: "--foundation-txt-title",                       label: "bg-primary"          },
  { bg: "--foundation-bg-secondary",                txtOn: "--foundation-txt-body",                        label: "bg-secondary"        },
  { bg: "--foundation-bg-brand-default",            txtOn: "--foundation-txt-on-brand-default",            label: "bg-brand-default"    },
  { bg: "--foundation-bg-feedback-info-default",    txtOn: "--foundation-txt-on-feedback-info-default",    label: "feedback-info"       },
  { bg: "--foundation-bg-feedback-success-default", txtOn: "--foundation-txt-on-feedback-success-default", label: "feedback-success"    },
  { bg: "--foundation-bg-feedback-warning-default", txtOn: "--foundation-txt-on-feedback-warning-default", label: "feedback-warning"    },
  { bg: "--foundation-bg-feedback-danger-default",  txtOn: "--foundation-txt-on-feedback-danger-default",  label: "feedback-danger"     },
] as const;

const TYPO = [
  { cls: "typography-theme_engine-heading-highlight_1", label: "DISPLAY — heading-highlight_1", txt: "Heading Display",                              color: "--foundation-txt-title" },
  { cls: "typography-theme_engine-heading-title_2",     label: "TITLE — heading-title_2",       txt: "Heading Title Semibold",                       color: "--foundation-txt-title" },
  { cls: "typography-theme_engine-content-body",        label: "BODY — content-body",           txt: "Body text with the theme's main font.",        color: "--foundation-txt-body"  },
  { cls: "typography-theme_engine-content-label",       label: "LABEL — content-label",         txt: "Interface label / caption",                    color: "--foundation-txt-muted" },
] as const;

const TRACE_STEPS = (hex: string, lang: Lang) => [
  {
    token: "--foundation-bg-brand-default",
    value: "var(--semantic-color-...)",
    desc: lang === "pt-br"
      ? "Foundation alias aponta para o slot semântico"
      : "Foundation alias points to the semantic slot",
  },
  {
    token: "--semantic-color-brand-branding-first-default-background",
    value: hex,
    desc: lang === "pt-br"
      ? "Semantic token resolve para o valor da marca ativa"
      : "Semantic token resolves to the active brand's value",
  },
];

const UI = {
  "pt-br": {
    title: "Playground de Temas",
    subtitle: "Mude marca, modo e superfície. Os tokens Foundation resolvem em tempo real pela camada Semantic.",
    brand: "Marca", mode: "Modo", surface: "Superfície",
    modeLight: "Light", modeDark: "Dark",
    surfacePositive: "Positive", surfaceNegative: "Negative",
    tema: "Tema Ativo",
    typographyTitle: "Tipografia",
    colorsTitle: "Foundation Colors",
    componentsTitle: "Componentes",
    traceTitle: "Resolução de Token",
    traceSub: "O mesmo token. 4 resoluções diferentes.",
    traceBtn: "Rastrear",
    resetBtn: "Resetar",
    previewLabel: "Valor Resolvido",
    finalLabel: "Valor final:",
    resolvedText: "Resolvido!",
    resolvingText: "Resolvendo…",
    btnPrimary: "Botão Primário",
    btnOutline: "Botão Outline",
    inputPlaceholder: "Digite algo…",
    cardTitle: "Card de Exemplo",
    cardBody: "Componente com tokens Semantic para fundo, texto e borda.",
    cardAction: "Ver mais",
  },
  en: {
    title: "Theme Playground",
    subtitle: "Switch brand, mode and surface. Foundation tokens resolve in real time through the Semantic layer.",
    brand: "Brand", mode: "Mode", surface: "Surface",
    modeLight: "Light", modeDark: "Dark",
    surfacePositive: "Positive", surfaceNegative: "Negative",
    tema: "Active Theme",
    typographyTitle: "Typography",
    colorsTitle: "Foundation Colors",
    componentsTitle: "Components",
    traceTitle: "Token Resolution",
    traceSub: "Same token. 4 different resolutions.",
    traceBtn: "Trace",
    resetBtn: "Reset",
    previewLabel: "Resolved Value",
    finalLabel: "Final value:",
    resolvedText: "Resolved!",
    resolvingText: "Resolving…",
    btnPrimary: "Primary Button",
    btnOutline: "Outline Button",
    inputPlaceholder: "Type something…",
    cardTitle: "Example Card",
    cardBody: "Component using Semantic tokens for background, text and border.",
    cardAction: "Learn more",
  },
} as const;

// ── CSS helpers ───────────────────────────────────────────────────────────

function injectLink(href: string, id: string) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const l = document.createElement("link");
  l.id = id; l.rel = "stylesheet"; l.href = href;
  document.head.appendChild(l);
}

function injectFonts() {
  if (typeof document === "undefined" || document.getElementById("aplica-playground-fonts")) return;
  const s = document.createElement("style");
  s.id = "aplica-playground-fonts";
  s.textContent = `
    @font-face{font-family:'Sansita';font-weight:400;src:url('/aplica-package/dist/assets/fonts/Sansita/Sansita-Regular.ttf')format('truetype')}
    @font-face{font-family:'Sansita';font-weight:700;src:url('/aplica-package/dist/assets/fonts/Sansita/Sansita-Bold.ttf')format('truetype')}
    @font-face{font-family:'Sansita';font-weight:800;src:url('/aplica-package/dist/assets/fonts/Sansita/Sansita-ExtraBold.ttf')format('truetype')}
    @font-face{font-family:'Poppins';font-weight:400;src:url('/aplica-package/dist/assets/fonts/Poppins/Poppins-Regular.ttf')format('truetype')}
    @font-face{font-family:'Poppins';font-weight:600;src:url('/aplica-package/dist/assets/fonts/Poppins/Poppins-SemiBold.ttf')format('truetype')}
    @font-face{font-family:'Poppins';font-weight:700;src:url('/aplica-package/dist/assets/fonts/Poppins/Poppins-Bold.ttf')format('truetype')}
    @font-face{font-family:'Poppins';font-weight:800;src:url('/aplica-package/dist/assets/fonts/Poppins/Poppins-ExtraBold.ttf')format('truetype')}
    @font-face{font-family:'Roboto';font-weight:100 900;src:url('/aplica-package/dist/assets/fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf')format('truetype')}
    @font-face{font-family:'Noto Sans';font-weight:100 900;src:url('/aplica-package/dist/assets/fonts/Noto_Sans/NotoSans-VariableFont_wdth,wght.ttf')format('truetype')}
    @font-face{font-family:'IBM Plex Mono';font-weight:400;src:url('/aplica-package/dist/assets/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf')format('truetype')}
    @font-face{font-family:'IBM Plex Mono';font-weight:600;src:url('/aplica-package/dist/assets/fonts/IBM_Plex_Mono/IBMPlexMono-SemiBold.ttf')format('truetype')}
  `;
  document.head.appendChild(s);
}

// ── Component ─────────────────────────────────────────────────────────────

interface Props { lang?: Lang }

export function ThemePlayground({ lang = "pt-br" }: Props) {
  const [brand,   setBrand]   = useState<Brand>("tangerine");
  const [mode,    setMode]    = useState<Mode>("light");
  const [surface, setSurface] = useState<Surface>("positive");
  const [ready,   setReady]   = useState(false);

  // Tracer
  const [traceStep, setTraceStep] = useState(-1);
  const [isTracing, setIsTracing] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = UI[lang];
  const ab = BRANDS.find((b) => b.id === brand)!;

  // cssClass: blue_sky → aplica-blue-sky-* (file uses underscore, class uses hyphens)
  const cssClass = `aplica-${brand.replace(/_/g, "-")}-${mode}-${surface}`;

  // ── Load CSS on mount ──────────────────────────────────────────────────
  useEffect(() => {
    injectFonts();
    injectLink("/aplica-package/dist/css/foundation/engine/foundation.css", "aplica-foundation");
    injectLink("/aplica-package/dist/css/foundation/engine/typography.css", "aplica-typography");

    // Preload all 16 theme files (file names use underscore in brand part)
    const brands: Brand[] = ["tangerine", "joy", "grinch", "blue_sky"];
    const modes:  Mode[]  = ["light", "dark"];
    const surfs:  Surface[]= ["positive", "negative"];
    brands.forEach((b) => modes.forEach((m) => surfs.forEach((s) => {
      injectLink(
        `/aplica-package/dist/css/aplica_${b}-${m}-${s}.css`,
        `pg-theme-${b}-${m}-${s}`,
      );
    })));

    const id = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, []);

  // ── Auto-trace when brand changes (after first load) ──────────────────
  useEffect(() => {
    if (!ready) return;
    startTrace();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, ready]);

  const steps = TRACE_STEPS(ab.hex, lang);
  const isResolved = traceStep >= steps.length - 1;

  function startTrace() {
    if (timer.current) clearInterval(timer.current);
    setIsTracing(true);
    setTraceStep(0);
    let step = 0;
    timer.current = setInterval(() => {
      step += 1;
      setTraceStep(step);
      if (step >= steps.length - 1) {
        clearInterval(timer.current!);
        setIsTracing(false);
      }
    }, 900);
  }

  function resetTrace() {
    if (timer.current) clearInterval(timer.current);
    setIsTracing(false);
    setTraceStep(-1);
  }

  // ── Surface background token ───────────────────────────────────────────
  const bgSurface = surface === "positive"
    ? "var(--semantic-color-brand-ambient-contrast-base-positive-background)"
    : "var(--semantic-color-brand-ambient-contrast-base-negative-background)";

  // ── Shared pill ───────────────────────────────────────────────────────
  function Pill({ active, color, onClick, children }: {
    active: boolean; color?: string; onClick: () => void; children: React.ReactNode;
  }) {
    return (
      <button onClick={onClick} style={{
        padding: "0.3rem 0.875rem", borderRadius: "var(--radius-full)",
        border: active ? `2px solid ${color ?? ab.hex}` : "1.5px solid var(--color-border)",
        background: active ? `${color ?? ab.hex}18` : "transparent",
        color: active ? (color ?? ab.hex) : "var(--color-text-muted)",
        fontWeight: active ? 700 : 500, fontSize: "0.8125rem", cursor: "pointer",
        transition: "all 0.15s", display: "flex", alignItems: "center", gap: "0.375rem",
      }}>
        {children}
      </button>
    );
  }

  function CtrlLabel({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-text-muted)",
        marginBottom: "0.5rem", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
        {children}
      </div>
    );
  }

  function SecLabel({ label }: { label: string }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
        <div style={{ width: "0.25rem", height: "1rem", borderRadius: "2px", background: ab.hex, flexShrink: 0 }} />
        <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase" as const, color: `var(--foundation-txt-muted, var(--color-text-muted))` }}>
          {label}
        </span>
      </div>
    );
  }

  // Applied to every element that uses theme tokens to ensure CSS custom
  // properties from the theme class are available directly on the element
  // (not only inherited from an ancestor).
  const tc = ready ? cssClass : "";

  return (
    <section style={{ padding: "5rem 0" }}>
      <div className="container">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 700, marginBottom: "0.75rem", color: "var(--color-text)" }}>
            {t.title}
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--color-text-muted)",
            maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
            {t.subtitle}
          </p>
        </div>

        <div style={{ maxWidth: "960px", margin: "0 auto" }}>

          {/* Controls */}
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "1.5rem",
            marginBottom: "1.25rem", alignItems: "flex-start" }}>
            <div>
              <CtrlLabel>{t.brand}</CtrlLabel>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
                {BRANDS.map((b) => (
                  <Pill key={b.id} active={brand === b.id} color={b.hex} onClick={() => setBrand(b.id)}>
                    <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%",
                      background: b.hex, display: "inline-block", flexShrink: 0 }} />
                    {b.label}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <CtrlLabel>{t.mode}</CtrlLabel>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Pill active={mode === "light"} onClick={() => setMode("light")}>{t.modeLight}</Pill>
                <Pill active={mode === "dark"}  onClick={() => setMode("dark")}>{t.modeDark}</Pill>
              </div>
            </div>
            <div>
              <CtrlLabel>{t.surface}</CtrlLabel>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Pill active={surface === "positive"} onClick={() => setSurface("positive")}>{t.surfacePositive}</Pill>
                <Pill active={surface === "negative"} onClick={() => setSurface("negative")}>{t.surfaceNegative}</Pill>
              </div>
            </div>
          </div>

          {/* Active theme label */}
          <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--color-text-muted)",
              textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
              {t.tema}:
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.25rem 0.875rem",
              background: `${ab.hex}12`, border: `1px solid ${ab.hex}44`,
              borderRadius: "var(--radius-full)", transition: "all 0.25s",
            }}>
              <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%",
                background: ab.hex, display: "inline-block" }} />
              <span style={{ fontWeight: 700, fontSize: "0.8125rem", color: ab.hex }}>
                {ab.label}
              </span>
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>·</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{mode}</span>
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.8125rem" }}>·</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{surface}</span>
            </span>
          </div>

          {/* ── 2-column: Preview | Tracer ─────────────────────────────── */}
          <div className="pg-grid" style={{ display: "grid", gap: "1.25rem" }}>

            {/* ── LEFT: Preview panel ──────────────────────────────────── */}
            {/*
              KEY: we apply cssClass to the OUTER wrapper so all semantic tokens
              are in scope. Then we ALSO apply cssClass to each swatch/component
              div directly, so var(--foundation-*) resolves via the element's own
              class properties — not through ancestor inheritance — which is the
              reliable path in all browsers.
            */}
            <div
              className={tc}
              style={{
                borderRadius: "var(--radius-lg)",
                border: `1.5px solid ${ab.hex}33`,
                overflow: "hidden",
                background: ready ? bgSurface : "var(--color-bg-card)",
                transition: "background 0.4s",
              }}
            >
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column" as const, gap: "2rem" }}>

                {/* ── Typography ──────────────────────────────────────── */}
                <div>
                  <SecLabel label={t.typographyTitle} />
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>
                    {TYPO.map((s) => (
                      <div key={s.cls} className={tc}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                          fontWeight: 700, letterSpacing: "0.08em", color: ab.hex,
                          marginBottom: "0.2rem", opacity: 0.85 }}>
                          {s.label}
                        </div>
                        <div className={`${s.cls} ${tc}`}
                          style={{ color: `var(${s.color}, var(--color-text))` }}>
                          {s.txt}
                        </div>
                      </div>
                    ))}
                    {/* Code */}
                    <div className={tc}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                        fontWeight: 700, letterSpacing: "0.08em", color: ab.hex,
                        marginBottom: "0.2rem", opacity: 0.85 }}>
                        CODE — fontFamilies-code (IBM Plex Mono)
                      </div>
                      <code className={tc} style={{
                        fontFamily: "var(--semantic-typography-fontFamilies-code, 'IBM Plex Mono', monospace)",
                        fontSize: "0.875rem",
                        color: `var(--foundation-txt-body, var(--color-text))`,
                      }}>
                        --foundation-bg-brand-default
                      </code>
                    </div>
                  </div>
                </div>

                {/* ── Foundation Colors ────────────────────────────────── */}
                <div>
                  <SecLabel label={t.colorsTitle} />
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(7.5rem, 1fr))",
                    gap: "0.5rem",
                  }}>
                    {SWATCHES.map((sw) => (
                      <div key={sw.bg} style={{ borderRadius: "var(--radius-sm)", overflow: "hidden",
                        border: "1px solid rgba(128,128,128,0.15)" }}>
                        {/* Color area — cssClass applied directly so var() resolves on this element */}
                        <div
                          className={tc}
                          style={{
                            height: "3.5rem",
                            background: `var(${sw.bg})`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "background 0.35s",
                          }}
                        >
                          {/* txtOn text shown in the txtOn color */}
                          <span
                            className={tc}
                            style={{
                              fontFamily: "var(--font-mono, monospace)",
                              fontSize: "0.5rem",
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                              color: `var(${sw.txtOn})`,
                              textAlign: "center" as const,
                              lineHeight: 1.3,
                              maxWidth: "90%",
                              wordBreak: "break-word" as const,
                            }}
                          >
                            {sw.txtOn.replace("--foundation-txt-", "")}
                          </span>
                        </div>
                        {/* Token label */}
                        <div className={tc} style={{ padding: "0.3rem 0.5rem",
                          background: "rgba(128,128,128,0.07)" }}>
                          <div style={{
                            fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
                            color: `var(--foundation-txt-muted, var(--color-text-muted))`,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                          }}>
                            {sw.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Components — uses Semantic tokens directly ───────── */}
                <div>
                  <SecLabel label={t.componentsTitle} />
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.875rem" }}>

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" as const }}>
                      <button className={tc} style={{
                        padding: "0.625rem 1.25rem", borderRadius: "0.5rem", border: "none",
                        background: "var(--semantic-color-brand-branding-first-default-background)",
                        color: "var(--semantic-color-brand-branding-first-default-txtOn)",
                        fontFamily: "var(--semantic-typography-fontFamilies-main, sans-serif)",
                        fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                        transition: "background 0.3s",
                      }}>
                        {t.btnPrimary}
                      </button>
                      <button className={tc} style={{
                        padding: "0.625rem 1.25rem", borderRadius: "0.5rem",
                        border: "1.5px solid var(--semantic-color-brand-branding-first-default-border)",
                        background: "transparent",
                        color: "var(--semantic-color-brand-branding-first-default-background)",
                        fontFamily: "var(--semantic-typography-fontFamilies-main, sans-serif)",
                        fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                        transition: "color 0.3s, border-color 0.3s",
                      }}>
                        {t.btnOutline}
                      </button>
                    </div>

                    {/* Input */}
                    <input type="text" placeholder={t.inputPlaceholder}
                      className={tc}
                      style={{
                        padding: "0.625rem 0.875rem", borderRadius: "0.5rem",
                        border: "1.5px solid var(--semantic-color-brand-ambient-grayscale-lower-border)",
                        background: "var(--semantic-color-brand-ambient-contrast-base-positive-background)",
                        color: "var(--semantic-color-text-body)",
                        fontFamily: "var(--semantic-typography-fontFamilies-main, sans-serif)",
                        fontSize: "0.875rem", width: "100%", maxWidth: "20rem", outline: "none",
                        transition: "border-color 0.3s, background 0.3s",
                      }}
                    />

                    {/* Card */}
                    <div className={tc} style={{
                      padding: "1.25rem", borderRadius: "0.75rem",
                      border: "1px solid var(--semantic-color-brand-ambient-grayscale-lower-border)",
                      background: "var(--semantic-color-brand-ambient-neutral-lowest-background)",
                      maxWidth: "22rem", transition: "background 0.3s",
                    }}>
                      <div className={tc} style={{
                        fontFamily: "var(--semantic-typography-fontFamilies-main, sans-serif)",
                        fontWeight: 700, fontSize: "1rem", color: "var(--semantic-color-text-title)",
                        marginBottom: "0.5rem",
                      }}>
                        {t.cardTitle}
                      </div>
                      <div className={tc} style={{
                        fontFamily: "var(--semantic-typography-fontFamilies-content, sans-serif)",
                        fontSize: "0.875rem", color: "var(--semantic-color-text-body)",
                        lineHeight: 1.6, marginBottom: "1rem",
                      }}>
                        {t.cardBody}
                      </div>
                      <button className={tc} style={{
                        padding: "0.375rem 0.875rem", borderRadius: "0.375rem", border: "none",
                        background: "var(--semantic-color-brand-branding-first-default-background)",
                        color: "var(--semantic-color-brand-branding-first-default-txtOn)",
                        fontFamily: "var(--semantic-typography-fontFamilies-main, sans-serif)",
                        fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer",
                      }}>
                        {t.cardAction}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── RIGHT: Token resolution tracer ───────────────────────── */}
            <div style={{
              background: "linear-gradient(135deg, var(--color-bg-card), var(--color-bg-subtle))",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              display: "flex", flexDirection: "column" as const, gap: "1.25rem",
            }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text)",
                  marginBottom: "0.25rem" }}>
                  {t.traceTitle}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                  {t.traceSub}
                </p>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
                <button
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.5rem 1rem", borderRadius: "var(--radius)", fontWeight: 600,
                    fontSize: "0.875rem", border: "none",
                    background: isTracing ? "var(--color-bg-subtle)" : "var(--gradient-primary)",
                    color: isTracing ? "var(--color-text-muted)" : "#fff",
                    opacity: isTracing ? 0.6 : 1,
                    cursor: isTracing ? "not-allowed" : "pointer",
                  }}
                  onClick={startTrace}
                  disabled={isTracing}
                >
                  <Play size={13} />{t.traceBtn}
                </button>
                <button
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.5rem 1rem", borderRadius: "var(--radius)", fontWeight: 600,
                    fontSize: "0.875rem", border: "1.5px solid var(--color-border)",
                    background: "transparent", color: "var(--color-text-muted)", cursor: "pointer",
                  }}
                  onClick={resetTrace}
                >
                  <RotateCcw size={13} />{t.resetBtn}
                </button>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.625rem" }}>
                {steps.map((step, idx) => {
                  const isActive = traceStep >= idx;
                  const isFinal  = idx === steps.length - 1;
                  return (
                    <div key={idx} style={{
                      padding: "0.875rem 1rem", borderRadius: "var(--radius)",
                      border: isActive ? `1.5px solid ${ab.hex}44` : "1.5px solid transparent",
                      background: isActive ? `${ab.hex}08` : "var(--color-bg-subtle)",
                      transition: "all 0.4s ease",
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                        <div style={{
                          width: "1.75rem", height: "1.75rem", borderRadius: "50%", flexShrink: 0,
                          background: isActive ? (isFinal ? ab.hex : "var(--gradient-primary)") : "var(--color-border)",
                          color: isActive ? "#fff" : "var(--color-text-muted)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: "0.75rem", transition: "background 0.4s",
                        }}>
                          {idx + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: "var(--font-mono)", fontSize: "0.6875rem", fontWeight: 600,
                            color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                            marginBottom: "0.2rem",
                          }}>
                            {step.token}
                          </div>
                          <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", lineHeight: 1.4 }}>
                            {step.desc}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: "0.625rem", marginLeft: "2.5rem" }}>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.6875rem",
                          padding: "0.2rem 0.5rem", borderRadius: "var(--radius-full)",
                          background: isActive ? (isFinal ? ab.hex : `${ab.hex}20`) : "var(--color-border)",
                          color: isActive ? (isFinal ? "#fff" : ab.hex) : "var(--color-text-muted)",
                          fontWeight: isFinal && isActive ? 700 : 400,
                          transition: "background 0.4s, color 0.4s",
                          display: "inline-block", maxWidth: "100%",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                        }} title={step.value}>
                          {step.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Resolved preview */}
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--color-text)",
                  marginBottom: "0.625rem" }}>
                  {t.previewLabel}
                </div>
                <div style={{
                  height: "5rem", borderRadius: "var(--radius)",
                  background: isResolved ? ab.hex : "#94a3b8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "0.9375rem",
                  transition: "background 0.5s ease", marginBottom: "0.75rem",
                }}>
                  {isResolved ? t.resolvedText : t.resolvingText}
                </div>
                <div style={{
                  padding: "0.75rem 0.875rem",
                  background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}>
                  <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)", marginBottom: "0.3rem" }}>
                    {t.finalLabel}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.9375rem", fontWeight: 700,
                    color: isResolved ? ab.hex : "var(--color-text-muted)", transition: "color 0.4s",
                  }}>
                    {isResolved ? ab.hex : "var(--resolving)"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 760px) {
          .pg-grid {
            grid-template-columns: 1fr 280px !important;
          }
        }
      `}</style>
    </section>
  );
}