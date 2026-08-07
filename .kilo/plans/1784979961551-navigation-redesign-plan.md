# StandardsHub UI Redesign — Navigation Architecture Plan

## 1. Existing Navigation Architecture

### Current Desktop Layout (≥ 1400px)

```
+------------------+-----------------------------+----------------+
|  FrameworkRail   |      Reading Column         |     TOC        |
|  (72px icon rail)|   (minmax(0, 1fr))        |   (290px)      |
| + StandardsPanel |                            |                |
| (270px sidebar)  |  PageToc slot              |  Sticky,       |
|                  |  PreviousNextNavigation     |  active-tracking|
|                  |  Footer                     |                |
+------------------+-----------------------------+----------------+
|                       Header (84px, sticky)                    |
+----------------------------------------------------------------+
```

**Layout files:**
- `StandardLayout.astro` — Root app shell composing: `<Header>`, `.standards-sidebar` (FrameworkRail + StandardsPanel), `.sidebar-overlay`, `<main class="content">` with PageToc slot + Footer
- `StandardPageLayout.astro` — Wraps StandardLayout, passes TOC content, injects InformationHeader, BannerNotice, ReferenceGuide, RelatedStandards, PreviousNextNavigation

**Navigation components:**
- `Header.astro` — Logo, breadcrumbs, standard identity, mobile menu button, print button
- `FrameworkRail.astro` — 72px icon rail: Home + 4 frameworks + Settings/Theme/Recent/Avatar
- `StandardsPanel.astro` — Search + collapsible `<details>` sections per framework + empty state
- `PageToc.astro` — Sticky right-side TOC with viewport-based active tracking
- `PreviousNextNavigation.astro` — Prev/Next standard cards at content bottom
- `NavLink.astro` — Active-aware sidebar link with framework badge

**JavaScript:**
- `sidebar.js` — Section expand/collapse, filter/search, scroll restoration, mobile menu toggle, history sync
- `rail-panel.js` — Framework switching (client-side), cross-framework search, dark/light sidebar theme toggle
- `toc.js` — Viewport-based active detection, smooth scrolling, click-target locking
- `search.js` — Rotating placeholder text, clear button, focus/blur states

**Current mobile (max-width: 900px):**
- Sidebar becomes `position: fixed`, full-width, slides in from left via `.open`
- TOC hidden at max-width: 1400px
- No reading progress bar, no back-to-top, no floating drawer

---

## 2. Proposed Navigation Architecture

### Core Principle: Same Components, Adapted Presentation

The mobile experience uses the **same** `FrameworkRail`, `StandardsPanel`, `PageToc`, and `Header` components. No parallel component trees. The adaptation happens through:
1. CSS positioning (the sidebar becomes a floating drawer, the TOC becomes a floating panel)
2. Header layout changes (responsive flex/grid rearrangement)
3. Two small new additions: ReadingProgressBar + BackToTopButton

### Desktop (Unchanged)
Same 3-column layout. Two additions:
- Reading progress bar (2px, below header)
- Back-to-top floating button (bottom-right)

### Mobile (< 900px) — Same Application, Smaller Screen

```
+--------------------------------------------------+
| ▐▐  IAS 1  |  Title   | 🔍 | 🌙 | 👤            |  ← Header (expanded, 64px)
+--------------------------------------------------+
| ████████████████████████████                      |  ← Reading progress bar (2px)
|                                                    |
|  +--[floating drawer, 320px wide, rounded]--+      |
|  | FrameworkRail (horizontal tabs)          |      |
|  | [Home][IAS][IFRS][IndAS][USGAAP]         |      |
|  |------------------------------------------|      |
|  | StandardsPanel (search + list)           |      |
|  | > IAS 1                                  |      |
|  |   IAS 2                                  |      |
|  |   ...                                    |      |
|  +------------------------------------------+      |
|                                                    |
|  +-[floating TOC panel, right]-+  +---+              |
|  | PageToc (same component)   |  |Top|              |
|  | • S1                       |  +---+              |
|  | • S2                       |                      |
|  | • S3                       |                      |
|  +----------------------------+                      |
|                                                    |
|             Content area (full width)              |
|                                                    |
+--------------------------------------------------+
```

