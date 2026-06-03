---
title: "Automated Lead Qualification and CRM Routing Workflow"
description: "Streamline your sales process by automatically qualifying leads and routing them to the right team members based on predefined criteria"
profession: "Sales"
category: "Lead Management"
contentType: "workflow"
tags: ["lead qualification", "crm", "sales automation", "routing", "lead scoring"]
pubDate: "2026-06-03"
featured: false
---

## Why This Automation Matters

Manual lead qualification is time-consuming and prone to human error. This workflow automatically evaluates incoming leads against your qualification criteria, scores them based on predefined rules, and routes qualified leads to the appropriate sales representatives. This ensures faster response times, consistent qualification standards, and prevents hot leads from falling through the cracks.

The automation helps sales teams prioritize their efforts on high-quality prospects while ensuring every lead receives appropriate follow-up based on their qualification score and characteristics.

## What You Need Before Starting

- n8n instance (cloud or self-hosted)
- CRM system (HubSpot, Salesforce, or Pipedrive account)
- Lead source (web form, landing page, or lead capture system)
- Email service (Gmail, Outlook, or SMTP server)
- Slack workspace (optional, for team notifications)
- Predefined lead qualification criteria and scoring rules
- Sales team member assignments and territories

## Node-by-Node Build Instructions

### 1. Webhook Trigger Node
- Add a **Webhook** node as your starting point
- Set HTTP Method to `POST`
- Choose "Wait for Response" option
- Copy the webhook URL for your lead capture forms
- This will receive incoming lead data

### 2. Set Lead Data Node
- Add a **Set** node after the webhook
- Configure the following fields:
  - `leadId`: `{{ $json.id || $randomInt(100000, 999999) }}`
  - `firstName`: `{{ $json.first_name }}`
  - `lastName`: `{{ $json.last_name }}`
  - `email`: `{{ $json.email }}`
  - `company`: `{{ $json.company }}`
  - `jobTitle`: `{{ $json.job_title }}`
  - `phone`: `{{ $json.phone }}`
  - `leadSource`: `{{ $json.source }}`
  - `annualRevenue`: `{{ $json.annual_revenue }}`
  - `employeeCount`: `{{ $json.employee_count }}`

### 3. Lead Qualification Scoring Node
- Add a **Function** node for qualification logic
- Use this JavaScript code:

```javascript
const lead = $input.first().json;
let score = 0;
let qualificationNotes = [];

// Company size scoring
if (lead.employeeCount >= 100) {
  score += 20;
  qualificationNotes.push("Large company (100+ employees)");
} else if (lead.employeeCount >= 50) {
  score += 15;
  qualificationNotes.push("Medium company (50-99 employees)");
} else if (lead.employeeCount >= 10) {
  score += 10;
  qualificationNotes.push("Small company (10-49 employees)");
}

// Revenue scoring
if (lead.annualRevenue >= 1000000) {
  score += 25;
  qualificationNotes.push("High revenue (>$1M annually)");
} else if (lead.annualRevenue >= 500000) {
  score += 20;
  qualificationNotes.push("Medium revenue ($500K-$1M annually)");
} else if (lead.annualRevenue >= 100000) {
  score += 10;
  qualificationNotes.push("Growing revenue ($100K-$500K annually)");
}

// Job title scoring
const decisionMakerTitles = ['ceo', 'cto', 'cfo', 'director', 'vp', 'manager', 'head'];
if (decisionMakerTitles.some(title => lead.jobTitle?.toLowerCase().includes(title))) {
  score += 15;
  qualificationNotes.push("Decision maker role");
}

// Lead source scoring
if (lead.leadSource === 'referral') {
  score += 20;
  qualificationNotes.push("Referral lead");
} else if (lead.leadSource === 'demo_request') {
  score += 25;
  qualificationNotes.push("Demo request");
} else if (lead.leadSource === 'organic_search') {
  score += 10;
  qualificationNotes.push("Organic search");
}

// Determine qualification level
let qualificationLevel = 'Cold';
if (score >= 60) {
  qualificationLevel = 'Hot';
} else if (score >= 40) {
  qualificationLevel = 'Warm';
} else if (score >= 20) {
  qualificationLevel = 'Qualified';
}

return {
  ...lead,
  qualificationScore: score,
  qualificationLevel: qualificationLevel,
  qualificationNotes: qualificationNotes.join(', '),
  scoredAt: new Date().toISOString()
};
```

