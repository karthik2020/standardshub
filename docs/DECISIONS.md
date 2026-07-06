Decision: Remember user navigation state.

Status: Accepted.

Reason:

Restores the user's reading context.
Reduces friction for repeat visitors.
Requires no user interaction.
Benefits both desktop and mobile.

Implementation (later):

Store the last visited standard.
Remember expanded/collapsed sidebar sections.
Restore sidebar scroll position.
Highlight the active standard.

The TOC reflects what the reader is currently seeing, not just a single scroll position.

DEC-001
Documentation-first architecture

DEC-002
Poster renamed to Reference Guide

DEC-003
Website TOC replaces poster TOC

DEC-004
Sidebar uses native HTML <details>

DEC-005
Progressive Enhancement

DEC-006
Remember navigation state

## DEC-007

### Title
StandardLayout serves as the Application Shell.

### Status
Accepted

### Reason
During implementation, it became clear that StandardLayout already provided the responsibilities originally planned for AppShell. Introducing another layout added unnecessary complexity.
The project architecture was simplified by evolving StandardLayout instead of introducing a new abstraction.

### Alternatives Considered
Create a separate AppShell.
Rejected because it duplicated responsibilities already handled by StandardLayout.

### Impact
Simpler layout hierarchy.
Less migration effort.
Better maintainability.

## DEC-008

### Title

Use semantic HTML for metadata.

### Status

Accepted

### Decision

Metadata displayed on standard pages uses semantic HTML (`<dl>`, `<dt>`, `<dd>`) instead of generic containers.

### Reason

Metadata represents descriptive information rather than arbitrary layout.

Semantic HTML improves accessibility, screen reader support and document structure.

### Impact

All future metadata components should follow the same pattern.





