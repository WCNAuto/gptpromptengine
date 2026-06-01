---
title: "Automated Deployment Notification Workflow with n8n"
description: "Set up automated notifications for deployment events to keep your team informed of successful deployments, failures, and rollbacks across multiple channels."
profession: "Developers"
category: "DevOps"
contentType: "workflow"
tags: ["deployment", "notifications", "slack", "webhook", "automation", "devops"]
pubDate: "2026-06-01"
featured: false
---

## Why This Automation Matters

Deployment notifications are crucial for maintaining visibility across development teams. Manual notification processes lead to missed communications, delayed incident response, and poor stakeholder awareness. This automated workflow ensures instant, consistent notifications across multiple channels whenever deployments occur, helping teams respond quickly to issues and maintain deployment visibility.

Key benefits:
- **Instant team awareness** of deployment status
- **Reduced incident response time** through immediate failure notifications
- **Consistent communication** across all deployment environments
- **Customizable messaging** for different deployment types
- **Multi-channel support** for Slack, email, and webhooks

## What You Need Before Starting

### Prerequisites
- n8n instance (Cloud or self-hosted)
- Deployment system that can send webhooks (GitHub Actions, GitLab CI, Jenkins, etc.)
- Slack workspace with bot permissions (optional)
- SMTP email configuration (optional)

### Required Access
- Webhook endpoint access from your CI/CD system
- Slack Bot Token with `chat:write` permissions
- Email service credentials (if using email notifications)

### Information to Gather
- Slack channel IDs for notifications
- Email distribution lists
- Deployment environment names
- Repository/project identifiers

## Complete Node-by-Node Build Instructions

### Step 1: Webhook Trigger Setup
1. Add a **Webhook** node as your trigger
2. Set HTTP Method to `POST`
3. Set Path to `/deployment-webhook`
4. Configure Authentication as needed
5. Set Response Mode to `Respond immediately`
6. Add response data: `{"status": "received"}`

### Step 2: Extract Deployment Data
1. Add a **Set** node after the webhook
2. Name it "Extract Deployment Info"
3. Configure the following values:
   - `environment`: `{{ $json.body.environment }}`
   - `status`: `{{ $json.body.status }}`
   - `repository`: `{{ $json.body.repository }}`
   - `commit_sha`: `{{ $json.body.commit_sha }}`
   - `commit_message`: `{{ $json.body.commit_message }}`
   - `deployed_by`: `{{ $json.body.deployed_by }}`
   - `deployment_url`: `{{ $json.body.deployment_url }}`
   - `timestamp`: `{{ $now.format('YYYY-MM-DD HH:mm:ss') }}`

### Step 3: Create Status-Based Routing
1. Add a **Switch** node
2. Set Mode to "Rules"
3. Add three routes:
   - **Route 1**: `{{ $json.status }}` equals `success`
   - **Route 2**: `{{ $json.status }}` equals `failure`
   - **Route 3**: `{{ $json.status }}` equals `rollback`

### Step 4: Format Success Notification
1. Add a **Set** node to the success route
2. Name it "Format Success Message"
3. Configure:
   - `message_title`: `"✅ Deployment Successful"`
   - `message_color`: `"good"`
   - `message_text`: `"{{ $json.repository }} deployed to {{ $json.environment }}"`
   - `slack_emoji`: `":white_check_mark:"`

### Step 5: Format Failure Notification
1. Add a **Set** node to the failure route
2. Name it "Format Failure Message"
3. Configure:
   - `message_title`: `"❌ Deployment Failed"`
   - `message_color`: `"danger"`
   - `message_text`: `"{{ $json.repository }} deployment to {{ $json.environment }} failed"`
   - `slack_emoji`: `":x:"`
   - `urgency`: `"high"`

### Step 6: Format Rollback Notification
1. Add a **Set** node to the rollback route
2. Name it "Format Rollback Message"
3. Configure:
   - `message_title`: `"⚠️ Rollback Initiated"`
   - `message_color`: `"warning"`
   - `message_text`: `"{{ $json.repository }} rolled back in {{ $json.environment }}"`
   - `slack_emoji`: `":warning:"`

### Step 7: Merge Notification Paths
1. Add a **Merge** node after all format nodes
2. Set Mode to "Combine All"
3. This combines all formatted messages into a single path

### Step 8: Send Slack Notification
1. Add a **Slack** node
2. Set Resource to "Message"
3. Set Operation to "Post"
4. Configure:
   - **Channel**: Your deployment channel ID
   - **Text**: `{{ $json.message_text }}`
   - **Attachments**: 
   ```json
   [
     {
       "color": "{{ $json.message_color }}",
       "title": "{{ $json.message_title }}",
       "fields": [
         {
           "title": "Repository",
           "value": "{{ $json.repository }}",
           "short": true
         },
         {
           "title": "Environment", 
           "value": "{{ $json.environment }}",
           "short": true
         },
         {
           "title": "Deployed by",
           "value": "{{ $json.deployed_by }}",
           "short": true
         },
         {
           "title": "Commit",
           "value": "{{ $json.commit_sha.slice(0, 8) }}",
           "short": true
         }
       ]
     }
   ]
   ```

### Step 9: Send Email Notification (Parallel)
1. Add an **Email Send** node parallel to Slack
2. Configure SMTP settings
3. Set recipients based on environment
4. Configure subject: `{{ $json.message_title }} - {{ $json.repository }}`
5. Set HTML body:
```html
<h2>{{ $json.message_title }}</h2>
<p><strong>Repository:</strong> {{ $json.repository }}</p>
<p><strong>Environment:</strong> {{ $json.environment }}</p>
<p><strong>Status:</strong> {{ $json.status }}</p>
<p><strong>Deployed by:</strong> {{ $json.deployed_by }}</p>
<p><strong>Commit:</strong> {{ $json.commit_sha }}</p>
<p><strong>Message:</strong> {{ $json.commit_message }}</p>
<p><strong>Timestamp:</strong> {{ $json.timestamp }}</p>
```

