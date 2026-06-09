---
title: "N8N Automation for Marketing Report Generation Weekly - Auto-Create Campaign Performance Dashboards 2026"
description: "Copy-paste n8n workflow that pulls Google Analytics, Facebook Ads & HubSpot data into automated weekly marketing reports sent every Monday at 9 AM."
profession: "Marketing Managers"
category: "Analytics"
contentType: workflow
tags: ["n8n automation for marketing report generation weekly", "automated marketing dashboards", "weekly campaign performance reports", "marketing analytics automation", "n8n marketing workflows"]
pubDate: 2026-06-09
featured: false
---

This workflow automatically pulls campaign data from Google Analytics, Facebook Ads, and HubSpot every Monday at 9 AM, combines it into a formatted report, and emails it to your marketing team. Replaces the 45 minutes you spend every Monday morning copying numbers between platforms and building the same performance summary.

## Why this automation matters

Manual weekly reports mean switching between 3-4 dashboards, copy-pasting metrics, and formatting the same email template. Miss a Monday morning and stakeholders ask where the numbers are. One wrong copy-paste and your conversion rates look off by 200%. This workflow pulls accurate data automatically and delivers consistent reports whether you're in meetings or out of office.

## What you need before starting

- Cron trigger node (built into n8n)
- Google Analytics OAuth2 credential connected to your GA4 property
- Facebook Marketing API credential with access to your ad accounts
- HubSpot OAuth2 credential with marketing permissions
- Gmail OAuth2 credential for sending reports
- Access to the Google Analytics property containing your website data
- Facebook Business Manager account with campaign data
- HubSpot account with lead and deal tracking enabled

## How to build it: step by step

### 1. Cron Trigger — Schedule weekly execution

Node type: Cron Trigger
Mode: Every Week
Weekday: Monday  
Hour: 9
Minute: 0
Timezone: Your local timezone
Output: Triggers the workflow every Monday at 9 AM
Why this matters: Consistent timing ensures stakeholders expect and receive reports at the same time weekly.

### 2. Google Analytics — Pull website traffic data

Node type: Google Analytics
Credential: Your GA4 OAuth2 credential
Operation: Get Report
Property ID: Your GA4 property ID
Date Range: Last 7 Days
Metrics: sessions, users, conversions, revenue
Dimensions: source, medium
Output: Array of traffic source data with conversion metrics
Why this matters: GA4 data shows which channels drove actual conversions, not just clicks.

### 3. Facebook Marketing API — Get ad spend and performance

Node type: Facebook Marketing API  
Credential: Your Facebook Marketing credential
Operation: Get Insights
Account ID: Your ad account ID
Date Range: Last 7 Days
Fields: spend, impressions, clicks, conversions, cost_per_conversion
Level: campaign
Output: Array of campaign performance with cost data
Why this matters: Combines reach metrics with cost efficiency to show ROI per campaign.

### 4. HubSpot — Pull lead generation numbers

Node type: HubSpot
Credential: Your HubSpot OAuth2 credential
Resource: Deal
Operation: Get All
Date Property: createdate
Date Range: Last 7 Days
Properties: dealname, amount, pipeline, dealstage, source
Output: Array of new deals created in the past week
Why this matters: Shows how marketing channels convert to actual sales opportunities.

### 5. Code — Calculate key metrics and format data

Node type: Code
Language: JavaScript
Code: Calculate total spend, cost per lead, conversion rates, revenue attribution
Input: Data from GA4, Facebook, and HubSpot nodes
Output: Formatted object with calculated KPIs and summary metrics
Why this matters: Stakeholders need ratios and percentages, not raw numbers from each platform.

### 6. HTML — Build formatted email report

Node type: HTML
Template: Email-friendly table with metrics, week-over-week comparisons
Data Source: Formatted metrics from Code node
Output: Complete HTML email body with styled tables and key insights
Why this matters: Professional formatting makes the data actionable instead of overwhelming.

### 7. Gmail — Send report to marketing team

Node type: Gmail
Credential: Your Gmail OAuth2 credential
Operation: Send Email
To: marketing-team@yourcompany.com
Subject: Weekly Marketing Performance - Week of {{$now.format('MMM DD, YYYY')}}
Body: HTML output from previous node
Output: Confirmation of sent email
Why this matters: Automated delivery ensures consistent communication even when you're unavailable.

## Full workflow JSON

