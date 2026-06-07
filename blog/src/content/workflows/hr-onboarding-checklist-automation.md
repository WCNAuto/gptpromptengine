---
title: "n8n Automation for Employee Onboarding Checklist HR Tasks in 2026"
description: "Automate onboarding task creation and tracking with this n8n workflow. Creates Trello cards, sends Slack notifications when new hires are added to Google Sheets."
profession: "HR Managers"
category: "Onboarding"
contentType: workflow
tags: ["n8n automation for employee onboarding checklist hr", "employee onboarding automation", "hr checklist workflow", "new hire task automation", "onboarding process automation"]
pubDate: 2026-06-07
featured: false
---

This workflow monitors your Google Sheets onboarding tracker and automatically creates a complete checklist of tasks in Trello when a new employee is added, then notifies your team via Slack. It eliminates the 20 minutes you spend manually creating onboarding cards and prevents tasks from being forgotten when you're processing multiple new hires in one week.

## Why this automation matters

Without this automation, you manually create 8-12 onboarding tasks in Trello every time someone new joins, copy their details across systems, and remember to notify the right people. When you're onboarding 3 people in one week, that manual checklist creation takes 45 minutes and you risk missing critical tasks like IT setup or manager introductions. This workflow creates the complete task list in under 30 seconds and ensures nothing falls through the cracks.

## What you need before starting

- Google Sheets OAuth2 credential connected to the account that owns your employee onboarding tracker sheet
- Trello API credential with access to your HR onboarding board
- Slack OAuth2 credential with permissions to post messages to your HR channel
- A Google Sheet with columns: Employee Name, Start Date, Department, Manager, Status
- A Trello board with lists named "Not Started", "In Progress", and "Complete"

## How to build it: step by step

### 1. Google Sheets Trigger — Watch for new employees

Node type: Google Sheets Trigger
Trigger On: Row Added
Document: Your onboarding tracker sheet ID
Sheet: Sheet1
What it outputs: The complete row data whenever a new employee is added to the sheet
Why this matters: The trigger fires immediately when HR adds a new hire, ensuring onboarding tasks are created before the employee's first day.

### 2. Trello — Create IT Setup Task

Node type: Trello
Operation: Create a Card
Board: HR Onboarding Board
List: Not Started
Name: `IT Setup - {{$json["Employee Name"]}}`
Description: `Set up laptop, email account, and system access for {{$json["Employee Name"]}}. Start date: {{$json["Start Date"]}}. Department: {{$json["Department"]}}.`
What it outputs: The created Trello card with ID and URL
Why this matters: Creates a trackable task for IT setup with all employee details embedded so IT knows exactly what to prepare.

### 3. Trello — Create Manager Introduction Task

Node type: Trello
Operation: Create a Card
Board: HR Onboarding Board
List: Not Started
Name: `Manager Introduction - {{$json["Employee Name"]}}`
Description: `Schedule introduction meeting between {{$json["Employee Name"]}} and manager {{$json["Manager"]}}. Ensure manager has onboarding plan ready.`
What it outputs: The created Trello card for manager coordination
Why this matters: Ensures the direct manager is actively involved in onboarding rather than assuming they'll remember to reach out.

### 4. Trello — Create Documentation Task

Node type: Trello
Operation: Create a Card
Board: HR Onboarding Board
List: Not Started
Name: `Documentation Package - {{$json["Employee Name"]}}`
Description: `Prepare and send employee handbook, department procedures, and role-specific documentation to {{$json["Employee Name"]}}.`
What it outputs: The documentation task card details
Why this matters: Standardizes document delivery so new hires receive consistent information regardless of who processes their onboarding.

### 5. Slack — Notify HR Team

Node type: Slack
Operation: Post Message
Channel: #hr-team
Text: `🎉 New hire onboarding started for {{$json["Employee Name"]}}! 
Department: {{$json["Department"]}}
Start Date: {{$json["Start Date"]}}
Manager: {{$json["Manager"]}}

Trello tasks created automatically. Check the HR Onboarding board for task assignments.`
What it outputs: Confirmation that the Slack message was posted
Why this matters: Keeps the entire HR team informed and creates accountability for following through on the generated tasks.

## Full workflow JSON

