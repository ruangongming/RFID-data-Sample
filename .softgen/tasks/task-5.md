---
title: History Log & API Integration
status: todo
priority: low
type: feature
tags: [history, api]
created_by: agent
created_at: 2026-05-18T02:44:11Z
position: 5
---

## Notes
History tab to display all created sessions. Store in localStorage for demo purposes. Includes session code, type, timestamp, status, and response data.

## Checklist
- [ ] Create HistoryLog component with table display
- [ ] Store submitted sessions in localStorage (session_code, type, timestamp, status, response)
- [ ] Display table with columns: Mã phiên, Loại, Thời gian, Trạng thái, Kết quả
- [ ] Add expand/collapse for JSON response details
- [ ] Clear history button
- [ ] Status badges (success/error styling)

## Acceptance
- All submitted sessions appear in history
- Can view full JSON response for each session
- History persists across page reloads