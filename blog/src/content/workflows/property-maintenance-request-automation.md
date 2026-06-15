---
title: "n8n Workflow for Tenant Maintenance Request Automation 2026"
description: "Complete n8n workflow that automatically creates tickets, assigns contractors, and tracks maintenance requests from tenant submissions to completion."
profession: "Property Managers"
category: "Maintenance"
contentType: workflow
tags: ["n8n workflow for tenant maintenance request automation", "property maintenance automation", "tenant request workflow", "maintenance ticket automation", "n8n property management"]
pubDate: 2026-06-15
featured: false
---

This n8n workflow automatically processes tenant maintenance requests from a Google Form submission through ticket creation, contractor assignment, and completion tracking. It connects Google Forms, Sheets, Gmail, and Slack to eliminate 45 minutes of manual coordination per request.

## Why this automation matters

Without automation, each maintenance request requires manual data entry, contractor lookup, email drafting, and status tracking across multiple systems. Property managers lose requests in email threads, assign wrong contractors to jobs outside their expertise, and tenants wait days for acknowledgment. This workflow ensures every request gets processed within 10 minutes and assigned to the right contractor based on issue type.

## What you need before starting

- Google Forms OAuth2 credential with access to your maintenance request form
- Google Sheets OAuth2 credential connected to the sheet receiving form responses
- Gmail OAuth2 credential for sending contractor and tenant notifications
- Slack OAuth2 credential for your property management team workspace
- Active Google Form collecting: tenant name, property address, issue type, urgency level, and description

## How to build it: step by step

### 1. Google Sheets Trigger — Monitor new maintenance requests

Node type: Google Sheets Trigger
Sheet: Your maintenance request response sheet
Trigger On: Row Added
Poll Time: Every 2 minutes
Output: New form submission data as individual items containing tenant info, issue details, and timestamp.
Why this matters: The 2-minute polling ensures rapid response times while avoiding API rate limits during busy periods.

### 2. Set Node — Standardize contractor assignment logic

Node type: Set
Fields to Set:
- contractor_email: `{{ $json.issue_type === 'Plumbing' ? 'plumber@contractor.com' : $json.issue_type === 'Electrical' ? 'electrician@contractor.com' : 'general@contractor.com' }}`
- priority_level: `{{ $json.urgency === 'Emergency' ? 'HIGH' : 'NORMAL' }}`
- ticket_id: `{{ 'MNT-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6) }}`
Output: Enhanced request data with assigned contractor and generated ticket ID.
Why this matters: Consistent contractor routing based on issue type prevents plumbers getting electrical calls and ensures proper skill matching.

### 3. Google Sheets — Log processed request

Node type: Google Sheets
Operation: Append Row
Sheet: Maintenance Tracking > Active Requests
Values to Append: Ticket ID, Tenant Name, Address, Issue Type, Contractor Email, Date Created, Status (set to "Assigned")
Output: Confirmation of logged entry with row number for future updates.
Why this matters: Creates a centralized tracking record that survives email deletions and provides status history.

### 4. Gmail — Notify assigned contractor

Node type: Gmail
Operation: Send Email
To: `{{ $json.contractor_email }}`
Subject: `{{ 'NEW ' + $json.priority_level + ' PRIORITY: ' + $json.ticket_id + ' - ' + $json.issue_type }}`
Message: Details the issue, tenant contact info, property address, and requested completion timeframe
Output: Email delivery confirmation with message ID for tracking.
Why this matters: Contractors receive consistent formatting with all necessary details to schedule and price the job immediately.

### 5. Gmail — Send acknowledgment to tenant

Node type: Gmail
Operation: Send Email
To: `{{ $json.tenant_email }}`
Subject: `{{ 'Maintenance Request Received - ' + $json.ticket_id }}`
Message: Confirms receipt, provides ticket number, contractor contact info, and expected response timeframe
Output: Tenant notification delivery confirmation.
Why this matters: Immediate acknowledgment prevents follow-up calls and gives tenants a reference number for status inquiries.

### 6. Slack — Alert property management team

Node type: Slack
Operation: Send Message
Channel: #maintenance-alerts
Message: `{{ 'New ' + $json.priority_level + ' priority request: ' + $json.ticket_id + ' assigned to ' + $json.contractor_email + ' for ' + $json.issue_type + ' at ' + $json.property_address }}`
Output: Posted message with timestamp and channel confirmation.
Why this matters: Team visibility enables intervention for emergency requests and provides backup communication if contractors don't respond.

## Full workflow JSON

