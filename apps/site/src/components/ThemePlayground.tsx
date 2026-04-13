import { useState, useEffect } from "react";

type Lang     = "pt-br" | "en";
type Brand    = "tangerine" | "joy" | "grinch" | "blue_sky";
type Mode     = "light" | "dark";
type Surface  = "positive" | "negative";

const BRANDS: { id: Brand; label: string; hex: string }[] = [
  { id: "joy",       label: "Joy",       hex: "#e7398a" },
  { id: "tangerine", label: "Tangerine", hex: "#ffae03" },
  { id: "grinch",    label: "Grinch",    hex: "#58bd59" },
  { id: "blue_sky",  label: "Blue Sky",  hex: "#265ed9" },
];

// bg utility class → txtOn utility class → label + token name shown inside swatch
const SWATCHES = [
  { bgCls: "pg-bg-primary",   txtOnCls: "pg-txt-title",    txtOnToken: "txt-title",             label: "bg-primary"       },
  { bgCls: "pg-bg-secondary", txtOnCls: "pg-txt-body",     txtOnToken: "txt-body",              label: "bg-secondary"     },
  { bgCls: "pg-bg-brand",     txtOnCls: "pg-txton-brand",  txtOnToken: "txt-on-brand-default",  label: "bg-brand-default" },
  { bgCls: "pg-bg-info",      txtOnCls: "pg-txton-info",   txtOnToken: "txt-on-feedback-info",  label: "feedback-info"    },
  { bgCls: "pg-bg-success",   txtOnCls: "pg-txton-success",txtOnToken: "txt-on-feedback-success",label: "feedback-success" },
  { bgCls: "pg-bg-warning",   txtOnCls: "pg-txton-warning",txtOnToken: "txt-on-feedback-warning",label: "feedback-warning" },
  { bgCls: "pg-bg-danger",    txtOnCls: "pg-txton-danger", txtOnToken: "txt-on-feedback-danger", label: "feedback-danger"  },
] as const;

const TYPO = [
  // display-display_2 uses fontFamilies-display → Sansita (tangerine/grinch/blue_sky) or Poppins (joy)
  { cls: "typography-theme_engine-display-display_2", label: "DISPLAY — fontFamilies-display", txt: "Display titles",                    pgCls: "pg-txt-title", sizeOverride: "2rem" },
  { cls: "typography-theme_engine-heading-title_2",   label: "TITLE — heading-title_2",        txt: "Heading Title — fontFamilies-main", pgCls: "pg-txt-title", sizeOverride: undefined },
  { cls: "typography-theme_engine-content-body",      label: "BODY — content-body",            txt: "Body text with the theme's main font.", pgCls: "pg-txt-body"  },
  { cls: "typography-theme_engine-content-label",     label: "LABEL — content-label",          txt: "Interface label / caption",         pgCls: "pg-txt-muted" },
] as const;

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
    btnPrimary: "Primary Button",
    btnOutline: "Outline Button",
    inputPlaceholder: "Type something…",
    cardTitle: "Example Card",
    cardBody: "Component using Semantic tokens for background, text and border.",
    cardAction: "Learn more",
  },
} as const;

// ── CSS helpers ───────────────────────────────────────────────────────────

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

/**
 * Injects a <style> block that re-declares foundation aliases scoped to every
 * aplica-* class AND defines .pg-txt-* / .pg-bg-* utility classes that use
 * them.  This is the "layer inside" approach: class-based rules resolve var()
 * chains through the cascade correctly even when the external foundation.css
 * is not parsed yet, because the semantic tokens are defined on the SAME class
 * selector that the element carries.
 */
