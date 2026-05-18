---
title: "n8n Automation for Teacher Assignment Grading Tracker"
description: "Streamline your assignment grading process with automated tracking, notifications, and progress monitoring using n8n workflow automation"
profession: "Teachers"
category: "Education"
contentType: "workflow"
tags: ["grading", "assignments", "teacher-tools", "education", "tracking", "automation"]
pubDate: "2026-05-18"
featured: false
---

# n8n Automation for Teacher Assignment Grading Tracker

## Why This Automation Matters

Managing assignment grading can be overwhelming for teachers, especially when handling multiple classes and numerous students. This n8n automation workflow helps you:

- **Track grading progress** across all assignments and students automatically
- **Send reminder notifications** for pending grades and approaching deadlines
- **Generate progress reports** to monitor your grading workload
- **Integrate with Google Sheets** for easy data management and visualization
- **Reduce administrative burden** so you can focus more on teaching and providing quality feedback

This workflow transforms your grading process from a chaotic pile of papers into an organized, trackable system that keeps you on top of your workload.

## What You Need Before Starting

### Required Tools and Accounts
- **n8n instance** (cloud or self-hosted)
- **Google account** with access to Google Sheets and Gmail
- **Slack workspace** (optional, for team notifications)

### Preparation Steps
1. Create a Google Sheet with columns: Student Name, Assignment Name, Due Date, Grade Status, Date Graded, Grade, Notes
2. Set up Google API credentials in n8n for Sheets and Gmail access
3. Configure Slack webhook (if using Slack notifications)
4. Prepare email templates for different notification types

### Technical Requirements
- Basic understanding of n8n interface
- Access to Google Workspace or personal Google account
- Email account for sending notifications

## Complete Node-by-Node Build Instructions

### Node 1: Schedule Trigger
1. Add **Schedule Trigger** node
2. Set interval to "Every Day"
3. Configure time to 8:00 AM (or your preferred check time)
4. This will run the workflow daily to check grading status

### Node 2: Google Sheets - Read Data
1. Add **Google Sheets** node
2. Connect to Schedule Trigger
3. Configure:
   - **Operation**: Read
   - **Document**: Select your grading tracker sheet
   - **Sheet**: Sheet1 (or your sheet name)
   - **Range**: A:G (adjust based on your columns)
4. This reads all assignment data

### Node 3: Code - Process Grading Data
1. Add **Code** node
2. Connect to Google Sheets node
3. Insert this JavaScript code:
```javascript
const currentDate = new Date();
const overdueAssignments = [];
const pendingGrades = [];
const weeklyStats = {
  totalAssignments: 0,
  gradedAssignments: 0,
  pendingAssignments: 0
};

for (const item of $input.all()) {
  const data = item.json;
  const dueDate = new Date(data['Due Date']);
  const gradeStatus = data['Grade Status'];
  
  weeklyStats.totalAssignments++;
  
  if (gradeStatus === 'Pending' || !gradeStatus) {
    weeklyStats.pendingAssignments++;
    
    // Check if assignment is overdue
    if (dueDate < currentDate) {
      overdueAssignments.push({
        studentName: data['Student Name'],
        assignmentName: data['Assignment Name'],
        dueDate: data['Due Date'],
        daysOverdue: Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24))
      });
    } else {
      pendingGrades.push({
        studentName: data['Student Name'],
        assignmentName: data['Assignment Name'],
        dueDate: data['Due Date']
      });
    }
  } else {
    weeklyStats.gradedAssignments++;
  }
}

return [
  {
    json: {
      overdueAssignments,
      pendingGrades,
      weeklyStats,
      checkDate: currentDate.toISOString()
    }
  }
];
```

### Node 4: IF - Check for Overdue Items
1. Add **IF** node
2. Connect to Code node
3. Configure condition:
   - **Value 1**: `{{$json.overdueAssignments.length}}`
   - **Operation**: Larger
   - **Value 2**: 0

### Node 5: Gmail - Send Overdue Alert
1. Add **Gmail** node to "True" output of IF
2. Configure:
   - **Operation**: Send
   - **To**: Your email address
   - **Subject**: `🚨 Overdue Assignments Alert - {{$json.overdueAssignments.length}} items`
   - **Message**: 
```
You have {{$json.overdueAssignments.length}} overdue assignments to grade:

{{$json.overdueAssignments.map(item => `• ${item.studentName} - ${item.assignmentName} (${item.daysOverdue} days overdue)`).join('\n')}}

Please prioritize grading these assignments.
```

### Node 6: IF - Check Pending Count
1. Add **IF** node
2. Connect to both outputs of previous IF node
3. Configure condition:
   - **Value 1**: `{{$json.pendingGrades.length}}`
   - **Operation**: Larger
   - **Value 2**: 10

### Node 7: Gmail - Send Weekly Summary
1. Add **Gmail** node to "True" output
2. Configure:
   - **Operation**: Send
   - **To**: Your email address
   - **Subject**: `📊 Weekly Grading Summary`
   - **Message**:
```
Weekly Grading Statistics:

📋 Total Assignments: {{$json.weeklyStats.totalAssignments}}
✅ Graded: {{$json.weeklyStats.gradedAssignments}}
⏳ Pending: {{$json.weeklyStats.pendingAssignments}}
📈 Completion Rate: {{Math.round(($json.weeklyStats.gradedAssignments / $json.weeklyStats.totalAssignments) * 100)}}%

You have a high number of pending grades ({{$json.pendingGrades.length}}). Consider setting aside dedicated grading time.
```

