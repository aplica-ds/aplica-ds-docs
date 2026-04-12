import { useState } from "react"

type Lang = "pt-br" | "en"

const translations = {
  "pt-br": {
    title: "12 Temas Auto-Gerados",
    subtitle:
      "3 marcas × 2 modos × 2 superfícies = 12 temas consistentes. Cada tema mantém a mesma lógica semântica com personalidade única.",
    brand: "Marca",
    mode: "Modo",
    surface: "Superfície",
    selected: "Ativo",
  },
  en: {
    title: "12 Auto-Generated Themes",
    subtitle:
      "3 brands × 2 modes × 2 surfaces = 12 consistent themes. Each theme shares the same semantic logic with unique brand personality.",
    brand: "Brand",
    mode: "Mode",
    surface: "Surface",
    selected: "Active",
  },
}

interface Theme {
  brand: string
  mode: "light" | "dark"
  surface: "positive" | "negative"
  primaryColor: string
  bgColor: string
  textColor: string
}

const themes: Theme[] = [
  { brand: "tangerine", mode: "light",  surface: "positive", primaryColor: "#FF6B35", bgColor: "#FFF8F5", textColor: "#4A1505" },
  { brand: "tangerine", mode: "light",  surface: "negative", primaryColor: "#FF8A65", bgColor: "#FF6B35", textColor: "#FFF8F5" },
  { brand: "tangerine", mode: "dark",   surface: "positive", primaryColor: "#FF7043", bgColor: "#1C0A05", textColor: "#FFD0BC" },
  { brand: "tangerine", mode: "dark",   surface: "negative", primaryColor: "#FF5722", bgColor: "#FF7043", textColor: "#1C0A05" },
  { brand: "joy",       mode: "light",  surface: "positive", primaryColor: "#4CAF50", bgColor: "#F3FBF3", textColor: "#1B4C1D" },
  { brand: "joy",       mode: "light",  surface: "negative", primaryColor: "#66BB6A", bgColor: "#4CAF50", textColor: "#F3FBF3" },
  { brand: "joy",       mode: "dark",   surface: "positive", primaryColor: "#43A047", bgColor: "#071508", textColor: "#B8E6BA" },
  { brand: "joy",       mode: "dark",   surface: "negative", primaryColor: "#388E3C", bgColor: "#43A047", textColor: "#071508" },
  { brand: "grinch",    mode: "light",  surface: "positive", primaryColor: "#8BC34A", bgColor: "#F7FBF1", textColor: "#2C4A0E" },
  { brand: "grinch",    mode: "light",  surface: "negative", primaryColor: "#9CCC65", bgColor: "#8BC34A", textColor: "#F7FBF1" },
  { brand: "grinch",    mode: "dark",   surface: "positive", primaryColor: "#7CB342", bgColor: "#0D1A04", textColor: "#C8E89E" },
  { brand: "grinch",    mode: "dark",   surface: "negative", primaryColor: "#689F38", bgColor: "#7CB342", textColor: "#0D1A04" },
]

const brandInitial = (brand: string) => brand.charAt(0).toUpperCase()

interface Props {
  lang?: Lang
}

export function ThemeGrid({ lang = "pt-br" }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const t = translations[lang]

  return (
    <section style={{ padding: "5rem 0", background: "var(--color-bg-subtle)" }}>
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
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div
          className="theme-grid-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
            maxWidth: "920px",
            margin: "0 auto",
          }}
        >
          {themes.map((theme, idx) => {
            const isSelected = selectedIdx === idx
            return (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedIdx(idx)}
                style={{
                  background: "var(--color-bg-card)",
                  border: isSelected ? `2px solid ${theme.primaryColor}` : "1.5px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                  padding: "1rem",
                  cursor: "pointer",
                  boxShadow: isSelected ? `0 0 0 3px ${theme.primaryColor}22, var(--shadow-md)` : "var(--shadow-sm)",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Color swatch */}
                <div
                  style={{
                    width: "100%",
                    height: "4.5rem",
                    borderRadius: "var(--radius-sm)",
                    background: theme.bgColor,
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      background: theme.primaryColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: theme.textColor,
                      fontWeight: 700,
                      fontSize: "0.875rem",
                    }}
                  >
                    {brandInitial(theme.brand)}
                  </div>
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "0.375rem",
                        right: "0.375rem",
                        width: "1.25rem",
                        height: "1.25rem",
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "var(--shadow-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke={theme.primaryColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Theme info */}
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      color: "var(--color-text)",
                      marginBottom: "0.375rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {theme.brand}
                  </div>
                  <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" as const }}>
                    {[theme.mode, theme.surface].map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "0.125rem 0.5rem",
                          background: "var(--color-bg-subtle)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-full)",
                          fontSize: "0.6875rem",
                          color: "var(--color-text-muted)",
                          textTransform: "capitalize" as const,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected theme details */}
        <div
          style={{
            maxWidth: "920px",
            margin: "1.5rem auto 0",
            padding: "1rem 1.25rem",
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap" as const,
          }}
        >
          <div
            style={{
              width: "1.5rem",
              height: "1.5rem",
              borderRadius: "50%",
              background: themes[selectedIdx].primaryColor,
              flexShrink: 0,
            }}
          />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            <span style={{ color: "var(--color-text)", fontWeight: 600, textTransform: "capitalize" }}>
              {themes[selectedIdx].brand}
            </span>
            {" · "}
            {themes[selectedIdx].mode}
            {" · "}
            {themes[selectedIdx].surface}
            {" · "}
            {themes[selectedIdx].primaryColor}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span
              style={{
                padding: "0.25rem 0.75rem",
                background: `${themes[selectedIdx].primaryColor}18`,
                color: themes[selectedIdx].primaryColor,
                borderRadius: "var(--radius-full)",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {t.selected}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}