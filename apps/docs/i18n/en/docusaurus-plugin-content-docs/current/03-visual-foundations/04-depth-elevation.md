---
title: "Depth & Elevation"
lang: en
---

# Depth & Elevation

> **Depth in interfaces is an optical illusion.** There is no real Z-axis on screen; we communicate overlap and elevation through visual signals that the brain decodes as distance.

In Aplica DS V2, this illusion is parameterized in the Theme Engine through a cohesive system of **Depth/Elevation Styles**. Instead of simply applying colors with blur, the model deconstructs the physical shadow phenomenon into **5 Primitive Elements**.

---

## 1. The 5 Primitive Elements of Shadow

Every shadow (and the resulting sense of elevation) in the system is the result of composing the following quantities, which map exactly to the syntax of a CSS `box-shadow`:

### 1.1 Position (Inset/Outer)
Determines where the shadow is projected relative to the layer, dictating whether the element is "floating" or is a "hole."
- **Outer (`drop-shadow`):** External shadow. The element appears to float **above** the plane. Default for cards, buttons, and modals.
- **Inner (`inset`):** Internal shadow. The element appears cut out or **below** the plane. Default for *inputs*, generic selectors, and recessed backgrounds.

### 1.2 Distance (Offset X and Y)
The shadow displacement size. Simulates "how high/low" the ambient light source is relative to the object and its distance from the ground.
- **Integration with Dimension:** Distance is tied to `Dimension` foundation tokens (e.g., micro `2px`, extraSmall `4px`, small `8px`).

### 1.3 Intensity (Blur)
The soft light scattering/diffraction that marks occlusion.
- Low blur (`~4px`): Objects very close to the surface, hard light. Hyper-sharp shadow.
- High blur (`~16px+`): Objects with high float, soft and diffused ambient light.

### 1.4 Proximity (Spread)
The simulation of approaching or moving away from the observer.
- **Negative spread:** Simulates the shadow hiding more under the object (proximity shadow).
- **No spread (`0px`):** Shadow faithful to the exact physical contour.

### 1.5 Luminosity (Color / Opacity)
Control of the α (Alpha) channel and color nuance to subtract light from the lower plane without dirtying the design.

> [!IMPORTANT]
> **The Grayscale Scale and Accessibility Commitment**
> As stipulated in the Color foundations (A11y and WCAG): shadows composed here use exclusively **Grayscale (no chroma/hue).**
> Colored shadows tend to create *color vibration* (visual noise) when passing over tinted surfaces, ruining the structural precision of the UI component in depth perception. We use dark, austere colors with low opacity purely to **subtract lightness** and physically simulate light occlusion.

**Canonical source of values:** The Alpha values used in this quantity come from the **Surface Stubs** of the opacity system (see [05-opacity.md](./05-opacity.md)). The Theme Engine automatically generates pre-composed translucent colors:

| Role in Depth | Source Stub Token | Generated Value |
|---|---|---|
| Occlusion shadow (Light Mode) | `surface.opacity.color.dark.superTransparent` | `rgba(0,0,0, 0.1)` |
| Occlusion shadow (Light Mode) | `surface.opacity.color.dark.semiTranslucid` | `rgba(0,0,0, 0.2)` |
| Inner Light (Dark Mode) | `surface.opacity.color.light.superTransparent` | `rgba(255,255,255, 0.1)` |

This ensures that any change to `global.opacityScale` automatically propagates to elevation composites, keeping the shadow scale coherent with the system's global opacity.

---

## 2. Canonical Elevation Patterns (Levels)

To prevent developers from composing the 5 primitives from scratch mathematically, the system exposes **8 Semantic Elevation Levels (Composite Tokens)** through the *Foundation Layer*.

The hierarchical rule is mandatory: **Always use the lowest possible level to communicate hierarchy.**

| Base Level | Semantic Token / Foundation | Context and Canonical Use |
|:---:|---|---|
| **-1** | `depth.level_minus_one` | Elements **recessed** in the plane (inner shadow). Use in recessed Content Areas, empty text Input fields. |
| **0** | `depth.level_zero` | **Reset.** Object flush with the surface. Zero box-shadow. |
| **1** | `depth.level_one` | **Pressed/Interactive.** Generally applied when a floating button is "pressed" or on very subtle list-item hover. |
| **2** | `depth.level_two` | **Base surface components.** Default for Standard Cards, contained Modules. |
| **3** | `depth.level_three` | **Flow Anchoring.** Navigation menus (*Navbars*), Sticky headers fixed to the top on scroll. |
| **4** | `depth.level_four` | **Transient Access.** Combobox dropdowns, Auto-completes detaching from the base input, large Tooltips. |
| **5** | `depth.level_five` | **Active Sub-applications.** Dense Datepickers, complex contextual menus. |
| **6** | `depth.level_six` | **Modals / Maximum Elevation.** Dialogs that dim the rest of the screen (overlay background) and require full user focal separation. |

---

## 3. Multi-shadow Composition (Multi-layered Shadows)

To perfectly emulate how light spreads *ambient light* sideways while intensely occluding just below (contact shadow), higher elevation levels (generally Level 4 to Level 6) are rarely a single `box-shadow`.

The Theme Engine natively supports **Multi-shadow**:

```css
/* Level 6 - Compilation example */
box-shadow: 
  0px 4px 8px rgba(0, 0, 0, 0.08),   /* Contact Shadow (Hard, Short, Less Dense) */
  0px 16px 48px rgba(0, 0, 0, 0.20)  /* Ambient Shadow (Super Diffuse, High Expansion) */
```

---

## 4. The Dark Mode Paradox

Since digital optical depth uses dark/translucent dark gray subtraction of light, when we invert the theme to **Dark Mode**, shadows become virtually invisible against dense color backgrounds (levels `10`, `20`, or `30` of the surface palette).

### Canonical Adaptation Pattern: "Inner Light" instead of Outer Shadow

To indicate that an element is "floating" above the ground in dark mode without relying solely on its surface color *lightness*, the engine resorts to manipulating the `Luminosity` parameter, introducing *Light* into high elevations.

The concept mimics that **the top border of the element receives the main ambient light**. A contrasting faint glow (inner-shadow) is applied using the `surface.opacity.color.light.*` stub (see [05-opacity.md](./05-opacity.md)):

```css
/* Elevation in Dark Mode — uses the light stub from the opacity system */
box-shadow: 
  0px 1px 0px rgba(255, 255, 255, 0.08) inset; /* Top Light refraction simulating prominent 3D border */
```

This ensures structural separation and prevents static, hard-to-scan two-dimensional interfaces, without breaking the fundamental requirements of the original theme.

---

## 5. References

- [Opacity — Surface Stubs that feed Luminosity](./05-opacity.md)
- [Colors — Grayscale and achromatic shadow rules](./01-colors.md)
- [Mathematics and Algorithms — Section 7: Depth / Elevation](./06-mathematics-and-algorithms.md)
- Engine implementation: [sync-architecture.mjs](../../references/aplica-tokens-theme-engine/dynamic-themes/scripts/sync-architecture.mjs)
