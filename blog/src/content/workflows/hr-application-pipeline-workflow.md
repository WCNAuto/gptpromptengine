---
title: "n8n Workflow for Tracking Job Application Pipeline in 2026"
description: "Automate your job application pipeline tracking in n8n. Sync candidate stages from Google Sheets to Slack in real time. Built for HR Managers."
profession: "HR Managers"
category: "Recruitment"
contentType: workflow
tags: ["n8n workflow for tracking job application pipeline", "n8n recruitment automation", "applicant tracking n8n", "candidate pipeline workflow", "HR automation n8n Google Sheets"]
pubDate: 2026-07-06
featured: false
---

This workflow monitors a Google Sheets applicant tracker for stage changes — Applied, Phone Screen, Interview, Offer, Hired, Rejected — and automatically posts a formatted Slack message to your recruiting channel and sends a status email to the candidate when their stage advances. It replaces 30 minutes of manual copy-paste and Slack updates every morning before your recruiting stand-up.

## Why this automation matters

Most HR teams track candidates in a shared Google Sheet and then manually post updates to Slack so hiring managers know who moved forward overnight. When that update is forgotten — which happens every third day — a hiring manager walks into an interview without knowing the candidate was already rejected, or a recruiter follows up with someone who already received an offer. This workflow fires the moment a stage column is updated, so the Slack channel and candidate inbox are never more than seconds behind the sheet.

## What you need before starting

- **Google Sheets OAuth2 credential** connected to the Google account that owns your applicant tracking sheet. The sheet must have these exact column headers in row 1: `Candidate Name`, `Email`, `Role`, `Stage`, `Last Updated`.
- **Slack OAuth2 credential** with `chat:write` scope, connected to the workspace where your recruiting channel lives. You need the channel ID (e.g. `C08XXXXXXXX`), not just the channel name.
- **Gmail OAuth2 credential** (or SMTP credential) connected to the email address candidates see as the sender — typically your `recruiting@yourcompany.com` address.
- **n8n instance** running version 1.40 or later, either self-hosted or on n8n Cloud. The Google Sheets Trigger node used here requires the Sheets API v4 polling method available from that version.
- **Google Sheets API enabled** in your Google Cloud Console project that the OAuth2 credential belongs to.
- A Google Sheet named **Applicant Tracker** with a tab named **Pipeline**. The `Stage` column must use one of these exact values: `Applied`, `Phone Screen`, `Interview`, `Offer`, `Hired`, `Rejected`.

---

## How to build it: step by step

### 1. Google Sheets Trigger — Poll the Pipeline tab for row changes

**Node type:** Google Sheets Trigger
**Credential:** Your Google Sheets OAuth2 credential
**Field: Trigger On** → set to `Row Updated`
**Field: Document** → select your **Applicant Tracker** spreadsheet
**Field: Sheet** → select **Pipeline**
**Field: Poll Times → Every** → set to `1 Minute`
**Field: Columns to Watch** → set to `Stage`

**Output:** Every time a value in the `Stage` column changes, this node emits one item containing all columns for that row: `Candidate Name`, `Email`, `Role`, `Stage`, `Last Updated`, and the row number.

**Why this configuration matters:** Watching only the `Stage` column means the workflow does not fire when a recruiter corrects a typo in a name or updates a phone number. It fires exactly when a candidate moves through the funnel — nothing else.

---

### 2. IF — Filter out rows where Stage is blank or unchanged

**Node type:** IF
**Condition 1:**
- **Field:** `{{ $json["Stage"] }}`
- **Operation:** `is not empty`

**Condition 2:**
- **Field:** `{{ $json["Stage"] }}`
- **Operation:** `is not equal to` `undefined`

**Logic:** AND

**Output (True branch):** Items where `Stage` has a real value pass forward.
**Output (False branch):** Items are discarded silently.

**Why this configuration matters:** Google Sheets Trigger occasionally emits a row when a collaborator opens the sheet without editing. This filter kills those ghost triggers before they spam your Slack channel or send a blank email to a candidate.

---

### 3. Switch — Route by Stage value

**Node type:** Switch
**Field: Value to Match** → `{{ $json["Stage"] }}`

Configure five output routes:

| Route name | Condition |
|---|---|
| `Phone Screen` | equals `Phone Screen` |
| `Interview` | equals `Interview` |
| `Offer` | equals `Offer` |
| `Hired` | equals `Hired` |
| `Rejected` | equals `Rejected` |

**Default output:** Leave unconfigured (items with stage `Applied` or any unexpected value fall through and are discarded — Applied is the starting state and needs no notification).

**Output:** Each candidate item exits through exactly one named output branch.

**Why this configuration matters:** Different stages need different Slack messages and different candidate emails. Splitting here lets you write stage-specific copy instead of one generic message that reads like an automated form letter.

---

### 4. Set — Build the notification payload (one per Switch branch)

You need **five Set nodes**, one wired to each Switch output. Each Set node constructs the variables used by the Slack and Gmail nodes downstream. The configuration is identical across all five — only the message text differs. Below is the full configuration for the **Interview** branch; replicate it for the others, changing the values in bold.

**Node type:** Set
**Mode:** Manual Mapping

