---
title: "Automate Google Analytics Weekly Email Reports with n8n"
description: "Create an automated workflow that generates and emails weekly Google Analytics reports to stakeholders, saving marketing managers hours of manual reporting time."
profession: "Marketing Managers"
category: "Analytics & Reporting"
contentType: "workflow"
tags: ["google-analytics", "email-automation", "reporting", "marketing", "weekly-reports"]
pubDate: "2026-05-13"
featured: false
---

# Automate Google Analytics Weekly Email Reports with n8n

## Why This Automation Matters

As a marketing manager, you spend countless hours manually pulling Google Analytics data and creating weekly reports for stakeholders. This automation eliminates that repetitive task by automatically generating comprehensive weekly analytics reports and emailing them to your team every Monday morning.

This workflow will help you:
- Save 2-3 hours per week on manual reporting
- Ensure consistent, timely delivery of analytics insights
- Maintain professional report formatting
- Never miss a weekly report deadline
- Focus on strategic analysis instead of data compilation

## What You Need Before Starting

### Required Accounts & Access
- n8n Cloud or self-hosted instance
- Google Analytics account with data access
- Google Cloud Console project (for GA4 API access)
- Email service (Gmail, Outlook, or SMTP server)
- Google Sheets account (for data formatting)

### Required Credentials
1. **Google Analytics Service Account**: Create in Google Cloud Console with Analytics Reporting API enabled
2. **Email Service Credentials**: Gmail OAuth2 or SMTP credentials
3. **Google Sheets API Access**: Same service account as Analytics

### Data You'll Need
- Google Analytics Property ID
- Recipient email addresses
- Date ranges and metrics you want to track
- Company branding/logo URL (optional)

## Complete Node-by-Node Build Instructions

### Step 1: Set Up the Cron Trigger

1. Add a **Cron** node as your starting point
2. Configure the schedule:
   - **Mode**: Custom
   - **Expression**: `0 8 * * 1` (Every Monday at 8 AM)
   - **Timezone**: Set to your business timezone

### Step 2: Calculate Date Range

1. Add a **Code** node after the Cron trigger
2. Name it "Calculate Week Dates"
3. Set the following JavaScript code:

```javascript
const now = new Date();
const lastMonday = new Date(now);
lastMonday.setDate(now.getDate() - now.getDay() - 6);

const lastSunday = new Date(lastMonday);
lastSunday.setDate(lastMonday.getDate() + 6);

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

return [{
  json: {
    startDate: formatDate(lastMonday),
    endDate: formatDate(lastSunday),
    weekLabel: `${formatDate(lastMonday)} to ${formatDate(lastSunday)}`
  }
}];
```

### Step 3: Fetch Google Analytics Data

1. Add a **Google Analytics** node
2. Configure the connection:
   - **Credential**: Your GA service account
   - **Resource**: Report
   - **Operation**: Get
3. Set parameters:
   - **Property ID**: Your GA4 property ID
   - **Start Date**: `{{ $json.startDate }}`
   - **End Date**: `{{ $json.endDate }}`
   - **Metrics**: sessions, users, pageviews, bounceRate, sessionDuration
   - **Dimensions**: date, source, medium

### Step 4: Process Analytics Data

1. Add a **Code** node named "Process GA Data"
2. Insert this processing code:

```javascript
const data = $input.all();
const weekLabel = data[0].json.weekLabel;

// Calculate totals
let totalSessions = 0;
let totalUsers = 0;
let totalPageviews = 0;
let totalBounceRate = 0;
let totalDuration = 0;

const sourceData = {};

data.forEach(item => {
  if (item.json.sessions) {
    totalSessions += parseInt(item.json.sessions);
    totalUsers += parseInt(item.json.users);
    totalPageviews += parseInt(item.json.pageviews);
    totalBounceRate += parseFloat(item.json.bounceRate || 0);
    totalDuration += parseFloat(item.json.sessionDuration || 0);
    
    const source = item.json.source || 'Direct';
    if (!sourceData[source]) {
      sourceData[source] = { sessions: 0, users: 0 };
    }
    sourceData[source].sessions += parseInt(item.json.sessions);
    sourceData[source].users += parseInt(item.json.users);
  }
});

// Get top 5 sources
const topSources = Object.entries(sourceData)
  .sort(([,a], [,b]) => b.sessions - a.sessions)
  .slice(0, 5);

return [{
  json: {
    weekLabel,
    summary: {
      totalSessions,
      totalUsers,
      totalPageviews,
      avgBounceRate: (totalBounceRate / data.length).toFixed(2) + '%',
      avgSessionDuration: Math.round(totalDuration / data.length) + 's'
    },
    topSources: topSources.map(([source, data]) => ({
      source,
      sessions: data.sessions,
      users: data.users
    }))
  }
}];
```

### Step 5: Create Google Sheets Report

1. Add a **Google Sheets** node
2. Configure:
   - **Resource**: Spreadsheet
   - **Operation**: Create
   - **Title**: `GA Weekly Report - {{ $json.weekLabel }}`
3. Add headers: Date Range, Metric, Value
4. Map the processed data to populate rows

### Step 6: Format Email Content

1. Add a **Code** node named "Format Email"
2. Create the HTML email template:

