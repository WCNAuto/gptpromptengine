---
title: "Automated Lead Scoring and CRM Routing with n8n"
description: "Streamline your sales process with automated lead scoring and intelligent CRM routing to ensure high-quality leads reach the right sales team members instantly."
profession: "Sales"
category: "Lead Management"
contentType: "workflow"
tags: ["lead scoring", "CRM automation", "sales routing", "lead qualification", "sales automation"]
pubDate: "2026-05-13"
featured: false
---

# Automated Lead Scoring and CRM Routing with n8n

## Why This Automation Matters

Manual lead qualification and routing creates bottlenecks that cost sales teams valuable opportunities. Studies show that companies responding to leads within 5 minutes are 100x more likely to connect with prospects. This n8n workflow automatically scores incoming leads based on predefined criteria and routes them to the appropriate sales team members, ensuring no hot lead goes cold while your team focuses on closing deals instead of lead triage.

Key benefits:
- **Instant lead qualification** - Score leads automatically based on company size, budget, industry, and behavior
- **Intelligent routing** - Direct leads to specialists based on territory, product interest, or deal size
- **Consistent follow-up** - Ensure every lead receives timely, appropriate attention
- **Performance insights** - Track scoring accuracy and routing effectiveness

## What You Need Before Starting

### Required Tools & Accounts
- **n8n instance** (Cloud or self-hosted)
- **CRM system** (HubSpot, Salesforce, or Pipedrive)
- **Lead source** (Website forms, landing pages, or lead magnets)
- **Email service** (Gmail, Outlook, or SMTP server)
- **Slack/Teams** (optional, for team notifications)

### Prerequisites
- Active CRM API credentials
- Lead capture form or webhook endpoint
- Sales team member assignments and territories defined
- Lead scoring criteria established (company size, budget, industry, etc.)
- Basic understanding of n8n workflow concepts

### Preparation Checklist
- [ ] Define lead scoring matrix (0-100 scale recommended)
- [ ] Map sales territories and team assignments
- [ ] Set up CRM custom fields for lead scores
- [ ] Create lead source tracking parameters
- [ ] Establish notification preferences for sales team

## Complete Node-by-Node Build Instructions

### Step 1: Set Up the Webhook Trigger

1. Add a **Webhook** node as your starting trigger
2. Set the HTTP method to `POST`
3. Configure the webhook URL path: `/lead-intake`
4. Set authentication to `None` for public forms
5. Test the webhook with sample lead data

Expected incoming data structure:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@company.com",
  "company": "Tech Corp",
  "jobTitle": "VP Sales",
  "phone": "+1234567890",
  "industry": "Technology",
  "employees": "501-1000",
  "budget": "50000",
  "source": "website_demo"
}
```

### Step 2: Initialize Lead Scoring Function

1. Add a **Function** node named "Calculate Lead Score"
2. Connect it to the Webhook trigger
3. Implement the scoring logic:

```javascript
// Lead Scoring Algorithm
const leadData = $input.item.json;
let score = 0;

// Company size scoring (0-30 points)
const employeeRanges = {
  "1-10": 5,
  "11-50": 10,
  "51-200": 15,
  "201-500": 20,
  "501-1000": 25,
  "1000+": 30
};
score += employeeRanges[leadData.employees] || 0;

// Budget scoring (0-25 points)
const budget = parseInt(leadData.budget) || 0;
if (budget >= 100000) score += 25;
else if (budget >= 50000) score += 20;
else if (budget >= 25000) score += 15;
else if (budget >= 10000) score += 10;
else if (budget > 0) score += 5;

// Industry scoring (0-20 points)
const highValueIndustries = ["Technology", "Finance", "Healthcare", "Manufacturing"];
if (highValueIndustries.includes(leadData.industry)) {
  score += 20;
} else {
  score += 10;
}

// Job title scoring (0-15 points)
const seniorTitles = ["CEO", "CTO", "VP", "Director", "President", "Founder"];
const titleMatch = seniorTitles.some(title => 
  leadData.jobTitle.toLowerCase().includes(title.toLowerCase())
);
score += titleMatch ? 15 : 5;

// Lead source scoring (0-10 points)
const sourceScores = {
  "website_demo": 10,
  "webinar": 8,
  "whitepaper": 6,
  "social_media": 4,
  "cold_outreach": 2
};
score += sourceScores[leadData.source] || 3;

