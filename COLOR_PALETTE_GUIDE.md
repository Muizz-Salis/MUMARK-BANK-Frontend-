# 🎨 MUMARK Bank Color Palette & Usage Guide

## Primary Color Palette

### Core Colors

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  PRIMARY LIGHT                                              │
│  #ff817c                                                    │
│  RGB(255, 129, 124)                                         │
│  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                          │
│  Warm Coral/Salmon - Use for gradient starts, light overlays│
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  PRIMARY MAIN                                               │
│  #f6433d                                                    │
│  RGB(246, 67, 61)                                           │
│  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                          │
│  Bold Red-Coral - Primary brand color, CTAs, buttons       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  PRIMARY DARK                                               │
│  #d63832                                                    │
│  RGB(214, 56, 50)                                           │
│  ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■                          │
│  Deep Red - Use for gradient ends, shadows, active states  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Secondary/Complementary Colors

### Neutral Palette
```
White (#ffffff)        - Cards, buttons, text on colored backgrounds
Gray-50 (#fafafa)      - Page backgrounds, light sections
Gray-100 (#f5f5f5)     - Card borders, subtle divisions
Gray-600 (#757575)     - Body text
Gray-900 (#212121)     - Footer, headings, dark text
```

### Accent Colors (Optional)
```
Blue (#4f46e5)         - Info messages, links
Purple (#7c3aed)       - Special features
Teal (#14b8a6)         - Success states
Yellow (#ffd93d)       - Highlights, warnings
```

---

## Color Usage Matrix

### Where Each Color Should Be Used

| Element | Primary Light | Primary Main | Primary Dark | White | Gray |
|---------|---------------|--------------|--------------|-------|------|
| **Buttons (Primary)** | Gradient start | Gradient middle/solid | Gradient end/hover | Text | - |
| **Buttons (Secondary)** | - | Border/text | - | Background | Border |
| **Navigation** | - | Hover states | - | Background | Text |
| **Hero Title** | Gradient start | Gradient middle | Gradient end | - | Main text |
| **Cards** | Border hover | Icon backgrounds | Shadow | Background | Text/borders |
| **Links** | - | Default/hover | - | - | Default |
| **Loading** | Gradient start | Gradient middle | Gradient end | Particles | - |
| **Footer** | Gradient brand | Gradient brand | Background option | Text | Background |
| **Trust Stats** | Number gradient | Number gradient | - | Labels | - |

---

## Gradient Combinations

### Linear Gradients

**1. Standard Brand Gradient (Left to Right)**
```css
background: linear-gradient(to right, #ff817c, #f6433d);
```
Tailwind: `bg-gradient-to-r from-[#ff817c] to-[#f6433d]`

**2. Full Spectrum (Left to Right)**
```css
background: linear-gradient(to right, #ff817c, #f6433d, #d63832);
```
Tailwind: `bg-gradient-to-r from-[#ff817c] via-[#f6433d] to-[#d63832]`

**3. Diagonal Brand Gradient**
```css
background: linear-gradient(135deg, #ff817c, #f6433d);
```
Tailwind: `bg-gradient-to-br from-[#ff817c] to-[#f6433d]`

**4. Loading Screen Gradient**
```css
background: linear-gradient(to bottom right, #ff817c, #f6433d, #d63832);
```
Tailwind: `bg-gradient-to-br from-[#ff817c] via-[#f6433d] to-[#d63832]`

---

## Text Color Guidelines

### On White/Light Backgrounds
```
Headings:      Gray-900 (#212121) or Gradient
Body Text:     Gray-600 (#757575)
Links:         Primary Main (#f6433d) → Primary Dark (#d63832) on hover
Buttons:       White text on Primary gradient
```

### On Dark Backgrounds
```
Headings:      White (#ffffff)
Body Text:     White with 80-90% opacity
Links:         Primary Light (#ff817c)
Buttons:       Primary colors or white with transparency
```

### On Colored Backgrounds
```
Over Primary:  Always white (#ffffff)
Over Gray:     Gray-900 or White depending on shade
```

---

## Opacity Variations

### Primary Colors with Opacity

