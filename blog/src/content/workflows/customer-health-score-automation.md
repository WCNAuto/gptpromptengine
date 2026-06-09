---
title: "n8n Workflow for Customer Health Score Alert Automation (2026)"
description: "Copy-paste n8n workflow that monitors customer health scores and auto-sends Slack alerts when scores drop below thresholds. Ready in 5 minutes."
profession: "Customer Success"
category: "Monitoring"
contentType: workflow
tags: ["n8n workflow for customer health score alert automation", "customer health monitoring automation", "health score alerting workflow", "automated customer success alerts", "n8n customer health tracking"]
pubDate: 2026-06-09
featured: false
---

This workflow monitors customer health scores in Google Sheets and automatically sends Slack alerts when scores drop below critical thresholds. It connects Google Sheets, conditional logic, and Slack to replace the daily manual check that takes 20 minutes every morning.

## Why this automation matters

Without this automation, Customer Success teams manually scan health score spreadsheets daily to identify at-risk customers. When scores drop during weekends or between check cycles, intervention gets delayed by days. One missed alert can mean losing a high-value customer who could have been saved with immediate outreach.

## What you need before starting

- Google Sheets OAuth2 credential connected to the account containing your customer health score data
- Slack OAuth2 credential with permissions to post messages to your chosen alert channel
- A Google Sheet with customer data including: Customer Name (column A), Health Score (column B), Account Manager (column C)
- A Slack channel where alerts will be posted

## How to build it: step by step

### 1. Schedule Trigger — Run health score checks every 4 hours

Node type: Schedule Trigger
Trigger Interval: Every 4 Hours
Time Zone: Your business timezone
What it outputs: A trigger signal every 4 hours that starts the workflow
Why this matters: Four-hour intervals catch score drops quickly without overwhelming your team with constant notifications.

### 2. Google Sheets — Read all customer health data

Node type: Google Sheets
Operation: Read Rows
Document: Your customer health score spreadsheet
Sheet: Sheet1
Range: A:C
Has Header Row: Yes
What it outputs: Each customer row as a separate item containing name, score, and account manager
Why this matters: Reading all rows ensures no customers are missed, and the range A:C captures exactly the data needed for alerting.

### 3. Filter — Identify customers with health scores below 70

Node type: Filter
Condition: Number
Field: Health Score
Operation: Smaller
Value: 70
What it outputs: Only customer records where health score is below 70 pass through
Why this matters: Filtering prevents alert spam by only flagging customers who need immediate attention.

### 4. Slack — Send alert message with customer details

Node type: Slack
Operation: Post Message
Channel: #customer-success-alerts
Text: 🚨 Health Score Alert: {{$json["Customer Name"]}} has dropped to {{$json["Health Score"]}}. Account Manager: {{$json["Account Manager"]}}
What it outputs: A posted Slack message with customer name, current score, and responsible team member
Why this matters: Including the account manager in the alert enables immediate assignment and faster response times.

## Full workflow JSON

```json
{
  "name": "Customer Health Score Alert Automation",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hoursInterval": 4
            }
          ]
        }
      },
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
        "operation": "readRows",
        "documentId": {
          "__rl": true,
          "value": "// Replace with your Google Sheets document ID",
          "mode": "url"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "autoFill"
        },
        "range": "A:C",
        "options": {
          "headerRow": true
        }
      },
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.3,
      "position": [
        460,
        300
      ],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "// Replace with your Google Sheets credential ID",
          "name": "Google Sheets OAuth2"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{$json[\"Health Score\"]}}",
              "operation": "smaller",
              "value2": 70
            }
          ]
        }
      },
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
        "operation": "postMessage",
        "channel": {
          "__rl": true,
          "value": "#customer-success-alerts",
          "mode": "name"
        },
        "text": "🚨 Health Score Alert: {{$json[\"Customer Name\"]}} has dropped to {{$json[\"Health Score\"]}}. Account Manager: {{$json[\"Account Manager\"]}}"
      },
      "name": "Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [
        900,
        300
      ],
      "credentials": {
        "slackOAuth2Api": {
          "id": "// Replace with your Slack credential ID",
          "name": "Slack OAuth2"
        }
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
  "staticData": null,
  "settings": {
    "executionOrder": "v1"
  },
  "pinData": null,
  "versionId": "4e4a5b8e-4f2a-4b9e-8c3d-1a2b3c4d5e6f",
  "triggerCount": 1,
  "tags": []
}
```

## Frequently Asked Questions

### What happens if the Google Sheet has health scores stored as text instead of numbers?

The Filter node will fail because text values can't be compared numerically. Convert your health score column to number format in Google Sheets, or add a Code node before the Filter to parse the text values using `parseInt({{$json["Health Score"]}})`.

### How do I prevent duplicate alerts for the same customer throughout the day?

Add a Google Sheets node after the Filter that writes alert timestamps to a tracking column, then modify the Filter to exclude customers who were already alerted in the last 24 hours using an additional date comparison condition.

### Can I customize alert thresholds for different customer tiers?

Yes, replace the single Filter node with multiple Filter nodes running in parallel, each with different score thresholds. Add a customer tier column to your sheet and use separate filters like "Enterprise customers below 80" and "Standard customers below 60" flowing to different Slack channels.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.