---
name: Indigo Slate AI
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 64px
  container-max: 1200px
  chat-width: 800px
---

## Brand & Style
The design system is engineered for a sophisticated AI SaaS environment, prioritizing focus, intelligence, and fluid conversation. The brand personality is authoritative yet approachable, utilizing a **Minimalist-Glassmorphic** hybrid style. This approach balances the structural reliability of enterprise software with the ethereal, "light-speed" nature of modern artificial intelligence.

The emotional response should be one of "calm productivity." By using deep, expansive backgrounds contrasted with vibrant indigo accents, the UI recedes to let the user's dialogue and the AI's data take center stage. High-quality whitespace and precision-engineered typography ensure that complex technical information remains digestible and elegant.

## Colors
The palette is anchored in a dark-mode-first philosophy to reduce eye strain during prolonged sessions. 

- **Primary (Indigo):** Used exclusively for high-intent actions, active states, and AI identity markers.
- **Background (Deep Slate/Charcoal):** Provides a rich, low-contrast foundation.
- **Success (Emerald):** Reserved for metrics, positive AI confirmations, and system health status.
- **Surface (Glass):** Utilizes a semi-transparent slate with a background blur (12px to 20px) to create a sense of depth without adding visual weight.

## Typography
This design system utilizes **Inter** for all UI and conversational elements due to its exceptional legibility in digital interfaces. **JetBrains Mono** is introduced as a supporting typeface for code snippets and technical output within the chat.

Hierarchy is established through weight rather than excessive size shifts. Large headlines use a tighter letter-spacing for a modern, editorial feel, while labels utilize increased tracking to ensure readability at small scales on dark backgrounds.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict max-width constraints for readability. The primary chat interface is centered within a 800px column to prevent line lengths from becoming unreadable.

- **Desktop:** A 12-column grid with 24px gutters. Sidebars (Navigation and History) are fixed-width (280px) and glassmorphic.
- **Mobile:** Single column layout. Margins are reduced to 16px. Chat bubbles utilize the full width minus 48px to allow for sender distinction.
- **Rhythm:** All spacing (padding, margins) must be a multiple of 4px.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Glassmorphism** rather than traditional heavy shadows.

- **Level 0 (Background):** Deep Slate (#0F172A).
- **Level 1 (Panels):** Glassmorphic surfaces with a 1px white border at 8% opacity. These panels use a `backdrop-filter: blur(16px)`.
- **Level 2 (Chat Bubbles/Floating Actions):** Subtle ambient shadows (0px 4px 20px rgba(0, 0, 0, 0.4)) are used to separate active elements from the glass panels.
- **Interactions:** Hover states on cards should involve a subtle increase in border opacity and a light "glow" effect using the primary indigo color at 5% opacity.

## Shapes
The shape language is consistently **Rounded**. This softens the technical nature of the AI, making the interaction feel more organic.

- **Standard Elements:** 8px (0.5rem) radius for buttons and input fields.
- **Cards & Panels:** 16px (1rem) radius for chat containers and glassmorphic panels.
- **Chat Bubbles:** 12px (0.75rem) radius, with a slightly sharper 4px radius on the corner pointing toward the sender's avatar.

## Components
- **Chat Bubbles:** AI responses use the glassmorphic style (subtle blur, low-opacity white border). User messages use the Indigo primary color with high-contrast white text.
- **Input Fields:** The main prompt input is a large, pill-shaped or highly rounded bar. It features a ghost-border that illuminates with an Indigo outer glow when focused.
- **Buttons:** 
  - **Primary:** Solid Indigo with white text. 
  - **Secondary:** Ghost style with Indigo text and 1px border.
- **Cards:** Used for model selection or featured templates. They feature a vertical gradient from `rgba(255,255,255,0.05)` at the top to transparent at the bottom.
- **Chips/Badges:** Small, high-contrast labels for "New" features or "Model Type," using the Indigo or Emerald palette with a 0.1 opacity background of the same color.
- **Lists:** Clean, borderless list items with a subtle Indigo highlight on hover.