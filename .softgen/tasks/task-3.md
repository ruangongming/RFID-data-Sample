---
title: Stock Out Form
status: done
priority: high
type: feature
tags: [form, api]
created_by: agent
created_at: 2026-05-18T02:44:11Z
position: 3
---

## Notes
Create form for warehouse exit notes. Includes metadata (code, name, datetime, warehouse info) and recipient info (person code/name, department). Dynamic item list with asset_id and EPC.

## Checklist
- [x] Create StockOutForm with metadata fields
- [x] Add warehouse and recipient info sections
- [x] Dynamic items list (asset_id, epc) with add/remove
- [x] JSON preview and API submission
- [x] Display response with stockout_id

## Acceptance
- Form data matches stockout API spec
- Items list clearly organized
- Generated JSON matches stockout API spec
- Response shows stockout_id on success