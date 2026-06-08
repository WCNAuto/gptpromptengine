---
title: "n8n Workflow for Inventory Low Stock Alert Automation 2026"
description: "Copy-paste n8n workflow that monitors inventory levels and sends email alerts when stock drops below threshold. Setup takes 10 minutes."
profession: "Ecommerce"
category: "Inventory"
contentType: workflow
tags: ["n8n workflow for inventory low stock alert automation", "inventory management automation", "low stock email alerts", "ecommerce stock monitoring", "automated inventory tracking"]
pubDate: 2026-06-08
featured: false
---

This workflow monitors your inventory spreadsheet every hour and automatically sends email alerts when any product drops below your minimum stock threshold. It connects Google Sheets to Gmail, eliminating the daily manual check that takes 15 minutes every morning and prevents stockouts that cost sales.

## Why this automation matters

Without this automation, you manually check inventory levels daily, risking missed low-stock situations that lead to lost sales and disappointed customers. When you're managing 50+ SKUs, a single overlooked row means a product goes out of stock for days before you notice. This workflow catches low stock within one hour and immediately alerts your purchasing team via email.

## What you need before starting

- Google Sheets OAuth2 credential connected to the account that owns your inventory spreadsheet
- Gmail OAuth2 credential for the email account that will send alerts
- Google Sheets document with columns: Product Name (A), Current Stock (B), Minimum Stock (C)
- Schedule Trigger node (built into n8n)
- Google Sheets node
- IF node
- Gmail node

## How to build it: step by step

### 1. Schedule Trigger — Run inventory check every hour

Node type: Schedule Trigger
Trigger Interval: Hours
Hours: 1
This trigger executes the workflow every 60 minutes, ensuring low stock situations are caught quickly without overwhelming your email with constant checks.

### 2. Google Sheets — Read all inventory data

Node type: Google Sheets
Operation: Read Rows
Document: Select your inventory tracking spreadsheet
Sheet: Sheet1 (or your inventory sheet name)
Range: A:C
Return all: Enabled
This node fetches all product rows with Name, Current Stock, and Minimum Stock columns, passing each row as a separate item to the next node for individual evaluation.

### 3. IF — Check if current stock is below minimum

Node type: IF
Condition Type: Number
Value 1: {{ $json.B }} (Current Stock column)
Operation: Smaller
Value 2: {{ $json.C }} (Minimum Stock column)
This comparison identifies products where current inventory has dropped below the reorder point, filtering out products with adequate stock levels.

### 4. Gmail — Send low stock alert email

Node type: Gmail
Operation: Send Email
To: purchasing@yourstore.com
Subject: LOW STOCK ALERT: {{ $json.A }}
Message: Product "{{ $json.A }}" is running low. Current stock: {{ $json.B }} units. Minimum required: {{ $json.C }} units. Please reorder immediately.
This node sends one email per low-stock product with specific quantities, giving your team the exact information needed to place reorders.

## Full workflow JSON

```json
{
  "name": "Inventory Low Stock Alert",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "hours",
              "hoursInterval": 1
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
        "operation": "read",
        "documentId": {
          "__rl": true,
          "value": "YOUR_SPREADSHEET_ID",
          "mode": "list",
          "cachedResultName": "Inventory Tracker"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Sheet1"
        },
        "range": "A:C",
        "options": {}
      },
      "name": "Google Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4.4,
      "position": [
        460,
        300
      ],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "REPLACE_WITH_YOUR_GOOGLE_SHEETS_CREDENTIAL_ID",
          "name": "Google Sheets account"
        }
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
              "id": "1",
              "leftValue": "={{ parseInt($json.B) }}",
              "rightValue": "={{ parseInt($json.C) }}",
              "operator": {
                "type": "number",
                "operation": "smaller"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "name": "IF",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [
        680,
        300
      ]
    },
    {
      "parameters": {
        "operation": "send",
        "options": {},
        "subject": "LOW STOCK ALERT: {{ $json.A }}",
        "message": "Product \"{{ $json.A }}\" is running low.\n\nCurrent stock: {{ $json.B }} units\nMinimum required: {{ $json.C }} units\n\nPlease reorder immediately to avoid stockout.",
        "toList": "purchasing@yourstore.com"
      },
      "name": "Gmail",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [
        900,
        300
      ],
      "credentials": {
        "gmailOAuth2": {
          "id": "REPLACE_WITH_YOUR_GMAIL_CREDENTIAL_ID",
          "name": "Gmail account"
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
            "node": "IF",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "IF": {
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
  "pinData": {},
  "meta": {
    "templateCredsSetupCompleted": true
  }
}
```

## Frequently Asked Questions

### What happens if my spreadsheet has empty rows or non-numeric stock values?
The IF node's parseInt() function converts text to numbers and treats empty cells as 0. If you have header rows, exclude them by changing the Google Sheets range from A:C to A2:C to skip the first row.

### Can I customize the alert email to include supplier contact information?
Yes, add a column D for supplier email in your spreadsheet, then modify the Gmail message parameter to include "{{ $json.D }}" and change the "To" field to send directly to suppliers instead of your purchasing team.

### How do I prevent getting alerts for the same low-stock product every hour?
Add a column E called "Alert Sent" to track notifications. Modify the IF condition to check both stock levels AND whether the Alert Sent column is empty, then use another Google Sheets node after Gmail to mark "Yes" in column E when alerts are sent.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.