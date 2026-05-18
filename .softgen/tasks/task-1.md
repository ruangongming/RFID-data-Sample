---
title: Design System & Layout Structure
status: done
priority: urgent
type: chore
tags: [design, foundation]
created_by: agent
created_at: 2026-05-18T02:44:11Z
position: 1
---

## Notes
Set up design system with technical/industrial color palette and typography. Create main layout with tab navigation for 4 simulation features + history.

## Checklist
- [x] Configure globals.css with color variables (slate primary, amber accent, technical palette)
- [x] Set up fonts in tailwind.config.ts (IBM Plex Sans, Rubik, JetBrains Mono)
- [x] Create main layout with tab navigation (5 tabs: Print, Stock Out, Stock In, Audit, History)
- [x] Create reusable form components (FormField, JSONPreview, StatusBadge)

## Acceptance
- Tabs switch smoothly between 4 form types and history
- Color system uses technical slate/amber theme consistently
- Monospace font displays in JSON preview areas