### 4. Territory Assignment Node
- Add another **Function** node for territory routing
- Use this code to assign sales reps:

```javascript
const lead = $input.first().json;

// Define territory assignments
const territories = {
  'enterprise': {
    rep: 'john.doe@company.com',
    repName: 'John Doe',
    criteria: (l) => l.employeeCount >= 100 || l.annualRevenue >= 1000000
  },
  'mid-market': {
    rep: 'jane.smith@company.com',
    repName: 'Jane Smith', 
    criteria: (l) => (l.employeeCount >= 50 && l.employeeCount < 100) || 
                     (l.annualRevenue >= 500000 && l.annualRevenue < 1000000)
  },
  'smb': {
    rep: 'mike.johnson@company.com',
    repName: 'Mike Johnson',
    criteria: (l) => l.employeeCount < 50 || l.annualRevenue < 500000
  }
};

// Assign territory
let assignedTerritory = 'smb'; // default
for (const [territory, config] of Object.entries(territories)) {
  if (config.criteria(lead)) {
    assignedTerritory = territory;
    break;
  }
}

const assignment = territories[assignedTerritory];

return {
  ...lead,
  assignedRep: assignment.rep,
  assignedRepName: assignment.repName,
  territory: assignedTerritory
};
```

### 5. If Node for Qualification Check
- Add an **If** node to check qualification level
- Set condition: `{{ $json.qualificationScore >= 20 }}`
- This routes only qualified leads to CRM

### 6. CRM Create/Update Node (True Branch)
- Add your CRM node (HubSpot/Salesforce/Pipedrive)
- Configure to create new contact/lead:
  - First Name: `{{ $json.firstName }}`
  - Last Name: `{{ $json.lastName }}`
  - Email: `{{ $json.email }}`
  - Company: `{{ $json.company }}`
  - Phone: `{{ $json.phone }}`
  - Job Title: `{{ $json.jobTitle }}`
  - Lead Score: `{{ $json.qualificationScore }}`
  - Qualification Level: `{{ $json.qualificationLevel }}`
  - Assigned Owner: `{{ $json.assignedRep }}`
  - Lead Source: `{{ $json.leadSource }}`

### 7. Email Notification Node
- Add **Gmail** or **Send Email** node
- Configure email to assigned rep:
  - To: `{{ $json.assignedRep }}`
  - Subject: `New {{ $json.qualificationLevel }} Lead: {{ $json.firstName }} {{ $json.lastName }}`
  - Body:
```
Hi {{ $json.assignedRepName }},

You have a new {{ $json.qualificationLevel }} lead assigned to you:

Name: {{ $json.firstName }} {{ $json.lastName }}
Company: {{ $json.company }}
Email: {{ $json.email }}
Phone: {{ $json.phone }}
Job Title: {{ $json.jobTitle }}

Qualification Score: {{ $json.qualificationScore }}/100
Territory: {{ $json.territory }}
Lead Source: {{ $json.leadSource }}

Qualification Notes: {{ $json.qualificationNotes }}

Please follow up within 24 hours for hot leads, 48 hours for warm leads.

Best regards,
Sales Automation System
```

### 8. Slack Notification Node (Optional)
- Add **Slack** node for team notifications
- Post to sales channel:
  - Channel: `#sales-leads`
  - Message: `🚨 New {{ $json.qualificationLevel }} lead for {{ $json.assignedRepName }}: {{ $json.firstName }} {{ $json.lastName }} from {{ $json.company }} (Score: {{ $json.qualificationScore }})`

### 9. Unqualified Lead Handling (False Branch)
- Add **Set** node on false branch
- Add lead to nurture list or low-priority follow-up
- Send to marketing automation for nurturing

### 10. Response Node
- Add **Respond to Webhook** node at the end
- Return success response:
```json
{
  "status": "success",
  "message": "Lead processed successfully",
  "leadId": "{{ $json.leadId }}",
  "qualificationLevel": "{{ $json.qualificationLevel }}"
}
```

## Complete Workflow JSON

