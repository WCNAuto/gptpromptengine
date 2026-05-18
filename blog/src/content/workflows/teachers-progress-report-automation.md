---
title: "Automated Student Progress Report Emails with n8n"
description: "Streamline parent communication by automatically generating and sending personalized student progress reports via email using n8n workflow automation."
profession: "Teachers"
category: "Education & Communication"
contentType: "workflow"
tags: ["education", "email automation", "student reports", "parent communication", "progress tracking"]
pubDate: "2026-05-18"
featured: false
---

# Automated Student Progress Report Emails with n8n

## Why This Automation Matters

As a teacher, keeping parents informed about their child's progress is crucial but time-consuming. This n8n workflow automates the creation and delivery of personalized progress reports, saving you hours of manual work while ensuring consistent parent communication. The automation pulls student data, generates customized reports, and sends them directly to parents' email addresses on a scheduled basis.

## What You Need Before Starting

- **n8n instance** (cloud or self-hosted)
- **Google Sheets** with student data (names, grades, parent emails)
- **Gmail account** for sending emails
- **Basic student information**: student names, current grades, parent contact details
- **Google Cloud Console** access for API credentials

### Required Data Structure

Your Google Sheet should contain columns for:
- Student Name
- Student ID
- Current Grade/Score
- Subject
- Parent Email
- Parent Name
- Report Period

## Complete Node-by-Node Build Instructions

### Node 1: Schedule Trigger
1. Add a **Schedule Trigger** node
2. Set interval to "Every Month" 
3. Configure to run on the last Friday of each month at 3:00 PM
4. This ensures reports are sent before weekend review time

### Node 2: Google Sheets Reader
1. Add **Google Sheets** node
2. Set operation to "Read"
3. Connect your Google account
4. Select your student data spreadsheet
5. Choose the appropriate worksheet tab
6. Set range to include all student data (e.g., A1:G100)

### Node 3: Code Node - Data Processing
1. Add a **Code** node
2. Set to "Run Once for All Items"
3. Insert the following JavaScript code:

```javascript
const students = items.map(item => item.json);
const groupedByStudent = {};

// Group data by student
students.forEach(student => {
  const key = student['Student ID'];
  if (!groupedByStudent[key]) {
    groupedByStudent[key] = {
      studentName: student['Student Name'],
      studentId: student['Student ID'],
      parentEmail: student['Parent Email'],
      parentName: student['Parent Name'],
      reportPeriod: student['Report Period'],
      subjects: []
    };
  }
  
  groupedByStudent[key].subjects.push({
    subject: student['Subject'],
    grade: student['Current Grade/Score']
  });
});

return Object.values(groupedByStudent).map(student => ({ json: student }));
```

### Node 4: Code Node - Report Generation
1. Add another **Code** node
2. Set to "Run Once for Each Item"
3. Insert HTML report template code:

```javascript
const student = $input.item.json;

const generateProgressReport = (studentData) => {
  let subjectsHtml = '';
  studentData.subjects.forEach(subject => {
    const gradeColor = subject.grade >= 80 ? '#4CAF50' : subject.grade >= 70 ? '#FF9800' : '#F44336';
    subjectsHtml += `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject.subject}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; color: ${gradeColor}; font-weight: bold;">${subject.grade}%</td>
      </tr>
    `;
  });

  return `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Progress Report</h2>
          <h3 style="color: #666;">Student: ${studentData.studentName}</h3>
          <p style="color: #666;">Report Period: ${studentData.reportPeriod}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #4CAF50; color: white;">
                <th style="padding: 12px; text-align: left;">Subject</th>
                <th style="padding: 12px; text-align: left;">Current Grade</th>
              </tr>
            </thead>
            <tbody>
              ${subjectsHtml}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px;">
            <p style="margin: 0; color: #666;">
              If you have any questions about your child's progress, please don't hesitate to contact me.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

