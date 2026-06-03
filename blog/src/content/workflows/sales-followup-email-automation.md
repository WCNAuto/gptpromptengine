
---
title: "Automated Sales Follow-Up Email Sequences with n8n"
description: "Build automated email sequences to nurture leads and close more deals with personalized follow-up messages triggered by customer actions."
profession: "Sales"
category: "Lead Nurturing"
contentType: "workflow"
tags: ["sales", "email automation", "lead nurturing", "follow-up", "crm integration"]
pubDate: "2026-06-03"
featured: false
---

# Automated Sales Follow-Up Email Sequences with n8n

## Why This Automation Matters

Manual follow-up emails are time-consuming and prone to human error. This automation ensures no leads fall through the cracks by:

- **Consistent Communication**: Automatically sends timely follow-ups based on prospect behavior
- **Increased Conversion**: Nurtures leads with personalized content at optimal intervals
- **Time Savings**: Eliminates manual email scheduling and tracking
- **Scalability**: Handles hundreds of prospects simultaneously without additional effort
- **Performance Tracking**: Monitors open rates, clicks, and responses automatically

## What You Need Before Starting

### Required Tools
- n8n instance (Cloud or self-hosted)
- Email service provider (Gmail, Outlook, or SMTP)
- CRM system (HubSpot, Salesforce, or Airtable)
- Lead source (web form, landing page, or manual entry)

### Required Information
- Email templates for each sequence stage
- Timing intervals between emails (e.g., 1 day, 3 days, 1 week)
- Lead qualification criteria
- Unsubscribe handling process

### Permissions Needed
- Email account access for sending
- CRM read/write permissions
- Webhook endpoint access (if using external triggers)

## Complete Node-by-Node Build Instructions

### Step 1: Set Up the Trigger
1. Add a **Webhook** node as your starting point
2. Set the HTTP Method to "POST"
3. Set the Path to "/new-lead"
4. Configure Authentication if needed
5. Test the webhook URL with sample data

### Step 2: Validate and Parse Lead Data
1. Add an **IF** node after the webhook
2. Configure condition: `{{ $json.email }}` is not empty
3. Add second condition: `{{ $json.email }}` contains "@"
4. Connect "true" output to continue the workflow
5. Connect "false" output to an error notification

### Step 3: Check for Existing Lead
1. Add your **CRM node** (HubSpot/Salesforce/Airtable)
2. Set operation to "Search"
3. Search for existing contact by email: `{{ $json.email }}`
4. Add an **IF** node to check if lead exists
5. Route new leads to sequence, existing leads to update path

### Step 4: Create/Update Lead Record
1. Add **CRM node** for new lead creation
2. Set operation to "Create Contact"
3. Map fields:
   - Email: `{{ $json.email }}`
   - Name: `{{ $json.firstName }} {{ $json.lastName }}`
   - Lead Source: `{{ $json.source }}`
   - Sequence Status: "Active"
   - Sequence Step: "1"

### Step 5: Send First Follow-Up Email
1. Add **Gmail/Email** node
2. Configure recipient: `{{ $json.email }}`
3. Set subject: "Thanks for your interest, {{ $json.firstName }}!"
4. Add personalized email body with merge tags
5. Set up tracking parameters if available

### Step 6: Schedule Next Follow-Up
1. Add **Wait** node after the email
2. Set wait time to 24 hours
3. Add **CRM node** to check sequence status
4. Verify lead hasn't unsubscribed or converted

### Step 7: Send Second Follow-Up Email
1. Add another **Gmail/Email** node
2. Configure with different template
3. Subject: "Quick question about your {{ $json.industry }} goals"
4. Include case studies or relevant content
5. Add clear call-to-action

### Step 8: Continue Sequence Logic
1. Add **Wait** node (3 days)
2. Repeat CRM status check
3. Add third email with urgency/scarcity
4. Include final call-to-action

### Step 9: Handle Responses and Opt-Outs
1. Add **IF** node to check for replies
2. Route replies to sales team notification
3. Add unsubscribe handling logic
4. Update CRM status accordingly

### Step 10: Sequence Completion
1. Add final **CRM node** to update status
2. Set sequence status to "Completed"
3. Add lead score based on engagement
4. Trigger sales team notification for hot leads

## Full Workflow JSON Code

