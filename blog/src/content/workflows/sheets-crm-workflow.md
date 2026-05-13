---
title: "Google Sheets CRM Automation Workflow for Sales Teams"
description: "Automate your sales CRM processes with Google Sheets using n8n. Track leads, update deal stages, and sync customer data automatically."
profession: "Sales"
category: "CRM Automation"
contentType: "workflow"
tags: ["google sheets", "crm", "sales automation", "lead management", "data sync"]
pubDate: "2026-05-13"
featured: false
---

# Google Sheets CRM Automation Workflow for Sales Teams

## Why This Automation Matters

Sales teams often struggle with manual data entry, inconsistent lead tracking, and scattered customer information across multiple platforms. This n8n workflow transforms a simple Google Sheet into a powerful CRM system that automatically:

- Captures new leads from various sources
- Updates deal stages and contact information
- Triggers follow-up actions based on sales milestones
- Maintains data consistency across your sales pipeline
- Saves hours of manual data entry each week

By automating these repetitive tasks, sales professionals can focus on what they do best: building relationships and closing deals.

## What You Need Before Starting

### Prerequisites
- Active n8n instance (cloud or self-hosted)
- Google account with Google Sheets access
- Basic understanding of spreadsheet structure
- Gmail account for email notifications (optional)

### Required Credentials
- Google Sheets API credentials configured in n8n
- Gmail OAuth2 credentials (if using email notifications)

### Recommended Sheet Structure
Create a Google Sheet with these columns:
- Lead ID (A)
- Company Name (B)
- Contact Name (C)
- Email (D)
- Phone (E)
- Deal Stage (F)
- Deal Value (G)
- Last Contact Date (H)
- Next Follow-up (I)
- Notes (J)

## Complete Node-by-Node Build Instructions

### Step 1: Set Up the Trigger
1. Add a **Webhook** node as your starting point
2. Set the webhook method to `POST`
3. Copy the webhook URL for external integrations
4. This will receive new lead data from forms, landing pages, or other sources

### Step 2: Process Incoming Data
1. Add a **Set** node after the webhook
2. Configure it to clean and structure the incoming data:
   - Map `company` to `company_name`
   - Map `name` to `contact_name`
   - Map `email` to `email_address`
   - Set `deal_stage` to "New Lead"
   - Set `created_date` to current timestamp

### Step 3: Check for Existing Records
1. Add a **Google Sheets** node
2. Configure the operation as "Read"
3. Select your CRM spreadsheet
4. Set range to cover all existing data (e.g., A:J)
5. This reads all current records to check for duplicates

### Step 4: Filter Duplicates
1. Add a **Code** node
2. Use JavaScript to check if the email already exists:
```javascript
const newEmail = $node["Set"].json["email_address"];
const existingData = $node["Google Sheets"].json;

const duplicate = existingData.find(row => row.Email === newEmail);

if (duplicate) {
  return [{ json: { action: "update", rowIndex: duplicate.rowIndex } }];
} else {
  return [{ json: { action: "create" } }];
}
```

### Step 5: Create New Lead Branch
1. Add an **IF** node
2. Set condition: `{{ $json.action }}` equals `create`
3. Connect the "true" output to a new **Google Sheets** node
4. Configure as "Append" operation
5. Map the processed data to appropriate columns

### Step 6: Update Existing Lead Branch
1. From the IF node "false" output, add another **Google Sheets** node
2. Configure as "Update" operation
3. Use the row index from the duplicate check
4. Update relevant fields while preserving existing data

### Step 7: Set Follow-up Date
1. Add a **Set** node after both create/update branches
2. Calculate next follow-up date (e.g., 3 days from now):
```javascript
const followUpDate = new Date();
followUpDate.setDate(followUpDate.getDate() + 3);
return { next_followup: followUpDate.toISOString().split('T')[0] };
```

### Step 8: Send Notification Email
1. Add a **Gmail** node
2. Configure to send email to sales team
3. Include lead details in email body:
   - Company name
   - Contact information
   - Deal stage
   - Assigned follow-up date

### Step 9: Schedule Follow-up Automation
1. Add a **Cron** node (separate workflow branch)
2. Set to run daily at 9 AM
3. Connect to **Google Sheets** node to read all records
4. Filter records where `Next Follow-up` equals today's date
5. Send reminder emails for due follow-ups

### Step 10: Deal Stage Progression
1. Add another **Webhook** node for deal updates
2. Connect to **Google Sheets** read operation
3. Find the specific deal by Lead ID
4. Update the deal stage and value
5. Log the activity with timestamp

## Full Workflow JSON Code

