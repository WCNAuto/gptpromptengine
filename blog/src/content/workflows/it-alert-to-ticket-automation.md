---
title: "n8n Workflow for IT Alert to Ticket Auto Creation 2026: Complete Setup Guide"
description: "Copy-paste n8n workflow that automatically converts IT monitoring alerts into ServiceNow tickets. Saves 45 minutes daily on manual ticket creation."
profession: "IT Managers"
category: "Incident Mgmt"
contentType: workflow
tags: ["n8n workflow for it alert to ticket auto creation", "automated incident management n8n", "servicenow ticket automation", "it monitoring alert workflow", "n8n nagios to servicenow"]
pubDate: 2026-06-15
featured: false
---

This workflow automatically converts IT monitoring alerts from Nagios into ServiceNow incident tickets, eliminating the 15-20 minutes your team spends manually creating each ticket during outages. It connects Nagios webhook alerts directly to ServiceNow's REST API, creating properly categorized tickets with alert details, severity mapping, and assignment routing. For teams handling 10+ alerts per day, this saves approximately 45 minutes of manual ticket creation work.

## Why this automation matters

Without automation, each Nagios alert requires someone to log into ServiceNow, manually create a ticket, copy alert details, set the correct priority and category, and assign it to the right team. During major incidents with multiple cascading alerts, this manual process creates a 10-15 minute delay before tickets enter your standard resolution workflow. Critical alerts can sit unassigned while someone handles the administrative overhead of ticket creation, extending your mean time to resolution.

## What you need before starting

- Webhook trigger node (built into n8n)
- ServiceNow credential with incident creation permissions on your ServiceNow instance
- Nagios configured to send webhook notifications to your n8n instance URL
- ServiceNow instance with REST Table API enabled
- Access to your ServiceNow sys_user table for assignment group mapping

## How to build it: step by step

### 1. Webhook Trigger — Receive Nagios alerts

Node type: Webhook
HTTP Method: POST
Path: /nagios-alerts
Authentication: None
Response Mode: On Received Call
Response Code: 200

This node creates an endpoint that Nagios will POST alert data to. It outputs the raw webhook payload containing alert status, host information, service details, and timestamp. Configure Nagios to send webhooks to https://your-n8n-instance.com/webhook/nagios-alerts when alert states change.

### 2. Set Node — Parse and map alert data

Node type: Set
Operation: Keep Only Set Fields
Fields to Set:
- severity: `{{ $json.body.state === 'CRITICAL' ? '1' : $json.body.state === 'WARNING' ? '3' : '4' }}`
- short_description: `{{ $json.body.host_name }} - {{ $json.body.service_desc }}: {{ $json.body.plugin_output }}`
- description: `Alert Time: {{ $json.body.datetime }}\nHost: {{ $json.body.host_name }}\nService: {{ $json.body.service_desc }}\nState: {{ $json.body.state }}\nOutput: {{ $json.body.plugin_output }}`
- category: Network
- assignment_group: IT Operations

This node transforms the raw Nagios webhook data into ServiceNow-compatible field values. It maps Nagios alert states (CRITICAL, WARNING, OK) to ServiceNow severity numbers and formats alert details into proper incident description fields. The output provides clean, structured data ready for ServiceNow's REST API.

### 3. ServiceNow Node — Create incident ticket

Node type: ServiceNow
Operation: Create
Resource: Incident
Fields:
- Short Description: `{{ $json.short_description }}`
- Description: `{{ $json.description }}`
- Urgency: `{{ $json.severity }}`
- Impact: `{{ $json.severity }}`
- Category: `{{ $json.category }}`
- Assignment Group: `{{ $json.assignment_group }}`
- State: New

This node creates the actual ServiceNow incident using your ServiceNow credential. It outputs the created ticket details including the new incident number, sys_id, and creation timestamp. ServiceNow automatically applies your instance's business rules for notifications and escalations to the new ticket.

### 4. Webhook Response — Confirm to Nagios

Node type: Respond to Webhook
Response Code: 200
Response Body: `{"status": "success", "ticket": "{{ $node['ServiceNow'].json['number'] }}"}`