```json
{
  "name": "Lead Qualification and CRM Routing",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-intake",
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
              "name": "leadId",
              "value": "={{ $json.id || $randomInt(100000, 999999) }}"
            },
            {
              "name": "firstName", 
              "value": "={{ $json.first_name }}"
            },
            {
              "name": "lastName",
              "value": "={{ $json.last_name }}"
            },
            {
              "name": "email",
              "value": "={{ $json.email }}"
            },
            {
              "name": "company",
              "value": "={{ $json.company }}"
            },
            {
              "name": "jobTitle",
              "value": "={{ $json.job_title }}"
            },
            {
              "name": "phone",
              "value": "={{ $json.phone }}"
            },
            {
              "name": "leadSource",
              "value": "={{ $json.source }}"
            },
            {
              "name": "annualRevenue",
              "value": "={{ $json.annual_revenue }}"
            },
            {
              "name": "employeeCount",
              "value": "={{ $json.employee_count }}"
            }
          ]
        }
      },
      "id": "set-lead-data",
      "name": "Set Lead Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "functionCode": "const lead = $input.first().json;\nlet score = 0;\nlet qualificationNotes = [];\n\n// Company size scoring\nif (lead.employeeCount >= 100) {\n  score += 20;\n  qualificationNotes.push(\"Large company (100+ employees)\");\n} else if (lead.employeeCount >= 50) {\n  score += 15;\n  qualificationNotes.push(\"Medium company (50-99 employees)\");\n} else if (lead.employeeCount >= 10) {\n  score += 10;\n  qualificationNotes.push(\"Small company (10-49 employees)\");\n}\n\n// Revenue scoring\nif (lead.annualRevenue >= 1000000) {\n  score += 25;\n  qualificationNotes.push(\"High revenue (>$1M annually)\");\n} else if (lead.annualRevenue >= 500000) {\n  score += 20;\n  qualificationNotes.push(\"Medium revenue ($500K-$1M annually)\");\n} else if (lead.annualRevenue >= 100000) {\n  score += 10;\n  qualificationNotes.push(\"Growing revenue ($100K-$500K annually)\");\n}\n\n// Job title scoring\nconst decisionMakerTitles = ['ceo', 'cto', 'cfo', 'director', 'vp', 'manager', 'head'];\nif (decisionMakerTitles.some(title => lead.jobTitle?.toLowerCase().includes(title))) {\n  score += 15;\n  qualificationNotes.push(\"Decision maker role\");\n}\n\n// Lead source scoring\nif (lead.leadSource === 'referral') {\n  score += 20;\n  qualificationNotes.push(\"Referral lead\");\n} else if (lead.leadSource === 'demo_request') {\n  score += 25;\n  qualificationNotes.push(\"Demo request\");\n} else if (lead.leadSource === 'organic_search') {\n  score += 10;\n  qualificationNotes.push(\"Organic search\");\n}\n\n// Determine qualification level\nlet qualificationLevel = 'Cold';\nif (score >= 60) {\n  qualificationLevel = 'Hot';\n} else if (score >= 40) {\n  qualificationLevel = 'Warm';\n} else if (score >= 20) {\n  qualificationLevel = 'Qualified';\n}\n\nreturn {\n  ...lead,\n  qualificationScore: score,\n  qualificationLevel: qualificationLevel,\n  qualificationNotes: qualificationNotes.join(', '),\n  scoredAt: new Date().toISOString()\n};"
      },
      "id": "qualification-scoring",
      "name": "Lead Qualification Scoring",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "functionCode": "const lead = $input.first().json;\n\n// Define territory assignments\nconst territories = {\n  'enterprise': {\n    rep: 'john.doe@company.com',\n    repName: 'John Doe',\n    criteria: (l) => l.employeeCount >= 100 || l.annualRevenue >= 1000000\n  },\n  'mid-market': {\n    rep: 'jane.smith@company.com',\n    repName: 'Jane Smith',\n    criteria: (l) => (l.employeeCount >= 50 && l.employeeCount < 100) || \n                     (l.annualRevenue >= 500000 && l.annualRevenue < 1000000)\n  },\n  'smb': {\n    rep: 'mike.johnson@company.com',\n    repName: 'Mike Johnson',\n    criteria: (l) => l.employeeCount < 50 || l.annualRevenue < 500000\n  }\n};\n\n// Assign territory\nlet assignedTerritory = 'smb'; // default\n