### Step 10: Log Deployment Event
1. Add an **HTTP Request** node for logging
2. Set Method to `POST`
3. URL to your logging service
4. Body with deployment data for audit trail

## Full Workflow JSON

```json
{
  "name": "Deployment Notification Workflow",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "deployment-webhook",
        "responseMode": "respondInformationToast",
        "responseData": "{\n  \"status\": \"received\",\n  \"timestamp\": \"{{ $now.toISO() }}\"\n}"
      },
      "id": "webhook-trigger",
      "name": "Deployment Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "environment",
              "value": "={{ $json.body.environment }}"
            },
            {
              "name": "status", 
              "value": "={{ $json.body.status }}"
            },
            {
              "name": "repository",
              "value": "={{ $json.body.repository }}"
            },
            {
              "name": "commit_sha",
              "value": "={{ $json.body.commit_sha }}"
            },
            {
              "name": "commit_message",
              "value": "={{ $json.body.commit_message }}"
            },
            {
              "name": "deployed_by",
              "value": "={{ $json.body.deployed_by }}"
            },
            {
              "name": "deployment_url",
              "value": "={{ $json.body.deployment_url }}"
            },
            {
              "name": "timestamp",
              "value": "={{ $now.format('YYYY-MM-DD HH:mm:ss') }}"
            }
          ]
        }
      },
      "id": "extract-data",
      "name": "Extract Deployment Info",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "rules": {
          "rules": [
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{ $json.status }}",
                    "operation": "equal",
                    "value2": "success"
                  }
                ]
              }
            },
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{ $json.status }}",
                    "operation": "equal", 
                    "value2": "failure"
                  }
                ]
              }
            },
            {
              "conditions": {
                "string": [
                  {
                    "value1": "={{ $json.status }}",
                    "operation": "equal",
                    "value2": "rollback"
                  }
                ]
              }
            }
          ]
        }
      },
      "id": "status-switch",
      "name": "Status Switch",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "message_title",
              "value": "✅ Deployment Successful"
            },
            {
              "name": "message_color",
              "value": "good"
            },
            {
              "name": "message_text", 
              "value": "={{ $json.repository }} successfully deployed to {{ $json.environment }}"
            },
            {
              "name": "slack_emoji",
              "value": ":white_check_mark:"
            }
          ]
        }
      },
      "id": "format-success",
      "name": "Format Success Message",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [900, 180]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "message_title",
              "value": "❌ Deployment Failed"
            },
            {
              "name": "message_color", 
              "value": "danger"
            },
            {
              "name": "message_text",
              "value": "={{ $json.repository }} deployment to {{ $json.environment }} failed"
            },
            {
              "name": "slack_emoji",
              "value": ":x:"
            },
            {
              "name": "urgency",
              "value": "high"
            }
          ]
        }
      },
      "id": "format-failure",
      "name": "Format Failure Message", 
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "message_title",
              "value": "⚠️ Rollback Initiated"
            },
            {
              "name": "message_color",
              "value": "warning"
            },
            {
              "name": "message_text",
              "value": "={{ $json.repository }} rolled back in {{ $json.environment }}"
            },
            {
              "name": "slack_emoji", 
              "value": ":warning:"
            }
          ]
        }
      },
      "id": "format-rollback",
      "name": "Format Rollback Message",
      "type": "n8n-nodes-base.set", 
      "typeVersion": 1,
      "position": [900, 420]
    },
    {
      "parameters": {},
      "id": "merge-messages",
      "name": "Merge Messages",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 2,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "channel": "#deployments",
        "text": "={{ $json.message_text }}",
        "attachments": [
          {
            "color": "={{ $json.message_color }}",
            "title": "={{ $json.message_title }}",
            "fields": [
              {
                "title": "Repository",
                "value": "={{ $json.repository }}",
                "short": true
              },
              {
                "title": "Environment",
                "value": "={{ $json.environment }}", 
                "short": true
              },
              {
                "title": "Deployed by",
                "value": "={{ $json.deployed_by }}",
                "short": true
              },
              {
                "title": "Commit",
                "value": "={{ $json.commit_sha.slice(0, 8) }}",
                "short": true
              }
            ]
          }
        ]
      },
      "id": "slack-notification",
      "name": "Send Slack Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1340, 220]
    },
    {
      "parameters": {
        "toEmail": "devops@company.com",
        "subject": "={{ $json.message_title }} - {{ $json.repository }}",
        "emailFormat": "html",
        "html": "<h2>{{ $json.message_title }}</h2>\n<p><strong>Repository:</strong> {{ $json.repository }}</p>\n<p><strong>Environment:</strong> {{ $json.environment }}</p>\n<p><strong>Status:</strong> {{ $json.status }}</p>\n<p><strong>Deployed by:</strong> {{ $json.deployed_by }}</p>\n<p><strong>Commit:</strong> {{ $json.commit_sha }}</p>\n<p><strong>Message:</strong> {{ $json.commit_message }}</p>\n<p><strong>Timestamp:</strong> {{ $json.timestamp }}</p>"
      },
      "id": "email-notification",
      "name": "Send Email Notification",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 1,
      "position": [1340, 380]
    }
  ],
  "connections": {
    "Deployment Webhook": {
      "main": [
        [
          {
            "node": "Extract Deployment Info",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Deployment Info": {
      "main": [
        [
          {
            "node": "Status Switch", 
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Status Switch": {
      "main": [
        [
          {
            "node": "Format Success Message",
            "type": "