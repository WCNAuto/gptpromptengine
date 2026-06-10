---
title: "N8N Workflow for Virtual Assistant Inbox Zero Automation 2026"
description: "Complete n8n workflow to auto-sort, label, and archive emails by priority rules. Achieve inbox zero in 15 minutes daily instead of 2 hours."
profession: "Virtual Assistants"
category: "Email"
contentType: workflow
tags: ["n8n workflow for virtual assistant inbox zero automation", "email automation for virtual assistants", "inbox zero n8n workflow", "automated email sorting", "virtual assistant email management"]
pubDate: 2026-06-10
featured: false
---

This workflow automatically processes your Gmail inbox every 30 minutes, sorting emails into labeled folders based on sender importance, keywords, and urgency markers. Instead of spending 2 hours daily managing client emails manually, you'll review pre-sorted priority folders in 15 minutes each morning.

## Why this automation matters

Manual email sorting means important client requests sit buried under newsletters and automated notifications. Missing a priority email costs client relationships and creates emergency fire-drills. This workflow ensures high-priority emails from your client list get labeled "URGENT" and moved to a priority folder, while promotional emails auto-archive after being labeled "Low Priority".

## What you need before starting

- Gmail OAuth2 credential connected to your primary work Gmail account
- Google Sheets OAuth2 credential connected to the same Google account
- A Google Sheet named "Email Rules" with columns: Sender Email, Priority Level, Action
- Gmail API enabled in your Google Cloud Console for the connected account

## How to build it: step by step

### 1. Cron Trigger — Run every 30 minutes

Node type: Cron
Schedule: `*/30 * * * *`
Output: Triggers the workflow every 30 minutes during business hours.
Why this matters: Frequent processing prevents important emails from sitting unread for hours while keeping API usage reasonable.

### 2. Gmail — Read unread emails

Node type: Gmail
Operation: Get All
Resource: Message
Options: Only Unread Messages = true, Max Results = 50
Output: Array of unread Gmail message objects with sender, subject, and content.
Why this matters: Limiting to 50 unread messages prevents timeout errors while processing the most recent emails first.

### 3. Google Sheets — Load email rules

Node type: Google Sheets
Operation: Read
Document: Email Rules
Sheet: Sheet1
Options: Has Header Row = true
Output: Array of rules with sender email addresses, priority levels, and actions to take.
Why this matters: Centralizes your email sorting rules so you can update priorities without rebuilding the workflow.

### 4. Set — Prepare email data

Node type: Set
Keep Only Set: false
Values to Set:
- senderEmail = `{{ $json.payload.headers.find(h => h.name === 'From').value.match(/<(.+)>/)?.[1] || $json.payload.headers.find(h => h.name === 'From').value }}`
- subject = `{{ $json.payload.headers.find(h => h.name === 'Subject').value }}`
- messageId = `{{ $json.id }}`
Output: Cleaned email data with extracted sender address, subject line, and message ID.
Why this matters: Gmail's raw header format needs parsing to match against your rules spreadsheet.

### 5. Merge — Match emails to rules

Node type: Merge
Mode: Keep Matches
Join: Left Join
Left Field: senderEmail
Right Field: Sender Email
Output: Emails with their matching priority rules attached, or null for no matches.
Why this matters: Connects each email to its corresponding action rule, or identifies emails that need default handling.

### 6. IF — Check if rule exists

Node type: IF
Condition: Expression = `{{ $json["Priority Level"] !== undefined }}`
Output True: Emails that matched a rule in your spreadsheet.
Output False: Emails with no matching rule that get default processing.
Why this matters: Handles unknown senders gracefully instead of breaking the workflow.

### 7. Gmail — Apply priority label (True branch)

Node type: Gmail
Operation: Update
Resource: Message
Message ID: `{{ $json.messageId }}`
Add Labels: `{{ $json["Priority Level"] }}`
Remove Labels: UNREAD
Output: Successfully labeled and marked-as-read priority emails.
Why this matters: High-priority emails get visual labels in Gmail and are marked as processed.

### 8. Gmail — Archive low priority (True branch, priority = "Low Priority")