function injectPlaygroundLayer() {
  const ID = "aplica-playground-layer";
  if (typeof document === "undefined" || document.getElementById(ID)) return;
  const s = document.createElement("style");
  s.id = ID;
  // The attribute selector matches any element whose class attribute contains
  // a token starting with "aplica-" so it covers all 16 theme classes.
  s.textContent = `
    /* ── Foundation aliases re-declared on every aplica-* element ──────── */
    [class*="aplica-tangerine-"],
    [class*="aplica-joy-"],
    [class*="aplica-grinch-"],
    [class*="aplica-blue-sky-"] {
      --foundation-txt-title:              var(--semantic-color-text-title);
      --foundation-txt-body:               var(--semantic-color-text-body);
      --foundation-txt-muted:              var(--semantic-color-text-muted);
      --foundation-bg-primary:             var(--semantic-color-brand-ambient-contrast-base-positive-background);
      --foundation-bg-secondary:           var(--semantic-color-brand-ambient-neutral-lowest-background);
      --foundation-bg-brand-default:       var(--semantic-color-brand-branding-first-default-background);
      --foundation-txt-on-brand-default:   var(--semantic-color-brand-branding-first-default-txtOn);
      --foundation-bg-neutral-low:         var(--semantic-color-brand-ambient-neutral-low-background);
      --foundation-txt-on-neutral-low:     var(--semantic-color-brand-ambient-neutral-low-txtOn);
      --foundation-bg-feedback-info-default:       var(--semantic-color-interface-feedback-info-default-normal-background);
      --foundation-txt-on-feedback-info-default:   var(--semantic-color-interface-feedback-info-default-normal-txtOn);
      --foundation-bg-feedback-success-default:    var(--semantic-color-interface-feedback-success-default-normal-background);
      --foundation-txt-on-feedback-success-default:var(--semantic-color-interface-feedback-success-default-normal-txtOn);
      --foundation-bg-feedback-warning-default:    var(--semantic-color-interface-feedback-warning-default-normal-background);
      --foundation-txt-on-feedback-warning-default:var(--semantic-color-interface-feedback-warning-default-normal-txtOn);
      --foundation-bg-feedback-danger-default:     var(--semantic-color-interface-feedback-danger-default-normal-background);
      --foundation-txt-on-feedback-danger-default: var(--semantic-color-interface-feedback-danger-default-normal-txtOn);
    }

    /* ── Utility classes used inside the playground preview ────────────── */
    .pg-txt-title { color: var(--foundation-txt-title) !important; }
    .pg-txt-body  { color: var(--foundation-txt-body)  !important; }
    .pg-txt-muted { color: var(--foundation-txt-muted) !important; }
    .pg-bg-primary   { background: var(--foundation-bg-primary)   !important; }
    .pg-bg-secondary    { background: var(--foundation-bg-secondary)    !important; }
    .pg-bg-neutral-low  { background: var(--foundation-bg-neutral-low)  !important; }
    .pg-txton-neutral-low { color: var(--foundation-txt-on-neutral-low) !important; }
    .pg-bg-brand     { background: var(--foundation-bg-brand-default) !important; }
    .pg-txton-brand  { color: var(--foundation-txt-on-brand-default) !important; }
    .pg-bg-info      { background: var(--foundation-bg-feedback-info-default)    !important; }
    .pg-txton-info   { color: var(--foundation-txt-on-feedback-info-default)     !important; }
    .pg-bg-success   { background: var(--foundation-bg-feedback-success-default) !important; }
    .pg-txton-success{ color: var(--foundation-txt-on-feedback-success-default)  !important; }
    .pg-bg-warning   { background: var(--foundation-bg-feedback-warning-default) !important; }
    .pg-txton-warning{ color: var(--foundation-txt-on-feedback-warning-default)  !important; }
    .pg-bg-danger    { background: var(--foundation-bg-feedback-danger-default)  !important; }
    .pg-txton-danger { color: var(--foundation-txt-on-feedback-danger-default)   !important; }

    /* ── Surface background ─────────────────────────────────────────────── */
    /* positive-background is always the main bg for any theme (light/dark/positive/negative).
       The theme class switch is what drives the actual color change. */
    .pg-surface { background: var(--semantic-color-brand-ambient-contrast-base-positive-background) !important; }

    @media (min-width: 760px) { .pg-grid { grid-template-columns: 1fr 280px !important; } }
  `;
  document.head.appendChild(s);
}

// ── Component ─────────────────────────────────────────────────────────────

interface Props { lang?: Lang }

export function ThemePlayground({ lang = "pt-br" }: Props) {
  const [brand,   setBrand]   = useState<Brand>("joy");
  const [mode,    setMode]    = useState<Mode>("light");
  const [surface, setSurface] = useState<Surface>("positive");
  const [ready,   setReady]   = useState(false);

  const t = UI[lang];
  const ab = BRANDS.find((b) => b.id === brand)!;

  // cssClass: blue_sky → aplica-blue-sky-* (file uses underscore, class uses hyphens)
  const cssClass = `aplica-${brand.replace(/_/g, "-")}-${mode}-${surface}`;

  // ── Load CSS on mount ──────────────────────────────────────────────────
  useEffect(() => {
    injectFonts();
    injectPlaygroundLayer();
    setReady(true);
  }, []);

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
              className={`${tc} ${ready ? "pg-surface" : ""}`}
              style={{
                borderRadius: "var(--radius-lg)",
                border: `1.5px solid ${ab.hex}33`,
                overflow: "hidden",
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
                        {/* pgCls applies color via injected CSS layer — no inline color:var() */}
                        <div className={`${s.cls} ${tc} ${s.pgCls}`}
                          style={"sizeOverride" in s && s.sizeOverride ? { fontSize: s.sizeOverride } : {}}>
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
                      <code className={`${tc} pg-txt-body`} style={{
                        fontFamily: "var(--semantic-typography-fontFamilies-code, 'IBM Plex Mono', monospace)",
                        fontSize: "0.875rem",
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
                      <div key={sw.bgCls} style={{ borderRadius: "var(--radius-sm)", overflow: "hidden",
                        border: "1px solid rgba(128,128,128,0.15)" }}>
                        {/* bgCls sets background; txtOnCls sets text color — both via injected layer */}
                        <div className={`${tc} ${sw.bgCls}`} style={{
                          height: "3.5rem",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background 0.35s",
                        }}>
                          <span className={`${tc} ${sw.txtOnCls}`} style={{
                            fontFamily: "var(--font-mono, monospace)",
                            fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.04em",
                            textAlign: "center" as const, lineHeight: 1.3,
                            maxWidth: "90%", wordBreak: "break-word" as const,
                          }}>
                            {sw.txtOnToken}
                          </span>
                        </div>
                        {/* Token label */}
                        <div className={`${tc} pg-txt-muted`} style={{ padding: "0.3rem 0.5rem",
                          background: "rgba(128,128,128,0.07)" }}>
                          <div style={{
                            fontFamily: "var(--font-mono, monospace)", fontSize: "0.5rem",
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
                    <div className={`${tc} pg-bg-primary`} style={{
                      padding: "1.25rem", borderRadius: "0.75rem",
                      border: "1px solid var(--semantic-color-brand-ambient-grayscale-lower-border)",
                      maxWidth: "22rem", transition: "background 0.3s",
                    }}>
                      <div className={`${tc} pg-txton-primary`} style={{
                        fontFamily: "var(--semantic-typography-fontFamilies-main, sans-serif)",
                        fontWeight: 700, fontSize: "1rem",
                        marginBottom: "0.5rem",
                      }}>
                        {t.cardTitle}
                      </div>
                      <div className={`${tc} pg-txton-primary`} style={{
                        fontFamily: "var(--semantic-typography-fontFamilies-content, sans-serif)",
                        fontSize: "0.875rem",
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

          </div>
        </div>
      </div>

    </section>
  );
}