```json
{
  "name": "Google Sheets CRM Automation",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "new-lead",
        "responseMode": "responseNode"
      },
      "id": "webhook1",
      "name": "New Lead Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "company_name",
              "value": "={{ $json.body.company }}"
            },
            {
              "name": "contact_name",
              "value": "={{ $json.body.name }}"
            },
            {
              "name": "email_address",
              "value": "={{ $json.body.email }}"
            },
            {
              "name": "phone",
              "value": "={{ $json.body.phone }}"
            },
            {
              "name": "deal_stage",
              "value": "New Lead"
            },
            {
              "name": "created_date",
              "value": "={{ $now.format('yyyy-MM-dd') }}"
            }
          ]
        }
      },
      "id": "set1",
      "name": "Process Lead Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "sheetId": "YOUR_SHEET_ID",
        "range": "A:J",
        "keyRowIndex": 1
      },
      "id": "googlesheets1",
      "name": "Read Existing Records",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "const newEmail = $node[\"Process Lead Data\"].json[\"email_address\"];\nconst existingData = $input.all();\n\nconst duplicate = existingData.find(item => item.json.Email === newEmail);\n\nif (duplicate) {\n  return [{ json: { action: \"update\", existingRecord: duplicate.json } }];\n} else {\n  return [{ json: { action: \"create\" } }];\n}"
      },
      "id": "code1",
      "name": "Check Duplicates",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.action }}",
              "operation": "equal",
              "value2": "create"
            }
          ]
        }
      },
      "id": "if1",
      "name": "New or Existing Lead?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "operation": "append",
        "sheetId": "YOUR_SHEET_ID",
        "values": {
          "Lead ID": "={{ $runIndex + 1000 }}",
          "Company Name": "={{ $node[\"Process Lead Data\"].json[\"company_name\"] }}",
          "Contact Name": "={{ $node[\"Process Lead Data\"].json[\"contact_name\"] }}",
          "Email": "={{ $node[\"Process Lead Data\"].json[\"email_address\"] }}",
          "Phone": "={{ $node[\"Process Lead Data\"].json[\"phone\"] }}",
          "Deal Stage": "={{ $node[\"Process Lead Data\"].json[\"deal_stage\"] }}",
          "Deal Value": "0",
          "Last Contact Date": "={{ $node[\"Process Lead Data\"].json[\"created_date\"] }}",
          "Next Follow-up": "={{ DateTime.now().plus({ days: 3 }).toFormat('yyyy-MM-dd') }}",
          "Notes": "New lead from website"
        }
      },
      "id": "googlesheets2",
      "name": "Create New Lead",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [1340, 200]
    },
    {
      "parameters": {
        "operation": "update",
        "sheetId": "YOUR_SHEET_ID",
        "values": {
          "Last Contact Date": "={{ $now.format('yyyy-MM-dd') }}",
          "Notes": "Updated contact information"
        },
        "options": {
          "valueRenderOption": "USER_ENTERED"
        }
      },
      "id": "googlesheets3",
      "name": "Update Existing Lead",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [1340, 400]
    },
    {
      "parameters": {
        "sendTo": "sales@yourcompany.com",
        "subject": "New Lead: {{ $node[\"Process Lead Data\"].json[\"company_name\"] }}",
        "message": "A new lead has been added to your CRM:\n\nCompany: {{ $node[\"Process Lead Data\"].json[\"company_name\"] }}\nContact: {{ $node[\"Process Lead Data\"].json[\"contact_name\"] }}\nEmail: {{ $node[\"Process Lead Data\"].json[\"email_address\"] }}\nPhone: {{ $node[\"Process Lead Data\"].json[\"phone\"] }}\n\nNext follow-up scheduled for: {{ DateTime.now().plus({ days: 3 }).toFormat('yyyy-MM-dd') }}"
      },
      "id": "gmail1",
      "name": "Send Notification",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1560, 300]
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * *"
            }
          ]
        }
      },
      "id": "cron1",
      "name": "Daily Follow-up Check",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 600]
    },
    {
      "parameters": {
        "operation": "read",
        "sheetId": "YOUR_SHEET_ID",
        "range": "A:J",
        "keyRowIndex": 1
      },
      "id": "googlesheets4",
      "name": "Read All Leads",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [460, 600]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json[\"Next Follow-up\"] }}",
              "operation": "equal",
              "value2": "={{ $now.format('yyyy-MM-dd') }}"
            }
          ]
        }
      },
      "id": "if2",
      "name": "Due for Follow-up?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [680, 600]
    },
    {
      "parameters": {
        "sendTo": "sales@yourcompany.com",
        "subject": "Follow-up Due: {{ $json[\"Company Name\"] }}",
        "message": "Reminder: Follow-up is due today for:\n\nCompany: {{ $json[\"Company Name\"] }}\nContact: {{ $json[\"Contact Name\"] }}\nEmail: {{ $json[\"Email\"] }}\nDeal Stage: {{ $json[\"Deal Stage\"] }}\nDeal Value: ${{ $json[\"Deal Value\"] }}\n\nLast Contact: {{ $json[\"Last Contact Date\"] }}\nNotes: {{ $json[\"Notes\"] }}"
      },
      "id": "gmail2",
      "name": "Follow-up Reminder",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [900, 600]
    }
  ],
  "connections": {
    "New Lead Webhook": {
      "main": [
        [
          {
            "node": "Process Lead Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Lead Data": {
      "main": [
        [
          {
            "node": "Read Existing Records",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Read Existing Records": {
      "main": [
        [
          {
            "node": "Check Duplicates",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Duplicates": {
      "main": [
        [
          {
            "node": "New or Existing Lead?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "New or Existing Lead?": {
      "main": [
        [
          {
            "node": "Create New Lead",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Update Existing Lead",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create New Lead": {
      "main": [
        [
          {
            "node": "Send Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update Existing Lead": {
      "main": [
        [
          {
            "node": "Send Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Daily Follow-up Check": {
      "main": [
        [
          {
            "node": "Read All Leads",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },