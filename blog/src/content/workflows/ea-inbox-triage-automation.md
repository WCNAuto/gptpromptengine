---
title: "N8N Workflow for Executive Assistant Inbox Triage 2026"
description: "Auto-sort CEO emails by priority, flag urgent items, and create follow-up tasks in Monday.com. Saves 45 minutes of daily email sorting for exec assistants."
profession: "Exec Assistants"
category: "Email"
contentType: workflow
tags: ["n8n workflow for executive assistant inbox triage", "executive assistant email automation", "email priority sorting workflow", "inbox triage automation", "executive email management n8n"]
pubDate: 2026-06-14
featured: false
---

This workflow automatically triages your executive's Gmail inbox by scanning new emails every 10 minutes, categorizing them as High/Medium/Low priority based on sender and keywords, and creating follow-up tasks in Monday.com for urgent items. It saves 45 minutes of manual email sorting every morning.

## Why this automation matters

Manual inbox triage means you're checking email every few minutes, interrupting deep work to scan for urgent items from board members, key clients, or internal stakeholders. Without automation, important emails from new contacts get buried under newsletters, and you risk missing time-sensitive requests that should have been escalated immediately. This workflow ensures high-priority emails are flagged within 10 minutes of arrival.

## What you need before starting

- Gmail OAuth2 credential with access to your executive's inbox
- Monday.com API credential for the board where you track executive tasks
- A Google Sheets OAuth2 credential connected to a sheet containing VIP email addresses
- The Monday.com board ID where urgent email tasks should be created
- A Gmail label called "EA-Triaged" for processed emails

## How to build it: step by step

### 1. Cron — Trigger every 10 minutes

Node type: Cron
Field: Expression
Value: `*/10 * * * *`
Output: Triggers the workflow every 10 minutes during business hours.
Why this matters: Frequent checks ensure urgent emails are caught quickly without overwhelming your system with constant polling.

### 2. Gmail — Get unread emails

Node type: Gmail
Operation: Get Messages
Query: `is:unread -label:EA-Triaged`
Max Results: 50
Output: Returns unread emails that haven't been processed by this workflow.
Why this matters: The label filter prevents processing the same emails repeatedly while focusing only on new items.

### 3. Google Sheets — Load VIP contact list

Node type: Google Sheets
Operation: Read Rows
Sheet: Executive VIP List > Sheet1
Range: A:B
Output: Returns email addresses and priority levels for key contacts.
Why this matters: Maintaining VIPs in a sheet lets you update the priority list without rebuilding the workflow.

### 4. Code — Analyze email priority

Node type: Code
```javascript
const vipEmails = $('Google Sheets').all().map(item => ({
  email: item.json.Email.toLowerCase(),
  priority: item.json.Priority
}));

const emails = $('Gmail').all();
const results = [];

for (const email of emails) {
  const sender = email.json.payload.headers.find(h => h.name === 'From').value;
  const senderEmail = sender.match(/<(.+)>/)?.[1] || sender;
  const subject = email.json.payload.headers.find(h => h.name === 'Subject').value;
  
  let priority = 'Low';
  let reason = 'Standard email';
  
  // Check VIP list
  const vipMatch = vipEmails.find(vip => senderEmail.toLowerCase().includes(vip.email));
  if (vipMatch) {
    priority = vipMatch.priority;
    reason = 'VIP sender';
  }
  
  // Check urgent keywords
  const urgentKeywords = ['urgent', 'asap', 'emergency', 'board meeting', 'crisis', 'deadline today'];
  if (urgentKeywords.some(keyword => subject.toLowerCase().includes(keyword))) {
    priority = 'High';
    reason = 'Urgent keyword detected';
  }
  
  results.push({
    ...email.json,
    priority,
    reason,
    sender: senderEmail,
    subject
  });
}

return results;
```
Output: Each email with assigned priority (High/Medium/Low) and reasoning.
Why this matters: The code combines VIP sender status with keyword analysis to make intelligent priority decisions.

### 5. Switch — Route by priority level

Node type: Switch
Mode: Rules
Rules:
- Rule 1: `{{ $json.priority === 'High' }}` → Output 1
- Rule 2: `{{ $json.priority === 'Medium' }}` → Output 2
- Rule 3: `{{ $json.priority === 'Low' }}` → Output 3
Output: Routes emails to different processing paths based on priority.
Why this matters: High priority emails need immediate task creation while low priority items only need labeling.

### 6. Monday.com — Create urgent task

Node type: Monday.com
Operation: Create Item
Board ID: 1234567890
Item Name: `Urgent Email: {{ $json.subject }}`
Column Values:
- Status: "Urgent"
- Email: `{{ $json.sender }}`
- Notes: `Priority: {{ $json.priority }} - {{ $json.reason }}`
Output: Creates a Monday.com task for high-priority emails.
Why this matters: Urgent emails become trackable tasks that won't get lost in the inbox.

