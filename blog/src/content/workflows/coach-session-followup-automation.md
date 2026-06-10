---
title: "n8n Workflow for Coach Client Session Follow Up Email with Session Notes 2026"
description: "Complete n8n workflow that automatically sends personalized follow-up emails with session notes and action items within 24 hours of coaching sessions."
profession: "Coaches"
category: "Follow Up"
contentType: workflow
tags: ["n8n workflow for coach client session follow up email", "coaching session follow up automation", "client session notes email", "automated coaching follow up", "session summary email workflow"]
pubDate: 2026-06-10
featured: false
---

This workflow automatically sends personalized follow-up emails to coaching clients within 24 hours of completing a session, pulling session notes from Google Sheets and delivering them via Gmail with action items and next steps. It eliminates the manual task of writing and sending 15-20 follow-up emails every week, saving 2-3 hours of administrative work.

## Why this automation matters

Without automated follow-up, session insights get delayed by days or forgotten entirely while you handle back-to-back client calls. Clients lose momentum on action items when they don't receive their session summary within 24 hours. This workflow ensures every client gets their personalized follow-up email with notes, action items, and next session details immediately after you mark their session as complete in your tracking sheet.

## What you need before starting

- Google Sheets OAuth2 credential connected to your client session tracking spreadsheet
- Gmail OAuth2 credential for the email account that sends client communications
- Google Sheets spreadsheet with columns: Client Name, Email, Session Date, Session Status, Session Notes, Action Items, Next Session Date
- Cron expression knowledge (basic scheduling format)

## How to build it: step by step

### 1. Schedule Trigger — Check for completed sessions daily

Node type: Schedule Trigger
Trigger Rules: Cron Expression
Cron Expression: `0 9 * * *`
Output: Fires at 9 AM daily to check for sessions marked complete in the last 24 hours.
Why this matters: Daily checks ensure no completed sessions get missed while avoiding excessive API calls to Google Sheets.

### 2. Google Sheets — Read completed session rows

Node type: Google Sheets
Operation: Read
Document: Your client session tracking sheet
Sheet: Sheet1
Read: All Data
Output: Returns all rows from the spreadsheet as individual items.
Why this matters: Pulling all data lets the workflow filter for recently completed sessions in the next step.

### 3. Filter — Only process sessions completed yesterday

Node type: Filter
Conditions: Session Status equals "Complete" AND Session Date equals "{{ $now.minus({days: 1}).toFormat('yyyy-MM-dd') }}"
Output: Only sessions marked complete with yesterday's date pass through to email generation.
Why this matters: Prevents sending duplicate follow-ups for old sessions while catching all sessions from the previous day.

### 4. Gmail — Send personalized follow-up email

Node type: Gmail
Operation: Send Email
To: `{{ $json.Email }}`
Subject: `Follow-up from our {{ $json["Session Date"] }} coaching session`
Email Type: HTML
Message: 
```
Hi {{ $json["Client Name"] }},

Thank you for our productive coaching session yesterday. Here's a summary of what we covered and your action items:

<h3>Session Summary</h3>
{{ $json["Session Notes"] }}

<h3>Your Action Items</h3>
{{ $json["Action Items"] }}

<h3>Next Session</h3>
I'm looking forward to our next session on {{ $json["Next Session Date"] }}. We'll review your progress on these action items and continue building momentum.

Feel free to reach out if you have questions before then.

Best regards,
[Your Name]
```
Output: Sends one personalized email per completed session with dynamic content pulled from the spreadsheet.
Why this matters: Personalized emails with actual session content are more valuable than generic follow-ups and reinforce the client's investment in the coaching process.

## Full workflow JSON

```json
{
  "name": "Coach Client Session Follow Up Email",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "triggerAtHour": 9
            }
          ]
        }
      },
      "id": "schedule-trigger-node",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [
        240,
        300
      ]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "// Replace with your Google Sheets document ID",
        "sheetName": "Sheet1",
        "range": "A:G",
        "options": {
          "useFirstRowAsHeaders": true
        }
      },
      "id": "google-sheets-node",
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.2,
      "position": [
        460,
        300
      ],
      "credentials": {
        "googleSheetsOAuth2Api": "// Replace with your Google Sheets credential ID"
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
              "leftValue": "={{ $json['Session Status'] }}",
              "rightValue": "Complete",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            },
            {
              "leftValue": "={{ $json['Session Date'] }}",
              "rightValue": "={{ $now.minus({days: 1}).toFormat('yyyy-MM-dd') }}",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "filter-node",
      "name": "Filter",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2,
      "position": [
        680,
        300
      ]
    },
    {
      "parameters": {
        "operation": "send",
        "message": {
          "to": "={{ $json.Email }}",
          "subject": "=Follow-up from our {{ $json['Session Date'] }} coaching session",
          "emailType": "html",
          "message": "Hi {{ $json['Client Name'] }},\n\nThank you for our productive coaching session yesterday. Here's a summary of what we covered and your action items:\n\n<h3>Session Summary</h3>\n{{ $json['Session Notes'] }}\n\n<h3>Your Action Items</h3>\n{{ $json['Action Items'] }}\n\n<h3>Next Session</h3>\nI'm looking forward to our next session on {{ $json['Next Session Date'] }}. We'll review your progress on these action items and continue building momentum.\n\nFeel free to reach out if you have questions before then.\n\nBest regards,\n[Your Name]"
        },
        "options": {}
      },
      "id": "gmail-node",
      "name": "Gmail",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        900,
        300
      ],
      "credentials": {
        "gmailOAuth2": "// Replace with your Gmail credential ID"
      }
    }
  ],
  "pinData": {},
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Google Sheets",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets": {
      "main": [
        [
          {
            "node": "Filter",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter": {
      "main": [
        [
          {
            "node": "Gmail",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "workflow-version-id",
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "n8n-instance-id"
  },
  "id": "workflow-id",
  "tags": []
}
```

## Frequently Asked Questions

### What happens if I have multiple sessions with the same client on the same day?
The workflow will send one follow-up email per row marked complete, so multiple sessions will generate multiple emails. To avoid this, either combine session notes into one row per client per day, or modify the Filter node to group by client email address first.

### Can I customize the email template for different coaching programs or client types?
Yes, add a "Program Type" column to your spreadsheet and modify the Gmail node's message parameter to use conditional expressions like `{{ $json['Program Type'] === 'Executive' ? 'executive template' : 'standard template' }}` to switch between email formats.

### What if a client's session runs late and I mark it complete the same day instead of the next morning?
Change the Schedule Trigger to run multiple times per day (like every 4 hours with `0 */4 * * *`) and adjust the Filter condition to check for sessions completed in the last 4 hours instead of exactly yesterday.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.