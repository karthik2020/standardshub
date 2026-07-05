1. Purpose
2. Desktop Layout
3. Tablet Layout
4. Mobile Layout
5. Sticky Elements
6. Scrolling Behaviour
7. Layout Principles
8. Accessibility
9. Progressive Enhancement
10. Design Rationale


# Purpose

The Application Shell provides a consistent structure for every page in StandardsHub.

It separates navigation from content and ensures users always know:

- where they are,
- what they are reading,
- how to navigate elsewhere.

The shell remains consistent across all documentation pages.
Only the content changes.

┌────────────────────────────────────────────────────────────────────────────┐
│ Sticky Header                                                              │
├────────────────────────────────────────────────────────────────────────────┤
│ Sticky Breadcrumb                                                          │
├───────────────┬────────────────────────────────────────┬───────────────────┤
│               │                                        │                   │
│ Documentation │                                        │                   │
│ Explorer      │                                        │       TOC         │
│               │      Information Header                │                   │
│               │────────────────────────────────────────│                   │
│               │                                        │                   │
│               │                                        │                   │
│               │      Reference Guide                   │                   │
│               │                                        │                   │
│               │                                        │                   │
│               │                                        │                   │
│               │                                        │                   │
│               │                                        │                   │
└───────────────┴────────────────────────────────────────┴───────────────────┘
History
Related Standards
Previous / Next
Footer

The Application Shell separates navigation from learning content.

Navigation remains visible to reduce cognitive load, while the Reference Guide receives maximum reading space.

Supporting sections such as History and Related Standards become page-level content after the Reference Guide, encouraging continued learning without interrupting the reading experience.



┌──────────────────────────────────────────────────────────────────────────────┐
│ Sticky Header                                                                │
│ Logo │ Search │ Theme │ User (future)                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ Sticky Breadcrumb                                                            │
│ ☰  Home / IAS / IAS 16                                                       │
├──────────────┬───────────────────────────────────────────────┬───────────────┤
│              │                                               │               │
│ Documentation│                                               │ Table of      │
│ Explorer     │ Information Header                            │ Contents      │
│              │                                               │               │
│              ├───────────────────────────────────────────────┤               │
│              │                                               │               │
│              │                                               │               │
│              │          Reference Guide                      │               │
│              │                                               │               │
│              │                                               │               │
│              │                                               │               │
│              │                                               │               │
│              │                                               │               │
│              │                                               │               │
└──────────────┴───────────────────────────────────────────────┴───────────────┘
History
Related Standards
Previous / Next
Footer

## Desktop Behaviour

| Component              | Behaviour          |
| ---------------------- | ------------------ |
| Header                 | Sticky             |
| Breadcrumb             | Sticky             |
| Documentation Explorer | Sticky             |
| TOC                    | Sticky             |
| Information Header     | Scrolls away       |
| Reference Guide        | Normal page scroll |
| History                | Normal page scroll |
| Related Standards      | Normal page scroll |
| Footer                 | Normal page scroll |


## Mobile Behaviour

┌──────────────────────────────┐
│ Header                       │
├──────────────────────────────┤
│ Breadcrumb                   │
├──────────────────────────────┤
│ Information Header           │
├──────────────────────────────┤
│                              │
│ Reference Guide              │
│                              │
├──────────────────────────────┤
│ Previous / Next              │
├──────────────────────────────┤
│ History                      │
├──────────────────────────────┤
│ Related Standards            │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘

