Node type: Gmail
Operation: Update
Resource: Message
Message ID: `{{ $json.messageId }}`
Remove Labels: INBOX
Condition: `{{ $json["Priority Level"] === "Low Priority" }}`
Output: Low-priority emails removed from inbox view but preserved in All Mail.
Why this matters: Keeps promotional emails accessible for reference without cluttering your inbox.

### 9. Gmail — Default processing (False branch)

Node type: Gmail
Operation: Update
Resource: Message
Message ID: `{{ $json.messageId }}`
Add Labels: Needs Review
Output: Unknown emails labeled for manual review.
Why this matters: New senders don't get ignored, but they're flagged for you to create rules later.

## Full workflow JSON

```json
{
  "name": "VA Inbox Zero Automation",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "*/30 * * * *"
            }
          ]
        }
      },
      "id": "1",
      "name": "Every 30 minutes",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "getAll",
        "returnAll": false,
        "limit": 50,
        "simple": false,
        "options": {
          "includeSpamTrash": false,
          "q": "is:unread"
        }
      },
      "id": "2",
      "name": "Get Unread Emails",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2,
      "position": [460, 300],
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your Gmail OAuth2 credential ID",
          "name": "Gmail account"
        }
      }
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": {
          "__rl": true,
          "value": "// Replace with your Email Rules sheet ID",
          "mode": "list",
          "cachedResultName": "Email Rules"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "list",
          "cachedResultName": "Sheet1"
        },
        "options": {
          "hasHeaderRow": true
        }
      },
      "id": "3",
      "name": "Load Email Rules",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [460, 480],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "// Replace with your Google Sheets OAuth2 credential ID",
          "name": "Google Sheets account"
        }
      }
    },
    {
      "parameters": {
        "keepOnlySet": false,
        "values": {
          "string": [
            {
              "name": "senderEmail",
              "value": "={{ $json.payload.headers.find(h => h.name === 'From').value.match(/<(.+)>/)?.[1] || $json.payload.headers.find(h => h.name === 'From').value }}"
            },
            {
              "name": "subject",
              "value": "={{ $json.payload.headers.find(h => h.name === 'Subject').value }}"
            },
            {
              "name": "messageId",
              "value": "={{ $json.id }}"
            }
          ]
        },
        "options": {}
      },
      "id": "4",
      "name": "Extract Email Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [680, 300]
    },
    {
      "parameters": {
        "mode": "keepMatches",
        "joinBy": "field",
        "propertyName1": "senderEmail",
        "propertyName2": "Sender Email"
      },
      "id": "5",
      "name": "Match Rules",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 2,
      "position": [900, 390]
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
              "leftValue": "={{ $json['Priority Level'] }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "notEmpty"
              }
            }
          ],
          "combinator": "and"
        }
      },
      "id": "6",
      "name": "Rule Exists?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1120, 390]
    },
    {
      "parameters": {
        "operation": "update",
        "messageId": "={{ $json.messageId }}",
        "updateFields": {
          "addLabelIds": [
            "={{ $json['Priority Level'] }}"
          ],
          "removeLabelIds": [
            "UNREAD"
          ]
        }
      },
      "id": "7",
      "name": "Apply Priority Label",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2,
      "position": [1340, 300],
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your Gmail OAuth2 credential ID",
          "name": "Gmail account"
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
              "leftValue": "={{ $json['Priority Level'] }}",
              "rightValue": "Low Priority",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        }
      },
      "id": "8",
      "name": "Low Priority?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1560, 300]
    },
    {
      "parameters": {
        "operation": "update",
        "messageId": "={{ $json.messageId }}",
        "updateFields": {
          "removeLabelIds": [
            "INBOX"
          ]
        }
      },
      "id": "9",
      "name": "Archive Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2,
      "position": [1780, 200],
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your Gmail OAuth2 credential ID",
          "name": "Gmail account"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "messageId": "={{ $json.messageId }}",
        "updateFields": {
          "addLabelIds": [
            "Needs Review"
          ]
        }
      },
      "id": "10",
      "