```json
{
  "name": "Sales Follow-Up Email Sequence",
  "nodes": [
    {
      "parameters": {
        "path": "/new-lead",
        "httpMethod": "POST"
      },
      "id": "webhook-trigger",
      "name": "New Lead Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.email }}",
              "operation": "isNotEmpty"
            }
          ]
        }
      },
      "id": "validate-email",
      "name": "Validate Email",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "resource": "contact",
        "operation": "search",
        "searchField": "email",
        "searchValue": "={{ $json.email }}"
      },
      "id": "check-existing-lead",
      "name": "Check Existing Lead",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.length }}",
              "operation": "equal",
              "value2": 0
            }
          ]
        }
      },
      "id": "is-new-lead",
      "name": "Is New Lead?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "resource": "contact",
        "operation": "create",
        "email": "={{ $('New Lead Webhook').item.json.email }}",
        "firstName": "={{ $('New Lead Webhook').item.json.firstName }}",
        "lastName": "={{ $('New Lead Webhook').item.json.lastName }}",
        "additionalFields": {
          "leadSource": "={{ $('New Lead Webhook').item.json.source }}",
          "sequenceStatus": "Active",
          "sequenceStep": "1"
        }
      },
      "id": "create-contact",
      "name": "Create Contact",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [1120, 200]
    },
    {
      "parameters": {
        "sendTo": "={{ $('New Lead Webhook').item.json.email }}",
        "subject": "Thanks for your interest, {{ $('New Lead Webhook').item.json.firstName }}!",
        "message": "Hi {{ $('New Lead Webhook').item.json.firstName }},\n\nThank you for your interest in our solution. I wanted to personally reach out to see how we can help you achieve your goals.\n\nI've helped companies like yours increase their revenue by 30% on average. Would you be open to a brief 15-minute call this week to discuss your specific challenges?\n\nBest regards,\n[Your Name]",
        "options": {
          "trackOpens": true,
          "trackClicks": true
        }
      },
      "id": "send-email-1",
      "name": "Send Welcome Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1340, 200]
    },
    {
      "parameters": {
        "amount": 1,
        "unit": "days"
      },
      "id": "wait-1-day",
      "name": "Wait 1 Day",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [1560, 200]
    },
    {
      "parameters": {
        "resource": "contact",
        "operation": "get",
        "contactId": "={{ $('Create Contact').item.json.id }}"
      },
      "id": "check-status-1",
      "name": "Check Sequence Status",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [1780, 200]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.properties.sequenceStatus }}",
              "operation": "equal",
              "value2": "Active"
            }
          ]
        }
      },
      "id": "still-active-1",
      "name": "Still Active?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [2000, 200]
    },
    {
      "parameters": {
        "sendTo": "={{ $('New Lead Webhook').item.json.email }}",
        "subject": "Quick question about your {{ $('New Lead Webhook').item.json.industry }} goals",
        "message": "Hi {{ $('New Lead Webhook').item.json.firstName }},\n\nI hope this email finds you well. I wanted to follow up on my previous message and share a quick case study that might interest you.\n\nWe recently helped [Similar Company] overcome [specific challenge] and achieve [specific result] in just 90 days.\n\nI'd love to learn more about your current challenges. Are you available for a brief call this week?\n\nBest regards,\n[Your Name]",
        "options": {
          "trackOpens": true,
          "trackClicks": true
        }
      },
      "id": "send-email-2",
      "name": "Send Follow-Up 2",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [2220, 120]
    },
    {
      "parameters": {
        "amount": 3,
        "unit": "days"
      },
      "id": "wait-3-days",
      "name": "Wait 3 Days",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [2440, 120]
    },
    {
      "parameters": {
        "resource": "contact",
        "operation": "get",
        "contactId": "={{ $('Create Contact').item.json.id }}"
      },
      "id": "check-status-2",
      "name": "Check Status Again",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [2660, 120]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.properties.sequenceStatus }}",
              "operation": "equal",
              "value2": "Active"
            }
          ]
        }
      },
      "id": "still-active-2",
      "name": "Still Active 2?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [2880, 120]
    },
    {
      "parameters": {
        "sendTo": "={{ $('New Lead Webhook').item.json.email }}",
        "subject": "Last chance - Special offer ending soon",
        "message": "Hi {{ $('New Lead Webhook').item.json.firstName }},\n\nI don't want you to miss out on this opportunity. This is my final follow-up, and I wanted to extend a special offer.\n\nFor this week only, we're offering a free consultation and strategy session (valued at $500) to help you [achieve specific goal].\n\nThis offer expires Friday. Would you like to schedule your complimentary session?\n\nSimply reply to this email or book directly at [calendar link].\n\nBest regards,\n[Your Name]"
      },
      "id": "send-email-3",
      "name": "Send Final Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [3100, 40]
    },
    {
      "parameters": {
        "resource": "contact",
        "operation": "update",
        "contactId": "={{ $('Create Contact').item.json.id }}",
        "updateFields": {
          "sequenceStatus": "Completed",
          "sequenceStep": "3"
        }
      },
      "id": "complete-sequence",
      "name": "Complete Sequence",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [3320, 40]
    }
  ],
  "connections": {
    "New Lead Webhook": {
      "main": [
        [
          {
            "node": "Validate Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Validate Email": {
      "main": [
        [
          {
            "node": "Check Existing Lead",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Existing Lead": {
      "main": [
        [
          {
            "node": "Is New Lead?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Is New Lead?": {
      "main": [
        [
          {
            "node": "Create Contact",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Contact": {
      "main": [
        [
          {
            "node": "Send Welcome Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Welcome Email": {
      "main": [
        [
          {
            "node": "Wait 1 Day",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait 1 Day": {
      "main": [
        [
          {
            "node": "Check Sequence Status",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Sequence Status": {
      "main": [
        [
          {
            "node": "Still Active?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Still Active?": {
      "main": [
        [
          {
            "node": "Send Follow-Up 2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Follow-Up 2": {
      "main": [
        [
          {
            "node": "Wait 3 Days",
            "type": "main",
            "index": 0
          }
