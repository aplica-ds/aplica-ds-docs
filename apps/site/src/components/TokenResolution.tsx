import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import { Play, RotateCcw, ArrowRight } from "lucide-react";

type Lang = "pt-br" | "en";

export type TokenResolutionBrand = "joy" | "tangerine" | "grinch" | "blue_sky";

const BRAND_COLORS: Record<TokenResolutionBrand, string> = {
  joy: "#e7398a",
  tangerine: "#FFAE03",
  grinch: "#58bd59",
  blue_sky: "#265ed9",
};

const BRAND_LABELS: Record<TokenResolutionBrand, string> = {
  joy: "Joy",
  tangerine: "Tangerine",
  grinch: "Grinch",
  blue_sky: "Blue Sky",
};

const LAYER_COLORS: Record<string, string> = {
  Foundation: "#ec4899",
  Semantic: "#8b5cf6",
  Surface: "#10b981",
  Mode: "#3b82f6",
  Brand: "#f97316",
};

const RESOLUTION_STEPS = (brandLabel: string, finalColor: string) => [
  {
    layer: "Foundation",
    token: "foundation.bg.brand.default",
    value: "→ semantic.color...",
    desc_ptbr: "Alias curto para times de produto",
    desc_en: "Short alias for product teams",
  },
  {
    layer: "Semantic",
    token: "semantic.color.brand.branding\n  .first.default.background",
    value: "→ surface.color...",
    desc_ptbr: "Token com propósito — não cor, mas papel",
    desc_en: "Purpose token — not a color, but a role",
  },
  {
    layer: "Surface",
    token: "surface.color.brand.branding\n  .first.default.background",
    value: "→ mode.interface...",
    desc_ptbr: "Contexto de superfície: positive / negative",
    desc_en: "Surface context: positive / negative",
  },
  {
    layer: "Mode",
    token: "mode.interface.positive.branding\n  .first.default.background",
    value: "→ brand.color.palette.500",
    desc_ptbr: "Contexto de luminosidade: light / dark",
    desc_en: "Luminosity context: light / dark",
  },
  {
    layer: "Brand",
    token: "brand.color.palette.500",
    value: finalColor,
    desc_ptbr: `Valor primitivo da marca ${brandLabel}`,
    desc_en: `Primitive value for ${brandLabel} brand`,
  },
];

const translations = {
  "pt-br": {
    tracerLabel: "Cadeia de resolução",
    traceBtn: "Rastrear",
    resetBtn: "Resetar",
    previewLabel: "Valor resolvido",
    finalLabel: "Valor final:",
    resolvedText: "Resolvido!",
    resolvingText: "Resolvendo...",
    descKey: "desc_ptbr" as const,
  },
  en: {
    tracerLabel: "Resolution chain",
    traceBtn: "Trace",
    resetBtn: "Reset",
    previewLabel: "Resolved value",
    finalLabel: "Final value:",
    resolvedText: "Resolved!",
    resolvingText: "Resolving...",
    descKey: "desc_en" as const,
  },
};

const UNRESOLVED_COLOR = "#94a3b8";

function clearIntervalRef(ref: { current: ReturnType<typeof setInterval> | null }) {
  if (ref.current !== null) {
    clearInterval(ref.current);
    ref.current = null;
  }
}

export interface TokenResolutionWidgetProps {
  lang?: Lang;
  brand: TokenResolutionBrand;
  mode: "light" | "dark";
  surface: "positive" | "negative";
}