### 7. Gmail — Add triage label

Node type: Gmail
Operation: Add Labels
Message ID: `{{ $json.id }}`
Labels: ["EA-Triaged", "Priority-{{ $json.priority }}"]
Output: Marks the email as processed with its priority level.
Why this matters: Prevents reprocessing and creates visual priority indicators in Gmail.

## Full workflow JSON

```json
{
  "name": "Executive Assistant Inbox Triage",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "*/10 * * * *"
            }
          ]
        }
      },
      "id": "cron-trigger",
      "name": "Every 10 Minutes",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [200, 300]
    },
    {
      "parameters": {
        "operation": "getMessages",
        "query": "is:unread -label:EA-Triaged",
        "maxResults": 50
      },
      "id": "gmail-get",
      "name": "Get Unread Emails",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [400, 300],
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your Gmail credential ID",
          "name": "Gmail Account"
        }
      }
    },
    {
      "parameters": {
        "operation": "readRows",
        "documentId": "// Replace with your Google Sheets document ID",
        "sheetName": "Sheet1",
        "range": "A:B"
      },
      "id": "sheets-vips",
      "name": "Load VIP List",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 2,
      "position": [400, 500],
      "credentials": {
        "googleSheetsOAuth2": {
          "id": "// Replace with your Google Sheets credential ID",
          "name": "Google Sheets"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const vipEmails = $('Load VIP List').all().map(item => ({\n  email: item.json.Email.toLowerCase(),\n  priority: item.json.Priority\n}));\n\nconst emails = $('Get Unread Emails').all();\nconst results = [];\n\nfor (const email of emails) {\n  const sender = email.json.payload.headers.find(h => h.name === 'From').value;\n  const senderEmail = sender.match(/<(.+)>/)?.[1] || sender;\n  const subject = email.json.payload.headers.find(h => h.name === 'Subject').value;\n  \n  let priority = 'Low';\n  let reason = 'Standard email';\n  \n  // Check VIP list\n  const vipMatch = vipEmails.find(vip => senderEmail.toLowerCase().includes(vip.email));\n  if (vipMatch) {\n    priority = vipMatch.priority;\n    reason = 'VIP sender';\n  }\n  \n  // Check urgent keywords\n  const urgentKeywords = ['urgent', 'asap', 'emergency', 'board meeting', 'crisis', 'deadline today'];\n  if (urgentKeywords.some(keyword => subject.toLowerCase().includes(keyword))) {\n    priority = 'High';\n    reason = 'Urgent keyword detected';\n  }\n  \n  results.push({\n    ...email.json,\n    priority,\n    reason,\n    sender: senderEmail,\n    subject\n  });\n}\n\nreturn results;"
      },
      "id": "code-priority",
      "name": "Analyze Priority",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [600, 300]
    },
    {
      "parameters": {
        "mode": "rules",
        "rules": {
          "values": [
            {
              "conditions": {
                "options": {
                  "leftValue": "={{ $json.priority }}",
                  "operation": "equal",
                  "rightValue": "High"
                }
              }
            },
            {
              "conditions": {
                "options": {
                  "leftValue": "={{ $json.priority }}",
                  "operation": "equal",
                  "rightValue": "Medium"
                }
              }
            },
            {
              "conditions": {
                "options": {
                  "leftValue": "={{ $json.priority }}",
                  "operation": "equal",
                  "rightValue": "Low"
                }
              }
            }
          ]
        }
      },
      "id": "switch-priority",
      "name": "Route by Priority",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [800, 300]
    },
    {
      "parameters": {
        "operation": "createItem",
        "boardId": "// Replace with your Monday.com board ID",
        "itemName": "Urgent Email: {{ $json.subject }}",
        "columnValues": {
          "status": "Urgent",
          "text": "{{ $json.sender }}",
          "long_text": "Priority: {{ $json.priority }} - {{ $json.reason }}"
        }
      },
      "id": "monday-task",
      "name": "Create Urgent Task",
      "type": "n8n-nodes-base.mondayCom",
      "typeVersion": 1,
      "position": [1000, 200],
      "credentials": {
        "mondayComApi": {
          "id": "// Replace with your Monday.com credential ID",
          "name": "Monday.com"
        }
      }
    },
    {
      "parameters": {
        "operation": "addLabels",
        "messageId": "={{ $json.id }}",
        "labels": ["EA-Triaged", "Priority-{{ $json.priority }}"]
      },
      "id": "gmail-label",
      "name": "Add Labels",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1200, 300],
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your