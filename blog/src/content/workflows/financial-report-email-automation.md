---
title: "N8N Workflow for Financial Report to Client Email Auto - Complete 2026 Setup"
description: "Copy-paste n8n workflow that auto-generates client portfolio reports from your CRM data and emails them weekly. Saves 3 hours every Friday afternoon."
profession: "Financial Advisors"
category: "Reporting"
contentType: workflow
tags: ["n8n workflow for financial report to client email auto", "automated client reporting n8n", "financial advisor email automation", "portfolio report automation", "client communication workflow"]
pubDate: 2026-06-12
featured: false
---

This workflow automatically generates personalized portfolio performance reports from your client data and emails them every Friday at 4 PM. It connects Google Sheets (where you track client portfolios) to Gmail, creating PDF reports with each client's holdings, performance metrics, and market commentary. Eliminates the 3-hour manual report generation process every Friday afternoon.

## Why this automation matters

Manual report generation means copying data from multiple spreadsheets, formatting performance charts, writing personalized notes, and sending individual emails to 20+ clients every week. One missed client creates an awkward Monday morning explanation call. Late reports make you look disorganized compared to competitors who deliver consistent Friday updates. This workflow runs automatically whether you're in client meetings or taking time off.

## What you need before starting

- Google Sheets OAuth2 credential connected to the account containing your client portfolio tracker
- Gmail OAuth2 credential for the email address that sends client reports
- A Google Sheets document with columns: Client Name, Email, Portfolio Value, Week Change %, Month Change %, Holdings Summary
- PDF generation enabled in your n8n instance (requires Puppeteer package installed)

## How to build it: step by step

### 1. Schedule Trigger — Fire every Friday at 4 PM

Node type: Schedule Trigger
Trigger Times: 0 16 * * 5
Timezone: America/New_York
Output: Sends a signal every Friday at 4:00 PM Eastern to start the workflow.
Why this matters: Friday afternoon timing ensures reports reflect the full trading week and arrive before weekend market research.

### 2. Google Sheets — Read active client portfolio data

Node type: Google Sheets
Operation: Read Rows
Spreadsheet: Client Portfolio Tracker
Sheet: Q2_2026_Portfolios
Range: A2:G100
Filter: Status column equals 'Active'
Output: Each active client record becomes a separate workflow item with all portfolio data attached.
Why this matters: The filter prevents sending reports to former clients while the range captures all data without headers.

### 3. Code — Generate personalized report HTML

Node type: Code
Language: JavaScript
```javascript
const client = $json;
const reportHtml = `
<h1>Portfolio Report - ${client['Client Name']}</h1>
<h2>Week ending ${new Date().toLocaleDateString()}</h2>
<p>Portfolio Value: $${client['Portfolio Value']}</p>
<p>Week Change: ${client['Week Change %']}%</p>
<p>Month Change: ${client['Month Change %']}%</p>
<h3>Current Holdings</h3>
<p>${client['Holdings Summary']}</p>
<p>Best regards,<br>Your Financial Advisor Team</p>
`;
return { html: reportHtml, clientName: client['Client Name'], email: client['Email'] };
```
Output: HTML-formatted report content plus client email address for each portfolio.
Why this matters: Personalized HTML ensures each client sees only their data and creates a professional report layout for PDF conversion.

### 4. HTML/CSS to Image — Convert report to PDF

Node type: HTML/CSS to Image
Input HTML: {{$json.html}}
Output Format: PDF
Page Size: A4
Margins: 20px
File Name: {{$json.clientName}}_Portfolio_Report_{{new Date().toISOString().split('T')[0]}}.pdf
Output: PDF file attachment ready for email delivery.
Why this matters: PDF format ensures consistent formatting across all client devices and creates a professional document for client records.

### 5. Gmail — Send personalized report email

Node type: Gmail
Operation: Send Email
To: {{$json.email}}
Subject: Your Weekly Portfolio Report - {{new Date().toLocaleDateString()}}
Email Format: HTML
Message: Please find attached your personalized portfolio performance report for this week. Contact me with any questions.
Attachments: Use binary data from previous node
Output: Confirmation of successful email delivery for each client.
Why this matters: Personalized subject lines and individual sends create the impression of custom attention rather than mass email distribution.

## Full workflow JSON