This node sends a confirmation response back to Nagios with the created ticket number. It prevents Nagios from retrying the webhook and provides an audit trail showing which alerts successfully created tickets. The response includes the ServiceNow incident number for correlation in Nagios logs.

## Full workflow JSON

```json
{
  "name": "Nagios Alert to ServiceNow Ticket",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "nagios-alerts",
        "responseMode": "onReceived",
        "responseCode": 200,
        "responseBinaryPropertyName": "data"
      },
      "id": "webhook-trigger",
      "name": "Nagios Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "keepOnlySet": true,
        "values": {
          "string": [
            {
              "name": "severity",
              "value": "={{ $json.body.state === 'CRITICAL' ? '1' : $json.body.state === 'WARNING' ? '3' : '4' }}"
            },
            {
              "name": "short_description", 
              "value": "={{ $json.body.host_name }} - {{ $json.body.service_desc }}: {{ $json.body.plugin_output }}"
            },
            {
              "name": "description",
              "value": "=Alert Time: {{ $json.body.datetime }}\nHost: {{ $json.body.host_name }}\nService: {{ $json.body.service_desc }}\nState: {{ $json.body.state }}\nOutput: {{ $json.body.plugin_output }}"
            },
            {
              "name": "category",
              "value": "Network"
            },
            {
              "name": "assignment_group", 
              "value": "IT Operations"
            }
          ]
        }
      },
      "id": "set-node",
      "name": "Map Alert Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "resource": "incident",
        "operation": "create",
        "additionalFields": {
          "short_description": "={{ $json.short_description }}",
          "description": "={{ $json.description }}",
          "urgency": "={{ $json.severity }}",
          "impact": "={{ $json.severity }}",
          "category": "={{ $json.category }}",
          "assignment_group": "={{ $json.assignment_group }}",
          "state": "1"
        }
      },
      "id": "servicenow-node",
      "name": "Create ServiceNow Ticket",
      "type": "n8n-nodes-base.serviceNow",
      "typeVersion": 1,
      "position": [680, 300],
      "credentials": {
        "serviceNowOAuth2Api": {
          "id": "// Replace with your ServiceNow credential ID",
          "name": "ServiceNow Production"
        }
      }
    },
    {
      "parameters": {
        "responseCode": 200,
        "responseBody": "={\"status\": \"success\", \"ticket\": \"{{ $node['Create ServiceNow Ticket'].json['number'] }}\"}"
      },
      "id": "webhook-response",
      "name": "Confirm to Nagios",
      "type": "n8n-nodes-base.respondToWebhook", 
      "typeVersion": 1,
      "position": [900, 300]
    }
  ],
  "connections": {
    "Nagios Webhook": {
      "main": [
        [
          {
            "node": "Map Alert Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Map Alert Data": {
      "main": [
        [
          {
            "node": "Create ServiceNow Ticket",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    },
    "Create ServiceNow Ticket": {
      "main": [
        [
          {
            "node": "Confirm to Nagios",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {},
  "createdAt": "2026-06-15T10:00:00.000Z",
  "updatedAt": "2026-06-15T10:00:00.000Z",
  "id": "1"
}
```

## Frequently Asked Questions

### What happens if ServiceNow is down when an alert fires?
The workflow will fail at the ServiceNow node and n8n will return a 500 error to Nagios, causing Nagios to retry the webhook according to your notification retry settings. Check your n8n execution history to see failed attempts and manually create tickets for any alerts that couldn't auto-create during outages.

### How do I route different alert types to different ServiceNow assignment groups?
Modify the Set node's assignment_group field to use conditional logic based on the host_name or service_desc from Nagios. For example: `{{ $json.body.host_name.includes('web') ? 'Web Team' : $json.body.host_name.includes('db') ? 'Database Team' : 'IT Operations' }}` to route based on hostname patterns.

### Can I prevent duplicate tickets when Nagios sends multiple alerts for the same issue?
Add a ServiceNow node with "Get All" operation before the create operation to search for existing incidents with the same short_description in the last 24 hours. Use an IF node to only create the ticket if no matching incident exists, otherwise update the existing ticket with the new alert information.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.