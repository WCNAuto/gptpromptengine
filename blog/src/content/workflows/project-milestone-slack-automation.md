---
title: "n8n Workflow for Project Milestone Slack Notification 2026: Auto-Alert Your Team When Tasks Hit Due Dates"
description: "Copy-paste n8n workflow that monitors project milestones in Google Sheets and sends Slack notifications 24 hours before due dates. Ready to import."
profession: "Project Managers"
category: "Notifications"
contentType: workflow
tags: ["n8n workflow for project milestone slack notification", "project milestone automation", "slack notification workflow", "project management n8n", "milestone tracking automation"]
pubDate: 2026-06-11
featured: false
---

This workflow monitors your project milestone sheet every morning at 9 AM, identifies milestones due in the next 24 hours, and posts formatted alerts to your team's Slack channel. It connects Google Sheets milestone tracking with Slack notifications, eliminating the 15 minutes you spend each morning manually checking due dates and typing status updates.

## Why this automation matters

Without automated milestone alerts, project managers manually scan spreadsheets daily, often catching overdue milestones only after stakeholders ask for updates. This reactive approach creates last-minute scrambles, missed deadlines, and eroded stakeholder confidence. A single missed milestone notification can delay project handoffs by days when team members aren't prepared for dependencies.

## What you need before starting

- Schedule Trigger node (built into n8n)
- Google Sheets OAuth2 credential connected to the account that owns your milestone tracking sheet
- Slack OAuth2 credential with chat:write permissions for your target channel
- Google Sheets document with columns: Milestone Name, Due Date (YYYY-MM-DD format), Status, Owner
- Slack channel ID where notifications should be posted

## How to build it: step by step

### 1. Schedule Trigger — Run daily milestone check

Node type: Schedule Trigger
Rule: 0 9 * * 1-5
Timezone: Your project timezone
Output: Fires every weekday at 9 AM, passing a single execution item to the next node.
Why this matters: Weekday-only scheduling prevents noise on weekends when teams aren't actively managing milestones.

### 2. Google Sheets — Read milestone data

Node type: Google Sheets
Operation: Read Rows
Document: Your milestone tracking sheet
Sheet: Sheet1 (or your milestone sheet name)
Read All Data: true
Output: All milestone rows pass as individual items with Milestone Name, Due Date, Status, and Owner fields.
Why this matters: Reading all data ensures new milestones are caught without manual configuration updates.

### 3. Date & Time — Calculate tomorrow's date

Node type: Date & Time
Operation: Format a Date
Date: {{ new Date(Date.now() + 24*60*60*1000) }}
Format: YYYY-MM-DD
Output: Tomorrow's date in YYYY-MM-DD format for comparison with milestone due dates.
Why this matters: Dynamic date calculation keeps the workflow accurate without manual date updates.

### 4. Filter — Find milestones due tomorrow

Node type: Filter
Conditions: 
- Due Date equals {{ $node["Date & Time"].json.formattedDate }}
- Status not equals "Complete"
Output: Only milestone items with due dates matching tomorrow and incomplete status pass through.
Why this matters: Prevents spam from completed milestones and focuses alerts on actionable items.

### 5. Slack — Send milestone alert

Node type: Slack
Resource: Message
Operation: Post
Channel: #project-updates (your channel ID)
Text: 🚨 **Milestone Due Tomorrow**
Milestone: {{ $json["Milestone Name"] }}
Owner: {{ $json["Owner"] }}
Due: {{ $json["Due Date"] }}
Status: {{ $json["Status"] }}
Output: Formatted message posted to Slack channel for each due milestone.
Why this matters: Structured format ensures consistent, scannable alerts that team members can quickly act on.

## Full workflow JSON

```json
{
  "name": "Project Milestone Slack Notifications",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * 1-5"
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [
        240,
        300
      ]
    },
    {
      "parameters": {
        "operation": "readRows",
        "documentId": "// Replace with your Google Sheets document ID",
        "sheetName": "Sheet1",
        "readAllData": true
      },
      "id": "google-sheets",
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
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
        "operation": "formatDate",
        "date": "={{ new Date(Date.now() + 24*60*60*1000) }}",
        "format": "YYYY-MM-DD"
      },
      "id": "date-time",
      "name": "Date & Time",
      "type": "n8n-nodes-base.dateTime",
      "typeVersion": 2,
      "position": [
        680,
        300
      ]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "combineOperation": "all"
          },
          "conditions": [
            {
              "id": "due-date-check",
              "leftValue": "={{ $json['Due Date'] }}",
              "rightValue": "={{ $node['Date & Time'].json.formattedDate }}",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            },
            {
              "id": "status-check", 
              "leftValue": "={{ $json['Status'] }}",
              "rightValue": "Complete",
              "operator": {
                "type": "string",
                "operation": "notEquals"
              }
            }
          ]
        }
      },
      "id": "filter",
      "name": "Filter",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 2,
      "position": [
        900,
        300
      ]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "// Replace with your Slack channel ID",
        "text": "🚨 **Milestone Due Tomorrow**\nMilestone: {{ $json['Milestone Name'] }}\nOwner: {{ $json['Owner'] }}\nDue: {{ $json['Due Date'] }}\nStatus: {{ $json['Status'] }}"
      },
      "id": "slack",
      "name": "Slack", 
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2,
      "position": [
        1120,
        300
      ],
      "credentials": {
        "slackOAuth2Api": "// Replace with your Slack credential ID"
      }
    }
  ],
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
            "node": "Date & Time", 
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Date & Time": {
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
            "node": "Slack",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 1,
  "updatedAt": "2026-06-11T10:00:00.000Z",
  "versionId": "1"
}
```

## Frequently Asked Questions

### What happens if multiple milestones are due on the same day?
The workflow sends separate Slack messages for each due milestone. If you have 5 milestones due tomorrow, your channel receives 5 individual notifications. To consolidate them into a single message, add a Function node after Filter to combine milestone data into one formatted message.

### Why don't I get notifications for milestones I just marked complete?
The Filter node excludes any milestone where the Status column contains "Complete". If you're still getting notifications for finished work, check that your Status column values exactly match "Complete" with no extra spaces or different capitalization.

### Can I change the notification timing to 48 hours instead of 24?
Yes. In the Date & Time node, change the date calculation from `24*60*60*1000` to `48*60*60*1000`. This shifts the alert window to two days before due dates instead of one day.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.