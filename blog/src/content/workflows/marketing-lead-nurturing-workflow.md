---
title: "Automated Lead Nurturing Email Sequence with n8n"
description: "Build a complete lead nurturing automation that segments new leads and delivers personalized email sequences based on their interests and engagement levels"
profession: "Marketing Managers"
category: "Email Marketing"
contentType: "workflow"
tags: ["lead-nurturing", "email-automation", "marketing", "crm", "segmentation"]
pubDate: "2026-05-13"
featured: false
---

# Automated Lead Nurturing Email Sequence with n8n

## Why This Automation Matters

Lead nurturing is the backbone of successful marketing campaigns, but manually managing email sequences for hundreds or thousands of leads is time-consuming and error-prone. This n8n automation creates a sophisticated lead nurturing system that:

- **Automatically segments leads** based on their source, interests, and behavior
- **Delivers personalized email sequences** at optimal timing intervals
- **Tracks engagement** and adjusts messaging accordingly
- **Maintains CRM data** with lead scoring and status updates
- **Saves 15+ hours per week** typically spent on manual lead management

Marketing managers can focus on strategy and content creation while the automation handles the complex orchestration of multi-touch campaigns.

## What You Need Before Starting

### Required Tools & Accounts
- **n8n Cloud or self-hosted instance** (recommended: n8n Cloud for reliability)
- **Email service provider** (Gmail, Mailgun, SendGrid, or similar)
- **CRM system** (HubSpot, Pipedrive, Airtable, or Google Sheets)
- **Form/Lead capture tool** (Typeform, Gravity Forms, or webhook-enabled form)

### Required Credentials
- Email service API credentials
- CRM system API access
- Webhook URLs configured in your lead capture forms

### Preparation Steps
1. Create email templates for your nurturing sequence (5-7 emails recommended)
2. Define your lead scoring criteria
3. Set up lead source tracking in your forms
4. Prepare segmentation rules based on industry, company size, or interests

## Node-by-Node Build Instructions

### 1. Webhook Trigger Node
- Add **Webhook** node as the starting point
- Set **HTTP Method** to `POST`
- **Path**: `/lead-capture`
- **Response Mode**: `Respond Immediately`
- Copy the webhook URL to use in your forms

### 2. Lead Data Processing Node
- Add **Code** node after webhook
- **Name**: "Process Lead Data"
- **JavaScript Code**:
```javascript
// Extract and standardize lead data
const leadData = {
  email: $json.email.toLowerCase().trim(),
  firstName: $json.first_name || $json.firstName || '',
  lastName: $json.last_name || $json.lastName || '',
  company: $json.company || '',
  industry: $json.industry || 'Other',
  leadSource: $json.source || 'website',
  interests: $json.interests || [],
  createdAt: new Date().toISOString()
};

// Calculate initial lead score
let leadScore = 10; // Base score
if (leadData.company) leadScore += 15;
if (leadData.industry !== 'Other') leadScore += 10;
if (leadData.interests.length > 0) leadScore += 5;

leadData.leadScore = leadScore;
leadData.nurtureSequence = 1; // Start with email 1

return { json: leadData };
```

### 3. Lead Segmentation Node
- Add **Switch** node
- **Name**: "Segment Leads"
- **Mode**: `Expression`
- **Value**: `{{ $json.industry }}`
- Add outputs for:
  - **Technology**: `technology`
  - **Healthcare**: `healthcare`
  - **Finance**: `finance`
  - **Default**: `*` (catch-all)

### 4. CRM Lead Creation Nodes
Create separate nodes for each segment:

#### HubSpot Contact Creation
- Add **HubSpot** node after each Switch output
- **Operation**: `Create`
- **Resource**: `Contact`
- **Properties**:
  - **Email**: `{{ $json.email }}`
  - **First Name**: `{{ $json.firstName }}`
  - **Last Name**: `{{ $json.lastName }}`
  - **Company**: `{{ $json.company }}`
  - **Lead Score**: `{{ $json.leadScore }}`
  - **Lead Source**: `{{ $json.leadSource }}`

### 5. Welcome Email Node
- Add **Gmail** node (or your preferred email service)
- **Operation**: `Send`
- **To**: `{{ $json.email }}`
- **Subject**: `Welcome {{ $json.firstName }}! Here's what's next...`
- **Email Type**: `HTML`
- **Message**:
```html
<p>Hi {{ $json.firstName }},</p>
<p>Thanks for your interest in our solutions for {{ $json.industry }} companies!</p>
<p>Over the next week, I'll share:</p>
<ul>
<li>Industry-specific insights</li>
<li>Case studies from similar companies</li>
<li>Best practices guide</li>
</ul>
<p>Best regards,<br>Your Marketing Team</p>
```

### 6. Delay Node
- Add **Wait** node
- **Resume On**: `Timeout`
- **Wait Time**: `2` days

### 7. Follow-up Email Sequence
Create a loop structure with **HTTP Request** nodes that call back to your workflow:

#### Email 2 Node
- Add **Gmail** node
- **Subject**: `{{ $json.firstName }}, here's that {{ $json.industry }} insight I promised`
- **Message**: Industry-specific content based on segment

#### Progress Tracking Node
- Add **Code** node to increment sequence counter:
```javascript
const updatedLead = { ...$json };
updatedLead.nurtureSequence = ($json.nurtureSequence || 1) + 1;
updatedLead.lastEmailSent = new Date().toISOString();

return { json: updatedLead };
```

### 8. Engagement Tracking Branch
- Add **IF** node to check email opens/clicks
- **Condition**: `{{ $json.emailOpened }}` equals `true`
- **True branch**: Increase lead score, continue sequence
- **False branch**: Adjust timing, try different approach

