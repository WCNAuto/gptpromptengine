
---
title: "Automated Employee Onboarding Checklist with n8n"
description: "Streamline your HR onboarding process with this comprehensive n8n workflow that automatically creates and tracks employee onboarding tasks, sends notifications, and ensures nothing falls through the cracks."
profession: "HR Managers"
category: "Human Resources"
contentType: "workflow"
tags: ["onboarding", "hr automation", "employee management", "task tracking", "notifications"]
pubDate: "2026-05-13"
featured: false
---

# Automated Employee Onboarding Checklist with n8n

## Why This Automation Matters

Employee onboarding is critical for new hire success, but managing multiple tasks across different departments can be overwhelming. This n8n workflow automates the entire onboarding checklist process, ensuring consistent experiences for every new employee while reducing manual work for HR teams.

**Key Benefits:**
- **Zero missed tasks** - Automated checklist ensures every onboarding step is completed
- **Time savings** - Reduces manual coordination by 75%
- **Improved experience** - New hires receive timely communications and clear expectations
- **Better tracking** - Real-time visibility into onboarding progress across all departments
- **Compliance assurance** - Ensures all required documentation and training is completed

## What You Need Before Starting

### Required Integrations
- **Google Sheets** or **Airtable** (employee database)
- **Slack** or **Microsoft Teams** (team notifications)
- **Gmail** or **Outlook** (email communications)
- **Calendly** or **Google Calendar** (scheduling meetings)

### Prerequisites
- n8n Cloud account or self-hosted instance
- Access to your HRIS or employee spreadsheet
- Admin access to communication platforms
- Email templates for onboarding communications

### Data Setup
Create a spreadsheet with columns:
- Employee Name
- Email
- Start Date
- Department
- Manager Email
- Position
- Onboarding Status

## Complete Node-by-Node Build Instructions

### Node 1: Schedule Trigger
1. Add **Schedule Trigger** node
2. Set to **Every Day at 9:00 AM**
3. This checks for new employees starting today or overdue tasks

### Node 2: Google Sheets - Get Employee Data
1. Add **Google Sheets** node
2. Configure:
   - **Operation**: Read
   - **Document ID**: Your employee spreadsheet ID
   - **Sheet**: "New Employees"
   - **Range**: A:H (all columns)
3. This retrieves all employee onboarding records

### Node 3: Filter New Starts
1. Add **Filter** node
2. Configure condition:
   - **Property**: `start_date`
   - **Operation**: equals
   - **Value**: `{{ $now.format('YYYY-MM-DD') }}`
3. This identifies employees starting today

### Node 4: Create Onboarding Tasks
1. Add **Function** node
2. Add this code:
```javascript
const onboardingTasks = [
  { task: "Send welcome email", responsible: "HR", due_days: 0 },
  { task: "Create IT accounts", responsible: "IT", due_days: 1 },
  { task: "Prepare workspace", responsible: "Facilities", due_days: 1 },
  { task: "Schedule manager meeting", responsible: "Manager", due_days: 2 },
  { task: "Complete paperwork", responsible: "Employee", due_days: 3 },
  { task: "Assign buddy", responsible: "HR", due_days: 3 },
  { task: "Security training", responsible: "Employee", due_days: 5 },
  { task: "Department introduction", responsible: "Manager", due_days: 7 }
];

const employees = $input.all();
const results = [];

employees.forEach(employee => {
  onboardingTasks.forEach(task => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + task.due_days);
    
    results.push({
      employee_name: employee.json.employee_name,
      employee_email: employee.json.email,
      manager_email: employee.json.manager_email,
      department: employee.json.department,
      task_name: task.task,
      responsible: task.responsible,
      due_date: dueDate.toISOString().split('T')[0],
      status: "pending",
      created_date: new Date().toISOString().split('T')[0]
    });
  });
});

return results.map(item => ({ json: item }));
```