```javascript
const data = $json;
const summary = data.summary;
const topSources = data.topSources;

const htmlContent = `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Weekly Analytics Report</h2>
    <p style="color: #666;"><strong>Period:</strong> ${data.weekLabel}</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Key Metrics Summary</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Sessions:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${summary.totalSessions.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Users:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${summary.totalUsers.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Pageviews:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${summary.totalPageviews.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Avg. Bounce Rate:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${summary.avgBounceRate}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #333;">Top Traffic Sources</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: #f1f1f1;">
          <th style="padding: 10px; text-align: left;">Source</th>
          <th style="padding: 10px; text-align: left;">Sessions</th>
          <th style="padding: 10px; text-align: left;">Users</th>
        </tr>
        ${topSources.map(source => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${source.source}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${source.sessions.toLocaleString()}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${source.users.toLocaleString()}</td>
        </tr>
        `).join('')}
      </table>
    </div>
    
    <p style="margin-top: 30px; color: #888; font-size: 12px;">
      This report was automatically generated by n8n automation.
    </p>
  </div>
</body>
</html>
`;

return [{
  json: {
    ...data,
    emailSubject: `Weekly Analytics Report - ${data.weekLabel}`,
    emailContent: htmlContent
  }
}];
```

### Step 7: Send Email Report

1. Add a **Gmail** node (or your preferred email service)
2. Configure:
   - **Resource**: Message
   - **Operation**: Send
   - **To**: Enter recipient email addresses
   - **Subject**: `{{ $json.emailSubject }}`
   - **Email Type**: HTML
   - **Message**: `{{ $json.emailContent }}`
   - **Attachments**: Reference the Google Sheets file created earlier

### Step 8: Log Success

1. Add a final **Code** node for logging
2. Simple success message:

```javascript
return [{
  json: {
    status: 'success',
    message: `Weekly GA report sent successfully for ${$json.weekLabel}`,
    timestamp: new Date().toISOString(),
    recipients: 'stakeholders@company.com'
  }
}];
```

## Complete Workflow JSON

```json
{
  "name": "GA Weekly Email Report",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 8 * * 1"
            }
          ]
        }
      },
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "const now = new Date();\nconst lastMonday = new Date(now);\nlastMonday.setDate(now.getDate() - now.getDay() - 6);\n\nconst lastSunday = new Date(lastMonday);\nlastSunday.setDate(lastMonday.getDate() + 6);\n\nconst formatDate = (date) => {\n  return date.toISOString().split('T')[0];\n};\n\nreturn [{\n  json: {\n    startDate: formatDate(lastMonday),\n    endDate: formatDate(lastSunday),\n    weekLabel: `${formatDate(lastMonday)} to ${formatDate(lastSunday)}`\n  }\n}];"
      },
      "name": "Calculate Week Dates",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "resource": "report",
        "propertyId": "YOUR_GA4_PROPERTY_ID",
        "startDate": "={{ $json.startDate }}",
        "endDate": "={{ $json.endDate }}",
        "metrics": [
          "sessions",
          "users", 
          "pageviews",
          "bounceRate",
          "sessionDuration"
        ],
        "dimensions": [
          "date",
          "source",
          "medium"
        ]
      },
      "name": "Get GA Data",
      "type": "n8n-nodes-base.googleAnalytics",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "const data = $input.all();\nconst weekLabel = data[0].json.weekLabel;\n\nlet totalSessions = 0;\nlet totalUsers = 0;\nlet totalPageviews = 0;\nlet totalBounceRate = 0;\nlet totalDuration = 0;\n\nconst sourceData = {};\n\ndata.forEach(item => {\n  if (item.json.sessions) {\n    totalSessions += parseInt(item.json.sessions);\n    totalUsers += parseInt(item.json.users);\n    totalPageviews += parseInt(item.json.pageviews);\n    totalBounceRate += parseFloat(item.json.bounceRate || 0);\n    totalDuration += parseFloat(item.json.sessionDuration || 0);\n    \n    const source = item.json.source || 'Direct';\n    if (!sourceData[source]) {\n      sourceData[source] = { sessions: 0, users: 0 };\n    }\n    sourceData[source].sessions += parseInt(item.json.sessions);\n    sourceData[source].users += parseInt(item.json.users);\n  }\n});\n\nconst topSources = Object.entries(sourceData)\n  .sort(([,a], [,b]) => b.sessions - a.sessions)\n  .slice(0, 5);\n\nreturn [{\n  json: {\n    weekLabel,\n    summary: {\n      totalSessions,\n      totalUsers,\n      totalPageviews,\n      avgBounceRate: (totalBounceRate / data.length).toFixed(2) + '%',\n      avgSessionDuration: Math.round(totalDuration / data.length) + 's'\n    },\n    topSources: topSources.map(([source, data]) => ({\n      source,\n      sessions: data.sessions,\n      users: data.users\n    }))\n  }\n}];"
      },
      "name": "Process GA Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "jsCode": "const data = $json;\nconst summary = data.summary;\nconst topSources = data.topSources;\n\nconst htmlContent = `\n<html>\n<body style=\"font-family: Arial, sans-serif; margin: 0; padding: 20px;\">\n  <div style=\"max-width: 600px; margin: 0 auto;\">\n    <h2 style=\"color: #333;\">Weekly Analytics Report</h2>\n    <p style=\"color: #666;\"><strong>Period:</strong> ${data.weekLabel}</p>\n    \n    <div style=\"background: #f8f9fa; padding: 20px; border-radius: 5