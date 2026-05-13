```markdown
---
title: "n8n Content Calendar Publishing Automation for Marketing Managers"
description: "Automate your content calendar publishing workflow with n8n to streamline social media posts, blog publications, and campaign scheduling across multiple platforms."
profession: "Marketing Managers"
category: "Content Management"
contentType: "workflow"
tags: ["content-calendar", "social-media", "automation", "publishing", "marketing", "scheduling"]
pubDate: "2026-05-13"
featured: false
---

# n8n Content Calendar Publishing Automation for Marketing Managers

## Why This Automation Matters

As a marketing manager, juggling multiple content channels, deadlines, and campaigns can quickly become overwhelming. Manual content publishing is time-consuming, error-prone, and doesn't scale with growing marketing demands. This n8n automation eliminates the tedious task of manually publishing content across platforms by:

- **Saving 10+ hours weekly** on manual posting and scheduling
- **Reducing human errors** in posting times, content, and platform selection
- **Ensuring consistent brand messaging** across all channels
- **Enabling better work-life balance** by automating weekend and holiday posts
- **Providing centralized control** over your entire content calendar
- **Scaling your content operations** without increasing headcount

This workflow transforms your Google Sheets content calendar into an intelligent publishing system that automatically posts to social media, publishes blog articles, sends newsletters, and tracks performance—all while you focus on strategy and creative work.

## What You Need Before Starting

### Required Accounts & Access
- n8n Cloud account or self-hosted n8n instance
- Google Workspace account with Sheets access
- Social media platform accounts (Twitter, LinkedIn, Facebook)
- Content management system (WordPress, Webflow, or similar)
- Email marketing platform (Mailchimp, ConvertKit, etc.)
- Cloud storage (Google Drive or Dropbox) for media assets

### Required Credentials
- Google Sheets API credentials
- Social media platform API keys/tokens
- CMS API credentials or webhook URLs
- Email marketing platform API keys
- Cloud storage API access

### Prerequisites
- Basic understanding of content calendar structure
- Familiarity with your chosen platforms' content requirements
- Organized folder structure for media assets
- Established brand guidelines and approval processes

## Complete Node-by-Node Build Instructions

### Step 1: Set up the Trigger Node

1. Add a **Schedule Trigger** node
2. Configure the trigger:
   - **Rule**: Every 15 minutes
   - **Start Date**: Current date
   - Click "Add Rule" to save
3. This ensures your workflow checks for new content to publish every 15 minutes

### Step 2: Connect to Google Sheets

1. Add **Google Sheets** node after the trigger
2. Set up the connection:
   - **Operation**: Read
   - **Document**: Select your content calendar spreadsheet
   - **Sheet**: Choose the main calendar sheet
   - **Range**: A:K (adjust based on your columns)
3. Configure authentication with your Google account
4. Test the connection to ensure data retrieval works

### Step 3: Filter Ready-to-Publish Content

1. Add **Filter** node
2. Configure filtering conditions:
   - **Condition 1**: Status equals "Ready to Publish"
   - **Condition 2**: Publish Date equals today's date
   - **Condition 3**: Publish Time is within the next 15 minutes
3. Set **Combine** to "AND" for all conditions

### Step 4: Route Content by Platform

1. Add **Switch** node for platform routing
2. Configure routing rules:
   - **Route 1**: Platform equals "Twitter"
   - **Route 2**: Platform equals "LinkedIn" 
   - **Route 3**: Platform equals "Facebook"
   - **Route 4**: Platform equals "Blog"
   - **Route 5**: Platform equals "Email"
3. Set **Mode** to "Expression" for dynamic routing

### Step 5: Configure Twitter Publishing

1. Add **Twitter** node after Route 1
2. Configure settings:
   - **Operation**: Tweet
   - **Text**: `{{ $json.content }}`
   - **Additional Fields**: 
     - Media: `{{ $json.media_url }}` (if applicable)
     - Thread: Enable if content exceeds character limit
3. Set up Twitter API credentials

### Step 6: Configure LinkedIn Publishing

1. Add **LinkedIn** node after Route 2
2. Configure settings:
   - **Operation**: Create Post
   - **Text**: `{{ $json.content }}`
   - **Person**: Your LinkedIn profile ID
   - **Additional Fields**:
     - Media: `{{ $json.media_url }}`
     - Visibility: Public
3. Authenticate with LinkedIn

### Step 7: Configure Facebook Publishing

1. Add **Facebook Graph API** node after Route 3
2. Configure settings:
   - **HTTP Method**: POST
   - **URL**: `https://graph.facebook.com/v18.0/{{ $json.page_id }}/feed`
   - **Body Parameters**:
     - message: `{{ $json.content }}`
     - link: `{{ $json.link_url }}`
     - access_token: Your page access token