### 9. Lead Scoring Update
- Add **HubSpot** node (or your CRM)
- **Operation**: `Update`
- **Contact ID**: `{{ $json.contactId }}`
- **Properties**:
  - **Lead Score**: `{{ $json.leadScore + 5 }}`
  - **Nurture Status**: `{{ $json.nurtureSequence }}`

### 10. Sequence Completion Check
- Add **IF** node
- **Condition**: `{{ $json.nurtureSequence }}` greater than `5`
- **True**: Move to sales-ready status
- **False**: Continue to next email in sequence

## Complete Workflow JSON

```json
{
  "name": "Lead Nurturing Email Sequence",
  "nodes": [
    {
      "parameters": {
        "path": "/lead-capture",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "New Lead Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// Extract and standardize lead data\nconst leadData = {\n  email: $json.email.toLowerCase().trim(),\n  firstName: $json.first_name || $json.firstName || '',\n  lastName: $json.last_name || $json.lastName || '',\n  company: $json.company || '',\n  industry: $json.industry || 'Other',\n  leadSource: $json.source || 'website',\n  interests: $json.interests || [],\n  createdAt: new Date().toISOString()\n};\n\n// Calculate initial lead score\nlet leadScore = 10;\nif (leadData.company) leadScore += 15;\nif (leadData.industry !== 'Other') leadScore += 10;\nif (leadData.interests.length > 0) leadScore += 5;\n\nleadData.leadScore = leadScore;\nleadData.nurtureSequence = 1;\n\nreturn { json: leadData };"
      },
      "id": "process-lead",
      "name": "Process Lead Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "mode": "expression",
        "value": "={{ $json.industry }}",
        "rules": {
          "rules": [
            {
              "operation": "equal",
              "value": "technology"
            },
            {
              "operation": "equal",
              "value": "healthcare"
            },
            {
              "operation": "equal",
              "value": "finance"
            }
          ]
        },
        "fallbackOutput": 3
      },
      "id": "segment-leads",
      "name": "Segment Leads",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "authentication": "apiKey",
        "resource": "contact",
        "operation": "create",
        "properties": {
          "customProperties": {
            "property": [
              {
                "name": "email",
                "value": "={{ $json.email }}"
              },
              {
                "name": "firstname",
                "value": "={{ $json.firstName }}"
              },
              {
                "name": "lastname",
                "value": "={{ $json.lastName }}"
              },
              {
                "name": "company",
                "value": "={{ $json.company }}"
              }
            ]
          }
        }
      },
      "id": "create-hubspot-contact",
      "name": "Create HubSpot Contact",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [900, 200]
    },
    {
      "parameters": {
        "sendTo": "={{ $json.email }}",
        "subject": "Welcome {{ $json.firstName }}! Here's what's next...",
        "emailType": "html",
        "message": "<p>Hi {{ $json.firstName }},</p>\n<p>Thanks for your interest in our solutions for {{ $json.industry }} companies!</p>\n<p>Over the next week, I'll share:</p>\n<ul>\n<li>Industry-specific insights</li>\n<li>Case studies from similar companies</li>\n<li>Best practices guide</li>\n</ul>\n<p>Best regards,<br>Your Marketing Team</p>"
      },
      "id": "welcome-email",
      "name": "Send Welcome Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "amount": 2,
        "unit": "days"
      },
      "id": "wait-2-days",
      "name": "Wait 2 Days",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [1340, 300]
    },
    {
      "parameters": {
        "sendTo": "={{ $json.email }}",
        "subject": "{{ $json.firstName }}, here's that {{ $json.industry }} insight",
        "emailType": "html",
        "message": "<p>Hi {{ $json.firstName }},</p>\n<p>As promised, here are some insights specifically for {{ $json.industry }} companies...</p>\n<p>[Industry-specific content here]</p>\n<p>Tomorrow I'll share a relevant case study.</p>\n<p>Best,<br>Your Marketing Team</p>"
      },
      "id": "email-2",
      "name": "Email 2 - Industry Insights",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1560, 300]
    },
    {
      "parameters": {
        "jsCode": "const updatedLead = { ...$json };\nupdatedLead.nurtureSequence = ($json.nurtureSequence || 1) + 1;\nupdatedLead.lastEmailSent = new Date().toISOString();\n\nreturn { json: updatedLead };"
      },
      "id": "update-sequence",
      "name": "Update Sequence Progress",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [1780, 300]
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
            "node": "Segment Leads",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Segment Leads": {
      "main": [
        [
          {
            "node": "Create HubSpot Contact",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create HubSpot Contact",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create HubSpot Contact",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Create HubSpot Contact",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create HubSpot Contact": {
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
            "node": "Wait 2 Days",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait 2 Days": {
      "main": [
        [
          {
            "node": "Email 2 - Industry Insights",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Email 2 - Industry Insights": {
      "main": [
        [
          {
            "node": "Update Sequence Progress",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

## FAQ

### How do I track email engagement to improve lead scoring?

Connect your email service provider's webhook events to n8n using additional webhook nodes. Most email services (SendGrid, Mailgun, etc.) can send open, click, and bounce events to a webhook. Create separate webhook endpoints for each event type, then use IF nodes to update lead scores: +5 points for opens, +10 for clicks, -5 for bounces. Store engagement data in your CRM using update nodes.

### Can I pause or modify the nurturing sequence for specific leads?

Yes, add a "Lead Status Check" node before each email that queries your CRM for the lead's current status. Use an IF node to check if the status is "paused