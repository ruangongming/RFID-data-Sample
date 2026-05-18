---
title: Asset Management System
status: in_progress
priority: urgent
type: feature
tags: [storage, refactor]
created_by: agent
created_at: 2026-05-18T03:30:00Z
position: 6
---

## Notes
Implement centralized asset storage system. Print job creates assets, other forms (stockout, stockin, audit) select from this list. Assets persist in localStorage.

## Checklist
- [x] Create assetStore utility with localStorage persistence
- [x] Refactor PrintJobForm: add quantity input + "Tạo phiên in" button to auto-generate assets
- [ ] Update StockOutForm to select assets from store (no manual entry)
- [ ] Update StockInForm to select assets from store
- [ ] Update AuditSessionForm with "Tạo nhanh" button (select all assets)
- [ ] Display current asset count in forms

## Acceptance
- Print job generates N assets with empty EPC
- Other forms can select from generated assets
- Asset list persists across sessions
- "Tạo nhanh" in audit selects all available assets