### Step 8: Configure Blog Publishing

1. Add **WordPress** node after Route 4
2. Configure settings:
   - **Operation**: Create Post
   - **Title**: `{{ $json.title }}`
   - **Content**: `{{ $json.content }}`
   - **Status**: `{{ $json.post_status || 'publish' }}`
   - **Categories**: `{{ $json.categories }}`
   - **Featured Media**: `{{ $json.featured_image_id }}`

### Step 9: Configure Email Newsletter

1. Add **Mailchimp** node after Route 5
2. Configure settings:
   - **Operation**: Create Campaign
   - **Type**: Regular
   - **List**: Your subscriber list ID
   - **Subject**: `{{ $json.subject }}`
   - **Content**: `{{ $json.email_content }}`
   - **Send**: Enable if ready to send immediately

### Step 10: Update Publishing Status

1. Add **Google Sheets** node after all platform nodes
2. Configure as **NoOp** initially, then:
   - **Operation**: Update
   - **Document**: Same content calendar
   - **Sheet**: Same sheet name
   - **Range**: Find the row with matching content ID
   - **Values**: Update status column to "Published"
3. Add timestamp of publication

### Step 11: Log Publishing Results

1. Add **Airtable** or **Google Sheets** node for logging
2. Configure to track:
   - Content ID
   - Platform published
   - Publication timestamp
   - Success/failure status
   - Engagement metrics (if available)

### Step 12: Error Handling & Notifications

1. Add **Slack** or **Email** node for error notifications
2. Configure error handling:
   - Connect error outputs from all platform nodes
   - Send alerts for failed publications
   - Include error details and content information
   - Tag responsible team members

## Complete Workflow JSON

