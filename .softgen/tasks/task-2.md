---
title: Print Job Creation Form
status: in_progress
priority: high
type: feature
tags: [form, api]
created_by: agent
created_at: 2026-05-18T02:44:11Z
position: 2
---

## Notes
Implement form for creating print/encode sessions. Form includes session metadata (code, name, date, template selection, RFID toggle) and dynamic label list with name, product code, serial, EPC fields.

## Checklist
- [ ] Create PrintJobForm component with metadata fields (session_print, session_name, date_created, select_temp, rfid_enable)
- [ ] Add dynamic label list with add/remove functionality (name, prod_code, serial, epc)
- [ ] Generate JSON preview from form data
- [ ] Quick sample data button with default values
- [ ] Submit button to call API endpoint (POST /api/integration/create_print_job)
- [ ] Display API response (respcode, errmsg, print_job_id)

## Acceptance
- Form generates valid JSON matching API spec
- Can add/remove label items dynamically
- API response displays clearly after submission