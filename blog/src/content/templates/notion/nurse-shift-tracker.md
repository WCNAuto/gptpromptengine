---
title: "Free Notion Template for Nurse Shift and Patient Log 2026 - Track Handoffs & Care Documentation"
description: "Complete Notion template for nurse shift tracking and patient care logs. Document vitals, medications, and handoff notes in one organized workspace."
profession: "Nurses"
category: "Shift Management"
contentType: template
tool: Notion
tags: ["free notion template for nurse shift and patient log", "nurse patient tracking template", "shift handoff documentation", "nursing care log template", "patient assignment tracker"]
pubDate: 2026-06-11
featured: false
---

This template replaces the scattered paper logs, sticky notes, and multiple spreadsheets nurses use to track patient assignments, vital signs, medications, and shift handoffs. It creates a single workspace where you document patient care throughout your shift and generate complete handoff reports for the next nurse. This is not for nursing students or academic care plans — it's built for working floor nurses who need immediate access to current patient status and medication schedules.

## What this template does

It eliminates the manual process of writing patient updates on paper, losing track of medication times, and scrambling to remember critical details during shift change. When you open it on day one, you see your assigned patients with empty care logs ready to fill. After one week of use, you have a complete record of patient progress, medication compliance, and incident documentation that automatically generates handoff reports. Tracks up to 20 patients per shift with full care documentation history.

## Template structure

### Patient Assignment Database
- **Patient Name (Text)**: Last name, First name format. Jones, Sarah. Leave empty and the medication tracker view breaks because it cannot group by patient.
- **Room Number (Text)**: 302A, 418B, ICU-7. Update immediately when patients transfer or the location-based views show incorrect assignments.
- **Admission Date (Date)**: Actual admission date, not your first shift with them. The length-of-stay formula depends on this being accurate.
- **Primary Diagnosis (Text)**: CHF exacerbation, Post-op day 2 appendectomy. This drives the care plan template suggestions.
- **Acuity Level (Select)**: Low / Medium / High / Critical. Change when patient condition changes — affects nurse-to-patient ratios in the workload view.
- **Assigned Nurse (Select)**: Your name and coworkers. Set to your name for your patients, leave blank for admissions not yet assigned.

### Shift Log Database  
- **Date/Time (Date)**: Include exact time for each entry. 2026-06-11 14:30. Required for chronological handoff reports.
- **Patient (Relation)**: Links to Patient Assignment database. Must match exactly or entries appear as orphaned in patient-specific views.
- **Log Type (Select)**: Vitals / Medication / Assessment / Incident / Discharge. Medication entries auto-populate in the MAR view.
- **Details (Text)**: BP 140/90, HR 88, complained of chest pain, administered Lasix 40mg IV. Be specific — this becomes your legal documentation.
- **Follow-up Required (Checkbox)**: Check when something needs monitoring or action from next shift. Drives the handoff priority list.
- **Nurse (Select)**: Who documented this entry. Critical for accountability and legal documentation.

### Medication Schedule Database
- **Patient (Relation)**: Links to patient assignment. Required or medications won't appear in patient-specific views.
- **Medication (Text)**: Generic name and dose. Metoprolol 25mg, Furosemide 40mg. Avoid brand names for consistency.
- **Schedule (Select)**: Q4H / Q6H / Q8H / Q12H / BID / TID / QID / PRN / Once. Drives the medication due reminder view.
- **Route (Select)**: PO / IV / IM / SQ / Topical. Required for accurate administration documentation.
- **Last Given (Date)**: Exact date/time of last dose. 2026-06-11 08:00. Next due time auto-calculates from this.
- **Status (Select)**: Current / Held / Discontinued. Change to Held when parameters not met, Discontinued when order expires.

## How to use it week by week

1. **Start of each shift**: Open the Patient Assignment database, filter by Assigned Nurse = your name. Verify room numbers and acuity levels match your assignment sheet before documenting any care.

2. **Every 2-4 hours during shift**: Add new entries to Shift Log database. Set Log Type first, then Patient, then Details. Always include exact times for medication administration and vital signs.

3. **Before medication administration**: Check Medication Schedule database, filter by your patients and Status = Current. Verify last given time and schedule before administering. Update Last Given immediately after administration.

4. **30 minutes before shift end**: Open the Handoff Report view (filters Shift Log entries from your shift with Follow-up Required = checked). Print or screenshot this for verbal report to oncoming nurse.

5. **Weekly on Friday**: Archive completed records for discharged patients to keep active databases manageable. Export to PDF for permanent record keeping per facility policy.

## Get your free copy

[Duplicate this template for free](https://www.notion.so/) — opens in your workspace in under 30 seconds. Rename the Patient Assignment database to match your unit name before adding any patient records.

## Frequently Asked Questions

### How do I handle PRN medications in the schedule database?
Set Schedule to PRN and leave Last Given empty until first dose. The medication tracker view groups PRN meds separately from scheduled doses. Update Last Given each time you administer, and document parameters met in the Shift Log Details field.

### Can I customize the Log Type options for my unit's specific needs?
Yes, edit the Log Type select field to add options like Pain Assessment, Fall Risk, or Isolation Precautions. Each log type gets its own color in the timeline view, so you can quickly scan for specific types of entries during handoff.

### What happens when a patient transfers to another unit mid-shift?
Change the Room Number to reflect new location and update Assigned Nurse to the receiving nurse's name. All previous shift log entries remain linked to the patient record, so the receiving unit can see the complete care history without losing documentation.

---

Want 20 more templates built for Nurses? The full pack is on [Gumroad](https://gumroad.com) — includes every template on this site plus setup video walkthroughs.