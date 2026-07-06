---
title: "Free Notion Template for HR Managers: Recruitment Tracker 2026"
description: "Free Notion recruitment tracker for HR managers. Track every candidate, role, and interview stage in one database. Duplicate and use today."
profession: "HR Managers"
category: "Recruitment"
contentType: template
tool: Notion
tags: ["free notion template for hr managers recruitment tracker", "notion recruitment pipeline tracker", "hr candidate tracking template notion", "notion applicant tracker hr", "free notion template hiring manager 2026"]
pubDate: 2026-07-06
featured: false
---

You are managing six open roles simultaneously, candidate statuses are scattered across your inbox and a shared spreadsheet nobody updates, and a hiring manager just asked you for a shortlist by Thursday. This template gives you a single Notion database that shows every candidate, their stage, next action, and interview date — so you can answer that question in under two minutes. It is not for agencies managing hundreds of reqs or teams who need ATS integrations; it is for in-house HR managers running up to 20 concurrent roles who need to get organised today.

## What this template does

It replaces the habit of maintaining a spreadsheet per role, chasing interviewers for feedback over Slack, and manually compiling weekly hiring updates for your leadership team. On day one you see a Board view grouped by hiring stage, a Table view sorted by application date, and a filtered view called **This Week's Actions** that surfaces every candidate with a scheduled interview or a pending decision in the next seven days. After one week of consistent use, you have a live pipeline across all open roles, a log of every interviewer's feedback, and a ready-to-export status table you can paste into your Monday leadership update.

## Template structure

### Candidates Database (main database)

- **Candidate Name (Title):** Full name of the applicant, e.g. `Priya Mehta`. Every other view and filter runs off this field — leave it blank and the record becomes invisible in grouped views.
- **Role Applied For (Select):** One option per open position, e.g. `Senior Product Designer / Head of Finance / Customer Success Manager`. Add a new option the moment a req is opened; archive it when the role is filled. If this field is wrong, the **By Role** board view mixes candidates across reqs and the counts at the top of each column become meaningless.
- **Stage (Status):** `Applied` / `Phone Screen Scheduled` / `Phone Screen Done` / `Interview Scheduled` / `Interview Done` / `Offer Extended` / `Offer Accepted` / `Rejected` / `Withdrawn`. Move the card the moment the stage changes — not at the end of the week. The **This Week's Actions** filtered view uses Stage to surface anyone sitting in `Phone Screen Scheduled` or `Interview Scheduled` with a date in the next seven days.
- **Application Date (Date):** The date the application was received, e.g. `2026-06-30`. Used to sort the Table view oldest-first so late-stage candidates from three weeks ago do not get buried. Leaving this blank breaks the sort and the candidate appears at the bottom regardless of urgency.
- **Interview Date (Date):** The date of the next scheduled interview or call, e.g. `2026-07-09`. This is the primary driver of the **This Week's Actions** view. If no interview is scheduled yet, leave it blank — do not guess.
- **Interviewer (Person):** The Notion workspace member conducting the interview, e.g. `@David Okonkwo`. Tagging them here lets you filter the **My Interviews** view to show each hiring manager only their own upcoming interviews. If this is empty, no one owns the debrief.
- **Source (Select):** `LinkedIn` / `Referral` / `Job Board` / `Agency` / `Direct Application` / `Other`. Fill this in at the point of adding the candidate. After one full hiring cycle, filter this column to see which source is producing your shortlisted candidates — use that to decide where to post next.
- **CV Link (URL):** Direct link to the stored CV, e.g. `https://drive.google.com/file/d/abc123`. Paste the shareable Google Drive or SharePoint link. Without this, interviewers open the record and have no document to reference before the call.
- **Interviewer Feedback (Text):** Free-text notes from the debrief, e.g. `Strong on stakeholder management, weak on data analysis. Hiring manager wants to proceed to final round.` The interviewer or HR manager pastes their notes here within 24 hours of the interview. This field feeds the **Offer Decision** workflow — if it is blank when Stage is set to `Offer Extended`, you have made a decision without a paper trail.
- **Salary Expectation (Number):** Candidate's stated expectation in your local currency, e.g. `72000`. Used to filter against budget before extending an offer. Leave blank only if the candidate has genuinely not disclosed.
- **Next Action (Text):** One sentence on what happens next and who owns it, e.g. `HR to send technical assessment by 2026-07-08`. Update this every time Stage changes. The **This Week's Actions** view surfaces this field prominently so you can run your Monday check-in in under ten minutes.
- **Priority (Select):** `High` / `Normal` / `On Hold`. Set to `High` when a role is business-critical and the candidate is at offer stage. Set to `On Hold` when a req is paused so the candidate disappears from active views without being deleted.

### Open Roles Section (linked database callout)

This is a lightweight secondary database embedded at the top of the page as a linked view. It contains one record per open role.

- **Role Title (Title):** Exact job title, e.g. `Head of Finance`. Must match the options in the **Role Applied For** select field of the Candidates database exactly — if they diverge, the Board view groups break.
- **Hiring Manager (Person):** The internal owner of the req, e.g. `@Sarah Lindqvist`.
- **Target Start Date (Date):** The date the business needs the role filled by, e.g. `2026-09-01`. Used to calculate urgency at a glance.
- **Req Status (Select):** `Open` / `On Hold` / `Filled` / `Cancelled`. Change to `Filled` the day the offer is accepted, not when the new hire starts. The **Active Roles** filtered view in the Candidates database filters on `Open` only — stale reqs that are not closed will pollute this view.
- **Active Candidates (Rollup):** Automatically counts the number of records in the Candidates database linked to this role where Stage is not `Rejected` or `Withdrawn`. This number tells you at a glance whether a req has a live pipeline or needs sourcing attention.

## How to use it week by week

1. **When a new req is opened:** Add one record to the Open Roles database. Set Req Status to `Open`, assign the Hiring Manager, and set the Target Start Date. Then add the new role as an option in the **Role Applied For** select field in the Candidates database before any applications arrive.

2. **Each time a new application comes in:** Add one record to the Candidates database. Fill in Candidate Name, Role Applied For, Application Date, Source, and CV Link immediately. Set Stage to `Applied`. Write one sentence in Next Action, e.g. `HR to review CV by 2026-07-10`. Do not leave the record as a name with no fields — a half-filled record is worse than no record.

3. **Every Monday morning:** Open the **This Week's Actions** view. It filters for every candidate with an Interview Date in the next seven days or a Stage of `Phone Screen Scheduled`. Review the Next Action field for each one. Reassign or reschedule anything that has slipped. This takes ten minutes. The output is your mental agenda for the hiring week — you know exactly who needs to hear from you before Friday.

4. **Within 24 hours of any interview:** Paste the debrief notes into **Interviewer Feedback**. Update Stage to `Interview Done`. Rewrite Next Action to reflect the decision required, e.g. `Hiring manager to confirm final round invite by 2026-07-11`. Without this step, the record sits in `Interview Scheduled` forever and inflates your pipeline count.

5. **Every Friday afternoon:** Open the Table view, filter by Stage not equal to `Rejected` / `Withdrawn` / `Offer Accepted`, and sort by Application Date ascending. Screenshot or export this