```json
{
  "name": "Client Portfolio Report Auto-Email",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "cronExpression": "0 16 * * 5"
            }
          ]
        }
      },
      "id": "schedule-trigger-1",
      "name": "Every Friday 4PM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "sheetId": "// Replace with your Google Sheets ID",
        "range": "A2:G100",
        "options": {
          "valueRenderMode": "FORMATTED_VALUE"
        }
      },
      "id": "google-sheets-1",
      "name": "Read Client Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [460, 300],
      "credentials": {
        "googleSheetsOAuth2Api": "// Replace with your Google Sheets credential ID"
      }
    },
    {
      "parameters": {
        "jsCode": "const client = $json;\nif (client.Status !== 'Active') {\n  return null;\n}\n\nconst reportHtml = `\n<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { font-family: Arial, sans-serif; margin: 20px; }\n    h1 { color: #2c3e50; }\n    h2 { color: #34495e; }\n    .metric { background: #f8f9fa; padding: 10px; margin: 5px 0; }\n    .positive { color: #27ae60; }\n    .negative { color: #e74c3c; }\n  </style>\n</head>\n<body>\n  <h1>Portfolio Report - ${client['Client Name']}</h1>\n  <h2>Week ending ${new Date().toLocaleDateString()}</h2>\n  <div class=\"metric\">Portfolio Value: $${client['Portfolio Value']}</div>\n  <div class=\"metric\">Week Change: <span class=\"${parseFloat(client['Week Change %']) >= 0 ? 'positive' : 'negative'}\">${client['Week Change %']}%</span></div>\n  <div class=\"metric\">Month Change: <span class=\"${parseFloat(client['Month Change %']) >= 0 ? 'positive' : 'negative'}\">${client['Month Change %']}%</span></div>\n  <h3>Current Holdings</h3>\n  <p>${client['Holdings Summary']}</p>\n  <p>Best regards,<br>Your Financial Advisor Team</p>\n</body>\n</html>\n`;\n\nreturn {\n  html: reportHtml,\n  clientName: client['Client Name'],\n  email: client['Email'],\n  portfolioValue: client['Portfolio Value']\n};"
      },
      "id": "code-1",
      "name": "Generate Report HTML",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "url": "data:text/html;charset=utf-8,{{encodeURIComponent($json.html)}}",
        "options": {
          "type": "pdf",
          "format": "A4",
          "margin": {
            "top": "20px",
            "right": "20px",
            "bottom": "20px",
            "left": "20px"
          }
        },
        "fileName": "={{$json.clientName}}_Portfolio_Report_{{DateTime.now().toFormat('yyyy-MM-dd')}}.pdf"
      },
      "id": "html-to-pdf-1",
      "name": "Create PDF Report",
      "type": "n8n-nodes-base.htmlCssToImage",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "operation": "send",
        "message": {
          "to": "={{$json.email}}",
          "subject": "Your Weekly Portfolio Report - {{DateTime.now().toFormat('MMM dd, yyyy')}}",
          "emailFormat": "html",
          "message": "Dear {{$json.clientName}},<br><br>Please find attached your personalized portfolio performance report for this week.<br><br>Your portfolio value stands at ${{$json.portfolioValue}} as of market close today.<br><br>Should you have any questions about your holdings or performance, please don't hesitate to reach out.<br><br>Best regards,<br>Your Financial Advisor Team",
          "attachments": [
            {
              "type": "binary",
              "property": "data"
            }
          ]
        }
      },
      "id": "gmail-1",
      "name": "Email Report",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2,
      "position": [1120, 300],
      "credentials": {
        "gmailOAuth2": "// Replace with your Gmail credential ID"
      }
    }
  ],
  "connections": {
    "Every Friday 4PM": {
      "main": [
        [
          {
            "node": "Read Client Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Read Client Data": {
      "main": [
        [
          {
            "node": "Generate Report HTML",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Report HTML": {
      "main": [
        [
          {
            "node": "Create PDF Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create PDF Report": {
      "main": [
        [
          {
            "node": "Email Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "saveManualExecutions": true,
    "callerPolicy": "workflowsFromSameOwner"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 1,
  "updatedAt": "2026-06-12T00:00:00.000Z",
  "versionId": "1"
}
```

## Frequently Asked Questions

### What happens if a client's email bounces or Gmail fails to send?

The workflow will log the error in the execution history but continue processing remaining clients. Check the Gmail node execution details to see which specific email addresses failed. Add error handling by connecting a Set node after Gmail that logs failed sends to a separate Google Sheet for manual follow-up.

### How do I customize the report format or add charts to the PDF?

Modify the JavaScript code in the "Generate Report HTML" node to include additional HTML and CSS. For charts, generate base64-encoded chart images using a charting library like Chart.js in the code node, then embed them as data URLs in the HTML before PDF conversion.

### Can I send different report templates to different client tiers or portfolio sizes?

Add conditional logic in the Code node that checks the client's portfolio value or a "Tier" column in your spreadsheet. Use if/