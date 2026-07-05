# Navigation Principles

The navigation system of StandardsHub is designed to help users locate information with the fewest possible interactions.

Navigation should always communicate three things:

- Where am I?
- What else is available?
- Where can I go next?

Every navigation component has a single responsibility. Navigation should never be duplicated unnecessarily.

---

## Design Principles

### Documentation First

Navigation is designed for reading and learning rather than marketing.

---

### Predictability

The same navigation elements appear in the same locations throughout the website.

Users should never need to relearn navigation when moving between pages.

---

### Progressive Disclosure

Show only the information needed at each level.

Examples:

- Header → Global actions
- Sidebar → Standards
- Breadcrumb → Current location
- TOC → Current page sections

---

### Minimise Cognitive Load

Users should reach any accounting standard in as few interactions as possible.

Navigation should avoid unnecessary clicks, hidden pages or complex menu structures.

---

### Search Before Browsing

Users often know what they are looking for.

Search should therefore be treated as a primary navigation method rather than an additional feature.

---

### Mobile First

Navigation should be equally effective on desktop and mobile devices.

Features should never exist only on desktop.

---

### Consistency

All documentation pages share the same navigation structure.

Only the content changes.

---

## Success Criteria

A user should be able to:

- Understand where they are immediately.
- Locate any standard within a few seconds.
- Move between related standards naturally.
- Continue reading without losing context.

# Global Navigation

The global navigation is available on every page.

Its purpose is to provide access to global actions rather than documentation navigation.

Documentation navigation is handled by the sidebar.

---

## Header

The header is sticky.

It remains visible while scrolling.

---

## Header Items

### Logo

Returns the user to the homepage.

---

### Search

Primary method of finding standards.

Desktop

- Opens instant search results.
- Enter opens the Search Results page.

Mobile

- Opens the Search page directly.

---

### Theme

Light

Dark

System

The selected theme is remembered.

---

### User

Reserved for future versions.

Initially hidden until user accounts are introduced.

---

## Things intentionally excluded

The header does not contain:

- IAS
- IFRS
- Ind AS
- Documentation links
- Marketing links

Those belong elsewhere.

---

## Header Behaviour

Desktop

Header always visible.

Mobile

Compact sticky header.

The header height remains constant throughout the application.

---

## Success Criteria

The user should always have immediate access to:

- Home
- Search
- Theme

## Design Rationale

The TOC is designed to support continuous reading rather than simply providing a list of links.
Major learning topics are represented, while detailed instructional elements remain within the Reference Guide.
This reduces cognitive load and helps users maintain orientation during long study sessions.

# Design Rationale

The navigation architecture is designed around the user's learning journey rather than traditional website navigation.
Global navigation provides access to universal actions.
The Documentation Explorer provides access to standards.
The Table of Contents supports reading.
Context navigation encourages continued learning.
Each navigation component has one clearly defined responsibility.
This separation reduces cognitive load and creates a consistent experience across desktop and mobile devices.