| Field name | Value |
|---|---|
| `slackMessage` | `:calendar: *{{ $json["Candidate Name"] }}* has moved to **Interview** for *{{ $json["Role"] }}*. Update the scorecard before their session.` |
| `emailSubject` | `Your application update — {{ $json["Role"] }} at [Your Company]` |
| `emailBody` | `Hi {{ $json["Candidate Name"] }},\n\nGreat news — you've been selected for an interview for the {{ $json["Role"] }} role. Our team will be in touch within one business day to confirm the time.\n\nBest,\nThe Recruiting Team` |
| `candidateEmail` | `{{ $json["Email"] }}` |
| `candidateName` | `{{ $json["Candidate Name"] }}` |
| `role` | `{{ $json["Role"] }}` |
| `stage` | `{{ $json["Stage"] }}` |

**Slack message text for each branch:**

- **Phone Screen:** `:telephone_receiver: *{{ $json["Candidate Name"] }}* is ready for a Phone Screen — *{{ $json["Role"] }}*. Assign a screener.`
- **Offer:** `:envelope: Offer stage reached — *{{ $json["Candidate Name"] }}* for *{{ $json["Role"] }}*. Confirm comp package before sending.`
- **Hired:** `:tada: *{{ $json["Candidate Name"] }}* accepted the offer for *{{ $json["Role"] }}*. Trigger onboarding checklist.`
- **Rejected:** `:x: *{{ $json["Candidate Name"] }}* — *{{ $json["Role"] }}* marked Rejected. Candidate decline email queued.`

**Output:** Each item now carries `slackMessage`, `emailSubject`, `emailBody`, `candidateEmail`, and supporting fields ready for the downstream nodes.

---

### 5. Slack — Post stage update to recruiting channel

**Node type:** Slack
**Credential:** Your Slack OAuth2 credential
**Field: Resource** → `Message`
**Field: Operation** → `Send`
**Field: Channel** → paste your channel ID, e.g. `C08XXXXXXXX`
**Field: Text** → `{{ $json["slackMessage"] }}`
**Field: Unfurl Links** → `false`

**Output:** Slack returns a `ts` (timestamp) confirming the message was posted. The item passes forward with this added to the JSON.

**Why this configuration matters:** Using the channel ID instead of the channel name means the workflow survives channel renames. If someone renames `#recruiting` to `#talent-acquisition` next quarter, this node keeps working.

---

### 6. Gmail — Send stage notification email to candidate

**Node type:** Gmail
**Credential:** Your Gmail OAuth2 credential
**Field: Resource** → `Message`
**Field: Operation** → `Send`
**Field: To** → `{{ $json["candidateEmail"] }}`
**Field: Subject** → `{{ $json["emailSubject"] }}`
**Field: Message** → `{{ $json["emailBody"] }}`
**Field: Email Type** → `Text`

**Output:** Gmail returns the sent message ID. The item continues to the final logging node.

**Why this configuration matters:** Setting Email Type to `Text` prevents n8n from wrapping your carefully written message in a default HTML template that strips your line breaks and makes the email look broken on mobile.

---

### 7. Google Sheets — Log the notification timestamp

**Node type:** Google Sheets
**Credential:** Your Google Sheets OAuth2 credential
**Field: Resource** → `Sheet Within Document`
**Field: Operation** → `Update Row`
**Field: Document** → **Applicant Tracker**
**Field: Sheet** → **Pipeline**
**Field: Mapping Column** → `Email` (this is the unique key that identifies which row to update)
**Field: Fields to Update:**
- `Last Updated` → `{{ $now.toISO() }}`

**Output:** The `Last Updated` cell for that candidate row is stamped with the exact time the notification fired.

**Why this configuration matters:** Without this write-back, the trigger node can re-fire on the same stage change the next polling cycle if the sheet metadata hasn't refreshed. Writing `Last Updated` gives you an audit trail and a reliable way to query "which candidates were updated today" without opening Slack history.

---

## Full workflow JSON

```json
{
  "name": "Job Application Pipeline Tracker",
  "nodes": [
    {
      "parameters": {
        "pollTimes": {
          "item": [
            {
              "mode": "everyMinute"
            }
          ]
        },
        "documentId": {
          "__rl": true,
          "value": "YOUR_GOOGLE_SHEET_ID",
          "mode": "id"
        },
        "sheetName": {
          "__rl": true,
          "value": "Pipeline",
          "mode": "name"
        },
        "triggerOn": "rowUpdate",
        "columnsToWatch": ["Stage"]
      },
      "id": "a1b2c3d4-0001-0001-0001-000000000001",
      "name": "Google Sheets Trigger",
      "type": "n8n-nodes-base.googleSheetsTrigger",
      "typeVersion": 1,
      "position": [240, 300],
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
              "value1": "={{ $json[\"Stage\"] }}",
              "operation": "isNotEmpty"
            },
            {
              "value1": "={{ $json[\"Stage\"] }}",
              "operation": "notEqual",
              "value2": "undefined"
            }
          ]
        },
        "combineOperation": "all"
      },
      "id": "a1b2c3d4-0002-0002-0002-000000000002",
      "name": "IF Stage Is Valid",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "dataType": "string",
        "value1": "={{ $json[\"Stage\"] }}",
        "rules": {
          "rules": [
            {
              "value2": "Phone Screen",
              "outputKey": "Phone Screen"
            },
            {
              "value2": "Interview",
              "