return {
  json: {
    ...student,
    reportHtml: generateProgressReport(student)
  }
};
```

### Node 5: Gmail Send
1. Add **Gmail** node
2. Set operation to "Send"
3. Connect your Gmail account
4. Configure email fields:
   - **To**: `{{ $json.parentEmail }}`
   - **Subject**: `Progress Report for {{ $json.studentName }} - {{ $json.reportPeriod }}`
   - **Message Type**: HTML
   - **Message**: `{{ $json.reportHtml }}`
5. Add a personalized introduction in the message field before the HTML

### Node 6: Set Node - Logging
1. Add a **Set** node for logging
2. Add these fields:
   - `emailsSent`: `{{ $runIndex + 1 }}`
   - `lastRun`: `{{ new Date().toISOString() }}`
   - `studentName`: `{{ $json.studentName }}`
   - `parentEmail`: `{{ $json.parentEmail }}`

## Complete Workflow JSON

```json
{
  "meta": {
    "instanceId": "your-instance-id"
  },
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "monthDay",
              "triggerAtDay": 25
            }
          ]
        }
      },
      "id": "schedule-trigger",
      "name": "Monthly Report Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [200, 200]
    },
    {
      "parameters": {
        "operation": "read",
        "sheetId": "your-sheet-id",
        "range": "A1:G1000",
        "options": {
          "headerRow": true
        }
      },
      "id": "google-sheets",
      "name": "Get Student Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [400, 200]
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const students = items.map(item => item.json);\nconst groupedByStudent = {};\n\nstudents.forEach(student => {\n  const key = student['Student ID'];\n  if (!groupedByStudent[key]) {\n    groupedByStudent[key] = {\n      studentName: student['Student Name'],\n      studentId: student['Student ID'],\n      parentEmail: student['Parent Email'],\n      parentName: student['Parent Name'],\n      reportPeriod: student['Report Period'],\n      subjects: []\n    };\n  }\n  \n  groupedByStudent[key].subjects.push({\n    subject: student['Subject'],\n    grade: student['Current Grade/Score']\n  });\n});\n\nreturn Object.values(groupedByStudent).map(student => ({ json: student }));"
      },
      "id": "code-group-data",
      "name": "Group Student Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [600, 200]
    },
    {
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const student = $input.item.json;\n\nconst generateProgressReport = (studentData) => {\n  let subjectsHtml = '';\n  studentData.subjects.forEach(subject => {\n    const gradeColor = subject.grade >= 80 ? '#4CAF50' : subject.grade >= 70 ? '#FF9800' : '#F44336';\n    subjectsHtml += `\n      <tr>\n        <td style=\"padding: 8px; border-bottom: 1px solid #ddd;\">${subject.subject}</td>\n        <td style=\"padding: 8px; border-bottom: 1px solid #ddd; color: ${gradeColor}; font-weight: bold;\">${subject.grade}%</td>\n      </tr>\n    `;\n  });\n\n  return `\n    <html>\n      <body style=\"font-family: Arial, sans-serif; margin: 0; padding: 20px;\">\n        <div style=\"max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;\">\n          <h2 style=\"color: #333; text-align: center;\">Progress Report</h2>\n          <h3 style=\"color: #666;\">Student: ${studentData.studentName}</h3>\n          <p style=\"color: #666;\">Report Period: ${studentData.reportPeriod}</p>\n          \n          <table style=\"width: 100%; border-collapse: collapse; margin: 20px 0;\">\n            <thead>\n              <tr style=\"background-color: #4CAF50; color: white;\">\n                <th style=\"padding: 12px; text-align: left;\">Subject</th>\n                <th style=\"padding: 12px; text-align: left;\">Current Grade</th>\n              </tr>\n            </thead>\n            <tbody>\n              ${subjectsHtml}\n            </tbody>\n          </table>\n          \n          <div style=\"margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px;\">\n            <p style=\"margin: 0; color: #666;\">\n              If you have any questions about your child's progress, please don't hesitate to contact me.\n            </p>\n          </div>\n        </div>\n      </body>\n    </html>\n  `;\n};\n\nreturn {\n  json: {\n    ...student,\n    reportHtml: generateProgressReport(student)\n  }\n};"
      },
      "id": "code-generate-report",
      "name": "Generate HTML Report",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [800, 200]
    },
    {
      "parameters": {
        "operation": "send",
        "resource": "message",
        "to": "={{ $json.parentEmail }}",
        "subject": "=Progress Report for {{ $json.studentName }} - {{ $json.reportPeriod }}",
        "emailType": "html",
        "message": "=Dear {{ $json.parentName }},\n\nI hope this email finds you well. Please find attached your child's progress report for the current period.\n\n{{ $json.reportHtml }}\n\nBest regards,\n[Your Name]\n[Your Title]\n[School Name]"
      },
      "id": "gmail-send",
      "name": "Send Progress Report",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1000, 200]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "emailsSent",
              "value": "={{ $runIndex + 1 }}"
            },
            {
              "name": "lastRun",
              "value": "={{ new Date().toISOString() }}"
            },
            {
              "name": "studentName",
              "value": "={{ $json.studentName }}"
            },
            {
              "name": "parentEmail",
              "value": "={{ $json.parentEmail }}"
            }
          ]
        },
        "options": {}
      },
      "id": "set-logging",
      "name": "Log Email Activity",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [1200, 200]
    }
  ],
  "connections": {
    "Monthly Report Schedule": {
      "main": [
        [
          {
            "node": "Get Student Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Student Data": {
      "main": [
        [
          {
            "node": "Group Student Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Group Student Data": {
      "main": [
        [
          {
            "node": "Generate HTML Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate HTML Report": {
      "main": [
        [
          {
            "node": "Send Progress Report",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Progress Report": {
      "main": [
        [
          {
            "node": "Log Email Activity",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {},
  "staticData": null,
  "tags": [],
  "triggerCount": 1,
  "updatedAt": "2026-05-18T00:00:00.000Z"
}
```

## FAQ

### How often should I send automated progress reports?
The workflow is configured to run monthly, but you can adjust the schedule trigger based on your school's reporting requirements. Weekly reports might be too frequent, while quarterly reports might not provide timely enough feedback. Monthly strikes a good balance for keeping parents informed without overwhelming them.

### Can I customize the report format for different grade levels?
Yes! You can modify the Code node that generates the HTML report to include conditional formatting based on grade level or student age. Add grade level to your Google Sheet and use JavaScript conditionals to adjust the report template, color schemes, or included information based on the student's level.

### What happens if a parent's email bounces or fails to send?
The Gmail node will show an error in the execution log if an email fails to send. You can add an IF node after the Gmail node to catch errors and route failed sends to a separate workflow that logs the failures or sends them to an alternative communication method. Consider adding error handling to retry failed sends or notify you of delivery issues.

---

Ready to streamline your parent communication? [Start automating with n8n Cloud](https://n8n.io/) and transform how you manage student progress reporting today!