---
title: "n8n Workflow for Real Estate Lead Follow-up Automation: Auto-Send Nurture Sequences in 2026"
description: "Import this complete n8n workflow to automatically send personalized follow-up emails to real estate leads based on their engagement stage and property interests."
profession: "Real Estate"
category: "Lead Mgmt"
contentType: workflow
tags: ["n8n workflow for real estate lead follow up automation", "real estate lead nurturing workflow", "automated property follow up emails", "real estate CRM automation", "lead scoring workflow automation"]
pubDate: 2026-06-14
featured: false
---

This workflow automatically sends personalized follow-up emails to real estate leads based on their engagement stage in your Google Sheets CRM. It checks for leads who haven't been contacted in 3 days, scores them based on property views and email opens, then sends targeted nurture emails through Gmail. Saves 2 hours of manual lead review and email drafting every Tuesday and Friday.

## Why this automation matters

Without automated follow-up, hot leads go cold while you're showing properties or in meetings. A lead who viewed 5 listings but hasn't heard from you in a week often signs with a competitor who stayed in touch. This workflow ensures every lead gets timely, relevant communication based on their actual behavior, not just when you remember to check your spreadsheet.

## What you need before starting

- Google Sheets OAuth2 credential with access to your lead tracking spreadsheet
- Gmail OAuth2 credential for the email address that sends follow-ups
- Google Sheets document with columns: Lead Name, Email, Phone, Last Contact Date, Property Views, Email Opens, Lead Stage, Property Type Interest
- Cron node capability (available in n8n Cloud and self-hosted)

## How to build it: step by step

### 1. Schedule — Trigger the workflow twice weekly

Node type: Schedule Trigger
Trigger Rules: 0 9 * * 2,5 (9 AM on Tuesdays and Fridays)
Output: Fires the workflow automatically without input data
Why this matters: Tuesday catches weekend leads, Friday ensures no lead sits uncontacted over the weekend.

### 2. Google Sheets — Read all active leads

Node type: Google Sheets
Operation: Read Rows
Document: Your lead tracking sheet
Sheet: Sheet1
Options > RAW: false
Output: Array of lead objects with all columns as properties
Why this matters: RAW false converts dates to proper format for comparison logic.

### 3. Code — Filter leads needing follow-up and calculate scores

Node type: Code
Mode: runOnceForAllItems
```javascript
const now = new Date();
const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

return $input.all().map(item => {
  const lead = item.json;
  const lastContact = new Date(lead['Last Contact Date']);
  
  if (lastContact < threeDaysAgo && lead['Lead Stage'] !== 'Closed') {
    const score = (lead['Property Views'] * 2) + (lead['Email Opens'] * 1);
    return {
      json: {
        ...lead,
        score: score,
        daysSinceContact: Math.floor((now - lastContact) / (1000 * 60 * 60 * 24))
      }
    };
  }
}).filter(Boolean);
```
Output: Filtered array of leads needing follow-up with calculated engagement scores
Why this matters: Focuses only on leads who need attention and prioritizes high-engagement prospects.

### 4. Gmail — Send personalized follow-up emails

Node type: Gmail
Operation: Send Email
To: `{{ $json.Email }}`
Subject: `Following up on {{ $json["Property Type Interest"] }} properties - {{ $json["Lead Name"] }}`
Message: 
```
Hi {{ $json["Lead Name"] }},

I noticed you've been looking at {{ $json["Property Type Interest"] }} properties and wanted to check in. 

Based on your recent activity ({{ $json["Property Views"] }} property views), I think you might be interested in some new listings that just came on the market.

I have {{ $json.daysSinceContact > 7 ? 'several great options' : 'a couple of properties' }} that match your criteria. 

Would you like to schedule a quick 15-minute call this week to discuss them?

Best regards,
[Your Name]
```
Output: Confirmation of sent emails with message IDs
Why this matters: Personalizes based on actual engagement data, not generic templates.

### 5. Google Sheets — Update last contact date

