---
title: "n8n Automation for Employee Survey Distribution in 2026: Send Personalised Pulse Surveys via Email When a New Row Appears in Google Sheets"
description: "Automate employee survey distribution in n8n: trigger personalised survey emails from Google Sheets on a schedule. Saves 45 min every Monday morning."
profession: "HR Managers"
category: "Engagement"
contentType: workflow
tags: ["n8n automation for employee survey distribution", "automated employee pulse survey", "HR survey workflow n8n", "Google Sheets survey trigger", "employee engagement automation"]
pubDate: 2026-07-05
featured: false
---

This workflow automatically sends a personalised weekly pulse survey email to every employee listed in a Google Sheet, every Monday at 9 AM, without you touching a single thing. It connects Google Sheets (your employee roster), n8n's Schedule Trigger, and Gmail to fire individual survey links in under 60 seconds. It replaces the 45-minute manual process of filtering your roster, copying links, and sending one-by-one from your inbox every Monday morning.

## Why this automation matters

Right now, your Monday morning routine probably looks like this: open the employee roster, filter for active staff, copy each person's name and manager into a draft email, swap in their unique SurveyMonkey or Typeform link, and send. If you miss someone — a new starter added on Friday, a name misspelled in a filter — they skip the pulse cycle entirely, and that absence shows up as a data gap in your quarterly engagement report. This workflow reads your roster fresh every Monday, so anyone added to the sheet since the last run is automatically included. It also logs a timestamp in the sheet the moment their email is sent, so you have an audit trail without building a separate tracker.

## What you need before starting

