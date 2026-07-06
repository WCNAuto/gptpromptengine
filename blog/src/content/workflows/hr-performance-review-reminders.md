---
title: "n8n Workflow for Automating Performance Review Reminders in 2026"
description: "Automate performance review reminders with n8n. Send personalised Slack and email alerts to managers and employees before deadlines. Save 45 min weekly."
profession: "HR Managers"
category: "Performance"
contentType: workflow
tags: ["n8n workflow for automating performance review reminders", "automated performance review notifications", "HR reminder automation n8n", "performance cycle email automation", "n8n Google Sheets HR workflow"]
pubDate: 2026-07-06
featured: false
---

This workflow reads a Google Sheet containing employee review due dates, calculates how many days remain until each deadline, and automatically sends a personalised reminder email via Gmail and a Slack message to the employee's manager — 14 days before and again 3 days before the review is due. It replaces a manual Monday-morning calendar check and copy-paste email routine that typically takes 45 minutes per week across a team of 30+ employees.

## Why this automation matters

Without this workflow, HR Managers must manually scan a spreadsheet, identify upcoming review deadlines, open Gmail, personalise each message with the employee name and manager, send it, then repeat the process in Slack. One missed lookup means a manager walks into a review cycle unprepared, or an employee submits a self-assessment after the window closes. The two-stage reminder cadence (14 days and 3 days out) mirrors what most HR teams already do manually — this workflow just executes it without human intervention every Monday at 8 AM.

## What you need before starting

