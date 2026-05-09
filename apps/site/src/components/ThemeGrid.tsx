import { useState, useEffect } from "react";

type Lang = "pt-br" | "en";

const translations = {
  "pt-br": {
    title: "60 Temas Auto-Gerados",
    subtitle:
      "15 marcas × 2 modos × 2 superfícies = 60 temas consistentes. Cada tema mantém a mesma lógica semântica com personalidade única.",
    selected: "Selecionado",
    cssClass: "Classe CSS",
  },
  en: {
    title: "60 Auto-Generated Themes",
    subtitle:
      "15 brands × 2 modes × 2 surfaces = 60 consistent themes. Each theme shares the same semantic logic with unique brand personality.",
    selected: "Selected",
    cssClass: "CSS class",
  },
};

interface Theme {
  brand: string;
  displayName: string;
  mode: "light" | "dark";
  surface: "positive" | "negative";
  cssClass: string;
  // primary color for the details bar (static, won't change per CSS load order)
  primaryHex: string;
}

const THEMES: Theme[] = [
  { brand: "aplica_joy",       displayName: "Joy",       mode: "light", surface: "positive", cssClass: "aplica-joy-light-positive",       primaryHex: "#e7398a" },
  { brand: "aplica_joy",       displayName: "Joy",       mode: "light", surface: "negative", cssClass: "aplica-joy-light-negative",       primaryHex: "#e7398a" },
  { brand: "aplica_joy",       displayName: "Joy",       mode: "dark",  surface: "positive", cssClass: "aplica-joy-dark-positive",        primaryHex: "#e7398a" },
  { brand: "aplica_joy",       displayName: "Joy",       mode: "dark",  surface: "negative", cssClass: "aplica-joy-dark-negative",        primaryHex: "#e7398a" },
  { brand: "aplica_tangerine", displayName: "Tangerine", mode: "light", surface: "positive", cssClass: "aplica-tangerine-light-positive", primaryHex: "#ffae03" },
  { brand: "aplica_tangerine", displayName: "Tangerine", mode: "light", surface: "negative", cssClass: "aplica-tangerine-light-negative", primaryHex: "#ffae03" },
  { brand: "aplica_tangerine", displayName: "Tangerine", mode: "dark",  surface: "positive", cssClass: "aplica-tangerine-dark-positive",  primaryHex: "#ffae03" },
  { brand: "aplica_tangerine", displayName: "Tangerine", mode: "dark",  surface: "negative", cssClass: "aplica-tangerine-dark-negative",  primaryHex: "#ffae03" },
  { brand: "aplica_grinch",    displayName: "Grinch",    mode: "light", surface: "positive", cssClass: "aplica-grinch-light-positive",    primaryHex: "#58bd59" },
  { brand: "aplica_grinch",    displayName: "Grinch",    mode: "light", surface: "negative", cssClass: "aplica-grinch-light-negative",    primaryHex: "#58bd59" },
  { brand: "aplica_grinch",    displayName: "Grinch",    mode: "dark",  surface: "positive", cssClass: "aplica-grinch-dark-positive",     primaryHex: "#58bd59" },
  { brand: "aplica_grinch",    displayName: "Grinch",    mode: "dark",  surface: "negative", cssClass: "aplica-grinch-dark-negative",     primaryHex: "#58bd59" },
  { brand: "aplica_blue_sky",  displayName: "Blue Sky",  mode: "light", surface: "positive", cssClass: "aplica-blue-sky-light-positive",  primaryHex: "#265ed9" },
  { brand: "aplica_blue_sky",  displayName: "Blue Sky",  mode: "light", surface: "negative", cssClass: "aplica-blue-sky-light-negative",  primaryHex: "#265ed9" },
  { brand: "aplica_blue_sky",  displayName: "Blue Sky",  mode: "dark",  surface: "positive", cssClass: "aplica-blue-sky-dark-positive",   primaryHex: "#265ed9" },
  { brand: "aplica_blue_sky",  displayName: "Blue Sky",  mode: "dark",  surface: "negative", cssClass: "aplica-blue-sky-dark-negative",   primaryHex: "#265ed9" },
  { brand: "aplica_sky",       displayName: "Sky",       mode: "light", surface: "positive", cssClass: "aplica-sky-light-positive",       primaryHex: "#265ed9" },
  { brand: "aplica_sky",       displayName: "Sky",       mode: "light", surface: "negative", cssClass: "aplica-sky-light-negative",       primaryHex: "#265ed9" },
  { brand: "aplica_sky",       displayName: "Sky",       mode: "dark",  surface: "positive", cssClass: "aplica-sky-dark-positive",        primaryHex: "#265ed9" },
  { brand: "aplica_sky",       displayName: "Sky",       mode: "dark",  surface: "negative", cssClass: "aplica-sky-dark-negative",        primaryHex: "#265ed9" },
  { brand: "aplica_slate",     displayName: "Slate",     mode: "light", surface: "positive", cssClass: "aplica-slate-light-positive",     primaryHex: "#2b4c7e" },
  { brand: "aplica_slate",     displayName: "Slate",     mode: "light", surface: "negative", cssClass: "aplica-slate-light-negative",     primaryHex: "#2b4c7e" },
  { brand: "aplica_slate",     displayName: "Slate",     mode: "dark",  surface: "positive", cssClass: "aplica-slate-dark-positive",      primaryHex: "#2b4c7e" },
  { brand: "aplica_slate",     displayName: "Slate",     mode: "dark",  surface: "negative", cssClass: "aplica-slate-dark-negative",      primaryHex: "#2b4c7e" },
  { brand: "aplica_obsidian",  displayName: "Obsidian",  mode: "light", surface: "positive", cssClass: "aplica-obsidian-light-positive",  primaryHex: "#1a1a2e" },
  { brand: "aplica_obsidian",  displayName: "Obsidian",  mode: "light", surface: "negative", cssClass: "aplica-obsidian-light-negative",  primaryHex: "#1a1a2e" },
  { brand: "aplica_obsidian",  displayName: "Obsidian",  mode: "dark",  surface: "positive", cssClass: "aplica-obsidian-dark-positive",   primaryHex: "#1a1a2e" },
  { brand: "aplica_obsidian",  displayName: "Obsidian",  mode: "dark",  surface: "negative", cssClass: "aplica-obsidian-dark-negative",   primaryHex: "#1a1a2e" },
  { brand: "aplica_electric",  displayName: "Electric",  mode: "light", surface: "positive", cssClass: "aplica-electric-light-positive",  primaryHex: "#1d4ed8" },
  { brand: "aplica_electric",  displayName: "Electric",  mode: "light", surface: "negative", cssClass: "aplica-electric-light-negative",  primaryHex: "#1d4ed8" },
  { brand: "aplica_electric",  displayName: "Electric",  mode: "dark",  surface: "positive", cssClass: "aplica-electric-dark-positive",   primaryHex: "#1d4ed8" },
  { brand: "aplica_electric",  displayName: "Electric",  mode: "dark",  surface: "negative", cssClass: "aplica-electric-dark-negative",   primaryHex: "#1d4ed8" },
  { brand: "aplica_forest",    displayName: "Forest",    mode: "light", surface: "positive", cssClass: "aplica-forest-light-positive",    primaryHex: "#1b5e20" },
  { brand: "aplica_forest",    displayName: "Forest",    mode: "light", surface: "negative", cssClass: "aplica-forest-light-negative",    primaryHex: "#1b5e20" },
  { brand: "aplica_forest",    displayName: "Forest",    mode: "dark",  surface: "positive", cssClass: "aplica-forest-dark-positive",     primaryHex: "#1b5e20" },
  { brand: "aplica_forest",    displayName: "Forest",    mode: "dark",  surface: "negative", cssClass: "aplica-forest-dark-negative",     primaryHex: "#1b5e20" },
  { brand: "aplica_coral",     displayName: "Coral",     mode: "light", surface: "positive", cssClass: "aplica-coral-light-positive",     primaryHex: "#f4845f" },
  { brand: "aplica_coral",     displayName: "Coral",     mode: "light", surface: "negative", cssClass: "aplica-coral-light-negative",     primaryHex: "#f4845f" },
  { brand: "aplica_coral",     displayName: "Coral",     mode: "dark",  surface: "positive", cssClass: "aplica-coral-dark-positive",      primaryHex: "#f4845f" },
  { brand: "aplica_coral",     displayName: "Coral",     mode: "dark",  surface: "negative", cssClass: "aplica-coral-dark-negative",      primaryHex: "#f4845f" },
  { brand: "aplica_midnight",  displayName: "Midnight",  mode: "light", surface: "positive", cssClass: "aplica-midnight-light-positive",  primaryHex: "#3730a3" },
  { brand: "aplica_midnight",  displayName: "Midnight",  mode: "light", surface: "negative", cssClass: "aplica-midnight-light-negative",  primaryHex: "#3730a3" },
  { brand: "aplica_midnight",  displayName: "Midnight",  mode: "dark",  surface: "positive", cssClass: "aplica-midnight-dark-positive",   primaryHex: "#3730a3" },
  { brand: "aplica_midnight",  displayName: "Midnight",  mode: "dark",  surface: "negative", cssClass: "aplica-midnight-dark-negative",   primaryHex: "#3730a3" },
  { brand: "aplica_rose",      displayName: "Rose",      mode: "light", surface: "positive", cssClass: "aplica-rose-light-positive",      primaryHex: "#e11d48" },
  { brand: "aplica_rose",      displayName: "Rose",      mode: "light", surface: "negative", cssClass: "aplica-rose-light-negative",      primaryHex: "#e11d48" },
  { brand: "aplica_rose",      displayName: "Rose",      mode: "dark",  surface: "positive", cssClass: "aplica-rose-dark-positive",       primaryHex: "#e11d48" },
  { brand: "aplica_rose",      displayName: "Rose",      mode: "dark",  surface: "negative", cssClass: "aplica-rose-dark-negative",       primaryHex: "#e11d48" },
  { brand: "aplica_mono",      displayName: "Mono",      mode: "light", surface: "positive", cssClass: "aplica-mono-light-positive",      primaryHex: "#374151" },
  { brand: "aplica_mono",      displayName: "Mono",      mode: "light", surface: "negative", cssClass: "aplica-mono-light-negative",      primaryHex: "#374151" },
  { brand: "aplica_mono",      displayName: "Mono",      mode: "dark",  surface: "positive", cssClass: "aplica-mono-dark-positive",       primaryHex: "#374151" },
  { brand: "aplica_mono",      displayName: "Mono",      mode: "dark",  surface: "negative", cssClass: "aplica-mono-dark-negative",       primaryHex: "#374151" },
  { brand: "aplica_aurora",    displayName: "Aurora",    mode: "light", surface: "positive", cssClass: "aplica-aurora-light-positive",    primaryHex: "#7c3aed" },
  { brand: "aplica_aurora",    displayName: "Aurora",    mode: "light", surface: "negative", cssClass: "aplica-aurora-light-negative",    primaryHex: "#7c3aed" },
  { brand: "aplica_aurora",    displayName: "Aurora",    mode: "dark",  surface: "positive", cssClass: "aplica-aurora-dark-positive",     primaryHex: "#7c3aed" },
  { brand: "aplica_aurora",    displayName: "Aurora",    mode: "dark",  surface: "negative", cssClass: "aplica-aurora-dark-negative",     primaryHex: "#7c3aed" },
  { brand: "aplica_ember",     displayName: "Ember",     mode: "light", surface: "positive", cssClass: "aplica-ember-light-positive",     primaryHex: "#c2410c" },
  { brand: "aplica_ember",     displayName: "Ember",     mode: "light", surface: "negative", cssClass: "aplica-ember-light-negative",     primaryHex: "#c2410c" },
  { brand: "aplica_ember",     displayName: "Ember",     mode: "dark",  surface: "positive", cssClass: "aplica-ember-dark-positive",      primaryHex: "#c2410c" },
  { brand: "aplica_ember",     displayName: "Ember",     mode: "dark",  surface: "negative", cssClass: "aplica-ember-dark-negative",      primaryHex: "#c2410c" },
];


