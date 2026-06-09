---
title: "n8n Workflow for Campaign Performance Alert Automation 2026"
description: "Complete n8n workflow that monitors Google Ads campaigns and sends Slack alerts when CTR drops below 2% or cost exceeds daily budget by 20%."
profession: "Marketing Managers"
category: "Alerts"
contentType: workflow
tags: ["n8n workflow for campaign performance alert automation", "google ads performance monitoring", "campaign alert automation", "marketing performance alerts", "automated campaign monitoring"]
pubDate: 2026-06-09
featured: false
---

This workflow monitors your Google Ads campaigns every 2 hours and sends instant Slack alerts when CTR drops below 2% or daily spend exceeds budget by 20%. It connects Google Ads API to Slack, eliminating the need to manually check campaign dashboards 8 times per day.

## Why this automation matters

Without automated monitoring, underperforming campaigns can burn through budget for hours before you notice. A campaign that drops to 0.8% CTR at 9 AM can waste $500+ by lunch if your daily budget is high. This workflow catches performance drops within 2 hours and sends actionable alerts with campaign names, current metrics, and direct links to fix the issue.

## What you need before starting

- Google Ads API credential with read access to the advertising account you want to monitor
- Slack OAuth2 credential with chat:write permission for the channel where alerts will be posted
- Cron Trigger node (built into n8n)
- Google Ads node
- IF node (built into n8n) 
- Slack node
- The Google Ads account ID you want to monitor

## How to build it: step by step

### 1. Cron Trigger — Run every 2 hours

Node type: Cron Trigger
Field: Cron Expression
Value: `0 */2 * * *`
Output: Triggers the workflow every 2 hours starting at midnight
Why this matters: 2-hour intervals catch performance issues quickly without hitting API rate limits or creating alert fatigue.

### 2. Google Ads — Fetch campaign performance

Node type: Google Ads
Operation: Get All > Campaigns
Resource: Campaign Performance Report
Date Range: TODAY
Metrics: campaign.name, metrics.clicks, metrics.impressions, metrics.cost_micros, campaign.campaign_budget.amount_micros
Output: Array of campaign objects with current performance data
Why this matters: TODAY date range ensures you're alerting on current performance, not yesterday's resolved issues.

### 3. Function — Calculate performance ratios

Node type: Function
Code:
```javascript
return items.map(item => {
  const clicks = item.json.metrics.clicks;
  const impressions = item.json.metrics.impressions;
  const cost = item.json.metrics.cost_micros / 1000000; // Convert to dollars
  const budget = item.json.campaign.campaign_budget.amount_micros / 1000000;
  
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const budgetUsed = (cost / budget) * 100;
  
  return {
    json: {
      ...item.json,
      ctr: ctr,
      budgetUsed: budgetUsed,
      cost: cost,
      budget: budget,
      needsAlert: ctr < 2 || budgetUsed > 120
    }
  };
});
```
Output: Campaign data enriched with CTR percentage, budget usage percentage, and alert flag
Why this matters: Pre-calculating ratios in one place prevents logic errors and makes the IF condition simple.

### 4. IF — Filter campaigns needing alerts

Node type: IF
Condition: `{{ $json.needsAlert }}` equals `true`
Output: Only campaigns with CTR below 2% or budget usage above 120% continue to Slack
Why this matters: Prevents spam alerts for campaigns performing normally.

### 5. Slack — Send performance alert

Node type: Slack
Resource: Message
Operation: Post
Channel: #marketing-alerts
Text: 
```
🚨 Campaign Alert: {{ $json.campaign.name }}
CTR: {{ $json.ctr.toFixed(2) }}% (Target: >2%)
Budget Used: {{ $json.budgetUsed.toFixed(1) }}% (${{ $json.cost.toFixed(2) }} of ${{ $json.budget.toFixed(2) }})
Action needed: Review targeting and creative performance
```
Output: Alert message posted to Slack channel
Why this matters: Includes specific metrics and clear next steps so team members can act immediately without additional research.

## Full workflow JSON

