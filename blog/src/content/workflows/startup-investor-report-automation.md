---
title: "N8N Workflow for Startup Investor Update Reporting 2026"
description: "Auto-generate monthly investor reports by pulling metrics from Airtable, calculating KPIs, and sending formatted updates via email to your investor list."
profession: "Entrepreneurs"
category: "Reporting"
contentType: workflow
tags: ["n8n workflow for startup investor update reporting", "startup metrics automation", "investor communication workflow", "automated KPI reporting", "monthly investor updates n8n"]
pubDate: 2026-06-07
featured: false
---

This workflow automatically generates monthly investor update reports by pulling key metrics from your Airtable base, calculating growth percentages, and emailing formatted reports to your investor distribution list. It eliminates the 4-hour monthly process of manually gathering data, building charts, and crafting individual emails.

## Why this automation matters

Most founders spend an entire afternoon each month pulling revenue data, user metrics, and burn rate numbers from different sources, then manually calculating month-over-month growth rates and crafting personalized investor emails. Without automation, it's easy to miss monthly deadlines or send inconsistent data formats. This workflow ensures your investor updates go out on the same day each month with consistent formatting and accurate calculations.

## What you need before starting

- Airtable OAuth2 credential connected to your startup metrics base
- Gmail OAuth2 credential for your founder email account
- Airtable base with tables named "Monthly_Metrics" and "Investors"
- Monthly_Metrics table with columns: Month, Revenue, Users, Burn_Rate, ARR
- Investors table with columns: Name, Email, Investment_Round, Status
- Schedule Trigger node capability in your n8n instance

## How to build it: step by step

### 1. Schedule Trigger — Monthly execution

Node type: Schedule Trigger
Trigger Rule: Cron Expression
Cron Expression: 0 9 1 * *
Timezone: Your local timezone
Output: Executes on the 1st day of each month at 9:00 AM
Why this matters: Ensures consistent timing for investor updates and gives you the first day of the month to review any last-minute data before sending.

### 2. Airtable — Fetch latest metrics

Node type: Airtable
Operation: List
Base ID: Your startup metrics base ID
Table: Monthly_Metrics
Sort: Month (descending)
Max Records: 2
Output: Returns the current month and previous month's metrics as separate items
Why this matters: Getting two months allows you to calculate growth percentages automatically rather than doing math manually.

### 3. Code — Calculate growth metrics

Node type: Code
Mode: Run Once for All Items
JavaScript Code:
```javascript
const current = $input.all()[0];
const previous = $input.all()[1];

const revenueGrowth = ((current.json.Revenue - previous.json.Revenue) / previous.json.Revenue * 100).toFixed(1);
const userGrowth = ((current.json.Users - previous.json.Users) / previous.json.Users * 100).toFixed(1);
const burnRate = current.json.Burn_Rate;

return [{
  json: {
    currentMonth: current.json.Month,
    revenue: current.json.Revenue,
    revenueGrowth: revenueGrowth,
    users: current.json.Users,
    userGrowth: userGrowth,
    burnRate: burnRate,
    arr: current.json.ARR
  }
}];
```
Output: Single item with formatted metrics and calculated growth percentages
Why this matters: Pre-calculating percentages prevents errors in your email template and ensures consistent number formatting.

### 4. Airtable — Get investor list

Node type: Airtable
Operation: List
Base ID: Your startup metrics base ID
Table: Investors
Filter Formula: Status = 'Active'
Output: All active investors as individual items for the email loop
Why this matters: Filtering by status prevents sending updates to investors who have requested to be removed or are no longer relevant.

### 5. Gmail — Send investor update

Node type: Gmail
Operation: Send Email
To: {{$json.Email}}
Subject: {{$('Code').item.json.currentMonth}} Investor Update - Revenue up {{$('Code').item.json.revenueGrowth}}%
Email Type: HTML
HTML Body:
```html
<p>Hi {{$json.Name}},</p>

<p>Here's our progress for {{$('Code').item.json.currentMonth}}:</p>

<h3>Key Metrics</h3>
<ul>
<li><strong>Revenue:</strong> ${{$('Code').item.json.revenue}} ({{$('Code').item.json.revenueGrowth}}% growth)</li>
<li><strong>Users:</strong> {{$('Code').item.json.users}} ({{$('Code').item.json.userGrowth}}% growth)</li>
<li><strong>ARR:</strong> ${{$('Code').item.json.arr}}</li>
<li><strong>Monthly Burn:</strong> ${{$('Code').item.json.burnRate}}</li>
</ul>

<p>Thanks for your continued support.</p>

<p>Best,<br>
[Your Name]</p>
```
Output: Individual emails sent to each active investor with personalized data
Why this matters: Using the investor's name and dynamic metrics creates personalized updates without manual customization for each recipient.