export function TokenResolutionWidget({
  lang = "pt-br",
  brand,
  mode,
  surface,
}: TokenResolutionWidgetProps) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = translations[lang];

  const finalColor = BRAND_COLORS[brand] ?? BRAND_COLORS.tangerine;
  const brandLabel = BRAND_LABELS[brand] ?? "Tangerine";
  const steps = RESOLUTION_STEPS(brandLabel, finalColor);
  const isResolved = currentStep >= steps.length - 1;
  const previewColor = isResolved ? finalColor : UNRESOLVED_COLOR;

  const beginTrace = useCallback(() => {
    clearIntervalRef(intervalRef);
    const lastIndex = steps.length - 1;
    setIsAnimating(true);
    setCurrentStep(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      setCurrentStep(step);
      if (step >= lastIndex) {
        clearIntervalRef(intervalRef);
        setIsAnimating(false);
      }
    }, 600);
  }, [steps.length]);

  const resetAnimation = useCallback(() => {
    clearIntervalRef(intervalRef);
    setCurrentStep(-1);
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    beginTrace();
    return () => clearIntervalRef(intervalRef);
  }, [brand, mode, surface, beginTrace]);

  const btnStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.5rem 1rem",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.15s",
  };

  return (
    <div
      id="token-resolution-widget"
      style={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "linear-gradient(135deg, var(--color-bg-card), var(--color-bg-subtle))",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          className="token-resolution-inner"
          style={{
            display: "block",
            flexDirection: "column",
            gap: "1.75rem",
            width: "100%",
            alignItems: "stretch",
            boxSizing: "border-box",
          }}
        >
          <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "var(--color-text)",
                  marginBottom: "0.75rem",
                }}
              >
                {t.tracerLabel}
              </h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
                <button
                  type="button"
                  style={{
                    ...btnStyle,
                    background: isAnimating ? "var(--color-bg-subtle)" : "var(--gradient-primary)",
                    color: isAnimating ? "var(--color-text-muted)" : "#fff",
                    opacity: isAnimating ? 0.6 : 1,
                    cursor: isAnimating ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    if (isAnimating) return;
                    beginTrace();
                  }}
                  disabled={isAnimating}
                >
                  <Play size={13} />
                  {t.traceBtn}
                </button>
                <button
                  type="button"
                  style={{
                    ...btnStyle,
                    background: "transparent",
                    color: "var(--color-text-muted)",
                    border: "1.5px solid var(--color-border)",
                  }}
                  onClick={resetAnimation}
                >
                  <RotateCcw size={13} />
                  {t.resetBtn}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                width: "100%",
                alignItems: "stretch",
                boxSizing: "border-box",
              }}
            >
              {steps.map((step, idx) => {
                const isActive = currentStep >= idx;
                const isFinal = idx === steps.length - 1;
                const layerColor = LAYER_COLORS[step.layer];
                const desc = step[t.descKey];
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      width: "100%",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                      padding: "0.875rem 1rem",
                      borderRadius: "var(--radius)",
                      border: isActive
                        ? `1.5px solid ${layerColor}55`
                        : "1px solid var(--color-border)",
                      background: isActive ? `${layerColor}0d` : "var(--color-bg-subtle)",
                      transition: "all 0.35s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "1.625rem",
                        height: "1.625rem",
                        borderRadius: "50%",
                        background: isActive ? layerColor : "var(--color-border)",
                        color: isActive ? "#fff" : "var(--color-text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.6875rem",
                        flexShrink: 0,
                        marginTop: "0.1rem",
                        transition: "background 0.35s",
                      }}
                    >
                      {idx + 1}
                    </div>

                    <div style={{ flex: "1 1 0%", minWidth: 0, width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: isActive ? `${layerColor}20` : `${layerColor}12`,
                            color: isActive ? layerColor : "var(--color-text-muted)",
                            transition: "all 0.35s",
                          }}
                        >
                          {step.layer}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: isActive ? "var(--color-text)" : "var(--color-text-muted)",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          lineHeight: 1.5,
                        }}
                      >
                        {step.token}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-muted)",
                          marginTop: "0.25rem",
                          lineHeight: 1.45,
                        }}
                      >
                        {desc}
                      </div>
                    </div>

                    <div
                      style={{
                        flex: "0 0 auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        gap: "0.35rem",
                        paddingTop: "0.15rem",
                        marginLeft: "auto",
                        minWidth: "min(11rem, 38%)",
                        maxWidth: "42%",
                      }}
                    >
                      <ArrowRight
                        size={14}
                        style={{
                          color: isActive ? layerColor : "var(--color-border)",
                          transition: "color 0.35s",
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6875rem",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "var(--radius-full)",
                          background: isActive
                            ? isFinal
                              ? layerColor
                              : `${layerColor}22`
                            : "var(--color-bg-card)",
                          border: `1px solid ${isActive ? `${layerColor}55` : "var(--color-border)"}`,
                          color: isActive ? (isFinal ? "#fff" : layerColor) : "var(--color-text-muted)",
                          width: "100%",
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          transition: "background 0.35s, color 0.35s, border-color 0.35s",
                          fontWeight: isFinal && isActive ? 700 : 500,
                          boxSizing: "border-box",
                        }}
                        title={step.value}
                      >
                        {step.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="token-resolution-preview-col" style={{ width: "100%", minWidth: 0, boxSizing: "border-box", marginTop: "1.25rem" }}>
            <h4
              style={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "var(--color-text)",
                marginBottom: "0.875rem",
              }}
            >
              {t.previewLabel}
            </h4>

            <div
              style={{
                width: "100%",
                height: "7rem",
                borderRadius: "var(--radius)",
                background: previewColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                transition: "background 0.5s ease",
                marginBottom: "1rem",
                letterSpacing: "0.01em",
              }}
            >
              {isResolved ? t.resolvedText : t.resolvingText}
            </div>

            <div
              style={{
                padding: "0.875rem 1rem",
                background: "var(--color-bg-subtle)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius)",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                  marginBottom: "0.375rem",
                }}
              >
                {t.finalLabel}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: isResolved ? finalColor : "var(--color-text-muted)",
                  transition: "color 0.4s",
                }}
              >
                {isResolved ? finalColor : "var(--resolving)"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 720px) {
          .token-resolution-inner {
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .token-resolution-inner > div:first-child {
            flex: 1 1 0% !important;
            min-width: 0 !important;
            width: auto !important;
          }
          .token-resolution-inner .token-resolution-preview-col {
            width: 240px !important;
            min-width: 200px !important;
            max-width: 280px !important;
            flex-shrink: 0 !important;
          }
        }
        @media (min-width: 960px) {
          .token-resolution-inner .token-resolution-preview-col {
            width: 260px !important;
            max-width: 300px !important;
          }
        }
      `}</style>
    </div>
  );
}
