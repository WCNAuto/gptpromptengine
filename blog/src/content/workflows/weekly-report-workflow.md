---
title: "Automated Weekly Operations Report Generation with n8n"
description: "Create automated weekly reports that aggregate operational metrics, system status, and performance data from multiple sources into professional reports delivered via email."
profession: "Operations"
category: "Reporting & Analytics"
contentType: "workflow"
tags: ["operations", "reporting", "automation", "weekly-reports", "data-aggregation", "email"]
pubDate: "2026-05-13"
featured: false
---

## Why This Automation Matters

Operations teams spend countless hours manually collecting data from various systems, compiling metrics, and formatting reports for stakeholders. This weekly report automation eliminates the tedious manual work by automatically gathering operational data, calculating key performance indicators, and delivering professionally formatted reports to the right people at the right time.

This workflow saves operations teams 3-5 hours per week while ensuring consistent, accurate reporting that helps leadership make informed decisions about system performance, resource allocation, and operational improvements.

## What You Need Before Starting

- **n8n instance** (cloud or self-hosted)
- **Email service** (Gmail, Outlook, or SMTP server)
- **Data sources** such as:
  - Database access (MySQL, PostgreSQL, or MongoDB)
  - API endpoints for system metrics
  - Google Sheets or Excel files with operational data
  - Monitoring tools (optional: New Relic, DataDog)
- **HTML/CSS knowledge** (basic, for report formatting)
- **Credentials configured** in n8n for your data sources and email service

## Complete Node-by-Node Build Instructions

### 1. Schedule Trigger Node
- Add **Schedule Trigger** node
- Set trigger to run weekly: `0 8 * * MON` (8 AM every Monday)
- Configure timezone to match your business hours

### 2. Set Report Variables Node
- Add **Set** node after the trigger
- Configure variables:
  - `reportWeek`: `{{ $now.minus({days: 7}).toFormat('yyyy-MM-dd') }}` to `{{ $now.toFormat('yyyy-MM-dd') }}`
  - `reportTitle`: `Weekly Operations Report - Week of {{ $now.minus({days: 7}).toFormat('MMM dd, yyyy') }}`
  - `recipientEmails`: Array of email addresses for report distribution

### 3. Fetch Database Metrics Node
- Add **MySQL** (or your database) node
- Configure connection to your operations database
- Query for weekly metrics:
```sql
SELECT 
  COUNT(*) as total_tickets,
  AVG(resolution_time) as avg_resolution_time,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
  COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tickets
FROM support_tickets 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
```

### 4. Fetch System Uptime Node
- Add **HTTP Request** node
- Configure to call your monitoring API
- Method: GET
- URL: Your monitoring endpoint (e.g., `/api/v1/uptime/weekly`)
- Headers: Include authentication if required

### 5. Get Performance Data Node
- Add **Google Sheets** node (if using Sheets for performance tracking)
- Operation: Read
- Configure to fetch last week's performance data
- Range: Specify the range containing weekly metrics

### 6. Calculate KPIs Node
- Add **Code** node
- Process the collected data and calculate key metrics:
```javascript
const dbMetrics = $input.first().json;
const uptimeData = $input.all()[1].json;
const performanceData = $input.all()[2].json;

// Calculate key performance indicators
const kpis = {
  ticketResolutionRate: ((dbMetrics.resolved_tickets / dbMetrics.total_tickets) * 100).toFixed(2),
  averageResolutionTime: Math.round(dbMetrics.avg_resolution_time),
  systemUptime: uptimeData.uptime_percentage || 99.9,
  highPriorityTickets: dbMetrics.high_priority_tickets,
  weekOverWeekChange: calculateWeekOverWeekChange(performanceData)
};

return { kpis, rawData: { dbMetrics, uptimeData, performanceData } };
```

### 7. Generate Report Charts Node (Optional)
- Add **HTTP Request** node to QuickChart API
- Method: POST
- URL: `https://quickchart.io/chart`
- Body:
```json
{
  "chart": {
    "type": "bar",
    "data": {
      "labels": ["Resolved", "Pending", "High Priority"],
      "datasets": [{
        "data": ["{{ $json.kpis.resolvedTickets }}", "{{ $json.rawData.dbMetrics.total_tickets - $json.rawData.dbMetrics.resolved_tickets }}", "{{ $json.kpis.highPriorityTickets }}"]
      }]
    }
  }
}
```

### 8. Format HTML Report Node
- Add **HTML** node or **Code** node
- Create professional HTML email template:
```javascript
const { kpis, rawData } = $input.first().json;
const reportDate = new Date().toLocaleDateString();

const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
        .metric { background: #fff; border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #2196F3; }
        .status-good { color: #4CAF50; }
        .status-warning { color: #FF9800; }
        .status-critical { color: #F44336; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Weekly Operations Report</h1>
        <p>Report Period: ${$('Set').first().json.reportWeek}</p>
    </div>
    
    <div class="metric">
        <h3>Support Tickets</h3>
        <div class="metric-value">${rawData.dbMetrics.total_tickets}</div>
        <p>Resolution Rate: <span class="${kpis.ticketResolutionRate > 85 ? 'status-good' : 'status-warning'}">${kpis.ticketResolutionRate}%</span></p>
        <p>Avg Resolution Time: ${kpis.averageResolutionTime} hours</p>
    </div>
    
    <div class="metric">
        <h3>System Performance</h3>
        <div class="metric-value ${kpis.systemUptime > 99.5 ? 'status-good' : 'status-warning'}">${kpis.systemUptime}%</div>
        <p>Uptime this week</p>
    </div>
    
    <div class="metric">
        <h3>High Priority Issues</h3>
        <div class="metric-value ${kpis.highPriorityTickets === 0 ? 'status-good' : kpis.highPriorityTickets < 5 ? 'status-warning' : 'status-critical'}">${kpis.highPriorityTickets}</div>
        <p>Requiring immediate attention</p>
    </div>
</body>
</html>
`;

