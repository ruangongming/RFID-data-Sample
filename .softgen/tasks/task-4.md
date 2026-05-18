---
title: Stock In Form & Audit Session Form
status: todo
priority: medium
type: feature
tags: [form, api]
created_by: agent
created_at: 2026-05-18T02:44:11Z
position: 4
---

## Notes
Two remaining forms: Stock In (similar to Stock Out but for warehouse entry) and Audit Session (inventory checking with asset list).

## Checklist
- [ ] Create StockInForm (mirrors StockOut structure but with sender_person instead of assigned_person)
- [ ] Submit to POST /api/integration/stockin_note
- [ ] Create AuditSessionForm with fields: session_audit, session_name, method, date_created, user_request, department_info, store_info
- [ ] Audit items list (asset_id, serial, epc nullable)
- [ ] Submit to POST /api/integration/create_audit_session
- [ ] Both forms show JSON preview and handle responses

## Acceptance
- Stock In form submits successfully with stockin_id response
- Audit form submits successfully with audit_id response
- All form data matches API specs exactly