```json
{
  "name": "Content Calendar Publishing Automation",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "minutes",
              "value": 15
            }
          ]
        }
      },
      "id": "scheduler-trigger",
      "name": "Schedule Content Check",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "YOUR_SHEET_ID",
        "sheetName": "Content Calendar",
        "range": "A:K"
      },
      "id": "google-sheets-read",
      "name": "Read Content Calendar",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "and": [
            {
              "leftValue": "={{ $json.status }}",
              "rightValue": "Ready to Publish",
              "operator": "equal"
            },
            {
              "leftValue": "={{ DateTime.fromISO($json.publish_date).hasSame(DateTime.now(), 'day') }}",
              "rightValue": true,
              "operator": "equal"
            },
            {
              "leftValue": "={{ DateTime.fromISO($json.publish_date + 'T' + $json.publish_time).diff(DateTime.now(), 'minutes').minutes <= 15 }}",
              "rightValue": true,
              "operator": "equal"
            }
          ]
        }
      },
      "id": "filter-ready-content",
      "name": "Filter Ready Content",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "mode": "expression",
        "output": "input",
        "options": {},
        "rules": {
          "values": [
            {
              "output": 0,
              "conditions": {
                "and": [
                  {
                    "leftValue": "={{ $json.platform }}",
                    "rightValue": "Twitter",
                    "operator": "equal"
                  }
                ]
              }
            },
            {
              "output": 1,
              "conditions": {
                "and": [
                  {
                    "leftValue": "={{ $json.platform }}",
                    "rightValue": "LinkedIn",
                    "operator": "equal"
                  }
                ]
              }
            },
            {
              "output": 2,
              "conditions": {
                "and": [
                  {
                    "leftValue": "={{ $json.platform }}",
                    "rightValue": "Facebook",
                    "operator": "equal"
                  }
                ]
              }
            },
            {
              "output": 3,
              "conditions": {
                "and": [
                  {
                    "leftValue": "={{ $json.platform }}",
                    "rightValue": "Blog",
                    "operator": "equal"
                  }
                ]
              }
            },
            {
              "output": 4,
              "conditions": {
                "and": [
                  {
                    "leftValue": "={{ $json.platform }}",
                    "rightValue": "Email",
                    "operator": "equal"
                  }
                ]
              }
            }
          ]
        }
      },
      "id": "platform-router",
      "name": "Route by Platform",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "operation": "tweet",
        "text": "={{ $json.content }}",
        "additionalFields": {
          "attachments": "={{ $json.media_url ? $json.media_url : '' }}"
        }
      },
      "id": "twitter-post",
      "name": "Post to Twitter",
      "type": "n8n-nodes-base.twitter",
      "typeVersion": 1,
      "position": [1120, 100]
    },
    {
      "parameters": {
        "operation": "createPost",
        "person": "YOUR_LINKEDIN_PERSON_ID",
        "text": "={{ $json.content }}",
        "additionalFields": {
          "visibility": "PUBLIC"
        }
      },
      "id": "linkedin-post",
      "name": "Post to LinkedIn",
      "type": "n8n-nodes-base.linkedIn",
      "typeVersion": 1,
      "position": [1120, 200]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://graph.facebook.com/v18.0/{{ $json.page_id }}/feed",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "message",
              "value": "={{ $json.content }}"
            },
            {
              "name": "access_token",
              "value": "YOUR_PAGE_ACCESS_TOKEN"
            }
          ]
        }
      },
      "id": "facebook-post",
      "name": "Post to Facebook",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "operation": "create",
        "title": "={{ $json.title }}",
        "content": "={{ $json.content }}",
        "status": "publish",
        "additionalFields": {
          "categories": "={{ $json.categories }}",
          "featuredMedia": "={{ $json.featured_image_id }}"
        }
      },
      "id": "wordpress-post",
      "name": "Publish Blog Post",
      "type": "n8n-nodes-base.wordpress",
      "typeVersion": 1,
      "position": [1120, 400]
    },
    {
      "parameters": {
        "operation": "createCampaign",
        "type": "regular",
        "list": "YOUR_LIST_ID",
        "subject": "={{ $json.subject }}",
        "content": "={{ $json.email_content }}",
        "additionalFields": {
          "send": true
        }
      },
      "id": "mailchimp-send",
      "name": "Send Email Campaign",
      "type": "n8n-nodes-base.mailchimp",
      "typeVersion": 1,
      "position": [1120, 500]
    },
    {
      "parameters": {
        "operation": "update",
        "documentId": "YOUR_SHEET_ID",
        "sheetName": "Content Calendar",
        "range": "={{ 'G' + $json.row_number }}",
        "options": {},
        "dataMode": "raw",
        "data": {
          "values": [
            [
              "Published"
            ]
          ]
        }
      },
      "id": "update-status",
      "name": "Update Status",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [1340, 300]
    },
    {
      "parameters": {
        "channel": "#marketing",
        "text": "✅ Content published successfully!\nPlatform: {{ $json.platform }}\nTitle: {{ $json.title }}",
        "otherOptions": {}
      },
      "id": "success-notification",
      "name": "Success Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1560, 300]
    },
    {
      "parameters": {
        "channel": "#marketing",
        "text": "❌ Content publishing failed!\nPlatform: {{ $json.platform }}\nError: {{ $json.error }}",
        "otherOptions": {}
      },
      "id": "error-notification",
      "name": "Error Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1340, 600]
    }
  ],
  "connections": {
    "Schedule Content Check": {
      "main": [
        [
          {
            "node": "Read Content Calendar",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Read Content Calendar": {
      "main": [
        [
          {
            "node": "Filter Ready Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Ready Content": {
      "main": [
        [
          {
            "node": "Route by Platform",
            "