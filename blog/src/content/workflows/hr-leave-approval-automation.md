---
title: "n8n Automation for Leave Request Approvals: Full Workflow Guide 2026"
description: "Automate leave request approvals in n8n 2026. Connect Google Forms, Sheets, Gmail & Slack to route, approve and log requests without manual chasing."
profession: "HR Managers"
category: "Operations"
contentType: workflow
tags: ["n8n automation for leave request approvals", "leave request workflow automation", "HR approval automation n8n", "employee leave management n8n", "automated leave approval email n8n"]
pubDate: 2026-07-06
featured: false
---

This workflow automates the full leave request approval cycle: an employee submits a Google Form, their manager receives a Slack message with approve/deny buttons, the decision is logged back to a Google Sheet, and the employee receives a confirmation email via Gmail — all without HR touching a single message. A process that typically consumes 25–40 minutes of HR time per request, across chasing managers and updating trackers, drops to zero manual effort.

## Why this automation matters

Without automation, leave requests land in a shared inbox, get forwarded to a line manager, and then HR has to follow up when no reply comes, manually update the leave tracker, and send the employee a final answer. The real cost is not the admin time — it is the requests that fall through: a manager replies on Slack instead of email, the tracker never gets updated, and payroll processes the month with wrong leave balances. This workflow creates a single, auditable chain: every request goes through one path, every decision is recorded in one place, and the employee always gets a reply.

## What you need before starting