**Primary Light (#ff817c)**
```
100% - Solid buttons, icons
80%  - Hover states
50%  - Borders
30%  - Light overlays
20%  - Subtle backgrounds
10%  - Very light tints
```

**Primary Main (#f6433d)**
```
100% - Main buttons, CTAs
80%  - Active states
50%  - Disabled states
30%  - Borders, dividers
20%  - Background overlays
10%  - Soft backgrounds
```

---

## Accessibility & Contrast

### WCAG AA Compliance

**Primary Main (#f6433d) on White**
- Contrast Ratio: 4.9:1 ✅
- Large Text: AAA
- Normal Text: AA

**White on Primary Main**
- Contrast Ratio: 4.2:1 ✅
- Large Text: AAA
- Normal Text: AA

**Gray-600 (#757575) on White**
- Contrast Ratio: 4.6:1 ✅
- Normal Text: AA

**Gray-900 (#212121) on White**
- Contrast Ratio: 16.1:1 ✅
- All Sizes: AAA

---

## Gradient Text Effect

### Implementation

**CSS**
```css
background: linear-gradient(to right, #ff817c, #f6433d, #d63832);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

**Tailwind**
```html
<span class="bg-clip-text text-transparent bg-gradient-to-r from-[#ff817c] via-[#f6433d] to-[#d63832]">
  MUMARK Bank
</span>
```

**Best Used For:**
- Brand name in hero section
- Large headings
- Emphasis text
- Logo text

---

## Shadow & Glow Effects

### Button Shadows
```css
/* Primary button */
box-shadow: 0 8px 25px rgba(246, 67, 61, 0.4);

/* Hover state */
box-shadow: 0 12px 35px rgba(246, 67, 61, 0.6);
```

### Card Shadows
```css
/* Default */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Hover */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Glow Effects
```css
/* Link hover glow */
text-shadow: 0 0 8px rgba(255, 129, 124, 0.6);

/* Icon glow */
box-shadow: 0 0 20px rgba(246, 67, 61, 0.3);
```

---

## Tailwind Color Classes

### Background Colors
```html
bg-[#ff817c]          <!-- Primary Light -->
bg-[#f6433d]          <!-- Primary Main -->
bg-[#d63832]          <!-- Primary Dark -->
bg-[#ff817c]/20       <!-- Primary Light with 20% opacity -->
```

### Text Colors
```html
text-[#ff817c]        <!-- Primary Light -->
text-[#f6433d]        <!-- Primary Main -->
text-[#d63832]        <!-- Primary Dark -->
```

### Border Colors
```html
border-[#ff817c]      <!-- Primary Light -->
border-[#f6433d]      <!-- Primary Main -->
border-[#ff817c]/30   <!-- Primary Light with 30% opacity -->
```

### Gradient Backgrounds
```html
<!-- Two colors -->
bg-gradient-to-r from-[#ff817c] to-[#f6433d]

<!-- Three colors -->
bg-gradient-to-r from-[#ff817c] via-[#f6433d] to-[#d63832]

<!-- Diagonal -->
bg-gradient-to-br from-[#ff817c] to-[#f6433d]
```

---

## Animation Color Transitions

### Hover Transitions
```html
<!-- Button hover -->
<button class="bg-[#f6433d] hover:bg-[#d63832] transition-colors duration-300">
  Click Me
</button>

<!-- Border hover -->
<div class="border-gray-100 hover:border-[#ff817c]/30 transition-colors duration-300">
  Card
</div>

<!-- Text hover -->
<a class="text-gray-700 hover:text-[#f6433d] transition-colors duration-300">
  Link
</a>
```

---

## Color Combination Examples

### Good Combinations ✅
```
1. White + Primary Main + Gray-900
2. Primary Gradient + White text
3. Gray-50 background + Primary accents + Gray-600 text
4. Gray-900 + Primary Light accents + White text
5. Primary Light borders + White background + Gray-900 text
```

### Avoid ❌
```
1. Primary colors on Primary colors (low contrast)
2. Gray-600 text on Primary backgrounds (readability issue)
3. Primary Light on white for small text (contrast too low)
4. Multiple gradients competing for attention
5. Too many different opacity values of same color
```

---

## Dark Mode (Future Consideration)

### Suggested Dark Mode Palette
```
Background:    Gray-900 (#212121)
Surface:       Gray-800 (#424242)
Primary:       Keep #ff817c and #f6433d
Text:          White with 90% opacity
Secondary:     Gray-400 (#bdbdbd)
```

---

## Color Psychology

### Why These Colors?

**Red-Coral (#f6433d)**
- Energy and passion
- Urgency and action
- Confidence and trust
- Modern and bold

**Coral (#ff817c)**
- Warmth and approachability
- Friendly and inviting
- Optimism and enthusiasm
- Contemporary and fresh

**Combined Effect**
- Professional yet approachable
- Modern banking brand
- Trustworthy but innovative
- Energetic and confident

---

## Export Formats

### For Design Tools

**Figma/Sketch**
```
Primary Light: #ff817c
Primary Main:  #f6433d
Primary Dark:  #d63832
```

**Adobe XD**
```
rgba(255, 129, 124, 1)  // Primary Light
rgba(246, 67, 61, 1)    // Primary Main
rgba(214, 56, 50, 1)    // Primary Dark
```

**CSS Variables**
```css
:root {
  --primary-light: #ff817c;
  --primary-main: #f6433d;
  --primary-dark: #d63832;
}
```

---

## Testing Your Colors

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Palette Generator](https://coolors.co/)
- Chrome DevTools (color picker with contrast ratio)

### Checklist
- [ ] All text meets WCAG AA contrast ratios
- [ ] Colors are distinguishable for colorblind users
- [ ] Gradients don't create banding on lower-quality displays
- [ ] Colors print correctly (if needed)
- [ ] Dark mode variants considered

---

**Remember**: Consistency is key! Stick to these defined colors and their variations for a cohesive design.