## Full workflow JSON

```json
{
  "name": "Startup Investor Update Automation",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "cronExpression": "0 9 1 * *"
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Monthly Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "list",
        "base": {
          "__rl": true,
          "value": "// Replace with your Airtable base ID",
          "mode": "id"
        },
        "table": {
          "__rl": true,
          "value": "Monthly_Metrics",
          "mode": "string"
        },
        "sort": {
          "sortFields": [
            {
              "field": "Month",
              "direction": "desc"
            }
          ]
        },
        "limit": 2
      },
      "id": "airtable-metrics",
      "name": "Fetch Metrics",
      "type": "n8n-nodes-base.airtable",
      "typeVersion": 1,
      "position": [460, 300],
      "credentials": {
        "airtableOAuth2Api": {
          "id": "// Replace with your Airtable credential ID",
          "name": "Airtable OAuth2"
        }
      }
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const current = $input.all()[0];\nconst previous = $input.all()[1];\n\nconst revenueGrowth = ((current.json.fields.Revenue - previous.json.fields.Revenue) / previous.json.fields.Revenue * 100).toFixed(1);\nconst userGrowth = ((current.json.fields.Users - previous.json.fields.Users) / previous.json.fields.Users * 100).toFixed(1);\nconst burnRate = current.json.fields.Burn_Rate;\n\nreturn [{\n  json: {\n    currentMonth: current.json.fields.Month,\n    revenue: current.json.fields.Revenue,\n    revenueGrowth: revenueGrowth,\n    users: current.json.fields.Users,\n    userGrowth: userGrowth,\n    burnRate: burnRate,\n    arr: current.json.fields.ARR\n  }\n}];"
      },
      "id": "code-calculate",
      "name": "Calculate Growth",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "operation": "list",
        "base": {
          "__rl": true,
          "value": "// Replace with your Airtable base ID",
          "mode": "id"
        },
        "table": {
          "__rl": true,
          "value": "Investors",
          "mode": "string"
        },
        "filterByFormula": "Status = 'Active'"
      },
      "id": "airtable-investors",
      "name": "Get Investors",
      "type": "n8n-nodes-base.airtable",
      "typeVersion": 1,
      "position": [900, 300],
      "credentials": {
        "airtableOAuth2Api": {
          "id": "// Replace with your Airtable credential ID",
          "name": "Airtable OAuth2"
        }
      }
    },
    {
      "parameters": {
        "operation": "send",
        "to": "={{$json.fields.Email}}",
        "subject": "={{$node['Calculate Growth'].json.currentMonth}} Investor Update - Revenue up {{$node['Calculate Growth'].json.revenueGrowth}}%",
        "emailType": "html",
        "html": "<p>Hi {{$json.fields.Name}},</p>\n\n<p>Here's our progress for {{$node['Calculate Growth'].json.currentMonth}}:</p>\n\n<h3>Key Metrics</h3>\n<ul>\n<li><strong>Revenue:</strong> ${{$node['Calculate Growth'].json.revenue}} ({{$node['Calculate Growth'].json.revenueGrowth}}% growth)</li>\n<li><strong>Users:</strong> {{$node['Calculate Growth'].json.users}} ({{$node['Calculate Growth'].json.userGrowth}}% growth)</li>\n<li><strong>ARR:</strong> ${{$node['Calculate Growth'].json.arr}}</li>\n<li><strong>Monthly Burn:</strong> ${{$node['Calculate Growth'].json.burnRate}}</li>\n</ul>\n\n<p>Thanks for your continued support.</p>\n\n<p>Best,<br>\n[Your Name]</p>"
      },
      "id": "gmail-send",
      "name": "Send Update Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1120, 300],
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your Gmail credential ID",
          "name": "Gmail OAuth2"
        }
      }
    }
  ],
  "connections": {
    "Monthly Trigger": {
      "main": [
        [
          {
            "node": "Fetch Metrics",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Fetch Metrics": {
      "main": [
        [
          {
            "node": "Calculate Growth",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Calculate Growth": {
      "main": [
        [
          {
            "node": "Get Investors",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Investors": {
      "main": [
        [
          {
            "node": "Send Update Email",
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

### What happens if I don't have data for the previous month when calculating growth?
The Code node will throw a division error and the workflow will fail. Add a manual entry to your Monthly_