---
title: "Free Notion Template for L&D Training Planner HR 2026"
description: "Free Notion template for L&D training planner HR teams. Map every course, owner, and deadline in one workspace. Duplicate and start today."
profession: "HR Managers"
category: "L&D"
contentType: template
tool: Notion
tags: ["free notion template for l&d training planner hr", "notion l&d planner template", "hr training tracker notion", "employee training plan notion template", "learning and development planner hr 2026"]
pubDate: 2026-07-07
featured: false
---

You have a quarterly training calendar to deliver, five department heads asking for different things, and no single place that shows what is confirmed, what is still waiting on a vendor, and what is overdue. This template replaces that mess with one database that produces a weekly training status report you can paste directly into your Monday standup. It is not for L&D consultants building a course library from scratch — it is for the HR Manager who already knows what training needs to happen and needs a clean way to track it to completion.

## What this template does

It replaces the spreadsheet-and-email loop where training requests get lost between Slack, your inbox, and a shared Google Sheet nobody updates. On day one you open it to a pre-filtered Kanban view showing every session grouped by Status, with the current week's sessions at the top. After one week of use it surfaces the exact sessions that are Confirmed but missing a Facilitator, and the ones marked Scheduled whose booking confirmation has not been uploaded — the two gaps that most commonly cause a session to fall apart 48 hours before it runs. The template tracks up to 40 active training sessions across departments without any additional setup.

## Template structure

### Training Sessions Database

- **Session Name (Title):** Plain text. Example: `Unconscious Bias Awareness — Sales Team Q3`. Leave this blank and the record becomes invisible in filtered views that other managers rely on; every record needs a name before you save it.

- **Department (Select):** `Sales / Operations / Finance / People / Technology / All Staff`. Example: `Sales`. If left blank, this session is excluded from the Department View that heads of department use to see their own team's upcoming training. Set it the moment you create the record.

- **Status (Select):** `Requested / In planning / Confirmed / Scheduled / Delivered / Cancelled`. Change to `Confirmed` only when you have a signed booking confirmation or a written yes from the facilitator — not a verbal agreement. Change to `Scheduled` when the calendar invite has gone to all attendees. This field drives the Weekly Delivery View and the Blocked Sessions filtered view.

- **Session Date (Date):** The date the session runs. Example: `2026-07-22`. If this is empty the session disappears from the Timeline View and from the auto-sorted Weekly Agenda, which means it will not appear in your Monday standup export.

- **Facilitator (Text):** Full name or vendor name. Example: `Meridian Training Ltd`. Leave this blank and the `Ready to Deliver` filtered view flags the record in red, prompting you to chase a confirmation before the week closes.

- **Delivery Method (Select):** `In-person / Virtual / Hybrid / Self-paced e-learning`. Example: `Virtual`. This field feeds the Logistics Checklist view — virtual sessions show a reminder to send the Zoom link 48 hours before; in-person sessions show a room booking reminder.

- **Target Headcount (Number):** The number of employees expected to attend. Example: `18`. Used in the Capacity formula field. If blank, the completion rate formula returns an error and the Completion Rate rollup in the Summary Dashboard breaks.

- **Actual Attendees (Number):** Fill this in within 24 hours of a session delivering. Example: `14`. Drives the Completion Rate formula: `Actual Attendees / Target Headcount`. This is the number your HRBP will ask for at the end of the quarter.

- **Completion Rate (Formula):** `prop("Actual Attendees") / prop("Target Headcount")`. Outputs a percentage. Example: `78%`. Read-only — do not edit. If it shows `NaN`, one of the two number fields above is empty.

- **Booking Confirmation (Files & Media):** Upload the signed confirmation email, PO, or calendar screenshot here. Example: a PDF named `UB_Awareness_Confirmation_July2026.pdf`. If this is empty when Status is `Confirmed`, the session appears in the Missing Confirmation filtered view, which you review every Thursday.

- **Budget Code (Text):** Your internal cost centre code. Example: `L&D-2026-Q3-007`. Required for finance sign-off. Leave it blank and the session cannot be included in the quarterly spend report you export from the Finance View.

- **Notes (Text):** Free text for anything that does not fit elsewhere. Example: `Vendor requires laptop-free room. Notify IT by 5 days prior.` This field is not included in any filtered view but is visible in the record detail pane.

### Summary Dashboard Section

This is a Notion synced view pinned to the top of the page — not a separate database. It contains three linked gallery cards:

- **Sessions Delivering This Week:** Filtered view of the Training Sessions Database where Session Date falls within the current ISO week and Status is `Confirmed` or `Scheduled`.
- **Blocked or Missing Info:** Filtered view where Status is `Requested` or `In planning` AND Session Date is within 14 days — these are the records that need action before they become a problem.
- **Delivered This Quarter:** Filtered view where Status is `Delivered` and Session Date falls within the current quarter. Shows average Completion Rate across those sessions.

## How to use it week by week

1. **Every Monday morning, before your standup:** Open the Weekly Delivery View. It auto-filters to sessions with a Session Date in the next 7 days. Scan Status for anything still showing `In planning` — those need to move to `Confirmed` or `Cancelled` by end of day. Screenshot or export this view and paste it into your standup notes or team Slack channel.

2. **When a new training request lands in your inbox:** Create a new record immediately. Fill in Session Name, Department, Delivery Method, and Target Headcount. Set Status to `Requested`. Do not wait until you have all the information — an incomplete record in the system is better than a request sitting in your inbox that you will forget by Wednesday.

3. **When you receive a booking confirmation from a vendor or internal facilitator:** Upload the confirmation document to the Booking Confirmation field, update Status to `Confirmed`, and enter the Facilitator name. Do all three in one sitting. If you update Status without uploading the file, the record appears in both the Confirmed view and the Missing Confirmation view simultaneously, which creates confusion when you do your Thursday audit.

4. **Every Thursday afternoon:** Open the Missing Confirmation filtered view. Every record here has Status set to `Confirmed` but no file in the Booking Confirmation field. Chase each one before the week closes. If you cannot get written confirmation, revert Status to `In planning` so it does not look settled when it is not.

5. **24 hours after a session delivers:** Open the record, set Status to `Delivered`, and enter the Actual Attendees count. This triggers the Completion Rate formula and adds the session to the Delivered This Quarter dashboard card. If you let this slip more than 48 hours, you will be reconstructing attendance numbers from memory at the end of the quarter.

6. **On the last Friday of each month:** Open the Finance View, filter by the current month, and export it as a CSV. Every record with a Budget Code populates cleanly. Records missing a Budget Code appear at the top of the export with a blank cell — find those and fill them in before sending to finance.

## Get your free copy

[Duplicate this template for free](https://www.notion.so/) — opens in your workspace in under 30 seconds. Rename the top-level database to match your team or the current quarter (for example, `L&D Training Planner — Q3 2026`) before adding any records, so filtered views and exports carry the right label from the start.

## Frequently Asked Questions

### The Completion Rate formula is showing NaN for some sessions — how do I fix it?

`NaN` appears when either Target Headcount or Actual Attendees is empty for that record. Open the flagged record, check both number fields, and enter a value in whichever is blank. If a session was cancelled before it ran, enter `0` in Actual