- **n8n instance** — self-hosted (v1.40 or later) or [n8n Cloud](https://n8n.io/)
- **Google Sheets OAuth2 credential** — connected to the Google account that owns the employee roster sheet described below
- **Gmail OAuth2 credential** — connected to the HR inbox you want to send from (e.g. hr@yourcompany.com); must have Gmail Send scope granted
- **Google Sheet named `Employee Roster`** — with these exact column headers in Row 1: `Full Name`, `Email`, `Department`, `Manager Name`, `Survey Link`, `Last Survey Sent`
- **Survey links already generated** — one unique Typeform, Google Form, or SurveyMonkey URL per employee populated in the `Survey Link` column before the first run
- **n8n node types used** — Schedule Trigger, Google Sheets (Read Rows), IF, Google Sheets (Update Row), Gmail (Send Email). All are built-in; no community nodes required.

---

## How to build it: step by step

### 1. Schedule Trigger — Fire the workflow every Monday at 9 AM

**Node type:** Schedule Trigger
**Field: Trigger Interval** → Set to `Weeks`
**Field: Weeks Between Triggers** → `1`
**Field: Trigger on Weekdays** → Select `Monday`
**Field: Trigger at Hour** → `9`
**Field: Trigger at Minute** → `0`

**Output:** A single trigger event with no payload — it simply wakes the workflow.

**Why this matters:** Setting the interval to weekly on Monday at 9 AM means the workflow runs before most employees start their day, maximising the chance the survey email is the first thing they see. If you need a different cadence (bi-weekly, first Monday of the month), change `Weeks Between Triggers` to `2` or add a Function node after this to check if today matches your desired schedule.

---

### 2. Google Sheets — Read all active employee rows

**Node type:** Google Sheets
**Operation:** Read Rows (also labelled "Get Many Rows" in n8n v1.40+)
**Field: Credential** → Select your Google Sheets OAuth2 credential
**Field: Spreadsheet** → Select or paste the name `Employee Roster`
**Field: Sheet** → `Sheet1` (or whatever tab name you use)
**Field: Filters → Column** → `Department` | **Condition** → `is not empty`

> If you want to exclude leavers, add a second filter row: Column `Email` → `is not empty`. This catches any row where someone has been removed but the row not deleted.

**Output:** Every employee row as a separate item, each containing the values from all six columns. Downstream nodes receive one item per employee.

**Why this matters:** Reading the sheet fresh each run means new starters added after last Monday are automatically included — you do not need to manually update a separate distribution list.

---

### 3. IF — Skip employees who were already sent a survey this week

**Node type:** IF
**Condition 1:**
- **Value 1** → Expression: `{{ $json["Last Survey Sent"] }}`
- **Operation** → `is empty`

**True branch output:** Employees with a blank `Last Survey Sent` field — these get an email.
**False branch output:** Employees who already have a date in that field — these are discarded (connect the False output to a NoOp node to close the branch cleanly).

**Why this matters:** Without this check, re-running the workflow manually mid-week — or if it fires twice due to a misconfiguration — would send duplicate survey emails to every employee. The `Last Survey Sent` timestamp you write in Step 4 is what protects against duplicates.

> **Note:** This check is week-agnostic by default. If you want it to skip only employees sent a survey *this specific week* (not just anyone with any date), change the condition to: Value 1 → `{{ $json["Last Survey Sent"] }}` | Operation → `does not contain` | Value 2 → `{{ $today.toFormat('yyyy-WW') }}`. You would then also need to write the ISO week string (e.g. `2026-28`) into `Last Survey Sent` instead of a plain date in Step 4.

---

### 4. Gmail — Send personalised survey email

**Node type:** Gmail
**Operation:** Send
**Field: Credential** → Select your Gmail OAuth2 credential
**Field: To** → Expression: `{{ $json["Email"] }}`
**Field: Subject** → `{{ $json["Full Name"] }}, your weekly pulse check-in is ready`
**Field: Email Type** → HTML
**Field: Message** →

```
Hi {{ $json["Full Name"] }},

This week's pulse survey takes less than 2 minutes. Your responses help 
{{ $json["Manager Name"] }} and the HR team understand how things are going 
across {{ $json["Department"] }}.

<a href="{{ $json["Survey Link"] }}" style="background:#0052CC;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;font-family:sans-serif;">Take the survey</a>

If the button doesn't work, paste this link into your browser:
{{ $json["Survey Link"] }}

Thanks,
HR Team
```

**Field: Append n8n Attribution** → Toggle OFF (keeps the email clean)

**Output:** A confirmation object per sent email containing `messageId`, `threadId`, and the recipient address.

**Why this matters:** Using `$json["Survey Link"]` pulls each employee's unique survey URL from the sheet rather than sending everyone the same link — this is what enables per-person response tracking in Typeform, Google Forms, or SurveyMonkey.

---

### 5. Google Sheets — Write timestamp to Last Survey Sent column

**Node type:** Google Sheets
**Operation:** Update Row
**Field: Credential** → Select your Google Sheets OAuth2 credential
**Field: Spreadsheet** → `Employee Roster`
**Field: Sheet** → `Sheet1`
**Field: Matching Column** → `Email` (this is how n8n identifies which row to update)
**Field: Value to Update — Column** → `Last Survey Sent`
**Field: Value to Update — Value** → Expression: `{{ $now.toFormat('yyyy-MM-dd') }}`

**Output:** Confirmation that the row was updated. The `Last Survey Sent` column in the sheet now contains today's date (e.g. `2026-07-07`) for every employee who was emailed.

**Why this matters:** This timestamp is what the IF node in Step 3 reads on the next run. Without writing it back, the duplicate-prevention logic has nothing to compare against.

---

## Full workflow JSON

```json
{
  "name": "Employee Survey Distribution — Weekly Pulse",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "weeks",
              "weeksInterval": 1,
              "triggerAtDay": [1],
              "triggerAtHour": 9,
              "triggerAtMinute": 0
            }
          ]
        }
      },
      "id": "a1b2c3d4-0001-0001-0001-000000000001",
      "name": "Every Monday 9AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "getRows",
        "documentId": {
          "__rl": true,
          "value": "YOUR_GOOGLE_SHEET_ID_HERE",
          "mode": "id"
        },
        "sheetName": {
          "__rl": true,
          "value": "Sheet1",
          "mode": "name"
        },
        "filtersUI": {
          "values": [
            {
              "lookupColumn": "Department",
              "lookupValue": "",
              "condition": "notEqual"
            },
            {
              "lookupColumn": "Email",
              "lookupValue": "",
              "condition": "notEqual"
            }
          ]
        },
        "options": {}
      },
      "id": "a1b2c3d4-0002-0002-0002-000000000002",
      "name": "Read Employee Roster",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.2,
      "position": [460, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "REPLACE_WITH_YOUR_GOOGLE_SHEETS_CREDENTIAL_ID",
          "name": "Google Sheets account"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true,
            "leftValue": "",
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "cond-001",
              "leftValue": "={{ $json[\"Last Survey Sent\"] }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "empty",
                "singleValue": true
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "a1b2c3d4-0003-0003-0003-000000000003",
      "name": "Not Yet Sent This Week",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "sendTo": "={{ $json[\"Email\"] }}",
        "subject": "={{ $json[\"Full Name\"] }}, your weekly pulse check-in is ready",
        "emailType": "html",
        "message": "=<p>Hi {{ $json[\"Full Name\"] }},</p><p>This week's pulse survey takes less than 2 minutes. Your responses help {{ $json[\"Manager Name\"] }} and the HR team understand how things are going across {{ $json[\"Department\"] }}.</p><p><a href=\"{{ $json[\"Survey Link\"] }}\" style=\"background:#0052CC;color:#ffffff;padding:10px 20px;border-radius:4px;text-decoration:none;font-family:sans-serif;display:inline-block;\">Take the survey