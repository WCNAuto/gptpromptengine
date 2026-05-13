---
title: "n8n Automation for Customer Support Ticket Routing"
description: "Automate customer support ticket routing based on priority, category, and agent availability using n8n workflows to improve response times and customer satisfaction."
profession: "Customer Service"
category: "Support Operations"
contentType: "workflow"
tags: ["customer support", "ticket routing", "automation", "helpdesk", "workflow"]
pubDate: "2026-05-13"
featured: false
---

## Why This Automation Matters

Manual ticket routing creates bottlenecks in customer support operations, leading to delayed responses and frustrated customers. This n8n automation intelligently routes tickets based on urgency, category, and agent availability, ensuring critical issues reach the right experts immediately. By automating this process, support teams can reduce response times by up to 60%, improve customer satisfaction scores, and allow agents to focus on solving problems rather than managing ticket distribution.

## What You Need Before Starting

- n8n Cloud account or self-hosted n8n instance
- Access to your helpdesk system API (Zendesk, Freshdesk, ServiceNow, etc.)
- Slack or Microsoft Teams webhook for notifications
- Gmail or SMTP credentials for email notifications
- Customer database or CRM system access
- List of support agents with their specializations and availability status

## Complete Node-by-Node Build Instructions

### Step 1: Set Up the Webhook Trigger
1. Add a **Webhook** node as your trigger
2. Set HTTP Method to `POST`
3. Set Path to `/ticket-routing`
4. Enable "Respond to Webhook" option
5. Set Response Code to `200`

### Step 2: Parse Incoming Ticket Data
1. Add a **Set** node after the webhook
2. Configure the following fields:
   - `ticket_id`: `{{ $json.ticket.id }}`
   - `subject`: `{{ $json.ticket.subject }}`
   - `description`: `{{ $json.ticket.description }}`
   - `customer_email`: `{{ $json.ticket.requester.email }}`
   - `priority`: `{{ $json.ticket.priority }}`
   - `category`: `{{ $json.ticket.custom_fields.category }}`
   - `created_at`: `{{ $json.ticket.created_at }}`

### Step 3: Determine Customer Tier
1. Add an **HTTP Request** node
2. Set Method to `GET`
3. URL: `https://your-crm.com/api/customers/{{ $json.customer_email }}`
4. Add Authentication headers as needed
5. This retrieves customer tier information (Premium, Standard, Basic)

### Step 4: Calculate Priority Score
1. Add a **Function** node
2. Insert the following JavaScript code:
```javascript
let priorityScore = 0;
const priority = $input.first().json.priority;
const customerTier = $input.first().json.customer_tier;
const category = $input.first().json.category;

// Base priority scoring
switch(priority) {
  case 'urgent': priorityScore += 40; break;
  case 'high': priorityScore += 30; break;
  case 'normal': priorityScore += 20; break;
  case 'low': priorityScore += 10; break;
}

// Customer tier bonus
switch(customerTier) {
  case 'premium': priorityScore += 20; break;
  case 'standard': priorityScore += 10; break;
  case 'basic': priorityScore += 5; break;
}

// Category urgency
if(['billing', 'security', 'outage'].includes(category)) {
  priorityScore += 15;
}

return { priority_score: priorityScore, ...$input.first().json };
```

### Step 5: Route Based on Category
1. Add a **Switch** node
2. Set Mode to "Rules"
3. Create rules for different categories:
   - Rule 1: `{{ $json.category }}` equals `technical` → Route to Technical Team
   - Rule 2: `{{ $json.category }}` equals `billing` → Route to Billing Team
   - Rule 3: `{{ $json.category }}` equals `sales` → Route to Sales Team
   - Default: Route to General Support

### Step 6: Check Agent Availability (Technical Branch)
1. Add an **HTTP Request** node for technical routing
2. Method: `GET`
3. URL: `https://your-system.com/api/agents/available?department=technical`
4. This returns available technical support agents