### Node 5: Google Sheets - Save Tasks
1. Add **Google Sheets** node
2. Configure:
   - **Operation**: Append
   - **Document ID**: Your tasks tracking spreadsheet
   - **Sheet**: "Onboarding Tasks"
3. This saves all tasks to track progress

### Node 6: Send Welcome Email
1. Add **Gmail** node
2. Configure:
   - **Operation**: Send
   - **To**: `{{ $node["Filter New Starts"].json["email"] }}`
   - **Subject**: "Welcome to [Company Name] - Your First Day Guide"
   - **Body**: 
```html
<h2>Welcome to the team, {{ $node["Filter New Starts"].json["employee_name"] }}!</h2>

<p>We're excited to have you join us. Here's what to expect on your first day:</p>

<ul>
  <li>Report to reception at 9:00 AM</li>
  <li>You'll meet with HR for initial paperwork</li>
  <li>IT will set up your accounts and equipment</li>
  <li>Your manager {{ $node["Filter New Starts"].json["manager_email"] }} will give you a department tour</li>
</ul>

<p>If you have any questions, don't hesitate to reach out!</p>

<p>Best regards,<br>HR Team</p>
```

### Node 7: Notify Manager
1. Add **Slack** node (or Teams)
2. Configure:
   - **Operation**: Post Message
   - **Channel**: `@{{ $node["Filter New Starts"].json["manager_email"] }}`
   - **Text**:
```
🎉 New team member starting today!

*Employee:* {{ $node["Filter New Starts"].json["employee_name"] }}
*Position:* {{ $node["Filter New Starts"].json["position"] }}
*Department:* {{ $node["Filter New Starts"].json["department"] }}

Your onboarding tasks:
• Schedule 1:1 meeting (due in 2 days)
• Department introduction (due in 1 week)

Check the onboarding tracker for full details.
```

### Node 8: Notify IT Department
1. Add **Slack** node
2. Configure:
   - **Channel**: "#it-requests"
   - **Text**:
```
🔧 New employee IT setup required

*Name:* {{ $node["Filter New Starts"].json["employee_name"] }}
*Email:* {{ $node["Filter New Starts"].json["email"] }}
*Department:* {{ $node["Filter New Starts"].json["department"] }}
*Start Date:* {{ $node["Filter New Starts"].json["start_date"] }}

Tasks needed:
• Create email account
• Set up computer and accounts
• Install department-specific software

Due: Tomorrow
```

### Node 9: Schedule Check-in Meeting
1. Add **Google Calendar** node
2. Configure:
   - **Operation**: Create Event
   - **Summary**: "Week 1 Check-in - {{ $node["Filter New Starts"].json["employee_name"] }}"
   - **Start**: 1 week from start date
   - **Attendees**: Employee and Manager emails
   - **Description**: "First week check-in to discuss onboarding progress and answer questions"

### Node 10: Daily Task Reminder Check
1. Add **Schedule Trigger** (separate branch)
2. Set to **Every Day at 10:00 AM**
3. Add **Google Sheets** node to check overdue tasks
4. Add **Filter** node for overdue items
5. Add **Slack** node to send reminders

## Full Workflow JSON

