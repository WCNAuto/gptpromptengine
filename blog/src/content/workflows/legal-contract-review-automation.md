---
title: "N8N Workflow for Contract Review Notification Automation - 2026"
description: "Automate contract review deadline notifications with n8n. Monitor expiration dates and send alerts 30, 14, and 7 days before renewal deadlines."
profession: "Legal"
category: "Contracts"
contentType: workflow
tags: ["n8n workflow for contract review notification automation", "contract deadline notifications n8n", "legal automation workflow", "contract expiration alerts", "n8n contract management"]
pubDate: 2026-06-14
featured: false
---

This n8n workflow monitors contract expiration dates in Google Sheets and automatically sends email notifications to assigned legal team members at 30, 14, and 7 days before renewal deadlines. It replaces the manual process of checking spreadsheets daily and saves 45 minutes of administrative work each week.

## Why this automation matters

Legal teams typically track contract renewal dates in spreadsheets but rely on manual calendar reminders or weekly reviews to catch upcoming deadlines. Without automation, contracts slip through renewal windows, forcing emergency renegotiations or auto-renewals under unfavorable terms. This workflow ensures no contract deadline is missed by automatically flagging upcoming expirations and notifying the responsible attorney with contract details and recommended actions.

## What you need before starting

- Google Sheets OAuth2 credential connected to the account containing your contract tracking sheet
- Gmail OAuth2 credential for the email account that will send notifications
- Google Sheets document with columns: Contract Name, Expiration Date, Assigned Attorney Email, Contract Value, Status
- Cron Trigger node capability (available in n8n Cloud and self-hosted instances)
- Email addresses for legal team members formatted correctly in the spreadsheet

## How to build it: step by step

### 1. Cron Trigger — Daily contract check schedule

Node type: Cron Trigger
Mode: Every Day
Hour: 09
Minute: 00
Timezone: Your office timezone
Output: Triggers the workflow once daily at 9 AM to check for upcoming contract deadlines.
Why this matters: Morning execution ensures legal team receives notifications early in the workday when they can take immediate action.

### 2. Google Sheets — Read active contracts

Node type: Google Sheets
Operation: Get Many
Document: Your contract tracking spreadsheet
Sheet: Sheet1
Return All: true
Filters: Status column equals "Active"
Output: Array of contract rows with all columns as individual data points for each contract.
Why this matters: Filtering for active contracts prevents notifications for terminated or completed agreements that don't require renewal action.

### 3. Date & Time — Calculate days until expiration

Node type: Date & Time
Operation: Format
Date: {{ $json["Expiration Date"] }}
Format: YYYY-MM-DD
Output Type: Days Between
Compare Date: {{ $now }}
Output: Number of days between today and each contract's expiration date, passed as a new field to subsequent nodes.
Why this matters: Converting dates to day counts enables precise filtering for 30, 14, and 7-day notification windows.

### 4. IF — Filter contracts needing notifications

Node type: IF
Conditions: 
- {{ $json.daysDiff }} equals 30 OR
- {{ $json.daysDiff }} equals 14 OR  
- {{ $json.daysDiff }} equals 7
Output: Only contracts with expiration dates exactly 30, 14, or 7 days away pass to the email node.
Why this matters: Precise day matching prevents duplicate notifications and ensures attorneys receive alerts at consistent, actionable intervals.

### 5. Gmail — Send notification email

Node type: Gmail
Operation: Send Email
To: {{ $json["Assigned Attorney Email"] }}
Subject: Contract Review Required: {{ $json["Contract Name"] }} expires in {{ $json.daysDiff }} days
Message: 
Contract: {{ $json["Contract Name"] }}
Expiration: {{ $json["Expiration Date"] }}
Value: {{ $json["Contract Value"] }}
Days remaining: {{ $json.daysDiff }}
Action required: Review renewal terms and initiate negotiations.
Output: Confirmation of sent emails with message IDs for tracking purposes.
Why this matters: Including contract value and specific day count helps attorneys prioritize high-value contracts and plan negotiation timelines accordingly.