**Mobile header:**
- **Expanded (scroll 0–100px):** Hamburger + [Standard #] + [Title] + Search + Theme + Account. No breadcrumbs.
- **Collapsed (scroll > 100px):** Hamburger + [Standard #] + Search + Theme + Account. Title hidden.
- CSS-driven using `data-header-state="expanded|collapsed"` attribute
- Height transitions: 64px expanded → 56px collapsed

**Floating sidebar drawer (mobile):**
- `.standards-sidebar` remains the same DOM structure (FrameworkRail + StandardsPanel)
- CSS: `position: fixed; top: 16px; left: 16px; width: min(320px, calc(100vw - 32px)); max-height: calc(100vh - 88px); border-radius: 16px; z-index: calc(var(--z-modal) - 1); box-shadow: var(--shadow-lg); transform: translateX(-120%); transition: transform var(--duration-normal) var(--ease);`
- Open: `.standards-sidebar.open { transform: translateX(0); }`
- Independent scrolling, backdrop overlay
- FrameworkRail: adapt from vertical rail to horizontal tab strip on mobile
- StandardsPanel: search visible immediately, list below
- Footer: compact, "Recent" link

**Floating TOC panel (mobile):**
- `.page-toc` remains the same DOM structure (`<nav class="toc">`)
- Wrapped in a fixed-position card when opened:
  - `position: fixed; top: 16px; right: 16px; width: min(260px, calc(100vw - 32px)); max-height: calc(100vh - 88px); border-radius: 16px; z-index: var(--z-modal); box-shadow: var(--shadow-lg);`
- Toggle button fixed at right edge of content area
- Back-to-top button at bottom of floating panel

**Reading progress bar:**
- New `<ReadingProgressBar />` component
- Placed immediately after `<header>` in `StandardLayout.astro`
- 2px height, `background: var(--framework-accent)`, width driven by JS
- Desktop: always visible under sticky header
- Mobile: always visible under sticky header

**Back-to-top:**
- New `<BackToTopButton />` component
- Desktop: fixed-position, bottom-right, outside reading column
- Mobile: inside `.page-toc` (both desktop sticky and mobile floating)
- Single component, CSS decides positioning

---

## 3. Components Affected

| Component | Change | Details |
|-----------|--------|---------|
| `StandardLayout.astro` | **MODIFIED** | Insert `<ReadingProgressBar />` after header. Add `data-mobile-drawer-open` attribute on `<html>` for drawer state. Keep existing `toc` slot. |
| `Header.astro` | **MODIFIED** | Add `headerState` prop (default: `"expanded"`). Add `data-header-state` attribute. Remove breadcrumbs on mobile via CSS + conditional render. Add `header-actions` container for search/theme/account. Collapse title when `headerState="collapsed"`. |
| `FrameworkRail.astro` | **MODIFIED** | Desktop: vertical rail unchanged. Mobile: horizontal tab strip (change flex direction + item layout via CSS). Keep same icons and labels. |
| `StandardsPanel.astro` | **UNCHANGED** | Same markup and JS. Works inside floating drawer because `.standards-sidebar` gets `overflow-y: auto` and fixed dimensions. |
| `PageToc.astro` | **MODIFIED** | Add optional `<BackToTopButton />` slot/child. Same `<nav class="toc">` structure. Floating wrapper handled by CSS + JS on mobile. |
| `PreviousNextNavigation.astro` | **UNCHANGED** | |

**New components (2):**

| Component | Purpose |
|-----------|---------|
| `ReadingProgressBar.astro` | Thin 2px bar below header, width = scroll percentage |
| `BackToTopButton.astro` | Scroll-to-top button with icon; desktop = fixed, mobile = inside TOC panel |

---

## 4. Components Unchanged

| Component | Reason |
|-----------|--------|
| `StandardPageLayout.astro` | Wraps StandardLayout; new elements are inserted in StandardLayout |
| `InformationHeader.astro` | Content header, not navigation chrome |
| `PreviousNextNavigation.astro` | Bottom nav cards |
| `RelatedStandards.astro` | Cross-links |
| `ReferenceGuide.astro` | Content wrapper |
| `BannerNotice.astro` | UI notice |
| `Glossary.astro` | Content component |
| `FinancialStatementKey.astro` | Content component |
| `HistoryTimeline.astro` | Content component |
| `NavLink.astro` | Inner nav link, reused as-is |
| `StandardGroup.astro` | Standards list grouping |
| `StandardStatus.astro` | Status display |
| `StandardCard.astro` | Card display |
| `Sidebar.astro` | Legacy/alternate sidebar (not currently used in StandardLayout) |
| `Footer.astro` | Site footer |
| `Seo.astro` | SEO meta tags |

---

## 5. JavaScript Changes

**`public/js/header.js` (NEW)**
- Progress bar width: `progressBar.style.width = ((scrollTop / (docHeight - winHeight)) * 100) + "%"`
- Header collapsed state: toggle `data-header-state` on `<header>` when scroll > 100px
- Initialize on DOMContentLoaded

**`public/js/sidebar.js` — MODIFIED**
- Mobile menu toggle now opens/closes `.standards-sidebar` as floating drawer (same element, different CSS on mobile)
- Add escape key dismissal
- Add `data-drawer-open` attribute on `<html>` for CSS + accessibility
- Keep section expand/collapse, filter, scroll restoration, history sync unchanged

**`public/js/rail-panel.js` — MODIFIED**
- No structural changes needed. FrameworkRail is the same component.
- On mobile, FrameworkRail tabs need horizontal layout. CSS handles this.
- Ensure `setActive` still works when FrameworkRail is inside a floating container.

**`public/js/toc.js` — MODIFIED**
- Add open/close logic for floating TOC panel on mobile
- Register BackToTop click handler (delegated, since button is now inside PageToc)
- Keep existing viewport tracking and click scrolling unchanged

**`public/js/search.js` — UNCHANGED**
- Rotating placeholder works regardless of container

---

## 6. CSS Changes

**`site.css` — New rules / overrides:**

### Desktop additions
```css
.reading-progress-bar {
  position: sticky;
  top: var(--header-height);
  height: 2px;
  background: var(--framework-accent);
  width: 100%;
  z-index: calc(var(--z-header) + 1);
  pointer-events: none;
}

.back-to-top {
  position: fixed;
  bottom: var(--space-lg);
  right: var(--space-lg);
  z-index: var(--z-modal);
  /* button styles */
}
```

### Mobile restructure (max-width: 900px)

```css
/* Header: responsive layout + collapsed state */
.site-header[data-header-state="collapsed"] .header-title {
  display: none;
}
.site-header[data-header-state="collapsed"] {
  height: 56px;
}

/* Sidebar becomes floating drawer */
.standards-sidebar {
  position: fixed;
  top: 16px;
  left: 16px;
  width: min(320px, calc(100vw - 32px));
  max-height: calc(100vh - 88px);
  border-radius: 16px;
  z-index: calc(var(--z-modal) - 1);
  box-shadow: var(--shadow-lg);
  transform: translateX(-120%);
  transition: transform var(--duration-normal) var(--ease);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.standards-sidebar.open {
  transform: translateX(0);
}
.standards-sidebar .framework-rail {
  width: 100%;
  height: auto;
  flex-direction: row;
  border-right: none;
  border-bottom: 1px solid var(--border);
  padding: 8px 12px;
  gap: 4px;
}
.standards-sidebar .rail-item {
  flex-direction: row;
  width: auto;
  padding: 6px 12px;
  font-size: 12px;
  gap: 4px;
}
.standards-sidebar .standards-panel {
  flex: 1;
  overflow-y: auto;
}
.sidebar-overlay.visible {
  display: block;
}

/* TOC becomes floating panel */
.page-toc {
  position: fixed;
  top: 16px;
  right: 16px;
  width: min(260px, calc(100vw - 32px));
  max-height: calc(100vh - 88px);
  border-radius: 16px;
  z-index: var(--z-modal);
  box-shadow: var(--shadow-lg);
  transform: translateX(120%);
  transition: transform var(--duration-normal) var(--ease);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-toc.open {
  transform: translateX(0);
}
.page-toc .toc {
  flex: 1;
  overflow-y: auto;
}

/* TOC toggle button */
.toc-toggle {
  position: fixed;
  bottom: var(--space-lg);
  right: var(--space-lg);
  z-index: var(--z-modal);
  /* button styles */
}

/* Hide desktop-only sidebar overlay on mobile when not used */
@media (max-width: 900px) {
  .sidebar-overlay {
    display: none;
  }
  .sidebar-overlay.visible {
    display: block;
  }
}
```

---

## 7. Implementation Order

### Phase 1: Infrastructure
**Goal:** Establish progress bar and back-to-top with no behavioral changes.

1. **Create `ReadingProgressBar.astro`** — Empty shell component, rendered in `StandardLayout.astro` between header and app-body. CSS: `position: relative; height: 2px; width: 0%; background: var(--framework-accent);`.

2. **Create `BackToTopButton.astro`** — Empty shell component, rendered inside `PageToc.astro` (at bottom of `.toc` list). CSS: `display: none` initially.

3. **Update `StandardLayout.astro`** — Insert `<ReadingProgressBar />` in markup. No behavior yet.

### Phase 2: Progress Bar Behavior
**Goal:** Wire up scroll tracking.

4. **Create `public/js/header.js`** — Reads `scrollTop / (docHeight - winHeight)`, sets progress bar width. Adds `data-header-state` toggling at 100px scroll threshold. Initialize on DOMContentLoaded.

5. **Update `Header.astro`** — Add `headerState` prop, `data-header-state` attribute, `header-actions` container, conditional title rendering.

### Phase 3: Mobile Sidebar as Floating Drawer
**Goal:** Same `.standards-sidebar` DOM, different CSS on mobile.

6. **Update `site.css`** — Add mobile floating drawer styles at max-width: 900px. Add `.standards-sidebar.open` transform. Add overlay styles.

7. **Update `sidebar.js`** — Replace `.sidebar` class toggle with `.standards-sidebar` toggle + backdrop. Add escape key. Keep all existing expand/collapse + filter logic.

8. **Update `FrameworkRail.astro`** — Add mobile horizontal tab layout via CSS (same component, new breakpoint styles).

### Phase 4: Mobile TOC as Floating Panel
**Goal:** Same `.page-toc` DOM, different CSS on mobile.

9. **Update `PageToc.astro`** — Add `<slot name="footer">` at bottom of `.toc` for BackToTopButton.

10. **Update `BackToTopButton.astro`** — Add click handler (scroll to top), hide on desktop via CSS.

11. **Update `toc.js`** — Add floating panel toggle. Add BackToTop click handler. Keep existing active tracking.

12. **Update `site.css`** — Add floating `.page-toc` styles, `.toc-toggle` button, mobile open/close.

### Phase 5: Accessibility + Polish
**Goal:** ARIA, focus management, animations.

13. **Accessibility audit:**
    - Drawer: `aria-expanded` on toggle, `role="dialog"`, `aria-modal="true"`, focus trap
    - TOC panel: `aria-expanded` on toggle, `role="dialog"`
    - Header collapsed: ensure standard code remains readable

14. **Animation:**
    - Respect `prefers-reduced-motion: reduce` on drawer/TOC transitions
    - Header height transition smooth

---

## 8. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **CSS cascade on `.standards-sidebar`** | Medium — changing `.standards-sidebar` to fixed/floating on mobile must not break desktop | Use max-width media query; desktop uses `display: flex; width: var(--sidebar-width); position: static;` |
| **FrameworkRail horizontal layout** | Low — 72px rail becomes horizontal tabs; icons + labels need to fit | `flex-wrap: nowrap; overflow-x: auto;` with hidden scrollbar |
| **StandardsPanel scroll in drawer** | Medium — `.standards-panel` needs `overflow-y: auto` with bounded height | Set `max-height: calc(100vh - 88px - 16px - [framework-rail-height])` on mobile |
| **TOC floating panel overlap** | Medium — floating TOC + floating drawer can overlap on small screens | Z-index: drawer = 99, TOC = 100. Drawer is left, TOC is right. On narrow screens, only one should be open at a time. |
| **sessionStorage scroll restore** | Low — scroll restoration in sidebar.js targets `.sidebar-scroll` which now has bounded height | Selector still works; the element exists in both contexts. |
| **History sync** | Medium — `.syncSidebarFromUrl` assumes desktop sidebar DOM | Function operates on `.section` and `.nav-link` selectors which still exist inside the drawer. No change needed. |
| **Header height CSS variable** | Medium — `--header-height` = 84px; mobile needs 64px/56px | Add `--header-height-mobile-expanded: 64px`, `--header-height-mobile-collapsed: 56px`, update existing references via media query. |
| **iOS safe area** | Low — floating drawer near bottom may conflict with home indicator | Add `padding-bottom: env(safe-area-inset-bottom)` to drawer and TOC panel |

---

## 9. Decisions Required

1. **Header mobile actions order:** Spec says Search + Theme + Account. Currently FrameworkRail has Settings + Theme + Recent + Avatar. Should the mobile header use the same order (Settings/Theme/Account) or the spec order (Search/Theme/Account)? **Recommendation: Spec order (Search/Theme/Account). Settings can hide on mobile or go inside drawer footer.**

2. **Account button behavior:** Currently FrameworkRail has `.rail-avatar` with initials "KV". Is this a real account feature or decorative? **Recommendation: Ask if account is functional before designing account dropdown/permissions.**

3. **Floating drawer default state on mobile:** Should it open by default on first visit, or closed? **Recommendation: Closed by default. Preserve desktop behavior where sidebar is always visible.**

4. **TOC floating panel toggle position:** Bottom-right (below content) or top-right? **Recommendation: Bottom-right, near reading position, matching back-to-top placement.**

---

## 10. Pre-Implementation Checklist

- [ ] Confirm `--header-height` refactor approach (separate mobile variables vs single responsive variable)
- [ ] Confirm mobile header action buttons (search, theme, account placement)
- [ ] Confirm `.standards-sidebar` and `.page-toc` class names will NOT be renamed (to preserve history sync)
- [ ] Check `extended.css` for any sidebar/header overrides that affect mobile prototype pages
- [ ] Verify `rail-panel.js` selectors work when FrameworkRail is inside `position: fixed` container (scroll context changes)
- [ ] Ensure print button is hidden on mobile via CSS (`display: none` at max-width: 900px)