### Step 7: Assign to Best Available Agent
1. Add a **Function** node
2. Insert agent assignment logic:
```javascript
const availableAgents = $input.first().json.agents;
const priorityScore = $input.first().json.priority_score;

// Filter agents by workload and expertise
let bestAgent = null;
let lowestWorkload = Infinity;

for (const agent of availableAgents) {
  if (agent.current_tickets < lowestWorkload && agent.status === 'available') {
    // For high priority tickets, prefer senior agents
    if (priorityScore > 50 && agent.level === 'senior') {
      bestAgent = agent;
      lowestWorkload = agent.current_tickets;
    } else if (priorityScore <= 50) {
      bestAgent = agent;
      lowestWorkload = agent.current_tickets;
    }
  }
}

return { assigned_agent: bestAgent, ...($input.first().json) };
```

### Step 8: Update Ticket in Helpdesk System
1. Add an **HTTP Request** node
2. Method: `PUT`
3. URL: `https://your-helpdesk.com/api/tickets/{{ $json.ticket_id }}`
4. Headers: Add authentication
5. Body (JSON):
```json
{
  "assignee_id": "{{ $json.assigned_agent.id }}",
  "priority": "{{ $json.priority }}",
  "status": "assigned",
  "custom_fields": {
    "priority_score": "{{ $json.priority_score }}",
    "routing_timestamp": "{{ new Date().toISOString() }}"
  }
}
```

### Step 9: Notify Agent via Slack
1. Add a **Slack** node
2. Set Operation to "Post Message"
3. Select appropriate channel or send DM to agent
4. Message content:
```
🎫 New Ticket Assigned to You!

**Ticket ID:** {{ $json.ticket_id }}
**Priority:** {{ $json.priority }} (Score: {{ $json.priority_score }})
**Subject:** {{ $json.subject }}
**Customer:** {{ $json.customer_email }}
**Category:** {{ $json.category }}

**Quick Actions:**
• [View Ticket](https://your-helpdesk.com/tickets/{{ $json.ticket_id }})
• [Customer Profile](https://your-crm.com/customers/{{ $json.customer_email }})

⏰ Auto-assigned based on availability and expertise
```

### Step 10: Send Customer Acknowledgment
1. Add a **Gmail** node (or SMTP node)
2. Set Operation to "Send Email"
3. Configure:
   - To: `{{ $json.customer_email }}`
   - Subject: `Ticket #{{ $json.ticket_id }} - We're on it!`
   - Body: Create a professional acknowledgment email with estimated response time

### Step 11: Set Up High Priority Alert Path
1. Add an **IF** node after priority calculation
2. Condition: `{{ $json.priority_score }}` > `60`
3. True branch: Add immediate escalation notifications
4. False branch: Continue normal routing

### Step 12: Log Routing Decision
1. Add final **HTTP Request** node
2. POST routing data to your analytics system
3. Track metrics like routing time, agent workload, etc.

## Complete Workflow JSON

