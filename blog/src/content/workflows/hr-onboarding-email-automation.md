---
title: "n8n Workflow for Automating HR Onboarding Emails from Google Sheets (2026)"
description: "Auto-send personalised onboarding emails when a new hire row is added to Google Sheets. Full n8n workflow JSON included for HR Managers."
profession: "HR Managers"
category: "Onboarding"
contentType: workflow
tags: ["n8n workflow for automating hr onboarding emails", "n8n hr onboarding automation", "automate onboarding email google sheets", "n8n gmail workflow hr", "new hire email automation n8n"]
pubDate: 2026-07-05
featured: false
---

This workflow monitors a Google Sheets "Onboarding Tracker" for newly added employee rows and immediately sends each new hire a personalised welcome email via Gmail — no manual copy-paste, no missed sends. It connects Google Sheets, a data transformation step, and Gmail. For a team adding five or more new hires per week, this eliminates roughly 25 minutes of manual email drafting and sending every Monday morning.

## Why this automation matters

Without this workflow, an HR Manager must open the tracker, spot new rows added since last week, copy each person's name and start date into an email template, and send individually — a process that breaks down the moment the sheet is updated by a recruiter while you are in another meeting. A new hire who does not receive their welcome email on day one has no portal login instructions, no first-day agenda, and no point of contact — a gap that generates IT tickets and damages first impressions before the person has even started. This workflow fires the moment a row is added, so the email goes out within seconds regardless of who is watching the sheet.

## What you need before starting

