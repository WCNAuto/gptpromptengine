---
title: "N8N Workflow for Automated CV Screening and Ranking HR Teams 2026"
description: "Complete n8n workflow that automatically screens CVs from email, scores candidates using AI, and ranks them in Google Sheets. Ready-to-import JSON included."
profession: "Recruiters"
category: "CV Screening"
contentType: workflow
tags: ["n8n workflow for automated cv screening and ranking hr", "automated cv screening workflow", "ai cv ranking automation", "hr recruitment automation n8n", "automated candidate screening"]
pubDate: 2026-06-13
featured: false
---

This workflow automatically screens CVs sent to your recruitment email, extracts candidate information using AI, scores them against job requirements, and ranks them in a Google Sheets dashboard. It connects Gmail, OpenAI, and Google Sheets to process 20-30 CVs in the time it normally takes to manually review 3-4 candidates.

## Why this automation matters

Manual CV screening means opening each email attachment, reading through CVs, noting key skills, and manually entering candidate details into spreadsheets. Without automation, recruiters spend 45-60 minutes per day just on initial CV processing, leading to delayed candidate responses and missed opportunities with top talent. This workflow processes new CVs within 2 minutes of email receipt and maintains a live-ranked candidate list.

## What you need before starting

- Gmail credential with access to the recruitment inbox that receives CV emails
- OpenAI credential with GPT-4 API access and sufficient credits
- Google Sheets OAuth2 credential connected to the account that will own the candidate ranking spreadsheet
- A Google Sheet named "CV Screening Dashboard" with columns: Name, Email, Phone, Experience Years, Key Skills, Job Match Score, AI Summary, CV Status, Timestamp
- Email trigger configured to monitor the specific Gmail folder/label where CVs are received

## How to build it: step by step

### 1. Gmail Trigger — Monitor for new CV emails

Node type: Gmail Trigger
Trigger on: New Email
Label/Folder: CVs (or your designated CV folder)
Include Attachments: True
Output: Each new email with CV attachments triggers the workflow and passes email data plus attachment content to the next node.
Why this matters: The trigger only activates for CV emails, preventing the workflow from processing irrelevant messages and consuming unnecessary API credits.

### 2. IF Node — Filter emails with PDF attachments

Node type: IF
Condition: {{ $json.attachments.length > 0 && $json.attachments[0].mimeType === 'application/pdf' }}
True branch: Continue to CV processing
False branch: Stop execution
Output: Only emails containing PDF attachments proceed to CV analysis.
Why this matters: Prevents the workflow from processing emails without CVs, avoiding OpenAI API calls on irrelevant content.

### 3. Extract Text — Convert PDF to text

Node type: Extract from File
File Type: PDF
Input Data: {{ $json.attachments[0].data }}
Output Format: Plain text
Output: Raw text content from the CV PDF passes to the AI analysis node.
Why this matters: OpenAI requires text input, not binary PDF data, so extraction is essential for AI processing.

### 4. OpenAI — Analyze and score CV

Node type: OpenAI
Operation: Chat
Model: gpt-4
System Message: "You are an expert recruiter. Extract and score candidate information from CVs. Return JSON only with these fields: name, email, phone, experience_years, key_skills (array), job_match_score (0-100), summary (2 sentences)."
User Message: "Analyze this CV for a [SOFTWARE DEVELOPER] position requiring [JavaScript, React, Node.js, 3+ years experience]: {{ $('Extract Text').first().$json.text }}"
Temperature: 0.1
Output: Structured JSON with candidate data and scoring passes to the Google Sheets node.
Why this matters: Low temperature ensures consistent scoring, and specific job requirements in the prompt create accurate match scores.

### 5. Set Node — Structure data for Sheets

Node type: Set
Fields to Set:
- Name: {{ $json.choices[0].message.content.name }}
- Email: {{ $json.choices[0].message.content.email }}
- Phone: {{ $json.choices[0].message.content.phone }}
- Experience Years: {{ $json.choices[0].message.content.experience_years }}
- Key Skills: {{ $json.choices[0].message.content.key_skills.join(', ') }}
- Job Match Score: {{ $json.choices[0].message.content.job_match_score }}
- AI Summary: {{ $json.choices[0].message.content.summary }}
- CV Status: "New"
- Timestamp: {{ $now.toISO() }}
Output: Clean, structured data ready for Google Sheets insertion.
Why this matters: Proper data formatting prevents Google Sheets errors and ensures consistent column mapping.

### 6. Google Sheets — Add candidate to ranking sheet