## Full workflow JSON

```json
{
  "name": "Contract Review Notification Automation",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "value": "0 9 * * *"
            }
          ]
        }
      },
      "id": "cron-trigger-1",
      "name": "Daily Contract Check",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "operation": "getMany",
        "documentId": "YOUR_SHEET_ID",
        "sheetName": "Sheet1",
        "returnAll": true,
        "filters": {
          "conditions": [
            {
              "column": "Status",
              "condition": "equal",
              "value": "Active"
            }
          ]
        }
      },
      "id": "sheets-read-1", 
      "name": "Read Active Contracts",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [460, 300],
      "credentials": {
        "googleSheetsOAuth2Api": "REPLACE_WITH_SHEETS_CREDENTIAL_ID"
      }
    },
    {
      "parameters": {
        "operation": "calculate",
        "value1": "={{ $json['Expiration Date'] }}",
        "operation": "difference",
        "value2": "={{ $now }}",
        "unit": "days",
        "outputFieldName": "daysDiff"
      },
      "id": "date-calc-1",
      "name": "Calculate Days Until Expiration", 
      "type": "n8n-nodes-base.dateTime",
      "typeVersion": 2,
      "position": [680, 300]
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
              "id": "condition-1",
              "leftValue": "={{ $json.daysDiff }}",
              "rightValue": 30,
              "operator": {
                "type": "number",
                "operation": "equal"
              }
            },
            {
              "id": "condition-2", 
              "leftValue": "={{ $json.daysDiff }}",
              "rightValue": 14,
              "operator": {
                "type": "number",
                "operation": "equal"
              }
            },
            {
              "id": "condition-3",
              "leftValue": "={{ $json.daysDiff }}",
              "rightValue": 7, 
              "operator": {
                "type": "number",
                "operation": "equal"
              }
            }
          ],
          "combinator": "or"
        }
      },
      "id": "if-filter-1",
      "name": "Filter Notification Windows",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "operation": "send",
        "resource": "message",
        "to": "={{ $json['Assigned Attorney Email'] }}",
        "subject": "Contract Review Required: {{ $json['Contract Name'] }} expires in {{ $json.daysDiff }} days",
        "message": "Contract: {{ $json['Contract Name'] }}\nExpiration: {{ $json['Expiration Date'] }}\nValue: {{ $json['Contract Value'] }}\nDays remaining: {{ $json.daysDiff }}\n\nAction required: Review renewal terms and initiate negotiations."
      },
      "id": "gmail-send-1",
      "name": "Send Notification Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2,
      "position": [1120, 300],
      "credentials": {
        "gmailOAuth2": "REPLACE_WITH_GMAIL_CREDENTIAL_ID"
      }
    }
  ],
  "connections": {
    "Daily Contract Check": {
      "main": [
        [
          {
            "node": "Read Active Contracts",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    },
    "Read Active Contracts": {
      "main": [
        [
          {
            "node": "Calculate Days Until Expiration",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Calculate Days Until Expiration": {
      "main": [
        [
          {
            "node": "Filter Notification Windows", 
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Notification Windows": {
      "main": [
        [
          {
            "node": "Send Notification Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Frequently Asked Questions

### What happens if the assigned attorney email field is empty or invalid?
The Gmail node will fail for that specific contract row but continue processing remaining contracts. Check your workflow execution history to identify failed emails, then update the spreadsheet with valid email addresses and manually trigger the workflow for those contracts.

### Can I modify the notification schedule to include weekend days or different time intervals?
Yes, change the cron expression in the trigger node. For weekdays only, use "0 9 * * 1-5". To add 3-day notifications, modify the IF node conditions to include "daysDiff equals 3". The workflow will automatically send notifications for all specified intervals.

### How do I handle contracts with different renewal requirements or notification preferences?
Add a "Notification Days" column to your spreadsheet with values like "30,14,7" or "60,30,14" for each contract. Replace the hardcoded IF conditions with a formula that checks if the current daysDiff value exists in that contract's notification days list using the includes() function.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.