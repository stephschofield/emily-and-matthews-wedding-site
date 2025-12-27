---
id: task-006
title: Implement CSV export functionality for RSVPs
status: To Do
assignee: []
created_date: '2025-12-27 04:31'
labels:
  - admin export
dependencies: []
priority: low
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add export functionality to download RSVP data as CSV files for use with catering, seating charts, and other wedding planning tools. This enables offline data management.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Export button exists on RSVP list page,Clicking export downloads CSV file,CSV includes all RSVP data (names, status, meals, dietary restrictions),File naming includes date (e.g., rsvps-2026-05-01.csv),CSV format is compatible with Excel and Google Sheets,Export respects current filters if applied,API endpoint at /app/api/admin/export/route.ts handles generation,Large guest lists export without timeout
<!-- AC:END -->