Node type: Google Sheets
Operation: Append Row
Spreadsheet: CV Screening Dashboard
Sheet: Sheet1
Data Mapping: Map each Set node field to corresponding sheet columns
Sort: Job Match Score (Descending) after insert
Output: New candidate row added to spreadsheet, automatically sorted by match score.
Why this matters: Automatic sorting keeps the highest-scoring candidates at the top for immediate recruiter attention.

## Full workflow JSON

```json
{
  "name": "Automated CV Screening and Ranking",
  "nodes": [
    {
      "parameters": {
        "labelIds": ["CVs"],
        "format": "resolved",
        "options": {
          "includeAttachments": true
        }
      },
      "id": "f1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o",
      "name": "Gmail Trigger",
      "type": "n8n-nodes-base.gmailTrigger",
      "typeVersion": 1,
      "position": [260, 300],
      "credentials": {
        "googleOAuth2Api": {
          "id": "// Replace with your Gmail credential ID",
          "name": "Gmail Account"
        }
      }
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
              "leftValue": "={{ $json.attachments.length }}",
              "rightValue": 0,
              "operator": {
                "type": "number",
                "operation": "gt"
              }
            },
            {
              "leftValue": "={{ $json.attachments[0].mimeType }}",
              "rightValue": "application/pdf",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
      "name": "Check for PDF",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [480, 300]
    },
    {
      "parameters": {
        "operation": "extractFromFile",
        "extractFromFile": {
          "inputDataFieldName": "={{ $json.attachments[0].data }}",
          "options": {}
        }
      },
      "id": "b2c3d4e5-f6g7-8h9i-0j1k-2l3m4n5o6p7q",
      "name": "Extract CV Text",
      "type": "n8n-nodes-base.extractFromFile",
      "typeVersion": 1,
      "position": [700, 200]
    },
    {
      "parameters": {
        "resource": "chat",
        "operation": "create",
        "chatInput": {
          "messages": {
            "values": [
              {
                "role": "system",
                "content": "You are an expert recruiter. Extract and score candidate information from CVs. Return JSON only with these fields: name, email, phone, experience_years, key_skills (array), job_match_score (0-100), summary (2 sentences)."
              },
              {
                "role": "user",
                "content": "=Analyze this CV for a SOFTWARE DEVELOPER position requiring JavaScript, React, Node.js, 3+ years experience: {{ $('Extract CV Text').first().$json.text }}"
              }
            ]
          }
        },
        "options": {
          "temperature": 0.1,
          "maxTokens": 1000
        },
        "requestOptions": {}
      },
      "id": "c3d4e5f6-g7h8-9i0j-1k2l-3m4n5o6p7q8r",
      "name": "AI CV Analysis",
      "type": "@n8n/n8n-nodes-langchain.openAi",
      "typeVersion": 1.3,
      "position": [920, 200],
      "credentials": {
        "openAiApi": {
          "id": "// Replace with your OpenAI credential ID",
          "name": "OpenAI API"
        }
      }
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "name",
              "name": "Name",
              "value": "={{ JSON.parse($json.choices[0].message.content).name }}",
              "type": "string"
            },
            {
              "id": "email",
              "name": "Email",
              "value": "={{ JSON.parse($json.choices[0].message.content).email }}",
              "type": "string"
            },
            {
              "id": "phone",
              "name": "Phone",
              "value": "={{ JSON.parse($json.choices[0].message.content).phone }}",
              "type": "string"
            },
            {
              "id": "experience",
              "name": "Experience Years",
              "value": "={{ JSON.parse($json.choices[0].message.content).experience_years }}",
              "type": "number"
            },
            {
              "id": "skills",
              "name": "Key Skills",
              "value": "={{ JSON.parse($json.choices[0].message.content).key_skills.join(', ') }}",
              "type": "string"
            },
            {
              "id": "score",
              "name": "Job Match Score",
              "value": "={{ JSON.parse($json.choices[0].message.content).job_match_score }}",
              "type": "number"
            },
            {
              "id": "summary",
              "name": "AI Summary",
              "value": "={{ JSON.parse($json.choices[0].message.content).summary }}",
              "type": "string"
            },
            {
              "id": "status",
              "name": "CV Status",
              "value": "New",
              "type": "string"
            },
            {
              "id": "timestamp",
              "name": "Timestamp",
              "value": "={{ $now.toISO() }}",
              "type": "string"
            }
          ]
        },
        "options": {}
      },
      "id": "d4e5f6g7-h8i9-0j1k-2l3m-4n5o6p7q8r9s",
      "name": "Structure Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.3,
      "position": [1140, 200]
    },
    {
      "parameters": {
        "operation": "appendRow",
        "documentId": {
          "__rl": true,
          "value": "// Replace with your Google Sheet ID",
          "mode": "id"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",