```json
{
  "name": "Campaign Performance Alert Automation",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 */2 * * *"
            }
          ]
        }
      },
      "id": "cron-trigger-1",
      "name": "Every 2 Hours",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "resource": "campaignPerformanceReport",
        "operation": "getAll",
        "returnAll": true,
        "additionalFields": {
          "dateRange": "TODAY"
        },
        "fields": "campaign.name,metrics.clicks,metrics.impressions,metrics.cost_micros,campaign.campaign_budget.amount_micros"
      },
      "id": "google-ads-1",
      "name": "Get Campaign Performance",
      "type": "n8n-nodes-base.googleAds",
      "typeVersion": 1,
      "position": [450, 300],
      "credentials": {
        "googleAdsOAuth2Api": {
          "id": "// Replace with your Google Ads credential ID",
          "name": "Google Ads API"
        }
      }
    },
    {
      "parameters": {
        "functionCode": "return items.map(item => {\n  const clicks = item.json.metrics.clicks;\n  const impressions = item.json.metrics.impressions;\n  const cost = item.json.metrics.cost_micros / 1000000;\n  const budget = item.json.campaign.campaign_budget.amount_micros / 1000000;\n  \n  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;\n  const budgetUsed = (cost / budget) * 100;\n  \n  return {\n    json: {\n      ...item.json,\n      ctr: ctr,\n      budgetUsed: budgetUsed,\n      cost: cost,\n      budget: budget,\n      needsAlert: ctr < 2 || budgetUsed > 120\n    }\n  };\n});"
      },
      "id": "function-1",
      "name": "Calculate Performance Metrics",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.needsAlert }}",
              "value2": true
            }
          ]
        }
      },
      "id": "if-1",
      "name": "Needs Alert?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [850, 300]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "post",
        "channel": "#marketing-alerts",
        "text": "🚨 Campaign Alert: {{ $json.campaign.name }}\nCTR: {{ $json.ctr.toFixed(2) }}% (Target: >2%)\nBudget Used: {{ $json.budgetUsed.toFixed(1) }}% (${{ $json.cost.toFixed(2) }} of ${{ $json.budget.toFixed(2) }})\nAction needed: Review targeting and creative performance"
      },
      "id": "slack-1",
      "name": "Send Alert to Slack",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1050, 200],
      "credentials": {
        "slackOAuth2Api": {
          "id": "// Replace with your Slack credential ID",
          "name": "Slack OAuth2"
        }
      }
    }
  ],
  "connections": {
    "Every 2 Hours": {
      "main": [
        [
          {
            "node": "Get Campaign Performance",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Campaign Performance": {
      "main": [
        [
          {
            "node": "Calculate Performance Metrics",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Calculate Performance Metrics": {
      "main": [
        [
          {
            "node": "Needs Alert?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Needs Alert?": {
      "main": [
        [
          {
            "node": "Send Alert to Slack",
            "type": "main",
            "index": 0
          }
        ],
        []
      ]
    }
  },
  "active": true,
  "settings": {},
  "createdAt": "2026-06-09T10:00:00.000Z",
  "updatedAt": "2026-06-09T10:00:00.000Z",
  "id": "campaign-performance-alerts"
}
```

## Frequently Asked Questions

### What happens if a campaign has zero impressions today?
The Function node sets CTR to 0 when impressions are zero, which triggers an alert since 0% is below the 2% threshold. This is intentional — campaigns with no impressions indicate a serious delivery issue that needs immediate attention.

### Can I change the 2% CTR threshold for different campaign types?
Yes, modify the Function node condition from `ctr < 2` to include campaign type logic. For example: `(item.json.campaign.name.includes('Brand') && ctr < 1) || (item.json.campaign.name.includes('Search') && ctr < 2)` sets different thresholds based on campaign names.

### How do I add email alerts alongside Slack notifications?
Add a Gmail or Email node after the IF node, connecting it parallel to the Slack node. Both nodes will receive the same filtered campaign data and fire simultaneously when performance issues are detected.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and import the JSON above in under two minutes.