return {
  ...leadData,
  leadScore: score,
  scoreBreakdown: {
    company: employeeRanges[leadData.employees] || 0,
    budget: budget >= 100000 ? 25 : budget >= 50000 ? 20 : budget >= 25000 ? 15 : budget >= 10000 ? 10 : budget > 0 ? 5 : 0,
    industry: highValueIndustries.includes(leadData.industry) ? 20 : 10,
    title: titleMatch ? 15 : 5,
    source: sourceScores[leadData.source] || 3
  }
};
```

### Step 3: Determine Lead Priority and Routing

1. Add an **IF** node named "Lead Priority Router"
2. Set condition: `{{$json.leadScore}} >= 70`
3. This creates two paths: high-priority (True) and standard (False)

### Step 4: Configure High-Priority Lead Path

1. Add a **Function** node to the True path: "Assign Senior Sales Rep"
2. Configure senior rep assignment logic:

```javascript
const leadData = $input.item.json;

// Senior sales rep assignment based on territory/industry
const seniorReps = {
  "Technology": {
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1234567801"
  },
  "Finance": {
    name: "Mike Chen",
    email: "mike.c@company.com", 
    phone: "+1234567802"
  },
  "Healthcare": {
    name: "Lisa Rodriguez",
    email: "lisa.r@company.com",
    phone: "+1234567803"
  },
  "default": {
    name: "Alex Thompson",
    email: "alex.t@company.com",
    phone: "+1234567804"
  }
};

const assignedRep = seniorReps[leadData.industry] || seniorReps.default;

return {
  ...leadData,
  priority: "HIGH",
  assignedRep: assignedRep,
  followUpTime: "immediate"
};
```

### Step 5: Configure Standard Lead Path

1. Add a **Function** node to the False path: "Assign Standard Sales Rep"
2. Configure standard assignment logic:

```javascript
const leadData = $input.item.json;

// Standard sales rep rotation or territory-based assignment
const standardReps = [
  {
    name: "Tom Wilson",
    email: "tom.w@company.com",
    phone: "+1234567805",
    territory: "West"
  },
  {
    name: "Emma Davis",
    email: "emma.d@company.com",
    phone: "+1234567806", 
    territory: "East"
  },
  {
    name: "James Brown",
    email: "james.b@company.com",
    phone: "+1234567807",
    territory: "Central"
  }
];

// Simple round-robin assignment (can be enhanced with territory logic)
const assignedRep = standardReps[Math.floor(Math.random() * standardReps.length)];

let priority = "MEDIUM";
if (leadData.leadScore >= 50) {
  priority = "MEDIUM";
} else {
  priority = "LOW";
}

return {
  ...leadData,
  priority: priority,
  assignedRep: assignedRep,
  followUpTime: priority === "MEDIUM" ? "within_2_hours" : "within_24_hours"
};
```

### Step 6: Create CRM Records

1. Add a **Merge** node to combine both paths
2. Add your CRM node (e.g., **HubSpot**, **Salesforce**, or **Pipedrive**)
3. Configure CRM connection and map fields:

For HubSpot:
- Operation: "Create Contact"
- Email: `{{$json.email}}`
- First Name: `{{$json.firstName}}`
- Last Name: `{{$json.lastName}}`
- Company: `{{$json.company}}`
- Phone: `{{$json.phone}}`
- Lead Score: `{{$json.leadScore}}`
- Assigned Owner: `{{$json.assignedRep.email}}`

### Step 7: Send Notification to Sales Rep

1. Add a **Gmail** or **Send Email** node
2. Configure email to assigned sales rep:

```
To: {{$json.assignedRep.email}}
Subject: New {{$json.priority}} Priority Lead - {{$json.firstName}} {{$json.lastName}}

Body:
New lead assigned to you:

Lead Details:
- Name: {{$json.firstName}} {{$json.lastName}}
- Company: {{$json.company}}
- Email: {{$json.email}}
- Phone: {{$json.phone}}
- Industry: {{$json.industry}}
- Lead Score: {{$json.leadScore}}/100
- Priority: {{$json.priority}}
- Follow-up: {{$json.followUpTime}}