return { htmlReport, subject: $('Set').first().json.reportTitle };
```

### 9. Send Email Report Node
- Add **Gmail** (or your email service) node
- Configure:
  - To: `{{ $('Set').first().json.recipientEmails.join(',') }}`
  - Subject: `{{ $json.subject }}`
  - Email Type: HTML
  - Message: `{{ $json.htmlReport }}`

### 10. Log Report Generation Node
- Add **HTTP Request** node (optional)
- Log successful report generation to your monitoring system
- Or add **Set** node to store completion timestamp

## Complete Workflow JSON

```json
{
  "name": "Weekly Operations Report Generator",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "cronExpression": "0 8 * * MON"
            }
          ]
        }
      },
      "name": "Weekly Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "reportWeek",
              "value": "={{ $now.minus({days: 7}).toFormat('yyyy-MM-dd') }} to {{ $now.toFormat('yyyy-MM-dd') }}"
            },
            {
              "name": "reportTitle",
              "value": "Weekly Operations Report - Week of {{ $now.minus({days: 7}).toFormat('MMM dd, yyyy') }}"
            }
          ],
          "array": [
            {
              "name": "recipientEmails",
              "value": ["operations@company.com", "manager@company.com"]
            }
          ]
        }
      },
      "name": "Set Report Variables",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT COUNT(*) as total_tickets, AVG(resolution_time) as avg_resolution_time, COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets, COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_tickets FROM support_tickets WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
      },
      "name": "Fetch Database Metrics",
      "type": "n8n-nodes-base.mySql",
      "typeVersion": 2.1,
      "position": [680, 200]
    },
    {
      "parameters": {
        "url": "https://api.monitoring.com/uptime/weekly",
        "options": {}
      },
      "name": "Fetch System Uptime",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [680, 320]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "your-sheet-id",
        "sheetName": "Weekly Metrics",
        "range": "A:F"
      },
      "name": "Get Performance Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [680, 440]
    },
    {
      "parameters": {
        "jsCode": "const dbMetrics = $input.all()[0].json;\nconst uptimeData = $input.all()[1].json;\nconst performanceData = $input.all()[2].json;\n\nconst kpis = {\n  ticketResolutionRate: ((dbMetrics.resolved_tickets / dbMetrics.total_tickets) * 100).toFixed(2),\n  averageResolutionTime: Math.round(dbMetrics.avg_resolution_time),\n  systemUptime: uptimeData.uptime_percentage || 99.9,\n  highPriorityTickets: dbMetrics.high_priority_tickets\n};\n\nreturn { kpis, rawData: { dbMetrics, uptimeData, performanceData } };"
      },
      "name": "Calculate KPIs",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 320]
    },
    {
      "parameters": {
        "jsCode": "const { kpis, rawData } = $input.first().json;\nconst reportPeriod = $('Set Report Variables').first().json.reportWeek;\nconst reportTitle = $('Set Report Variables').first().json.reportTitle;\n\nconst htmlReport = `\n<!DOCTYPE html>\n<html>\n<head>\n    <style>\n        body { font-family: Arial, sans-serif; margin: 20px; }\n        .header { background-color: #f4f4f4; padding: 20px; text-align: center; }\n        .metric { background: #fff; border: 1px solid #ddd; margin: 10px 0; padding: 15px; }\n        .metric-value { font-size: 24px; font-weight: bold; color: #2196F3; }\n        .status-good { color: #4CAF50; }\n        .status-warning { color: #FF9800; }\n        .status-critical { color: #F44336; }\n    </style>\n</head>\n<body>\n    <div class=\"header\">\n        <h1>Weekly Operations Report</h1>\n        <p>Report Period: ${reportPeriod}</p>\n    </div>\n    \n    <div class=\"metric\">\n        <h3>Support Tickets</h3>\n        <div class=\"metric-value\">${rawData.dbMetrics.total_tickets}</div>\n        <p>Resolution Rate: <span class=\"${kpis.ticketResolutionRate > 85 ? 'status-good' : 'status-warning'}\">${kpis.ticketResolutionRate}%</span></p>\n        <p>Avg Resolution Time: ${kpis.averageResolutionTime} hours</p>\n    </div>\n    \n    <div class=\"metric\">\n        <h3>System Performance</h3>\n        <div class=\"metric-value ${kpis.systemUptime > 99.5 ? 'status-good' : 'status-warning'}\">${kpis.systemUptime}%</div>\n        <p>Uptime this week</p>\n    </div>\n    \n    <div class=\"metric\">\n        <h3>High Priority Issues</h3>\n        <div class=\"metric-value ${kpis.highPriorityTickets === 0 ? 'status-good' : kpis.highPriorityTickets < 5 ? 'status-warning' : 'status-critical'}\">${kpis.highPriorityTickets}</div>\n        <p>Requiring immediate attention</p>\n    </div>\n</body>\n</html>\n`;\n\nreturn { htmlReport, subject: reportTitle };"
      },
      "name": "Format HTML Report",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1120, 320]
    },
    {
      "parameters": {
        "sendTo": "={{ $('Set Report Variables').first().json.recipientEmails.join(',') }}",
        "subject": "={{ $json.subject }}",
        "emailType": "html",
        "message": "={{ $json.htmlReport }}"
      },
      "name": "Send Email Report",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2.1,
      "position": [1340, 320]
    }
  ],
  "connections": {
    "Weekly Schedule": {
      "main": [
        [
          {
            "node": "Set Report Variables",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set Report Variables