```markdown
---
title: "Automated Performance Review Reminders Workflow"
description: "Streamline your performance review process with automated reminders for managers and employees using n8n"
profession: "HR Managers"
category: "Human Resources"
contentType: "workflow"
tags: ["performance-review", "hr-automation", "reminders", "employee-management", "scheduling"]
pubDate: "2026-05-13"
featured: false
---

# Automated Performance Review Reminders Workflow

## Why This Automation Matters

Performance reviews are critical for employee development and organizational growth, but managing the entire process manually can be overwhelming for HR teams. This automation ensures no performance review falls through the cracks by:

- **Eliminating manual tracking** of review deadlines and follow-ups
- **Reducing administrative burden** by automating reminder communications
- **Improving completion rates** through timely, consistent notifications
- **Enhancing employee experience** with clear, professional communications
- **Providing audit trails** of all review-related communications
- **Scaling effortlessly** as your organization grows

This workflow automatically tracks review schedules, sends progressive reminders to both managers and employees, and escalates to HR when deadlines are missed.

## What You Need Before Starting

### Required Tools & Accounts
- **n8n Cloud account** or self-hosted n8n instance
- **Email service** (Gmail, Outlook, or SMTP server)
- **Spreadsheet application** (Google Sheets or Airtable for employee data)
- **Calendar application** (Google Calendar or Outlook Calendar)

### Required Information
- Employee database with review schedules
- Manager contact information
- Email templates for different reminder stages
- Review cycle dates and deadlines
- Escalation procedures and contacts

### Prerequisites
- Basic understanding of n8n workflow creation
- Access to your organization's employee data
- Email sending permissions
- Calendar integration capabilities

## Complete Node-by-Node Build Instructions

### Node 1: Schedule Trigger
1. Add a **Schedule Trigger** node
2. Set trigger to run **Daily at 9:00 AM**
3. Configure timezone to match your organization's primary location
4. This will check daily for upcoming review deadlines

### Node 2: Google Sheets (Get Employee Data)
1. Add a **Google Sheets** node
2. Select **Read** operation
3. Connect to your employee performance review spreadsheet
4. Configure columns: Employee Name, Email, Manager Name, Manager Email, Review Due Date, Last Reminder Sent, Status
5. This retrieves all active performance review records

### Node 3: Filter Upcoming Reviews
1. Add a **Code** node
2. Use JavaScript to filter employees with reviews due in the next 14 days
3. Calculate days until review deadline
4. Return only records that need reminders

```javascript
const today = new Date();
const upcomingReviews = [];

