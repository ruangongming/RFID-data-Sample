---
title: Stock Out Form
status: todo
priority: high
type: feature
tags: [form, api]
created_by: agent
created_at: 2026-05-18T02:44:11Z
position: 3
---

## Notes
Form for creating warehouse exit notes. Includes stock out code, warehouse info, assigned person details, and asset list.

## Checklist
- [ ] Create StockOutForm with fields: stockout_code, stockout_name, created_at
- [ ] Add warehouse section (warehouse_cd, warehouse_name)
- [ ] Add assigned person section (person_cd, person_name, department)
- [ ] Dynamic items list (asset_id, epc)
- [ ] JSON preview and sample data generation
- [ ] Submit to POST /api/integration/stockout_note
- [ ] Display response with stockout_id

## Acceptance
- All sections clearly organized
- Generated JSON matches stockout API spec
- Response shows stockout_id on success