- **n8n instance** running version 1.40 or later (self-hosted or n8n Cloud at https://n8n.io/)
- **Google Forms OAuth2 credential** connected to the Google account that owns the leave request form
- **Google Sheets OAuth2 credential** connected to the account that owns the Leave Tracker sheet (can be the same credential as above)
- **Gmail OAuth2 credential** connected to the HR email account that will send approval/denial emails to employees
- **Slack credential (OAuth2)** with `chat:write`, `chat:write.public`, and `channels:read` scopes, connected to the Slack workspace where managers operate
- **A Google Form** with these exact fields: Employee Name (Short answer), Employee Email (Short answer), Manager Email (Short answer), Leave Start Date (Date), Leave End Date (Date), Leave Type (Multiple choice: Annual / Sick / Unpaid), Reason (Paragraph)
- **A Google Sheet** named `Leave Tracker` with a sheet tab called `Requests`, with these column headers in row 1: `Timestamp`, `Employee Name`, `Employee Email`, `Manager Email`, `Leave Start Date`, `Leave End Date`, `Leave Type`, `Reason`, `Status`, `Decision Timestamp`
- **A Slack channel** where managers can receive approval requests (e.g. `#leave-approvals`); the Slack bot must be invited to this channel
- **A webhook-accessible n8n instance** — the Slack interactive message callback requires a publicly reachable URL; n8n Cloud handles this automatically; self-hosted users must expose the webhook port

## How to build it: step by step

### 1. Google Sheets Trigger — Poll for new leave request rows

**Node type:** Google Sheets Trigger
**Trigger Event:** Row Added
**Document:** Select your Google Sheets file (the one containing the `Leave Tracker` spreadsheet)
**Sheet:** Requests
**Poll Time:** Every 5 minutes

This node polls the `Requests` sheet every 5 minutes for newly added rows. It outputs each new row as a separate item with fields mapped to your column headers. The reason to use Google Sheets Trigger (rather than a Google Forms trigger) is that it gives you a single source of truth — the sheet — and means you can also add rows manually without breaking the workflow.

> **How rows get into the sheet:** Link your Google Form responses to the `Requests` sheet using Google Forms' built-in "Link to Sheets" feature (Responses tab → Link to Sheets). Google Forms will auto-populate columns A–H. Columns I (`Status`) and J (`Decision Timestamp`) are written by this workflow.

---

### 2. Set node — Normalise and prepare variables

**Node type:** Edit Fields (Set)
**Mode:** Manual Mapping

Add the following fields:

| Field name | Value (expression) |
|---|---|
| `employeeName` | `{{ $json["Employee Name"] }}` |
| `employeeEmail` | `{{ $json["Employee Email"] }}` |
| `managerEmail` | `{{ $json["Manager Email"] }}` |
| `leaveStart` | `{{ $json["Leave Start Date"] }}` |
| `leaveEnd` | `{{ $json["Leave End Date"] }}` |
| `leaveType` | `{{ $json["Leave Type"] }}` |
| `reason` | `{{ $json["Reason"] }}` |
| `rowNumber` | `{{ $json["row_number"] }}` |
| `sheetId` | `your-google-sheet-id-here` |

**What it outputs:** A clean item with predictable field names used by every downstream node. The `row_number` field is automatically included by the Google Sheets Trigger and is needed to update the correct row later.

---

### 3. Google Sheets — Write "Pending" status to the request row

**Node type:** Google Sheets
**Operation:** Update Row
**Document:** Your Leave Tracker spreadsheet
**Sheet:** Requests
**Row Number:** `{{ $json.rowNumber }}`
**Column to update:** `Status` → value: `Pending`

This writes `Pending` to column I of the new row immediately, so if HR opens the sheet before the manager responds, they can see the request is in-flight rather than unprocessed.

---

### 4. Slack — Send approval request to manager

**Node type:** Slack
**Operation:** Send a Message
**Channel:** `#leave-approvals`
**Message Type:** Blocks (for interactive buttons)

Set the **Blocks** field to the following JSON (paste into the Blocks field):

```json
[
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "*New Leave Request*\n*Employee:* {{ $json.employeeName }}\n*Type:* {{ $json.leaveType }}\n*From:* {{ $json.leaveStart }} *To:* {{ $json.leaveEnd }}\n*Reason:* {{ $json.reason }}\n*Row Number:* {{ $json.rowNumber }}"
    }
  },
  {
    "type": "actions",
    "elements": [
      {
        "type": "button",
        "text": { "type": "plain_text", "text": "Approve" },
        "style": "primary",
        "value": "{{ $json.rowNumber }}|{{ $json.employeeEmail }}|{{ $json.employeeName }}|{{ $json.leaveStart }}|{{ $json.leaveEnd }}|{{ $json.leaveType }}|approve",
        "action_id": "leave_approve"
      },
      {
        "type": "button",
        "text": { "type": "plain_text", "text": "Deny" },
        "style": "danger",
        "value": "{{ $json.rowNumber }}|{{ $json.employeeEmail }}|{{ $json.employeeName }}|{{ $json.leaveStart }}|{{ $json.leaveEnd }}|{{ $json.leaveType }}|deny",
        "action_id": "leave_deny"
      }
    ]
  }
]
```

**What it outputs:** A Slack message with two interactive buttons. The `value` field on each button encodes all the data needed downstream, so when a manager clicks Approve or Deny, the webhook that receives the callback has everything it needs without a second database lookup. The row number is embedded so the correct sheet row can be updated.

---

### 5. Webhook — Receive Slack interactive button callback

**Node type:** Webhook
**HTTP Method:** POST
**Path:** `leave-approval-callback`
**Authentication:** None (Slack sends a signed payload; signature verification is handled in the next node)
**Response Mode:** Respond Immediately (return a 200 so Slack does not show an error to the manager)

In your Slack app's **Interactivity & Shortcuts** settings (at https://api.slack.com/apps), set the **Request URL** to:
`https://your-n8n-instance.com/webhook/leave-approval-callback`

**What it outputs:** The raw Slack payload as a string in `$json.body.payload`. Slack sends interactive message data as a URL-encoded form field called `payload` containing a JSON string.

---

### 6. Code node — Parse Slack payload and extract decision

**Node type:** Code
**Language:** JavaScript

```javascript
const raw = $input.item.json.body.payload;
const payload = JSON.parse(decodeURIComponent(raw));

const action = payload.actions[0];
const actionId = action.action_id; // "leave_approve" or "leave_deny"
const valueParts = action.value.split("|");

const rowNumber = parseInt(valueParts[0]);
const employeeEmail = valueParts[1];
const employeeName = valueParts[2];
const leaveStart = valueParts[3];
const leaveEnd = valueParts[4];
const leaveType = valueParts[5];
const decision = valueParts[6]; // "approve" or "deny"

const managerName = payload.user.name;
const decisionTimestamp = new Date().toISOString();

return [{
  json: {
    rowNumber,
    employeeEmail,
    employeeName,
    leaveStart,
    leaveEnd,
    leaveType,
    decision,
    managerName,
    decisionTimestamp,
    status: decision === "approve" ? "Approved" : "Denied"
  }
}];
```

**What it outputs:** A clean item with `decision` (`approve` or `deny`), the row number to update, the employee's email for the confirmation, and all leave details for the email body.

---

### 7. IF node — Branch on approve vs deny

**Node type:** IF
**Condition:** String
**Value 1:** `{{ $json.decision }}`
**Operation:** equals
**Value 2:** `approve`

**True branch** → nodes 8 and 9 (approve path)
**False branch** → nodes 10 and 11 (deny path)

This splits the workflow into two paths so the approval email and denial email have different subject lines and body copy.

---

### 8a. Google Sheets (Approve path) — Update row status to Approved

**Node type:** Google Sheets
**Operation:** Update Row
**Document:** Leave Tracker
**Sheet:** Requests
**Row Number:** `{{ $json.rowNumber }}`
**Columns to update:**
- `Status` → `Approved`
- `Decision Timestamp` → `{{ $json.decisionTimestamp }}`

---

### 8b. Gmail (Approve path) — Send approval email to employee

**Node type:** Gmail
**Operation:** Send Email
**To:** `{{ $json.employeeEmail }}`
**Subject:** `Your {{ $json.leaveType }} leave request has been approved`
**Email Type:** HTML
**Message:**

```html
<p>Hi {{ $json.employeeName }},</p>
<p>Your leave request has been <strong>approved</strong>.</p>
<ul>
  <li><strong>Type:</strong> {{ $json.leaveType }}</li>
  <li><strong>From:</strong> {{ $json.leaveStart }}</li>
  <li><strong>To:</strong> {{ $json.leaveEnd }}</li>
</ul>
<p>Please ensure your handover notes are up to date before your leave starts. Contact HR if you need to make changes.</p>
<p>HR Team</p>
```

---

### 9a. Google Sheets (Deny path) — Update row status to Denied

**Node type:** Google Sheets
**Operation:** Update Row
**Document:** Leave Tracker
**Sheet:** Requests
**Row Number:** `{{ $json.rowNumber }}`
**Columns to update:**
- `Status` → `Denied`
- `Decision