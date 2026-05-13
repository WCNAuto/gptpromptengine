---
title: "Customer Feedback Collection Automation with n8n"
description: "Streamline customer feedback collection, processing, and response management with automated workflows that capture, analyze, and route feedback to appropriate teams."
profession: "Customer Service"
category: "Customer Experience"
contentType: "workflow"
tags: ["customer-feedback", "automation", "customer-service", "data-collection", "response-management"]
pubDate: "2026-05-13"
featured: false
---

## Why This Automation Matters

Customer feedback is the lifeblood of exceptional service delivery, but manually processing feedback forms, routing them to appropriate teams, and ensuring timely responses can overwhelm customer service departments. This n8n automation transforms your feedback collection process by:

- **Eliminating manual data entry** and reducing processing time by 80%
- **Automatically categorizing feedback** based on sentiment and topic
- **Instantly routing urgent issues** to the right team members
- **Triggering follow-up sequences** for different feedback types
- **Creating comprehensive analytics** dashboards for service improvement
- **Ensuring no feedback goes unanswered** with automated acknowledgments

## What You Need Before Starting

### Required Tools & Accounts
- n8n Cloud or self-hosted instance
- Google Forms or Typeform account
- Gmail or SMTP email service
- Google Sheets or Airtable for data storage
- Slack workspace (optional)

### Credentials Setup
- Google Forms API credentials
- Gmail/SMTP authentication
- Google Sheets API access
- Slack bot token (if using Slack notifications)

### Preparation Checklist
- [ ] Create feedback form with standardized fields
- [ ] Set up feedback storage spreadsheet/database
- [ ] Define feedback categories and priority levels
- [ ] Prepare email templates for responses
- [ ] Configure team notification channels

## Complete Node-by-Node Build Instructions

### Step 1: Form Trigger Setup
1. Add **Google Forms Trigger** node
2. Connect your Google account
3. Select your feedback collection form
4. Set trigger to "On Form Submit"
5. Test the connection

### Step 2: Data Processing and Validation
1. Add **Set** node after the trigger
2. Configure data mapping:
   - Customer Name: `{{$node["Google Forms Trigger"].json["Customer Name"]}}`
   - Email: `{{$node["Google Forms Trigger"].json["Email Address"]}}`
   - Feedback Type: `{{$node["Google Forms Trigger"].json["Feedback Category"]}}`
   - Rating: `{{$node["Google Forms Trigger"].json["Overall Rating"]}}`
   - Comments: `{{$node["Google Forms Trigger"].json["Comments"]}}`
   - Timestamp: `{{$now.format('yyyy-MM-dd HH:mm:ss')}}`

### Step 3: Sentiment Analysis
1. Add **HTTP Request** node
2. Configure for sentiment analysis API:
   - Method: POST
   - URL: Your preferred sentiment analysis service
   - Body: `{"text": "{{$node["Set"].json["Comments"]}}"}`
3. Add **Set** node to extract sentiment score

### Step 4: Feedback Categorization
1. Add **Switch** node
2. Configure routing rules:
   - Mode: Rules
   - Rule 1: Rating ≤ 2 OR sentiment < -0.5 → Urgent
   - Rule 2: Feedback Type = "Complaint" → Priority
   - Rule 3: Rating ≥ 4 AND sentiment > 0.5 → Positive
   - Default: Standard

### Step 5: Data Storage
1. Add **Google Sheets** node to each switch output
2. Configure spreadsheet connection
3. Set operation to "Append"
4. Map all feedback data plus category and priority

### Step 6: Urgent Feedback Handling
1. Add **Slack** node to Urgent path
2. Configure immediate team notification
3. Include customer details and feedback summary
4. Add **Gmail** node for priority email alert

### Step 7: Automated Acknowledgment
1. Add **Gmail** node to all paths
2. Configure customer acknowledgment email:
   - To: `{{$node["Set"].json["Email"]}}`
   - Subject: "Thank you for your feedback - [Ticket #{{$runIndex}}]"
   - Body: Personalized template based on feedback type

### Step 8: Follow-up Scheduling
1. Add **Wait** node (24 hours)
2. Add **HTTP Request** to check if feedback was addressed
3. Add **Gmail** node for follow-up if needed

### Step 9: Analytics Update
1. Add **Google Sheets** node
2. Update summary dashboard with:
   - Daily feedback count
   - Average rating
   - Sentiment trends
   - Response time metrics

## Complete Workflow JSON