- **n8n instance** running version 1.40 or later (self-hosted or n8n Cloud at https://n8n.io/)
- **Google Sheets OAuth2 credential** connected to the Google account that owns the sheet named "Onboarding Tracker" — configured inside n8n under Credentials → New → Google Sheets OAuth2
- **Gmail OAuth2 credential** connected to the HR team inbox (e.g. hr@yourcompany.com) that will send the onboarding emails — configured inside n8n under Credentials → New → Gmail OAuth2
- **Google Sheet** named "Onboarding Tracker" with at minimum these exact column headers in row 1: `First Name`, `Last Name`, `Personal Email`, `Start Date`, `Job Title`, `Department`, `Status`
- The **Status** column must default to blank for new rows; the workflow sets it to `Onboarded` after sending so the same row is never processed twice
- Your Google Sheet's **Spreadsheet ID** — found in the sheet URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`

## How to build it: step by step

### 1. Schedule Trigger — Poll for new rows every 15 minutes

**Node type:** Schedule Trigger
**Field:** Trigger Interval → set to `15` **Minutes**
**Output:** Fires a trigger event every 15 minutes, passing no data — it simply wakes the workflow so the next node can check the sheet.
**Why this matters:** Google Sheets does not natively push events to n8n, so polling on a tight interval is the most reliable method. Fifteen minutes means a new hire receives their email within 15 minutes of their row being added, which is fast enough for any onboarding scenario without hammering the Sheets API.

---

### 2. Google Sheets — Read rows where Status is blank

**Node type:** Google Sheets
**Operation:** `Get Many Rows`
**Credential:** Select your Google Sheets OAuth2 credential
**Spreadsheet ID:** Paste your spreadsheet ID (e.g. `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`)
**Sheet Name:** `Sheet1` (or rename to match your tab name exactly)
**Filters → Add Filter:**
- Column: `Status`
- Condition: `is empty`

**Output:** Each row where Status is blank is passed downstream as a separate item. If three new hires were added since last poll, three items flow into the next node.
**Why this matters:** The Status filter is your deduplication guard. Without it, every row in the sheet — including last month's hires — would receive a new email every 15 minutes.

---

### 3. IF — Skip if no new rows found

**Node type:** IF
**Condition:** `{{ $json["First Name"] }}` **is not empty**
**True branch output:** Items with valid data continue to the email step.
**False branch output:** Workflow ends silently with no action.
**Why this matters:** When the Schedule Trigger fires and Google Sheets finds zero blank-Status rows, the IF node prevents the workflow from throwing an error or attempting to send an email with empty fields. This keeps your execution log clean.

---

### 4. Code — Build the personalised email body

**Node type:** Code (JavaScript)
**Mode:** Run Once for Each Item
**Code:**

```javascript
const firstName = $json["First Name"];
const lastName = $json["Last Name"];
const startDate = $json["Start Date"];
const jobTitle = $json["Job Title"];
const department = $json["Department"];

const emailBody = `
<p>Hi ${firstName},</p>

<p>Welcome to the team! We are thrilled to have you joining us as <strong>${jobTitle}</strong> in the <strong>${department}</strong> department.</p>

<p>Your first day is <strong>${startDate}</strong>. Here is what to expect:</p>

<ul>
  <li>Arrive at 9:00 AM and ask for reception to page your HR contact</li>
  <li>You will receive your laptop and access credentials on day one</li>
  <li>Your manager will reach out separately to share your first-week schedule</li>
</ul>

<p>If you have any questions before your start date, reply directly to this email and our HR team will respond within one business day.</p>

<p>We look forward to seeing you on ${startDate}!</p>

<p>Warm regards,<br>HR Team</p>
`;

return {
  json: {
    ...$json,
    emailBody,
    toEmail: $json["Personal Email"],
    subject: `Welcome to the team, ${firstName}! Your start date is ${startDate}`
  }
};
```

**Output:** Each item now carries `emailBody`, `toEmail`, and `subject` fields alongside the original row data.
**Why this matters:** Building the body in a Code node keeps your Gmail node clean and lets you edit the email template in one place without touching node configuration.

---

### 5. Gmail — Send the onboarding email

**Node type:** Gmail
**Operation:** `Send`
**Credential:** Select your Gmail OAuth2 credential
**To:** `{{ $json.toEmail }}`
**Subject:** `{{ $json.subject }}`
**Email Type:** HTML
**Message:** `{{ $json.emailBody }}`
**Output:** Sends the email and passes the original item data (including the row's internal Google Sheets row number) downstream.
**Why this matters:** Using HTML mode renders the bullet list and bold text correctly. Plain text would collapse the formatting into an unreadable block.

---

### 6. Google Sheets — Update Status to "Onboarded"

**Node type:** Google Sheets
**Operation:** `Update Row`
**Credential:** Select your Google Sheets OAuth2 credential
**Spreadsheet ID:** Same spreadsheet ID as Step 2
**Sheet Name:** `Sheet1`
**Matching Column:** `Personal Email` (used to identify the exact row to update)
**Fields to Update:**
- Column: `Status` → Value: `Onboarded`

**Output:** Writes "Onboarded" into the Status column of the row that was just emailed, so the next poll cycle skips it.
**Why this matters:** This is the only step that prevents duplicate emails. If you skip this update or the node fails silently, every poll will re-send the welcome email to the same person. Confirm this node shows a green success tick in your first test run before going live.

---

## Full workflow JSON

```json
{
  "name": "HR Onboarding Email — Google Sheets to Gmail",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "minutes",
              "minutesInterval": 15
            }
          ]
        }
      },
      "id": "a1b2c3d4-0001-0001-0001-000000000001",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "getRows",
        "documentId": {
          "__rl": true,
          "value": "YOUR_SPREADSHEET_ID_HERE",
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
              "lookupColumn": "Status",
              "lookupValue": "",
              "condition": "eq"
            }
          ]
        },
        "options": {}
      },
      "id": "a1b2c3d4-0002-0002-0002-000000000002",
      "name": "Get New Hire Rows",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.4,
      "position": [460, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "REPLACE_WITH_YOUR_GOOGLE_SHEETS_CREDENTIAL_ID",
          "name": "Google Sheets OAuth2"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json[\"First Name\"] }}",
              "operation": "isNotEmpty"
            }
          ]
        }
      },
      "id": "a1b2c3d4-0003-0003-0003-000000000003",
      "name": "Has New Hire Data",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const firstName = $json[\"First Name\"];\nconst lastName = $json[\"Last Name\"];\nconst startDate = $json[\"Start Date\"];\nconst jobTitle = $json[\"Job Title\"];\nconst department = $json[\"Department\"];\n\nconst emailBody = `\n<p>Hi ${firstName},</p>\n\n<p>Welcome to the team! We are thrilled to have you joining us as <strong>${jobTitle}</strong> in the <strong>${department}</strong> department.</p>\n\n<p>Your first day is <strong>${startDate}</strong>. Here is what to expect:</p>\n\n<ul>\n  <li>Arrive at 9:00 AM and ask for reception to page your HR contact</li>\n  <li>You will receive your laptop and access credentials on day one</li>\n  <li>Your manager will reach out separately to share your first-week schedule</li>\n</ul>\n\n<p>If you have any questions before your start date, reply directly to this email and our HR team will respond within one business day.</p>\n\n<p>We look forward to seeing you on ${startDate}!</p>\n\n<p>Warm regards,<br>HR Team</p>\n`;\n\nreturn {\n  json: {\n    ...$json,\n    emailBody,\n    toEmail: $json[\"Personal Email\"],\n    subject: `Welcome to the team, ${firstName}! Your start date is ${startDate}`\n  }\n};"
      },
      "id": "a1