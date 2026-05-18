---
title: Stock In Form & Audit Session Form
status: done
priority: medium
type: feature
tags: [form, api]
created_by: agent
created_at: 2026-05-18T02:44:11Z
position: 4
---

## Notes
Build stock in (warehouse entry) and audit session forms. Stock in similar to stock out but with sender instead of recipient. Audit form has session metadata and asset list with optional EPC.

## Checklist
- [x] Create StockInForm with sender info instead of recipient
- [x] Dynamic items with required EPC for stock in
- [x] Create AuditSessionForm with session metadata
- [x] Dynamic audit items (asset_id, serial, optional epc)
- [x] Both forms submit to correct endpoints

## Acceptance
- Stock in form submits successfully with stockin_id response
- Audit form submits successfully with audit_id response
- All form data matches API specs exactly