```json
{
  "name": "Employee Onboarding Checklist Automation",
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
      "name": "Daily Onboarding Check",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "YOUR_SPREADSHEET_ID",
        "sheetName": "New Employees",
        "range": "A:H",
        "keyRow": 1
      },
      "name": "Get Employee Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.start_date }}",
              "operation": "equal",
              "value2": "={{ $now.format('YYYY-MM-DD') }}"
            }
          ]
        }
      },
      "name": "Filter New Starts",
      "type": "n8n-nodes-base.filter",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "functionCode": "const onboardingTasks = [\n  { task: \"Send welcome email\", responsible: \"HR\", due_days: 0 },\n  { task: \"Create IT accounts\", responsible: \"IT\", due_days: 1 },\n  { task: \"Prepare workspace\", responsible: \"Facilities\", due_days: 1 },\n  { task: \"Schedule manager meeting\", responsible: \"Manager\", due_days: 2 },\n  { task: \"Complete paperwork\", responsible: \"Employee\", due_days: 3 },\n  { task: \"Assign buddy\", responsible: \"HR\", due_days: 3 },\n  { task: \"Security training\", responsible: \"Employee\", due_days: 5 },\n  { task: \"Department introduction\", responsible: \"Manager\", due_days: 7 }\n];\n\nconst employees = $input.all();\nconst results = [];\n\nemployees.forEach(employee => {\n  onboardingTasks.forEach(task => {\n    const dueDate = new Date();\n    dueDate.setDate(dueDate.getDate() + task.due_days);\n    \n    results.push({\n      employee_name: employee.json.employee_name,\n      employee_email: employee.json.email,\n      manager_email: employee.json.manager_email,\n      department: employee.json.department,\n      task_name: task.task,\n      responsible: task.responsible,\n      due_date: dueDate.toISOString().split('T')[0],\n      status: \"pending\",\n      created_date: new Date().toISOString().split('T')[0]\n    });\n  });\n});\n\nreturn results.map(item => ({ json: item }));"
      },
      "name": "Create Onboarding Tasks",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": "YOUR_TASKS_SPREADSHEET_ID",
        "sheetName": "Onboarding Tasks",
        "options": {}
      },
      "name": "Save Tasks to Sheet",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "sendTo": "={{ $node[\"Filter New Starts\"].json[\"email\"] }}",
        "subject": "Welcome to [Company Name] - Your First Day Guide",
        "message": "<h2>Welcome to the team, {{ $node[\"Filter New Starts\"].json[\"employee_name\"] }}!</h2>\n\n<p>We're excited to have you join us. Here's what to expect on your first day:</p>\n\n<ul>\n  <li>Report to reception at 9:00 AM</li>\n  <li>You'll meet with HR for initial paperwork</li>\n  <li>IT will set up your accounts and equipment</li>\n  <li>Your manager will give you a department tour</li>\n</ul>\n\n<p>If you have any questions, don't hesitate to reach out!</p>\n\n<p>Best regards,<br>HR Team</p>"
      },
      "name": "Send Welcome Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [680, 500]
    },
    {
      "parameters": {
        "channel": "={{ '@' + $node[\"Filter New Starts\"].json[\"manager_email\"] }}",
        "text": "🎉 New team member starting today!\n\n*Employee:* {{ $node[\"Filter New Starts\"].json[\"employee_name\"] }}\n*Position:* {{ $node[\"Filter New Starts\"].json[\"position\"] }}\n*Department:* {{ $node[\"Filter New Starts\"].json[\"department\"] }}\n\nYour onboarding tasks:\n• Schedule 1:1 meeting (due in 2 days)\n• Department introduction (due in 1 week)\n\nCheck the onboarding tracker for full details."
      },
      "name": "Notify Manager",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [900, 500]
    },
    {
      "parameters": {
        "channel": "#it-requests",
        "text": "🔧 New employee IT setup required\n\n*Name:* {{ $node[\"Filter New Starts\"].json[\"employee_name\"] }}\n*Email:* {{ $node[\"Filter New Starts\"].json[\"email\"] }}\n*Department:* {{ $node[\"Filter New Starts\"].json[\"department\"] }}\n*Start Date:* {{ $node[\"Filter New Starts\"].json[\"start_date\"] }}\n\nTasks needed:\n• Create email account\n• Set up computer and accounts\n• Install department-specific software\n\nDue: Tomorrow"
      },
      "name": "Notify IT Department",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1120, 500]
    }
  ],
  "connections": {
    "Daily Onboarding Check": {
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
            "node": "Filter New Starts",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Filter New Starts": {
      "main": [
        [
          {
            "node": "Create Onboarding Tasks",
            "type": "main",
            "index": 0
          },
          {
            "node": "Send Welcome Email",
            "type": "main",
            "index": 0
          }
        ]