- **Google Sheets OAuth2 credential** connected to the Google account that owns the performance review tracker sheet.
- **Gmail OAuth2 credential** connected to the HR team inbox that sends review reminders (e.g. hr@yourcompany.com).
- **Slack API credential** (Bot Token with `chat:write` scope) for the Slack workspace where manager channels or DMs exist.
- **A Google Sheet** named `Performance Review Tracker` with the following exact column headers in row 1: `Employee Name`, `Employee Email`, `Manager Name`, `Manager Email`, `Manager Slack ID`, `Review Due Date` (formatted as YYYY-MM-DD), `Status` (values: `Pending`, `Complete`).
- **n8n instance** running on n8n Cloud (https://n8n.io/) or self-hosted v1.40 or later.
- The **Date & Time** and **IF** nodes are built into n8n — no additional installation required.

## How to build it: step by step

### 1. Schedule Trigger — Run every Monday at 8 AM

**Node type:** Schedule Trigger
**Field:** Trigger Interval → set to `Weeks`
**Field:** Week Interval → `1`
**Field:** Trigger on Weekdays → `Monday`
**Field:** Trigger at Hour → `8`
**Field:** Trigger at Minute → `0`
**Output:** Fires once every Monday at 08:00 and passes a single empty item to the next node.
**Why this matters:** Running once weekly is sufficient because review due dates rarely change day-to-day. Running it daily would flood managers with repeated messages.

---

### 2. Google Sheets — Read all pending review rows

**Node type:** Google Sheets
**Operation:** `Read Rows`
**Credential:** Select your Google Sheets OAuth2 credential
**Spreadsheet:** `Performance Review Tracker` (select from the dropdown after authentication)
**Sheet:** `Sheet1`
**Filter Rows:** Enable → Column: `Status` | Condition: `equals` | Value: `Pending`
**Output:** One item per row where Status is `Pending`. Each item contains the fields: `Employee Name`, `Employee Email`, `Manager Name`, `Manager Email`, `Manager Slack ID`, `Review Due Date`.
**Why this matters:** Filtering out `Complete` rows here prevents the workflow from sending reminders for reviews that are already done. If you skip this filter, managers receive reminders after they have already submitted the review.

---

### 3. Code — Calculate days until review due date

**Node type:** Code
**Language:** JavaScript
**Code to paste:**

```javascript
const items = $input.all();
const today = new Date();
today.setHours(0, 0, 0, 0);

return items.map(item => {
  const dueDate = new Date(item.json['Review Due Date']);
  dueDate.setHours(0, 0, 0, 0);
  const diffMs = dueDate - today;
  const daysUntilDue = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return {
    json: {
      ...item.json,
      daysUntilDue
    }
  };
});
```

**Output:** All input items with a new `daysUntilDue` integer field appended. A value of `14` means the review is due in exactly 14 days. Negative values mean the deadline has passed.
**Why this matters:** n8n has no native "date difference" node. This calculation is the only way to accurately filter who needs a reminder today versus who does not.

---

### 4. IF — Filter for 14-day or 3-day reminders only

**Node type:** IF
**Condition 1:** `{{ $json.daysUntilDue }}` `equals` `14`
**Combine with:** `OR`
**Condition 2:** `{{ $json.daysUntilDue }}` `equals` `3`
**Output (true branch):** Items where the review is due in exactly 14 or 3 days. These pass forward to the email and Slack nodes.
**Output (false branch):** All other items. Connect the false branch to a **No Operation** node to terminate cleanly.
**Why this matters:** Without this filter, every `Pending` row sends a reminder every Monday regardless of timing. The OR condition is what creates the two-stage cadence.

---

### 5. Gmail — Send reminder email to employee

**Node type:** Gmail
**Credential:** Select your Gmail OAuth2 credential
**Operation:** `Send`
**To:** `{{ $json['Employee Email'] }}`
**Subject:** `Reminder: Your performance review is due in {{ $json.daysUntilDue }} days`
**Email Type:** `HTML`
**Body:**

```html
<p>Hi {{ $json['Employee Name'] }},</p>
<p>This is a reminder that your performance self-assessment is due on <strong>{{ $json['Review Due Date'] }}</strong> — that's {{ $json.daysUntilDue }} days from today.</p>
<p>Please log in to complete your self-assessment before the deadline. If you have questions, contact the HR team at hr@yourcompany.com.</p>
<p>Thank you,<br>HR Team</p>
```

**Output:** One email sent per item. The node outputs the original item with a `messageId` field added confirming delivery.
**Why this matters:** Using `{{ $json['Employee Name'] }}` in the body personalises each email without any manual copy-paste. Every employee in the filtered batch receives a unique message in a single execution.

---

### 6. Gmail — Send reminder email to manager

**Node type:** Gmail (add a second Gmail node after node 5)
**Credential:** Select your Gmail OAuth2 credential
**Operation:** `Send`
**To:** `{{ $json['Manager Email'] }}`
**Subject:** `Action required: {{ $json['Employee Name'] }}'s review is due in {{ $json.daysUntilDue }} days`
**Email Type:** `HTML`
**Body:**

```html
<p>Hi {{ $json['Manager Name'] }},</p>
<p>This is a heads-up that <strong>{{ $json['Employee Name'] }}</strong>'s performance review is due on <strong>{{ $json['Review Due Date'] }}</strong>.</p>
<p>Please ensure you have scheduled the review meeting and completed your manager assessment before the deadline. Contact hr@yourcompany.com with any questions.</p>
<p>HR Team</p>
```

**Output:** One email per item sent to the manager's address. Passes items forward unchanged.
**Why this matters:** Managers and employees get separate emails because the calls to action are different — employees complete a self-assessment, managers complete a review and schedule a meeting.

---

### 7. Slack — Send DM to manager

**Node type:** Slack
**Credential:** Select your Slack API (Bot Token) credential
**Resource:** `Message`
**Operation:** `Post`
**Send Message To:** `User`
**User:** `{{ $json['Manager Slack ID'] }}`
**Text:**
```
:calendar: *Performance Review Reminder*
Hi {{ $json['Manager Name'] }}, {{ $json['Employee Name'] }}'s review is due in *{{ $json.daysUntilDue }} days* ({{ $json['Review Due Date'] }}). Please complete your manager assessment and confirm the meeting is booked.
```
**Output:** One Slack DM per item sent to the manager's Slack user ID. Node outputs the original item plus a Slack `ts` (message timestamp) confirming delivery.
**Why this matters:** Many managers respond faster to a Slack DM than email. The `Manager Slack ID` field in your sheet must be the Slack member ID (format: `U0123ABCDE`), not the display name, or the message will fail to deliver.

---

### 8. No Operation — Terminate false branch

**Node type:** No Operation, do nothing
**Configuration:** None required.
**Connect to:** False output of node 4 (IF node).
**Why this matters:** Connecting the false branch prevents n8n from flagging the workflow as having unconnected outputs, which can cause misleading error alerts in some n8n versions.

---

## Full workflow JSON

```json
{
  "name": "Performance Review Reminders",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "weeks",
              "weeksInterval": 1,
              "triggerAtDay": [1],
              "triggerAtHour": 8,
              "triggerAtMinute": 0
            }
          ]
        }
      },
      "id": "a1b2c3d4-0001-0001-0001-000000000001",
      "name": "Every Monday 8AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [260, 300]
    },
    {
      "parameters": {
        "operation": "readRows",
        "documentId": {
          "__rl": true,
          "value": "YOUR_GOOGLE_SHEET_ID",
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
              "lookupValue": "Pending"
            }
          ]
        },
        "options": {}
      },
      "id": "a1b2c3d4-0002-0002-0002-000000000002",
      "name": "Read Pending Reviews",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.2,
      "position": [480, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "REPLACE_WITH_YOUR_GOOGLE_SHEETS_CREDENTIAL_ID",
          "name": "Google Sheets account"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const items = $input.all();\nconst today = new Date();\ntoday.setHours(0, 0, 0, 0);\n\nreturn items.map(item => {\n  const dueDate = new Date(item.json['Review Due Date']);\n  dueDate.setHours(0, 0, 0, 0);\n  const diffMs = dueDate - today;\n  const daysUntilDue = Math.round(diffMs / (1000 *