Node type: Google Sheets
Operation: Update Row
Document: Same lead tracking sheet
Sheet: Sheet1
Column to Match On: Email
Value of Column: `{{ $json.Email }}`
Column to Update: Last Contact Date
Value to Set: `{{ $now }}`
Output: Confirmation of updated rows
Why this matters: Prevents sending duplicate follow-ups and tracks automation activity.

## Full workflow JSON

```json
{
  "name": "Real Estate Lead Follow-up Automation",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * 2,5"
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [280, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "// Replace with your Google Sheets document ID",
        "sheetName": "Sheet1",
        "options": {
          "rawData": false
        }
      },
      "id": "google-sheets-read",
      "name": "Google Sheets - Read Leads",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [500, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "// Replace with your Google Sheets credential ID",
          "name": "Google Sheets Credential"
        }
      }
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const now = new Date();\nconst threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));\n\nreturn $input.all().map(item => {\n  const lead = item.json;\n  const lastContact = new Date(lead['Last Contact Date']);\n  \n  if (lastContact < threeDaysAgo && lead['Lead Stage'] !== 'Closed') {\n    const score = (lead['Property Views'] * 2) + (lead['Email Opens'] * 1);\n    return {\n      json: {\n        ...lead,\n        score: score,\n        daysSinceContact: Math.floor((now - lastContact) / (1000 * 60 * 60 * 24))\n      }\n    };\n  }\n}).filter(Boolean);"
      },
      "id": "code-filter-score",
      "name": "Code - Filter and Score Leads",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [720, 300]
    },
    {
      "parameters": {
        "operation": "send",
        "message": {
          "to": "={{ $json.Email }}",
          "subject": "=Following up on {{ $json[\"Property Type Interest\"] }} properties - {{ $json[\"Lead Name\"] }}",
          "body": "Hi {{ $json[\"Lead Name\"] }},\n\nI noticed you've been looking at {{ $json[\"Property Type Interest\"] }} properties and wanted to check in.\n\nBased on your recent activity ({{ $json[\"Property Views\"] }} property views), I think you might be interested in some new listings that just came on the market.\n\nI have {{ $json.daysSinceContact > 7 ? 'several great options' : 'a couple of properties' }} that match your criteria.\n\nWould you like to schedule a quick 15-minute call this week to discuss them?\n\nBest regards,\n[Your Name]",
          "bodyType": "text"
        }
      },
      "id": "gmail-send",
      "name": "Gmail - Send Follow-up",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2,
      "position": [940, 300],
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your Gmail credential ID",
          "name": "Gmail Credential"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "documentId": "// Replace with your Google Sheets document ID",
        "sheetName": "Sheet1",
        "columnToMatchOn": "Email",
        "valueToMatchOn": "={{ $json.Email }}",
        "valueToSet": "={{ $now }}",
        "options": {}
      },
      "id": "google-sheets-update",
      "name": "Google Sheets - Update Contact Date",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [1160, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "// Replace with your Google Sheets credential ID",
          "name": "Google Sheets Credential"
        }
      }
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Google Sheets - Read Leads",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Sheets - Read Leads": {
      "main": [
        [
          {
            "node": "Code - Filter and Score Leads",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Code - Filter and Score Leads": {
      "main": [
        [
          {
            "node": "Gmail - Send Follow-up",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Gmail - Send Follow-up": {
      "main": [
        [
          {
            "node": "Google Sheets - Update Contact Date",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {}
}
```

## Frequently Asked Questions

### What happens if a lead's email bounces or Gmail fails to send?
The workflow will continue processing other leads, but the bounced lead's "Last Contact Date" won't update. Check your Gmail Sent folder and manually update the sheet for any failed sends. Consider adding an IF node after Gmail to only update the date on successful sends.

### Can I customize the email content based on lead score ranges?
Yes, modify the Gmail node's message field to include conditional content using expressions like `{{ $json.score > 10 ? 'high priority content' : 'standard content' }}`. You can create different email templates for hot leads (score > 15) versus cold leads (score < 5).

### How do I prevent the workflow from sending emails to leads I'm actively working with?
Add a "Status" column to your sheet with values like "Active", "Nurture", or "Do Not Contact". Update the Code node filter to include `&& lead.Status !== 'Active'` so active deals skip automated emails.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.