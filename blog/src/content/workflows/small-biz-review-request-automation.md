---
title: "Google Review Request Automation Workflow for Small Businesses"
description: "Automate Google review requests to boost your online reputation and customer feedback collection with this n8n workflow designed for small business owners."
profession: "Small Business"
category: "Customer Relationship Management"
contentType: "workflow"
tags: ["google-reviews", "customer-feedback", "automation", "small-business", "reputation-management", "email-marketing"]
pubDate: "2026-06-02"
featured: false
---

# Google Review Request Automation Workflow for Small Businesses

## Why This Automation Matters

For small businesses, online reviews are crucial for building trust and attracting new customers. This automation streamlines the process of requesting Google reviews from satisfied customers, helping you:

- **Increase review volume consistently** without manual follow-up
- **Improve online reputation** through timely review requests
- **Save time** by automating the entire review request process
- **Boost local SEO** with fresh, authentic reviews
- **Track customer satisfaction** patterns over time

Studies show that businesses with automated review systems see 30-50% more reviews compared to manual outreach methods.

## What You Need Before Starting

### Required Accounts & Services
- n8n Cloud or self-hosted instance
- Google My Business account with verified listing
- Email service provider (Gmail, Outlook, or SMTP server)
- Customer database or CRM (Google Sheets, Airtable, or CRM platform)

### Required Information
- Google My Business listing URL for reviews
- Customer contact information (email addresses)
- Email templates for review requests
- Trigger criteria (purchase completion, service delivery, etc.)

### Technical Requirements
- Basic understanding of n8n workflow creation
- Access to customer data source
- Email sending permissions

## Complete Node-by-Node Build Instructions

### Step 1: Set Up the Trigger Node

1. **Add Webhook Node**
   - Drag the "Webhook" node to your canvas
   - Set HTTP Method to "POST"
   - Configure path as `/review-request-trigger`
   - Set Response Mode to "On Received"

2. **Configure Webhook Settings**
   - Enable "Respond" option
   - Set Response Code to 200
   - Add Response Body: `{"status": "Review request initiated"}`

### Step 2: Add Customer Data Retrieval

1. **Add Google Sheets Node** (or your data source)
   - Connect after Webhook node
   - Select Operation: "Read"
   - Choose your customer database spreadsheet
   - Set Range to include customer emails and purchase data

2. **Configure Data Filtering**
   - Set filters to identify recent customers
   - Include customer email, name, and purchase date
   - Ensure data includes review eligibility criteria

### Step 3: Add Wait/Delay Node

1. **Insert Wait Node**
   - Add "Wait" node after data retrieval
   - Set wait time to 24-48 hours after purchase
   - Choose "For Duration" option
   - Configure duration: 1-2 days

### Step 4: Create Email Content Node

1. **Add Set Node for Email Template**
   - Name it "Email Template Builder"
   - Add following fields:
     - `recipient_email`: `{{$node["Google Sheets"].json["email"]}}`
     - `customer_name`: `{{$node["Google Sheets"].json["name"]}}`
     - `subject`: "We'd love your feedback!"
     - `email_body`: HTML template with review request

2. **Configure Email Body Template**
```html
<p>Hi {{$node["Email Template Builder"].json["customer_name"]}},</p>

<p>Thank you for choosing our business! We hope you're happy with your recent purchase.</p>

<p>Would you mind taking 2 minutes to share your experience on Google? Your review helps other customers discover us.</p>

<p><a href="[YOUR_GOOGLE_REVIEW_URL]" style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Leave a Google Review</a></p>

<p>Thank you for your support!</p>
<p>The [Your Business Name] Team</p>
```

### Step 5: Configure Email Sending

1. **Add Gmail Node** (or preferred email service)
   - Connect after Set node
   - Select Operation: "Send"
   - Configure Gmail credentials
   - Set recipient from previous node data

2. **Map Email Fields**
   - To: `{{$node["Email Template Builder"].json["recipient_email"]}}`
   - Subject: `{{$node["Email Template Builder"].json["subject"]}}`
   - Message: `{{$node["Email Template Builder"].json["email_body"]}}`

### Step 6: Add Follow-up Logic

1. **Add Wait Node for Follow-up**
   - Set 7-day delay for follow-up
   - Only if no review detected