```json
{
  "name": "Tenant Maintenance Request Automation",
  "nodes": [
    {
      "parameters": {
        "pollTimes": {
          "item": [
            {
              "mode": "everyMinute",
              "minute": 2
            }
          ]
        },
        "documentId": {
          "__rl": true,
          "value": "your-google-sheet-id",
          "mode": "list",
          "cachedResultName": "Maintenance Requests"
        },
        "sheetName": {
          "__rl": true,
          "value": "Form Responses 1",
          "mode": "list",
          "cachedResultName": "Form Responses 1"
        },
        "event": "rowAdded"
      },
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "name": "New Maintenance Request",
      "type": "n8n-nodes-base.googleSheetsTrigger",
      "typeVersion": 4,
      "position": [460, 240],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "google-sheets-credential-id",
          "name": "Google Sheets Maintenance"
        }
      }
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "contractor_email",
              "value": "={{ $json['Issue Type'] === 'Plumbing' ? 'plumber@contractors.com' : $json['Issue Type'] === 'Electrical' ? 'electrician@contractors.com' : $json['Issue Type'] === 'HVAC' ? 'hvac@contractors.com' : 'general@contractors.com' }}"
            },
            {
              "name": "priority_level",
              "value": "={{ $json['Urgency Level'] === 'Emergency' ? 'HIGH' : 'NORMAL' }}"
            },
            {
              "name": "ticket_id",
              "value": "={{ 'MNT-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6) }}"
            },
            {
              "name": "tenant_name",
              "value": "={{ $json['Tenant Name'] }}"
            },
            {
              "name": "tenant_email",
              "value": "={{ $json['Email Address'] }}"
            },
            {
              "name": "property_address",
              "value": "={{ $json['Property Address'] }}"
            },
            {
              "name": "issue_type",
              "value": "={{ $json['Issue Type'] }}"
            },
            {
              "name": "issue_description",
              "value": "={{ $json['Description of Issue'] }}"
            },
            {
              "name": "urgency",
              "value": "={{ $json['Urgency Level'] }}"
            }
          ]
        },
        "options": {}
      },
      "id": "b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7",
      "name": "Process Request Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3,
      "position": [680, 240]
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": {
          "__rl": true,
          "value": "your-tracking-sheet-id",
          "mode": "list",
          "cachedResultName": "Maintenance Tracking"
        },
        "sheetName": {
          "__rl": true,
          "value": "Active Requests",
          "mode": "list",
          "cachedResultName": "Active Requests"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Ticket ID": "={{ $json.ticket_id }}",
            "Tenant Name": "={{ $json.tenant_name }}",
            "Property Address": "={{ $json.property_address }}",
            "Issue Type": "={{ $json.issue_type }}",
            "Contractor Email": "={{ $json.contractor_email }}",
            "Date Created": "={{ new Date().toISOString().split('T')[0] }}",
            "Status": "Assigned",
            "Priority": "={{ $json.priority_level }}"
          },
          "matchingColumns": [],
          "schema": []
        },
        "options": {}
      },
      "id": "c3d4e5f6-g7h8-9i0j-1k2l-m3n4o5p6q7r8",
      "name": "Log to Tracking Sheet",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 4,
      "position": [900, 180],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "google-sheets-credential-id",
          "name": "Google Sheets Maintenance"
        }
      }
    },
    {
      "parameters": {
        "sendTo": "={{ $json.contractor_email }}",
        "subject": "={{ 'NEW ' + $json.priority_level + ' PRIORITY: ' + $json.ticket_id + ' - ' + $json.issue_type }}",
        "emailType": "text",
        "message": "=New maintenance request assigned:\n\nTicket: {{ $json.ticket_id }}\nProperty: {{ $json.property_address }}\nTenant: {{ $json.tenant_name }}\nContact: {{ $json.tenant_email }}\n\nIssue Type: {{ $json.issue_type }}\nPriority: {{ $json.priority_level }}\nDescription: {{ $json.issue_description }}\n\nPlease respond within {{ $json.priority_level === 'HIGH' ? '2 hours' : '24 hours' }} with availability and estimated cost.\n\nQuestions? Reply to this email or call the office.",
        "options": {}
      },
      "id": "d4e5f6g7-h8i9-0j1k-2l3m-n4o5p6q7r8s9",
      "name": "Email Contractor",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 2,
      "position": [900, 300],
      "credentials": {
        "gmailOAuth2": {
          "id": "gmail-credential-id",
          "name": "Property Manager Gmail"
        }
      }
    },
    {
      "parameters": {
        "sendTo": "={{ $json.tenant_email }}",
        "subject": "={{ 'Maintenance Request Received - ' + $json.ticket_id }}",
        "emailType": "text",
        "message": "=Dear {{ $json.tenant_name }},\n\nWe've received your maintenance request and assigned ticket number {{ $json.ticket_id }}.\n\nRequest Details:\nProperty: {{ $json.property_address }}\nIssue: {{ $json.issue_type }}\nPriority: {{ $json.priority_level }}\n\nYour assigned contractor will contact you within {{ $json.priority_level ===