---
title: "N8N Workflow for Automated Weekly Operations Report Generation in 2026"
description: "Copy-paste n8n workflow that pulls data from Google Sheets, Slack, and Monday.com to generate a comprehensive weekly operations report every Friday at 4 PM."
profession: "Operations"
category: "Reporting"
contentType: workflow
tags: ["n8n workflow for automated weekly operations report", "automated operations reporting", "weekly ops dashboard", "n8n google sheets reporting", "monday.com slack integration"]
pubDate: 2026-06-11
featured: false
---

This n8n workflow automatically generates a comprehensive weekly operations report every Friday at 4 PM by pulling KPI data from Google Sheets, team status updates from Slack, and project progress from Monday.com. It compiles everything into a formatted PDF and emails it to your operations team, replacing the 45-minute manual process most ops managers do every week.

## Why this automation matters

Without this workflow, you're manually copying metrics from three different platforms, formatting them in a document, and hoping you didn't miss any critical updates before the Monday morning leadership meeting. A single missed metric or outdated project status can derail strategic decisions. This automation ensures your weekly ops report is consistent, complete, and delivered on time every Friday.

## What you need before starting

• Google Sheets credential with read access to your Operations KPI tracker sheet
• Slack credential with channels:read and messages:read scopes for your #operations-updates channel
• Monday.com API token with read permissions for your operations board
• Gmail credential for sending the final report
• PDF generation service credential (we'll use HTML/CSS to PDF API)
• Google Sheets document named "Operations KPIs" with columns: Week_Ending, Revenue, Customer_Tickets, Response_Time, Team_Utilization

## How to build it: step by step

### 1. Schedule Trigger — Weekly report timing

Node type: Schedule Trigger
Trigger Rule: Week Days
Week Days: Friday
Time: 16:00
Timezone: Your local timezone
Output: Triggers the workflow every Friday at 4 PM
Why this matters: Friday timing gives you the weekend to review before Monday meetings, and 4 PM ensures all team updates are captured.

### 2. Google Sheets — Pull weekly KPI data

Node type: Google Sheets
Operation: Read Rows
Document: Operations KPIs
Sheet: Sheet1
Read Mode: Range
Range: A1:E100
Output: Returns all KPI rows with the current week's data passed to the next node
Why this matters: Reading by range ensures you get headers and can filter for the current week's data in the next step.

### 3. Code — Filter current week data

Node type: Code
Mode: Run Once for All Items
JavaScript Code:
```javascript
const today = new Date();
const weekEnding = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 5);
const weekEndingStr = weekEnding.toISOString().split('T')[0];

const currentWeekData = items.filter(item => 
  item.json.Week_Ending === weekEndingStr
)[0] || {};

return [{ json: currentWeekData }];
```
Output: Single item containing this week's KPI data
Why this matters: Filters to only the current week's row so your report doesn't include outdated metrics.

### 4. Slack — Get team updates

Node type: Slack
Operation: Get Channel Messages
Channel: #operations-updates
Oldest: 168 hours ago
Include Bot Messages: false
Output: Array of messages from the past week
Why this matters: Captures all team status updates and blockers shared in your operations channel over the past 7 days.

### 5. Monday.com — Get project status

Node type: Monday.com
Operation: Get Board Items
Board ID: Your operations board ID
Column IDs: status,progress,owner
Output: All items with their current status and progress percentages
Why this matters: Pulls real-time project data to show exactly where each initiative stands.

### 6. Code — Generate report HTML

Node type: Code
Mode: Run Once for All Items
JavaScript Code:
```javascript
const kpiData = $node["Code"].json;
const slackMessages = $node["Slack"].json;
const mondayItems = $node["Monday.com"].json;

const html = `
<html>
<body>
<h1>Weekly Operations Report - ${new Date().toDateString()}</h1>
<h2>Key Metrics</h2>
<table border="1">
<tr><td>Revenue</td><td>${kpiData.Revenue || 'N/A'}</td></tr>
<tr><td>Customer Tickets</td><td>${kpiData.Customer_Tickets || 'N/A'}</td></tr>
<tr><td>Avg Response Time</td><td>${kpiData.Response_Time || 'N/A'} hours</td></tr>
<tr><td>Team Utilization</td><td>${kpiData.Team_Utilization || 'N/A'}%</td></tr>
</table>
<h2>Team Updates</h2>
${slackMessages.map(msg => `<p><strong>${msg.user}:</strong> ${msg.text}</p>`).join('')}
<h2>Project Status</h2>
${mondayItems.map(item => `<p>${item.name}: ${item.status} (${item.progress}%)</p>`).join('')}
</body>
</html>
`;

return [{ json: { html: html } }];
```
Output: HTML formatted report ready for PDF conversion
Why this matters: Creates a professional-looking report format that includes all data sources in a readable structure.

### 7. HTML/CSS to PDF — Convert to PDF

Node type: HTML/CSS to PDF
HTML Content: {{$node["Code1"].json["html"]}}
Page Format: A4
Margin: 20mm
Output: PDF file as binary data
Why this matters: Creates a professional PDF that can be easily shared and archived.

### 8. Gmail — Email the report

Node type: Gmail
Operation: Send Email
To: ops-team@yourcompany.com
Subject: Weekly Operations Report - {{$now.format("MMM DD, YYYY")}}
Email Type: HTML
Message: Please find attached this week's operations report.
Attachments: Use binary data from HTML/CSS to PDF node
Attachment Name: Weekly_Ops_Report_{{$now.format("YYYY-MM-DD")}}.pdf
Output: Confirmation that email was sent
Why this matters: Delivers the report to your team automatically with a timestamped filename for easy organization.

## Full workflow JSON

```json
{
  "name": "Weekly Operations Report Generator",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "weekDay",
              "weekDay": 5
            },
            {
              "field": "hour",
              "hour": 16
            }
          ]
        }
      },
      "id": "1",
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "// Replace with your Google Sheets document ID",
        "sheetName": "Sheet1",
        "readMode": "range",
        "range": "A1:E100"
      },
      "id": "2",
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [460, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "// Replace with your Google Sheets credential ID",
          "name": "Google Sheets OAuth2 API"
        }
      }
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const today = new Date();\nconst weekEnding = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 5);\nconst weekEndingStr = weekEnding.toISOString().split('T')[0];\n\nconst currentWeekData = items.filter(item => \n  item.json.Week_Ending === weekEndingStr\n)[0] || {};\n\nreturn [{ json: currentWeekData }];"
      },
      "id": "3",
      "name": "Code",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "operation": "getChannelMessages",
        "channelId": "// Replace with your Slack channel ID",
        "oldest": "168 hours ago",
        "includeBotMessages": false
      },
      "id": "4",
      "name": "Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [460, 480],
      "credentials": {
        "slackOAuth2Api": {
          "id": "// Replace with your Slack credential ID",
          "name": "Slack OAuth2 API"
        }
      }
    },
    {
      "parameters": {
        "operation": "getBoardItems",
        "boardId": "// Replace with your Monday.com board ID"
      },
      "id": "5",
      "name": "Monday.com",
      "type": "n8n-nodes-base.mondayCom",
      "typeVersion": 1,
      "position": [460, 660],
      "credentials": {
        "mondayComApi": {
          "id": "// Replace with your Monday.com credential ID",
          "name": "Monday.com API"
        }
      }
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const kpiData = $node[\"Code\"].json;\nconst slackMessages = $node[\"Slack\"].json;\nconst mondayItems = $node[\"Monday.com\"].json;\n\nconst html = `\n<html>\n<head>\n<style>\ntable { border-collapse: collapse; width: 100%; }\nth, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\nth { background-color: #f2f2f2; }\n</style>\n</head>\n<body>\n<h1>Weekly Operations Report - ${new Date().toDateString()}</h1>\n<h2>Key Metrics</h2>\n<table>\n<tr><td><strong>Revenue</strong></td><td>${kpiData.Revenue || 'N/A'}</td></tr>\n<tr><td><strong>Customer Tickets</strong></td><td>${kpiData.Customer_Tickets || 'N/A'}</td></tr>\n<tr><td><strong>Avg Response Time</strong></td><td>${kpiData.Response_Time || 'N/A'} hours</td></tr>\n<tr><td><strong>Team Utilization</strong></td><td>${kpiData.Team_Utilization || 'N/A'}%</td></tr>\n</table>\n<h2>Team Updates</h2>\n${slackMessages.map(msg => `<p><strong>${msg.user}:</strong> ${msg.text}</p>`).join('')}\n<h2>Project Status</h2>\n${mondayItems.map(item => `<p><strong>${item.name}:</strong> ${item.status} (${item.progress}%)</p>`).join('')}\n</body>\n</html>\n`;\n\nreturn [{ json: { html: html } }];"
      },
      "id": "6",
      "name": "Code1",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 480