```json
{
  "name": "Employee Onboarding Checklist Automation",
  "nodes": [
    {
      "parameters": {
        "sheetId": "// Replace with your Google Sheets document ID",
        "range": "Sheet1",
        "triggerOn": "rowAdded"
      },
      "id": "8b2c5f1a-9d3e-4a6b-8c7d-1e2f3a4b5c6d",
      "name": "Google Sheets Trigger",
      "type": "n8n-nodes-base.googleSheetsTrigger",
      "typeVersion": 2,
      "position": [240, 300],
      "credentials": {
        "googleSheetsOAuth2Api": "// Replace with your Google Sheets credential ID"
      }
    },
    {
      "parameters": {
        "resource": "card",
        "operation": "create",
        "boardId": "// Replace with your Trello board ID",
        "listId": "// Replace with your 'Not Started' list ID",
        "name": "=IT Setup - {{$json[\"Employee Name\"]}}",
        "description": "=Set up laptop, email account, and system access for {{$json[\"Employee Name\"]}}. Start date: {{$json[\"Start Date\"]}}. Department: {{$json[\"Department\"]}}."
      },
      "id": "7a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
      "name": "Create IT Setup Task",
      "type": "n8n-nodes-base.trello",
      "typeVersion": 1,
      "position": [460, 200],
      "credentials": {
        "trelloApi": "// Replace with your Trello credential ID"
      }
    },
    {
      "parameters": {
        "resource": "card",
        "operation": "create",
        "boardId": "// Replace with your Trello board ID",
        "listId": "// Replace with your 'Not Started' list ID",
        "name": "=Manager Introduction - {{$json[\"Employee Name\"]}}",
        "description": "=Schedule introduction meeting between {{$json[\"Employee Name\"]}} and manager {{$json[\"Manager\"]}}. Ensure manager has onboarding plan ready."
      },
      "id": "9b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
      "name": "Create Manager Introduction Task",
      "type": "n8n-nodes-base.trello",
      "typeVersion": 1,
      "position": [460, 300],
      "credentials": {
        "trelloApi": "// Replace with your Trello credential ID"
      }
    },
    {
      "parameters": {
        "resource": "card",
        "operation": "create",
        "boardId": "// Replace with your Trello board ID",
        "listId": "// Replace with your 'Not Started' list ID",
        "name": "=Documentation Package - {{$json[\"Employee Name\"]}}",
        "description": "=Prepare and send employee handbook, department procedures, and role-specific documentation to {{$json[\"Employee Name\"]}}."
      },
      "id": "1c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
      "name": "Create Documentation Task",
      "type": "n8n-nodes-base.trello",
      "typeVersion": 1,
      "position": [460, 400],
      "credentials": {
        "trelloApi": "// Replace with your Trello credential ID"
      }
    },
    {
      "parameters": {
        "channel": "#hr-team",
        "text": "=🎉 New hire onboarding started for {{$json[\"Employee Name\"]}}!\nDepartment: {{$json[\"Department\"]}}\nStart Date: {{$json[\"Start Date\"]}}\nManager: {{$json[\"Manager\"]}}\n\nTrello tasks created automatically. Check the HR Onboarding board for task assignments.",
        "otherOptions": {}
      },
      "id": "2d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
      "name": "Notify HR Team",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [680, 300],
      "credentials": {
        "slackOAuth2Api": "// Replace with your Slack credential ID"
      }
    }
  ],
  "connections": {
    "Google Sheets Trigger": {
      "main": [
        [
          {
            "node": "Create IT Setup Task",
            "type": "main",
            "index": 0
          },
          {
            "node": "Create Manager Introduction Task",
            "type": "main",
            "index": 0
          },
          {
            "node": "Create Documentation Task",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Manager Introduction Task": {
      "main": [
        [
          {
            "node": "Notify HR Team",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "4a7c82f1-9d2e-4b6a-8c3f-1e5a7b9c2d4f",
  "id": "1",
  "meta": {
    "instanceId": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

## Frequently Asked Questions

### What happens if someone manually edits an existing row instead of adding a new one?
The Google Sheets trigger only fires on new row additions, not edits. If you need to handle status changes on existing employees, add a second trigger node configured for "Row Updated" and filter it to only process rows where the Status column changes to a specific value like "Active".

### How can I add different tasks based on the employee's department?
Add an IF node after the Google Sheets trigger that checks the Department column value. Create separate branches for each department with their specific Trello card creation nodes. For example, Sales employees might need CRM access tasks while Engineering employees need development environment setup tasks.

### Can this workflow handle bulk imports when I add multiple employees at once?
Yes, the workflow processes each new row individually, so adding 5 employees simultaneously creates 5 separate sets of tasks. However, if you're importing more than 10 employees at once, consider temporarily disabling the workflow and running it manually afterward to avoid hitting API rate limits on Trello or Slack.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.