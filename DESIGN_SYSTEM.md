# 🎨 Library Management System - Design System

## Color Palette

### Primary Colors (Pastel)
```
Rose-400:     #fb7185  - Primary action color
Pink-400:     #f472b6  - Secondary action
Rose-300:     #fda4af  - Hover states
Pink-500:     #ec4899  - Active states
```

### Secondary Colors (Nature/Night Theme)
```
Purple-900:   #3f0f63  - Dark backgrounds
Purple-600:   #9333ea  - Accent elements
Purple-300:   #d8b4fe  - Light text/borders
Purple-200:   #e9d5ff  - Very light text
```

### Neutral Colors (Slate - Sky theme)
```
Slate-900:    #0f172a  - Main background (night sky)
Slate-800:    #1e293b  - Card backgrounds
Slate-700:    #334155  - Input backgrounds
Slate-600:    #475569  - Borders
Slate-400:    #cbd5e1  - Light borders
```

### Status Colors
```
Emerald-400:  #10b981  - Available/Success
Emerald-300:  #6ee7b7  - Light success
Red-400:      #f87171  - Unavailable/Error
Amber-400:    #fbbf24  - Overdue/Warning
Blue-400:     #60a5fa  - Borrowed/Info
```

## Typography System

### Font Stack
```
Headings:     Playfair Display (serif, elegant)
Body:         Poppins (sans-serif, modern)
Code/Monospace: Space Mono (monospace)
```

### Component Specifications

### Buttons

#### Primary Button
```css
Background: linear-gradient(to right, #fb7185, #f472b6)
Color: white
Padding: 12px 24px
Border-radius: 8px
Font-weight: 600
Box-shadow: 0 10px 25px rgba(251, 113, 133, 0.3)
```

#### Secondary Button
```css
Background: rgba(71, 85, 105, 0.5)
Color: white
Border: 1px solid rgba(168, 123, 253, 0.3)
Padding: 12px 24px
Border-radius: 8px
```

### Cards
```css
Background: rgba(30, 41, 59, 0.4)
Backdrop-filter: blur(16px)
Border: 1px solid rgba(168, 123, 253, 0.2)
Border-radius: 12px
Padding: 24px
Box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
```

### Input Fields
```css
Background: rgba(71, 85, 105, 0.5)
Border: 1px solid rgba(168, 123, 253, 0.3)
Color: white
Padding: 12px 16px
Border-radius: 8px
Focus-border: #fb7185
```

## Animation Specifications

### Night Sky Animations

#### Flickering Stars
- Count: 150 stars
- Opacity range: ±40% variation
- Flicker speed: 0.01-0.03 per frame
- Glow blur: 5px shadow

#### Shooting Stars
- Spawn rate: ~0.2% per frame
- Speed: 2-6px horizontal, 1-3px vertical
- Trail length: 30 frames
- Trail colors: Warm orange/yellow with fade

#### Moon
- Size: 80px radius
- Color: #fef3c7 (cream)
- Glow radius: 120px
- Bloom intensity: Pulsing animation

## Spacing System

```
4px:   1
8px:   2
12px:  3
16px:  4
24px:  6
32px:  8
48px:  12
64px:  16
```

## Breakpoints

```
Small:    640px   - Mobile phones
Medium:   768px   - Tablets
Large:    1024px  - Desktops
XL:       1280px  - Large desktops
2XL:      1536px  - Extra large
```

---

**Perfect for a professional, beautiful library management system**