for (const item of $input.all()) {
  const reviewDate = new Date(item.json['Review Due Date']);
  const daysUntil = Math.ceil((reviewDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntil >= 0 && daysUntil <= 14 && item.json.Status !== 'Completed') {
    upcomingReviews.push({
      ...item.json,
      daysUntil: daysUntil
    });
  }
}

return upcomingReviews.map(review => ({ json: review }));
```

### Node 4: Split In Batches
1. Add a **Split In Batches** node
2. Set batch size to **1** to process each employee individually
3. This ensures personalized handling of each review reminder

### Node 5: IF Node (Check Days Until Review)
1. Add an **IF** node
2. Create conditions for different reminder stages:
   - **14 days**: Initial reminder
   - **7 days**: Second reminder
   - **3 days**: Urgent reminder
   - **0 days**: Overdue notification

### Node 6a: Gmail - Initial Reminder (14 Days)
1. Add a **Gmail** node for 14-day reminders
2. Configure recipient as **Manager Email**
3. CC the **Employee Email**
4. Subject: `Performance Review Reminder - {{Employee Name}} - Due in 2 Weeks`
5. Create professional email template with review guidelines

### Node 6b: Gmail - Second Reminder (7 Days)
1. Add another **Gmail** node for 7-day reminders
2. Configure with more urgent tone
3. Subject: `Action Required: Performance Review - {{Employee Name}} - Due in 1 Week`
4. Include links to review resources and templates

### Node 6c: Gmail - Urgent Reminder (3 Days)
1. Add **Gmail** node for urgent reminders
2. Subject: `URGENT: Performance Review - {{Employee Name}} - Due in 3 Days`
3. Include escalation notice to department head

### Node 6d: Gmail - Overdue Notification
1. Add **Gmail** node for overdue notifications
2. Send to Manager, Employee, and HR
3. Subject: `OVERDUE: Performance Review - {{Employee Name}} - Immediate Action Required`
4. Include escalation procedures

### Node 7: Google Sheets - Update Last Reminder
1. Add **Google Sheets** node with **Update** operation
2. Update the **Last Reminder Sent** column with current date
3. Update **Status** if review becomes overdue
4. This prevents duplicate reminders on the same day

### Node 8: Slack Notification (Optional)
1. Add **Slack** node for HR team notifications
2. Send summary of daily reminder activity
3. Include counts of reminders sent by type
4. Post to dedicated HR channel

### Node 9: Google Calendar - Create Events
1. Add **Google Calendar** node
2. Create calendar events for upcoming review deadlines
3. Invite manager and employee
4. Set appropriate reminders within the calendar event

## Full Workflow JSON Code

```json
{
  "name": "Performance Review Reminders",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * *"
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Daily Review Check",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "YOUR_SPREADSHEET_ID",
        "sheetName": "Performance Reviews",
        "range": "A:H",
        "keyRow": 1
      },
      "id": "google-sheets-read",
      "name": "Get Employee Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "const today = new Date();\nconst upcomingReviews = [];\n\nfor (const item of $input.all()) {\n  const reviewDate = new Date(item.json['Review Due Date']);\n  const daysUntil = Math.ceil((reviewDate - today) / (1000 * 60 * 60 * 24));\n  \n  if (daysUntil >= 0 && daysUntil <= 14 && item.json.Status !== 'Completed') {\n    upcomingReviews.push({\n      ...item.json,\n      daysUntil: daysUntil\n    });\n  }\n}\n\nreturn upcomingReviews.map(review => ({ json: review }));"
      },
      "id": "filter-reviews",
      "name": "Filter Upcoming Reviews",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "id": "split-batches",
      "name": "Split In Batches",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [900, 300]
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
              "id": "days-14",
              "leftValue": "={{ $json.daysUntil }}",
              "rightValue": 14,
              "operator": {
                "type": "number",
                "operation": "equals"
              }
            },
            {
              "id": "days-7", 
              "leftValue": "={{ $json.daysUntil }}",
              "rightValue": 7,
              "operator": {
                "type": "number",
                "operation": "equals"
              }
            },
            {
              "id": "days-3",
              "leftValue": "={{ $json.daysUntil }}",
              "rightValue": 3,
              "operator": {
                "type": "number",
                "operation": "equals"
              }
            },
            {
              "id": "overdue",
              "leftValue": "={{ $json.daysUntil }}",
              "rightValue": 0,
              "operator": {
                "type": "number",
                "operation": "lte"
              }
            }
          ],
          "combineOperation": "any"
        },
        "options": {}
      },
      "id": "check-days",
      "name": "Check Days Until Review",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "sendTo": "={{ $json['Manager Email'] }}",
        "cc": "={{ $json['Employee Email'] }}",
        "subject": "Performance Review Reminder - {{ $json['Employee Name'] }} - Due in 2 Weeks",
        "emailType": "html",
        "message": "<p>Dear {{ $json['Manager Name'] }},</p><p>This is a reminder that {{ $json['Employee Name'] }}'s performance review is due in 2 weeks on {{ $json['Review Due Date'] }}.</p><p>Please begin preparing for this review by:</p><ul><li>Reviewing the employee's goals and objectives</li><li>Gathering feedback from colleagues</li><li>Preparing discussion points</li></ul><p>Resources and templates are available in our HR portal.</p><p>Best regards,<br>HR Team</p>"
      },
      "id": "gmail-14-days",
      "name": "Send 14-Day Reminder",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [1340, 200]
    },
    {
      "parameters": {
        "sendTo": "={{ $json['Manager Email'] }}",
        "cc": "={{ $json['Employee Email'] }}",
        "subject": "Action Required: Performance Review - {{ $json['Employee Name'] }} - Due in 1 Week",
        "emailType": "html",
        "message": "<p>Dear {{ $json['Manager Name'] }},</p><p><strong>Action Required:</strong> {{ $json['Employee Name'] }}'s performance review is due in 1 week on {{ $json['Review Due Date'] }}.</p><p>If you haven't started the review process, please do so immediately. Contact HR if you need assistance or have scheduling conflicts.</p><p>Best regards,<br>HR Team</p>"
      },
      "id": "gmail-7-days",
      "name": "Send 7-Day Reminder", 
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [1340, 300]
    },
    {
      "parameters": {
        "sendTo": "={{ $json['Manager Email'] }}",
        "cc": "={{ $json['Employee Email'] }}, hr@company.com",
        "subject": "URGENT: Performance Review - {{ $json['Employee Name'] }} - Due in 3 Days",
        "emailType": "html",
        "message": "<p>Dear {{ $json['Manager Name'] }},</p><p><strong>URGENT:</strong> {{ $json['Employee Name'] }}'s performance review is due in 3 days on {{ $json['Review Due Date'] }}.</p><p>Please schedule and complete this review immediately. HR has been copied on this message for awareness.</p><p>Contact HR immediately if there are any issues preventing completion.</p><p>Best regards,<br>HR Team</p>"
      },
      "id": "gmail-3-days",
      "name": "Send 3-Day Urgent Reminder",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [1340, 400]
    },
    {
      "parameters": {
        "sendTo": "={{ $json['Manager Email'] }}",
        "cc": "={{ $json['Employee Email'] }}, hr@company.com, departmenthead@company.com",
        "subject": "OVERDUE: Performance Review - {{ $json['Employee Name'] }} - Immediate Action Required",
        "emailType": "html", 
        "message": "<p>Dear {{ $json['Manager Name'] }},</p><p><strong>OVERDUE:</strong> {{ $json['Employee Name'] }}'s performance review was due on {{ $json['Review Due Date'] }} and is now overdue.</p><p>This requires immediate attention. Please contact HR today to discuss next steps and schedule completion of this review.</p><p>Department leadership and HR have been copied for escalation purposes.</p><p>Best regards,<br>HR Team</p>"
      },
      "id": "gmail-overdue",
      "name": "Send Overdue Notice",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [1340, 500]
    },
    {
      "parameters": {
        "operation": "update",
        "documentId": "YOUR_SPREADSHEET_ID",
        "sheetName": "Performance Reviews",
        "range": "G{{ $json.rowNumber }}",
        "keyRow": 1,
        "dataMode": "define",
        "fieldsUi": {
          "values": [
            {
              "fieldId": "Last Reminder Sent",
              "fieldValue": "={{ new Date().toISOString().split('T')[0] }}"
            }
          ]
        }
      },
      "id": "update-sheet",
      "name": "Update Last Reminder Date",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [1560, 300]
    }
  ],
  "connections": {
    "Daily Review Check": {
      "main": [
        [
          {
            "node": "Get Employee Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Employee Data": {
      "main": [
        [
          {
            "node": "Filter Upcoming Reviews",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter Upcoming Reviews": {
      "main": [
        [
          {
            "node": "Split In Batches", 
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Split In Batches": {
      "main": [
        [
          {
            "node": "Check Days Until Review",
            "type": "main",
            "index":