```json
{
  "meta": {
    "instanceId": "n8n-weekly-marketing-reports"
  },
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "weekday",
              "weekday": 1
            },
            {
              "field": "hour", 
              "hour": 9
            }
          ]
        }
      },
      "id": "cron-trigger",
      "name": "Weekly Report Trigger",
      "type": "n8n-nodes-base.cron",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "getReport",
        "propertyId": "YOUR_GA4_PROPERTY_ID",
        "dateRanges": {
          "values": [
            {
              "startDate": "7daysAgo",
              "endDate": "yesterday"
            }
          ]
        },
        "dimensions": [
          "sessionSource",
          "sessionMedium"
        ],
        "metrics": [
          "sessions",
          "users", 
          "conversions",
          "totalRevenue"
        ]
      },
      "id": "google-analytics",
      "name": "GA4 Traffic Data", 
      "type": "n8n-nodes-base.googleAnalytics",
      "typeVersion": 2,
      "position": [460, 180],
      "credentials": {
        "googleAnalyticsOAuth2": {
          "id": "// Replace with your GA4 credential ID",
          "name": "GA4 Marketing Reports"
        }
      }
    },
    {
      "parameters": {
        "operation": "getInsights",
        "accountId": "YOUR_FACEBOOK_AD_ACCOUNT_ID",
        "fields": [
          "campaign_name",
          "spend",
          "impressions", 
          "clicks",
          "conversions",
          "cost_per_conversion"
        ],
        "datePreset": "last_7_days",
        "level": "campaign"
      },
      "id": "facebook-marketing", 
      "name": "Facebook Ad Performance",
      "type": "n8n-nodes-base.facebookMarketing",
      "typeVersion": 1,
      "position": [460, 300],
      "credentials": {
        "facebookMarketingOAuth2": {
          "id": "// Replace with your Facebook Marketing credential ID", 
          "name": "Facebook Ads API"
        }
      }
    },
    {
      "parameters": {
        "resource": "deal",
        "operation": "getAll",
        "filters": {
          "filterGroups": [
            {
              "filters": [
                {
                  "propertyName": "createdate",
                  "operator": "GTE",
                  "value": "{{$now.minus({days: 7}).startOf('day').toISO()}}"
                }
              ]
            }
          ]
        },
        "properties": [
          "dealname",
          "amount",
          "pipeline", 
          "dealstage",
          "hs_analytics_source"
        ]
      },
      "id": "hubspot-deals",
      "name": "HubSpot New Deals", 
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 2,
      "position": [460, 420],
      "credentials": {
        "hubspotOAuth2": {
          "id": "// Replace with your HubSpot credential ID",
          "name": "HubSpot Marketing"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const gaData = $input.first().json.rows || [];\nconst fbData = $input.all()[1].json.data || [];\nconst hsData = $input.all()[2].json || [];\n\n// Calculate totals\nconst totalSessions = gaData.reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0);\nconst totalUsers = gaData.reduce((sum, row) => sum + parseInt(row.metricValues[1].value), 0);\nconst totalConversions = gaData.reduce((sum, row) => sum + parseFloat(row.metricValues[2].value), 0);\nconst totalRevenue = gaData.reduce((sum, row) => sum + parseFloat(row.metricValues[3].value), 0);\n\nconst totalAdSpend = fbData.reduce((sum, campaign) => sum + parseFloat(campaign.spend), 0);\nconst totalAdClicks = fbData.reduce((sum, campaign) => sum + parseInt(campaign.clicks), 0);\nconst totalAdConversions = fbData.reduce((sum, campaign) => sum + parseInt(campaign.conversions || 0), 0);\n\nconst newDeals = hsData.length;\nconst newDealValue = hsData.reduce((sum, deal) => sum + parseFloat(deal.amount || 0), 0);\n\n// Calculate KPIs\nconst conversionRate = totalSessions > 0 ? (totalConversions / totalSessions * 100).toFixed(2) : 0;\nconst costPerClick = totalAdClicks > 0 ? (totalAdSpend / totalAdClicks).toFixed(2) : 0;\nconst costPerLead = totalAdConversions > 0 ? (totalAdSpend / totalAdConversions).toFixed(2) : 0;\nconst roas = totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : 0;\n\nreturn [{\n  json: {\n    period: 'Last 7 Days',\n    website: {\n      sessions: totalSessions,\n      users: totalUsers,\n      conversions: totalConversions,\n      revenue: totalRevenue,\n      conversionRate: conversionRate\n    },\n    advertising: {\n      spend: totalAdSpend,\n      clicks: totalAdClicks,\n      conversions: totalAdConversions,\n      costPerClick: costPerClick,\n      costPerLead: costPerLead\n    },\n    sales: {\n      newDeals: newDeals,\n      dealValue: newDealValue\n    },\n    kpis: {\n      roas: roas,\n      costPerLead: costPerLead,\n      conversionRate: conversionRate\n    }\n  }\n}];"
      },
      "id": "calculate-metrics",
      "name": "Calculate KPIs",
      "type": "n8n-nodes-base.code", 
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "html": "<!DOCTYPE html>\n<html>\n<head>\n<style>\ntable { border-collapse: collapse; width: 100%; font-family: Arial; }\nth, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\nth { background-color: #f2f2f2; }\n.metric { font-weight: bold; color: #2e7d32; }\n.currency { color: #1976d2; }\n</style>\n</head>\n<body>\n<h2>Weekly Marketing Report - {{$now.format('MMM DD, YYYY')}}</h2>\n\n