interface Props {
  lang?: Lang;
}

export function ThemeGrid({ lang = "pt-br" }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [cssLoaded, setCssLoaded] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    // All theme CSS files are loaded statically in Base.astro — no injection needed.
    setCssLoaded(true);
  }, []);

  const sel = THEMES[selectedIdx];

  // Ambient background token per surface
  const bgToken = (surface: "positive" | "negative") =>
    surface === "positive"
      ? "var(--semantic-color-brand-ambient-contrast-base-positive-background)"
      : "var(--semantic-color-brand-ambient-contrast-base-negative-background)";

  return (
    <section id="theme-grid" style={{ padding: "5rem 0", background: "var(--color-bg-subtle)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              fontWeight: 700,
              marginBottom: "0.75rem",
              color: "var(--color-text)",
            }}
          >
            {t.title}
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-muted)",
              maxWidth: "580px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.875rem",
            maxWidth: "960px",
            margin: "0 auto",
          }}
        >
          {THEMES.map((theme, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={theme.cssClass}
                onClick={() => setSelectedIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedIdx(idx)}
                style={{
                  background: "var(--color-bg-card)",
                  border: isSelected
                    ? `2px solid ${theme.primaryHex}`
                    : "1.5px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  padding: "0.75rem",
                  cursor: "pointer",
                  boxShadow: isSelected
                    ? `0 0 0 3px ${theme.primaryHex}22, var(--shadow-md)`
                    : "var(--shadow-sm)",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Swatch using real CSS vars from loaded theme */}
                <div
                  className={cssLoaded ? theme.cssClass : ""}
                  style={{
                    width: "100%",
                    height: "3.75rem",
                    borderRadius: "var(--radius-sm)",
                    background: cssLoaded
                      ? bgToken(theme.surface)
                      : theme.mode === "dark" ? "#1e293b" : "#f9fafb",
                    marginBottom: "0.625rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "background 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      borderRadius: "50%",
                      background: cssLoaded
                        ? "var(--semantic-color-brand-branding-first-default-background)"
                        : theme.primaryHex,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: cssLoaded
                        ? "var(--semantic-color-brand-branding-first-default-txtOn)"
                        : "#fff",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      transition: "background 0.3s",
                    }}
                  >
                    {theme.displayName.charAt(0)}
                  </div>
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0.3rem",
                        right: "0.3rem",
                        width: "1.125rem",
                        height: "1.125rem",
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "var(--shadow-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke={theme.primaryHex} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Theme info */}
                <div style={{ fontWeight: 600, fontSize: "0.75rem", color: "var(--color-text)", marginBottom: "0.3rem" }}>
                  {theme.displayName}
                </div>
                <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" as const }}>
                  {[theme.mode, theme.surface].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "0.1rem 0.4rem",
                        background: "var(--color-bg-subtle)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.625rem",
                        color: "var(--color-text-muted)",
                        textTransform: "capitalize" as const,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected theme details bar */}
        <div
          style={{
            maxWidth: "960px",
            margin: "1.25rem auto 0",
            padding: "0.875rem 1.25rem",
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            flexWrap: "wrap" as const,
          }}
        >
          <div
            style={{
              width: "1.25rem",
              height: "1.25rem",
              borderRadius: "50%",
              background: sel.primaryHex,
              flexShrink: 0,
            }}
          />
          <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-text-muted)", flex: 1 }}>
            <span style={{ color: "var(--color-accent)" }}>class</span>
            {"=\""}
            <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{sel.cssClass}</span>
            {"\""}
          </code>
          <span
            style={{
              padding: "0.2rem 0.6rem",
              background: `${sel.primaryHex}20`,
              color: sel.primaryHex,
              borderRadius: "var(--radius-full)",
              fontSize: "0.6875rem",
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
            }}
          >
            {sel.primaryHex}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .theme-grid-4col { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}