Score Breakdown:
- Company Size: {{$json.scoreBreakdown.company}} points
- Budget: {{$json.scoreBreakdown.budget}} points  
- Industry: {{$json.scoreBreakdown.industry}} points
- Job Title: {{$json.scoreBreakdown.title}} points
- Lead Source: {{$json.scoreBreakdown.source}} points

View in CRM: [Link to CRM record]
```

### Step 8: Add Slack Notification (Optional)

1. Add a **Slack** node for team notifications
2. Configure channel and message for high-priority leads only
3. Add an **IF** condition: `{{$json.priority}} === "HIGH"`

Slack message:
```
🚨 HIGH PRIORITY LEAD ALERT 🚨

{{$json.firstName}} {{$json.lastName}} from {{$json.company}}
Score: {{$json.leadScore}}/100
Assigned to: {{$json.assignedRep.name}}
Industry: {{$json.industry}}
```

### Step 9: Log Lead Activity

1. Add a **Google Sheets** or **Airtable** node for tracking
2. Log each lead with timestamp, score, and assignment details
3. This creates an audit trail for performance analysis

## Complete Workflow JSON

```json
{
  "name": "Lead Scoring and CRM Routing",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-intake",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Lead Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "lead-intake-webhook"
    },
    {
      "parameters": {
        "functionCode": "// Lead Scoring Algorithm\nconst leadData = $input.item.json;\nlet score = 0;\n\n// Company size scoring (0-30 points)\nconst employeeRanges = {\n  \"1-10\": 5,\n  \"11-50\": 10,\n  \"51-200\": 15,\n  \"201-500\": 20,\n  \"501-1000\": 25,\n  \"1000+\": 30\n};\nscore += employeeRanges[leadData.employees] || 0;\n\n// Budget scoring (0-25 points)\nconst budget = parseInt(leadData.budget) || 0;\nif (budget >= 100000) score += 25;\nelse if (budget >= 50000) score += 20;\nelse if (budget >= 25000) score += 15;\nelse if (budget >= 10000) score += 10;\nelse if (budget > 0) score += 5;\n\n// Industry scoring (0-20 points)\nconst highValueIndustries = [\"Technology\", \"Finance\", \"Healthcare\", \"Manufacturing\"];\nif (highValueIndustries.includes(leadData.industry)) {\n  score += 20;\n} else {\n  score += 10;\n}\n\n// Job title scoring (0-15 points)\nconst seniorTitles = [\"CEO\", \"CTO\", \"VP\", \"Director\", \"President\", \"Founder\"];\nconst titleMatch = seniorTitles.some(title => \n  leadData.jobTitle.toLowerCase().includes(title.toLowerCase())\n);\nscore += titleMatch ? 15 : 5;\n\n// Lead source scoring (0-10 points)\nconst sourceScores = {\n  \"website_demo\": 10,\n  \"webinar\": 8,\n  \"whitepaper\": 6,\n  \"social_media\": 4,\n  \"cold_outreach\": 2\n};\nscore += sourceScores[leadData.source] || 3;\n\nreturn {\n  ...leadData,\n  leadScore: score,\n  scoreBreakdown: {\n    company: employeeRanges[leadData.employees] || 0,\n    budget: budget >= 100000 ? 25 : budget >= 50000 ? 20 : budget >= 25000 ? 15 : budget >= 10000 ? 10 : budget > 0 ? 5 : 0,\n    industry: highValueIndustries.includes(leadData.industry) ? 20 : 10,\n    title: titleMatch ? 15 : 5,\n    source: sourceScores[leadData.source] || 3\n  }\n};"
      },
      "id": "lead-scoring",
      "name": "Calculate Lead Score", 
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{$json.leadScore}}",
              "operation": "largerEqual",
              "value2": 70
            }
          ]
        }
      },
      "id": "priority-router",
      "name": "Lead Priority Router",
      "type": "n8n-nodes-base.if", 
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "functionCode": "const leadData = $input.item.json;\n\n// Senior sales rep assignment based on territory/industry\nconst seniorReps = {\n  \"Technology\": {\n    name: \"Sarah Johnson\",\n    email: \"sarah.j@company.com\",\n    phone: \"+1234567801\"\n  },\n  \"Finance\": {\n    name: \"Mike Chen\",\n    email: \"mike.c@company.com\", \n    phone: \"+1234567802\"\n  },\n  \"Healthcare\": {\n    name