---
title: "Notion Template for Employee Onboarding Checklist HR Teams Can Use in 2026"
description: "A Notion onboarding checklist template for HR managers. Track every new hire task, owner, and deadline from offer letter to 90-day review."
profession: "HR Managers"
category: "Onboarding"
contentType: template
tool: Notion
tags: ["notion template for employee onboarding checklist hr", "new hire onboarding checklist notion", "hr onboarding tracker notion", "employee onboarding template 2026", "notion hr template new employee"]
pubDate: 2026-07-07
featured: false
---

You have a new hire starting Monday and the onboarding checklist lives across three emails, a shared Google Doc nobody has updated since Q3 2024, and a sticky note on your monitor. This template replaces all of that with a single Notion database that tracks every task, owner, and deadline from signed offer letter through the 90-day check-in — and produces a live status view you can share with the hiring manager before the end of the first week. It is not for HR consultants building a client deliverable or teams who want to redesign their entire people operations stack from scratch.

## What this template does

It replaces the manual process of copying a checklist into a new doc every time someone joins, chasing IT about laptop setup over Slack, and remembering to schedule the 30-day check-in yourself. When you open it on day one, you see a pre-built table of 40 onboarding tasks organised across five phases — Pre-boarding, Day 1, Week 1, Month 1, and 90-Day — with assigned owners, due dates, and status already stubbed in with sensible defaults. After one week of real use it surfaces exactly which tasks are overdue, which are blocked waiting on a third party such as IT or Payroll, and which the new hire still needs to complete themselves. The template tracks up to 15 concurrent new hire onboardings in a single database by filtering on the Employee field.

## Template structure

### Main Onboarding Tasks Database

- **Task Name (Title):** The specific action required, written as a verb phrase. Example: *Send welcome email with first-day logistics*. If this field is blank the task is invisible in every filtered view and will be skipped.

- **Phase (Select):** Pre-boarding / Day 1 / Week 1 / Month 1 / 90-Day. Set this when you first create the task. It drives the Phase Board view — the primary view HR managers open each morning. If a task has the wrong phase it will appear in the wrong column and the hiring manager will see outdated information.

- **Status (Status):** Not started / In progress / Blocked / Awaiting new hire / Done. Change to Blocked the moment a dependency has not cleared — for example, IT has not confirmed the laptop is ready. Change to Awaiting new hire only when the action is entirely in the employee's court, such as completing tax forms. This field drives the Blocked & Overdue filtered view, which you review every morning during the employee's first two weeks.

- **Owner (Select):** HR / IT / Hiring Manager / Facilities / New Hire / Payroll / Legal. Assign this before the employee's start date. If this field is empty the task has no accountable party and will not appear in the By Owner grouped view that you share with department heads.

- **Employee (Relation → Employee Directory database):** Links the task to a specific new hire record. Example: *Priya Nair — Software Engineer, Engineering, Start date 2026-07-14*. Every filtered view — including the per-employee checklist you share with the hiring manager — depends on this relation. A task without an employee linked is treated as a template stub, not a live task.

- **Due Date (Date):** The hard deadline for this task, not the employee's start date. Example: *2026-07-11* for a pre-boarding task due three days before a 14 July start. The Overdue Tasks filtered view sorts ascending by this field and highlights anything past today's date with an empty Status of Done.

- **Completion Date (Date):** The date the task was actually marked Done. Leave blank until done. The 90-Day Summary view uses this field to calculate average days-to-complete per phase, giving you a concrete number to bring to the next HR team retrospective.

- **Notes (Text):** Free text for context that does not fit elsewhere. Example: *IT confirmed laptop ships 2026-07-10 — tracking number in #it-ops Slack channel*. Not required but if a task is Blocked, a note explaining why is expected before you escalate.

- **Priority (Select):** Critical / High / Standard. Mark Critical only for tasks that block the new hire's ability to work on day one: system access, payroll setup, signed contracts. This field feeds the Day 1 Critical Tasks filtered view, which you review the afternoon before every start date.

- **Task Type (Select):** Admin / Equipment / Training / Culture / Compliance / Check-in. Use this field to filter by type when a specific team — for example, Legal for Compliance tasks — needs a list of everything assigned to them across all active onboardings.

---

### Employee Directory Database

- **Employee Name (Title):** Full legal name as it appears on the offer letter. Example: *Priya Nair*. This is the display name in the Employee relation field on every task.

- **Role (Text):** Job title exactly as written in the offer letter. Example: *Senior Product Designer*. Used in the per-employee checklist header so the hiring manager sees the right role at a glance.

- **Department (Select):** Engineering / Product / Marketing / Sales / Finance / People / Legal / Operations. Required before linking tasks. The By Department view groups all active onboardings so you can see at one glance if Engineering has three people starting the same week.

- **Start Date (Date):** The employee's first official day. Example: *2026-07-14*. The Pre-boarding Tasks filtered view uses this field to flag any task due within seven days of today that is still Not started.

- **Hiring Manager (Text):** Full name of the direct manager. Example: *Tom Okafor*. Add this on the day the offer is signed. The Hiring Manager Summary view groups tasks by this field — it is what you paste into the weekly update email you send to each manager on Friday afternoon.

- **Onboarding Status (Select):** Pre-boarding / Active / 90-Day Review / Complete. Change to Active on the employee's start date. Change to 90-Day Review when you schedule the 90-day check-in. Change to Complete only after that check-in is documented and signed off. This field controls which employees appear in the Active Onboardings dashboard view.

- **Contract Signed (Checkbox):** Tick this the moment the signed offer letter lands in your inbox. The Pre-boarding phase tasks are filtered to show only for employees where this box is ticked — there is no point assigning IT setup tasks before the hire is confirmed.

## How to use it week by week

1. **When a candidate accepts an offer:** Open the Employee Directory database, create a new record, fill in Employee Name, Role, Department, Start Date, and Hiring Manager. Tick Contract Signed. The template auto-populates 40 tasks linked to that employee via the Employee relation — you do not create tasks manually. Review the pre-built task list, delete any tasks irrelevant to this role, and set Priority to Critical for any role-specific blockers.

2. **Seven days before the start date:** Open the Pre-boarding Tasks filtered view. Every task in the Pre-boarding phase for this employee is listed sorted by Due Date ascending. Confirm an Owner is assigned for every Critical task. If any task is still Not started and due within three days, change its Status to In progress and add a note naming who is actioning it.

3. **The afternoon before the employee's first day:** Open the Day 1 Critical Tasks filtered view. This shows every task marked Critical with a Due Date of today or earlier that is not yet Done. If anything is still Not started or Blocked, resolve it or escalate before you leave for the day. This is not optional — a new hire who cannot log in on day one is a direct result of skipping this step.

4. **Every morning during Week 1 (Monday through Friday):** Open the Blocked & Overdue view. It shows every task where Status is Blocked or where Due Date is before today and Status is not Done. Work through each blocked task: either resolve the dependency, reassign the Owner, or update the Notes field with the current blocker so there is a written record. Close the view only when every remaining item has an