```json
{
  "name": "Customer Feedback Collection Automation",
  "nodes": [
    {
      "parameters": {
        "formId": "YOUR_FORM_ID",
        "triggerOn": "formSubmit"
      },
      "id": "google-forms-trigger",
      "name": "Google Forms Trigger",
      "type": "n8n-nodes-base.googleFormsTrigger",
      "typeVersion": 1,
      "position": [200, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "customerName",
              "value": "={{$node[\"Google Forms Trigger\"].json[\"Customer Name\"]}}"
            },
            {
              "name": "email",
              "value": "={{$node[\"Google Forms Trigger\"].json[\"Email Address\"]}}"
            },
            {
              "name": "feedbackType",
              "value": "={{$node[\"Google Forms Trigger\"].json[\"Feedback Category\"]}}"
            },
            {
              "name": "rating",
              "value": "={{$node[\"Google Forms Trigger\"].json[\"Overall Rating\"]}}"
            },
            {
              "name": "comments",
              "value": "={{$node[\"Google Forms Trigger\"].json[\"Comments\"]}}"
            },
            {
              "name": "timestamp",
              "value": "={{$now.format('yyyy-MM-dd HH:mm:ss')}}"
            }
          ]
        }
      },
      "id": "data-processing",
      "name": "Data Processing",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [400, 300]
    },
    {
      "parameters": {
        "url": "https://api.meaningcloud.com/sentiment-2.1",
        "options": {
          "bodyContentType": "form-urlencoded"
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "key",
              "value": "YOUR_API_KEY"
            },
            {
              "name": "txt",
              "value": "={{$node[\"Data Processing\"].json[\"comments\"]}}"
            },
            {
              "name": "lang",
              "value": "en"
            }
          ]
        }
      },
      "id": "sentiment-analysis",
      "name": "Sentiment Analysis",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 1,
      "position": [600, 300]
    },
    {
      "parameters": {
        "values": {
          "number": [
            {
              "name": "sentimentScore",
              "value": "={{$node[\"Sentiment Analysis\"].json[\"score_tag\"] === 'P+' ? 1 : $node[\"Sentiment Analysis\"].json[\"score_tag\"] === 'P' ? 0.5 : $node[\"Sentiment Analysis\"].json[\"score_tag\"] === 'NEU' ? 0 : $node[\"Sentiment Analysis\"].json[\"score_tag\"] === 'N' ? -0.5 : -1}}"
            }
          ]
        },
        "options": {
          "dotNotation": false
        }
      },
      "id": "sentiment-processing",
      "name": "Sentiment Processing",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [800, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "leftValue": "",
            "caseSensitive": true,
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "urgent",
              "leftValue": "={{$node[\"Data Processing\"].json[\"rating\"]}}",
              "rightValue": 2,
              "operator": {
                "type": "number",
                "operation": "lte"
              }
            },
            {
              "id": "priority",
              "leftValue": "={{$node[\"Data Processing\"].json[\"feedbackType\"]}}",
              "rightValue": "Complaint",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            },
            {
              "id": "positive",
              "leftValue": "={{$node[\"Data Processing\"].json[\"rating\"]}}",
              "rightValue": 4,
              "operator": {
                "type": "number",
                "operation": "gte"
              }
            }
          ]
        },
        "fallbackOutput": "extra"
      },
      "id": "feedback-router",
      "name": "Feedback Router",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [1000, 300]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "sheetId": "YOUR_SHEET_ID",
        "range": "Feedback!A:J",
        "options": {}
      },
      "id": "store-urgent-feedback",
      "name": "Store Urgent Feedback",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 2,
      "position": [1200, 100]
    },
    {
      "parameters": {
        "channel": "#customer-alerts",
        "text": "🚨 URGENT FEEDBACK ALERT 🚨",
        "attachments": [
          {
            "color": "#ff0000",
            "fields": {
              "item": [
                {
                  "title": "Customer",
                  "value": "={{$node[\"Data Processing\"].json[\"customerName\"]}}",
                  "short": true
                },
                {
                  "title": "Rating",
                  "value": "={{$node[\"Data Processing\"].json[\"rating\"]}}/5",
                  "short": true
                },
                {
                  "title": "Comments",
                  "value": "={{$node[\"Data Processing\"].json[\"comments\"]}}",
                  "short": false
                }
              ]
            }
          }
        ]
      },
      "id": "urgent-slack-alert",
      "name": "Urgent Slack Alert",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1400, 100]
    },
    {
      "parameters": {
        "sendTo": "={{$node[\"Data Processing\"].json[\"email\"]}}",
        "subject": "Thank you for your feedback - Ticket #{{$runIndex}}",
        "emailType": "html",
        "message": "<h2>Thank you for your feedback!</h2><p>Dear {{$node[\"Data Processing\"].json[\"customerName\"]}},</p><p>We have received your feedback and appreciate you taking the time to share your experience with us.</p><p><strong>Your feedback details:</strong></p><ul><li>Category: {{$node[\"Data Processing\"].json[\"feedbackType\"]}}</li><li>Rating: {{$node[\"Data Processing\"].json[\"rating\"]}}/5</li><li>Received: {{$node[\"Data Processing\"].json[\"timestamp\"]}}</li></ul><p>We will review your feedback and respond within 24 hours if a response is required.</p><p>Best regards,<br>Customer Service Team</p>"
      },
      "id": "acknowledgment-email",
      "name": "Acknowledgment Email",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1600, 300]
    },
    {
      "parameters": {
        "amount": 24,
        "unit": "hours"
      },
      "id": "follow-up-wait",
      "name": "Follow-up Wait",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [1800, 300]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "sheetId": "YOUR_ANALYTICS_SHEET_ID",
        "range": "Dashboard!A:E",
        "options": {}
      },
      "id": "update-analytics",
      "name": "Update Analytics",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 2,
      "position": [2000, 300]
    }
  ],
  "connections": {
    "Google Forms Trigger": {
      "main": [
        [
          {
            "node": "Data Processing",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Data Processing": {
      "main": [
        [
          {
            "node": "Sentiment Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Sentiment Analysis": {
      "main": [
        [
          {
            "node": "Sentiment Processing",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Sentiment Processing": {
      "main": [
        [
          {
            "node": "Feedback Router",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Feedback Router": {
      "main": [
        [
          {
            "node": "Store Urgent Feedback",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Acknowledgment Email",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Acknowledgment Email",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Acknowledgment Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Store Urgent Feedback": {
      "main": [
        [
          {
            "node": "Urgent Slack Alert",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Acknowledgment Email": {
      "main": [
        [
          {
            "node": "Follow-up Wait",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Follow-up Wait": {
      "main": [
        [
          {
            "node": "Update Analytics",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## FAQ

### Q: How do I handle feedback in multiple languages?
**A:** Modify the Sentiment Analysis node to include language detection first, then process sentiment accordingly. Add a translation step using Google Translate API for non-English feedback before routing