```json
{
  "name": "Customer Support Ticket Routing",
  "nodes": [
    {
      "parameters": {
        "path": "/ticket-routing",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "ticket_id",
              "value": "={{ $json.ticket.id }}"
            },
            {
              "name": "subject",
              "value": "={{ $json.ticket.subject }}"
            },
            {
              "name": "description",
              "value": "={{ $json.ticket.description }}"
            },
            {
              "name": "customer_email",
              "value": "={{ $json.ticket.requester.email }}"
            },
            {
              "name": "priority",
              "value": "={{ $json.ticket.priority }}"
            },
            {
              "name": "category",
              "value": "={{ $json.ticket.custom_fields.category }}"
            },
            {
              "name": "created_at",
              "value": "={{ $json.ticket.created_at }}"
            }
          ]
        },
        "options": {}
      },
      "id": "parse-ticket-data",
      "name": "Parse Ticket Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "https://your-crm.com/api/customers/={{ $json.customer_email }}",
        "options": {}
      },
      "id": "get-customer-tier",
      "name": "Get Customer Tier",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "functionCode": "let priorityScore = 0;\nconst priority = $input.first().json.priority;\nconst customerTier = $input.first().json.customer_tier;\nconst category = $input.first().json.category;\n\nswitch(priority) {\n  case 'urgent': priorityScore += 40; break;\n  case 'high': priorityScore += 30; break;\n  case 'normal': priorityScore += 20; break;\n  case 'low': priorityScore += 10; break;\n}\n\nswitch(customerTier) {\n  case 'premium': priorityScore += 20; break;\n  case 'standard': priorityScore += 10; break;\n  case 'basic': priorityScore += 5; break;\n}\n\nif(['billing', 'security', 'outage'].includes(category)) {\n  priorityScore += 15;\n}\n\nreturn { priority_score: priorityScore, ...($input.first().json) };"
      },
      "id": "calculate-priority",
      "name": "Calculate Priority Score",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "rules": {
          "rules": [
            {
              "operation": "equal",
              "value1": "={{ $json.category }}",
              "value2": "technical"
            },
            {
              "operation": "equal", 
              "value1": "={{ $json.category }}",
              "value2": "billing"
            },
            {
              "operation": "equal",
              "value1": "={{ $json.category }}",
              "value2": "sales"
            }
          ]
        },
        "fallbackOutput": "extra"
      },
      "id": "route-by-category",
      "name": "Route by Category",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 3,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "url": "https://your-system.com/api/agents/available?department=technical",
        "options": {}
      },
      "id": "get-technical-agents",
      "name": "Get Available Technical Agents", 
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [1340, 180]
    },
    {
      "parameters": {
        "functionCode": "const availableAgents = $input.first().json.agents;\nconst priorityScore = $input.first().json.priority_score;\n\nlet bestAgent = null;\nlet lowestWorkload = Infinity;\n\nfor (const agent of availableAgents) {\n  if (agent.current_tickets < lowestWorkload && agent.status === 'available') {\n    if (priorityScore > 50 && agent.level === 'senior') {\n      bestAgent = agent;\n      lowestWorkload = agent.current_tickets;\n    } else if (priorityScore <= 50) {\n      bestAgent = agent;\n      lowestWorkload = agent.current_tickets;\n    }\n  }\n}\n\nreturn { assigned_agent: bestAgent, ...($input.first().json) };"
      },
      "id": "assign-agent",
      "name": "Assign Best Agent",
      "type": "n8n-nodes-base.function", 
      "typeVersion": 1,
      "position": [1560, 180]
    },
    {
      "parameters": {
        "method": "PUT",
        "url": "https://your-helpdesk.com/api/tickets/={{ $json.ticket_id }}",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "assignee_id",
              "value": "={{ $json.assigned_agent.id }}"
            },
            {
              "name": "priority", 
              "value": "={{ $json.priority }}"
            },
            {
              "name": "status",
              "value": "assigned"
            }
          ]
        }
      },
      "id": "update-ticket",
      "name": "Update Ticket Assignment",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1, 
      "position": [1780, 180]
    },
    {
      "parameters": {
        "operation": "postMessage",
        "channel": "={{ $json.assigned_agent.slack_channel }}",
        "text": "🎫 New Ticket Assigned!\n\n**ID:** {{ $json.ticket_id }}\n**Priority:** {{ $json.priority }} ({{ $json.priority_score }})\n**Subject:** {{ $json.subject }}\n**Customer:** {{ $json.customer_email }}\n\n[View Ticket](https://your-helpdesk.com/tickets/{{ $json.ticket_id }})"
      },
      "id": "notify-slack",
      "name": "Notify Agent (Slack)",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2.1,
      "position": [2000, 180]
    },
    {
      "parameters": {
        "operation": "send",
        "to": "={{ $json.customer_email }}",
        "subject": "Ticket #{{ $json.ticket_id }} - We're on it!",
        "emailType": "html",
        "message": "<!DOCTYPE html><html><body><h2>Thank you for contacting support!</h2><p>Your ticket <strong>#{{ $json.ticket_id }}</strong> has been assigned to our {{ $json.category }} team.</p><p><strong>Expected Response:</strong> Within 2-4 hours</p><p>We'll keep you updated on progress.</p></body></html>"
      },
      "id":