### Node 8: Webhook - Update Dashboard
1. Add **Webhook** node (optional)
2. Connect to merge both IF outputs
3. Configure as needed for external dashboard updates

### Node 9: Google Sheets - Log Check
1. Add **Google Sheets** node
2. Connect to previous node
3. Configure:
   - **Operation**: Append
   - **Document**: Same spreadsheet
   - **Sheet**: Create "Grading_Log" sheet
   - **Values**: 
     - Check Date: `{{$json.checkDate}}`
     - Total Assignments: `{{$json.weeklyStats.totalAssignments}}`
     - Pending: `{{$json.weeklyStats.pendingAssignments}}`
     - Overdue: `{{$json.overdueAssignments.length}}`

## Full Workflow JSON Code Block

```json
{
  "name": "Teacher Assignment Grading Tracker",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 8 * * *"
            }
          ]
        }
      },
      "name": "Daily Grading Check",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "YOUR_SHEET_ID",
        "sheetName": "Sheet1",
        "range": "A:G",
        "keyRow": 1
      },
      "name": "Read Grading Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "const currentDate = new Date();\nconst overdueAssignments = [];\nconst pendingGrades = [];\nconst weeklyStats = {\n  totalAssignments: 0,\n  gradedAssignments: 0,\n  pendingAssignments: 0\n};\n\nfor (const item of $input.all()) {\n  const data = item.json;\n  const dueDate = new Date(data['Due Date']);\n  const gradeStatus = data['Grade Status'];\n  \n  weeklyStats.totalAssignments++;\n  \n  if (gradeStatus === 'Pending' || !gradeStatus) {\n    weeklyStats.pendingAssignments++;\n    \n    if (dueDate < currentDate) {\n      overdueAssignments.push({\n        studentName: data['Student Name'],\n        assignmentName: data['Assignment Name'],\n        dueDate: data['Due Date'],\n        daysOverdue: Math.floor((currentDate - dueDate) / (1000 * 60 * 60 * 24))\n      });\n    } else {\n      pendingGrades.push({\n        studentName: data['Student Name'],\n        assignmentName: data['Assignment Name'],\n        dueDate: data['Due Date']\n      });\n    }\n  } else {\n    weeklyStats.gradedAssignments++;\n  }\n}\n\nreturn [{\n  json: {\n    overdueAssignments,\n    pendingGrades,\n    weeklyStats,\n    checkDate: currentDate.toISOString()\n  }\n}];"
      },
      "name": "Process Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
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
              "id": "1",
              "leftValue": "={{$json.overdueAssignments.length}}",
              "rightValue": 0,
              "operator": {
                "type": "number",
                "operation": "gt"
              }
            }
          ],
          "combinator": "and"
        }
      },
      "name": "Check Overdue",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "sendTo": "YOUR_EMAIL@example.com",
        "subject": "🚨 Overdue Assignments Alert - {{$json.overdueAssignments.length}} items",
        "message": "You have {{$json.overdueAssignments.length}} overdue assignments to grade:\n\n{{$json.overdueAssignments.map(item => `• ${item.studentName} - ${item.assignmentName} (${item.daysOverdue} days overdue)`).join('\\n')}}\n\nPlease prioritize grading these assignments.",
        "options": {}
      },
      "name": "Send Overdue Alert",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [1120, 180]
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
              "id": "1",
              "leftValue": "={{$json.pendingGrades.length}}",
              "rightValue": 10,
              "operator": {
                "type": "number",
                "operation": "gt"
              }
            }
          ],
          "combinator": "and"
        }
      },
      "name": "Check High Pending",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1340, 300]
    },
    {
      "parameters": {
        "sendTo": "YOUR_EMAIL@example.com",
        "subject": "📊 Weekly Grading Summary",
        "message": "Weekly Grading Statistics:\n\n📋 Total Assignments: {{$json.weeklyStats.totalAssignments}}\n✅ Graded: {{$json.weeklyStats.gradedAssignments}}\n⏳ Pending: {{$json.weeklyStats.pendingAssignments}}\n📈 Completion Rate: {{Math.round(($json.weeklyStats.gradedAssignments / $json.weeklyStats.totalAssignments) * 100)}}%\n\nYou have a high number of pending grades. Consider setting aside dedicated grading time.",
        "options": {}
      },
      "name": "Send Summary",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [1560, 180]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": "YOUR_SHEET_ID",
        "sheetName": "Grading_Log",
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Check Date": "={{$json.checkDate}}",
            "Total Assignments": "={{$json.weeklyStats.totalAssignments}}",
            "Pending": "={{$json.weeklyStats.pendingAssignments}}",
            "Overdue": "={{$json.overdueAssignments.length}}"
          }
        },
        "options": {}
      },
      "name": "Log Statistics",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [1780, 300]
    }
  ],
  "connections": {
    "Daily Grading Check": {
      "main": [
        [
          {
            "node": "Read Grading Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Read Grading Data": {
      "main": [
        [
          {
            "node": "Process Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Data": {
      "main": [
        [
          {
            "node": "Check Overdue",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Overdue": {
      "main": [
        [
          {
            "node": "Send Overdue Alert",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Check High Pending",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Overdue Alert": {
      "main": [
        [
          {
            "node": "Check High Pending",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check High Pending": {
      "main": [
        [
          {
            "node": "Send Summary",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Log Statistics",
            "type": "main