2. **Add HTTP Request Node**
   - Check if customer has left review
   - Query Google My Business API
   - Skip follow-up if review exists

### Step 7: Log and Track Results

1. **Add Google Sheets Node for Logging**
   - Operation: "Append"
   - Log sent emails and responses
   - Track review request success rates

2. **Configure Logging Data**
   - Customer email
   - Request sent date
   - Follow-up status
   - Review received (if applicable)

## Full Workflow JSON Code

```json
{
  "name": "Google Review Request Automation",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "review-request-trigger",
        "responseMode": "onReceived",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "documentId": "YOUR_SHEET_ID",
        "sheetName": "Customers",
        "range": "A:E",
        "options": {}
      },
      "id": "customer-data",
      "name": "Get Customer Data",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "amount": 48,
        "unit": "hours"
      },
      "id": "wait-delay",
      "name": "Wait 48 Hours",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "recipient_email",
              "value": "={{$node[\"Get Customer Data\"].json[\"email\"]}}"
            },
            {
              "name": "customer_name",
              "value": "={{$node[\"Get Customer Data\"].json[\"name\"]}}"
            },
            {
              "name": "subject",
              "value": "We'd love your feedback!"
            },
            {
              "name": "email_body",
              "value": "<p>Hi {{$node[\"Get Customer Data\"].json[\"name\"]}},</p><p>Thank you for choosing our business! We hope you're happy with your recent purchase.</p><p>Would you mind taking 2 minutes to share your experience on Google?</p><p><a href=\"YOUR_GOOGLE_REVIEW_URL\" style=\"background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;\">Leave a Google Review</a></p><p>Thank you!</p>"
            }
          ]
        },
        "options": {}
      },
      "id": "email-template",
      "name": "Email Template Builder",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "operation": "send",
        "resource": "message",
        "message": "={{$node[\"Email Template Builder\"].json[\"email_body\"]}}",
        "subject": "={{$node[\"Email Template Builder\"].json[\"subject\"]}}",
        "toList": "={{$node[\"Email Template Builder\"].json[\"recipient_email\"]}}",
        "options": {
          "contentType": "html"
        }
      },
      "id": "send-email",
      "name": "Send Review Request",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "amount": 7,
        "unit": "days"
      },
      "id": "followup-wait",
      "name": "Wait for Follow-up",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [1340, 300]
    },
    {
      "parameters": {
        "operation": "append",
        "documentId": "YOUR_SHEET_ID",
        "sheetName": "Review Requests Log",
        "values": {
          "string": [
            "={{$node[\"Email Template Builder\"].json[\"recipient_email\"]}}",
            "={{$node[\"Email Template Builder\"].json[\"customer_name\"]}}",
            "={{new Date().toISOString()}}",
            "=Request Sent"
          ]
        },
        "options": {}
      },
      "id": "log-request",
      "name": "Log Request",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [1340, 500]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Get Customer Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Customer Data": {
      "main": [
        [
          {
            "node": "Wait 48 Hours",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait 48 Hours": {
      "main": [
        [
          {
            "node": "Email Template Builder",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Email Template Builder": {
      "main": [
        [
          {
            "node": "Send Review Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Review Request": {
      "main": [
        [
          {
            "node": "Wait for Follow-up",
            "type": "main",
            "index": 0
          },
          {
            "node": "Log Request",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {},
  "versionId": "1"
}
```

## FAQ

### How often should I send review requests?

Send review requests 24-48 hours after a purchase or service completion when the experience is still fresh. Avoid sending more than one request per customer per transaction to prevent appearing pushy. If you don't receive a review after the first request, wait 7-14 days before sending a gentle follow-up.

### Can I customize the email template for different types of customers?

Yes! You can modify the Set node to include conditional logic based on customer data. Create different email templates for different service types, customer segments, or purchase amounts. Use n8n's IF node to route customers to appropriate email templates based on criteria like purchase value, service type, or customer tier.

### What's the best way to find my Google Review URL?

Go to your Google My Business dashboard, select your location, then click on "Get more reviews." Google will provide a direct link that customers can use to leave reviews. Alternatively, you can use the format: `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID` where you replace YOUR_PLACE_ID with your business's Google Places ID.

---

Ready to automate your Google review requests and boost your online reputation? [Start automating with n8n Cloud](https://n8n.io/) and transform how you collect customer feedback today!