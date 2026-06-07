---
title: "N8N Workflow for Automated CV Screening HR: Filter CVs by Keywords and Score Candidates 2026"
description: "Copy-paste n8n workflow that automatically scores CVs from Google Drive against job requirements and sends ranked candidate lists to hiring managers."
profession: "HR Managers"
category: "Recruitment"
contentType: workflow
tags: ["n8n workflow for automated cv screening hr", "automated resume screening workflow", "cv filtering automation", "candidate scoring n8n", "hr recruitment automation"]
pubDate: 2026-06-07
featured: false
---

This workflow automatically screens CVs uploaded to a Google Drive folder, scores them against predefined job requirements, and emails hiring managers a ranked list of top candidates. Connects Google Drive, OpenAI, and Gmail to replace 2-3 hours of manual CV review per job posting.

## Why this automation matters

Manual CV screening means reading through 50-200 applications per role, checking each against job requirements, and creating shortlists. Without automation, qualified candidates get overlooked in large applicant pools, and hiring managers wait days for initial screening results. This workflow processes all CVs within 10 minutes of upload and delivers consistent scoring criteria across all applications.

## What you need before starting

- Google Drive OAuth2 credential with access to your CV upload folder
- OpenAI API credential with GPT-4 access
- Gmail OAuth2 credential for the account that sends hiring manager notifications
- Google Drive folder where CVs are uploaded (note the folder ID from the URL)
- Gmail account authorized to send emails on behalf of HR

## How to build it: step by step

### 1. Google Drive Trigger — Detect new CV uploads

Node type: Google Drive Trigger
Event: File Created
Folder ID: [Your CV upload folder ID from Drive URL]
File Types: PDF, DOC, DOCX
Output: Fires when a new CV file is uploaded, passing file metadata to the next node.
Why this matters: The folder-specific trigger ensures only relevant CV uploads start the screening process, not other HR documents.

### 2. Google Drive — Download CV content

Node type: Google Drive
Operation: Download
File ID: `{{ $json.id }}`
Binary Property: cvData
Output: Downloads the actual CV file content as binary data for text extraction.
Why this matters: The workflow needs the file content, not just metadata, to analyze candidate qualifications.

### 3. Extract Text — Convert CV to readable text

Node type: Extract from File
Input Binary Field: cvData
Output Binary Field: cvText
File Type: Auto-detect
Output: Converts PDF/DOC files to plain text that the AI can process.
Why this matters: AI models require text input, not binary file formats.

### 4. OpenAI — Score CV against requirements

Node type: OpenAI
Operation: Text Completion
Model: gpt-4
System Message: "You are an HR screening assistant. Score CVs from 1-100 based on job requirements. Return only a JSON object with score, strengths (max 3), weaknesses (max 2), and recommendation (yes/no/maybe)."
User Message: `Score this CV for a [Software Developer] role requiring: [JavaScript, React, 3+ years experience, team leadership]. CV content: {{ $node["Extract Text"].json.text }}`
Max Tokens: 500
Temperature: 0.3
Output: Returns structured JSON with candidate score and assessment details.
Why this matters: Consistent AI scoring eliminates bias and applies the same criteria to every candidate.

### 5. Set Variables — Store candidate data

Node type: Set
Fields to Set:
- candidateName: `{{ $node["Google Drive Trigger"].json.name.split('.')[0] }}`
- score: `{{ $node["OpenAI"].json.choices[0].message.content.score }}`
- strengths: `{{ $node["OpenAI"].json.choices[0].message.content.strengths }}`
- recommendation: `{{ $node["OpenAI"].json.choices[0].message.content.recommendation }}`
- fileName: `{{ $node["Google Drive Trigger"].json.name }}`
Output: Structured candidate data ready for email formatting.
Why this matters: Clean data structure makes the email template readable and professional.

### 6. IF — Filter qualified candidates

Node type: IF
Condition: `{{ $json.score >= 70 }}`
Output: Only candidates scoring 70+ proceed to notification email.
Why this matters: Prevents hiring manager overload by filtering out clearly unqualified applicants.

### 7. Gmail — Send candidate notification

Node type: Gmail
Operation: Send Email
To: hiring-manager@company.com
Subject: `New Qualified Candidate: {{ $json.candidateName }} (Score: {{ $json.score }})`
Email Type: HTML
Body: 
```html
<h3>New CV Screening Result</h3>
<p><strong>Candidate:</strong> {{ $json.candidateName }}</p>
<p><strong>AI Score:</strong> {{ $json.score }}/100</p>
<p><strong>Recommendation:</strong> {{ $json.recommendation }}</p>
<p><strong>Key Strengths:</strong></p>
<ul>
{{#each strengths}}
<li>{{ this }}</li>
{{/each}}
</ul>
<p><strong>File:</strong> {{ $json.fileName }}</p>
```
Output: Sends formatted email with candidate assessment to hiring manager.
Why this matters: Immediate notification means hiring managers can contact top candidates before competitors do.

## Full workflow JSON

```json
{
  "name": "Automated CV Screening",
  "nodes": [
    {
      "parameters": {
        "event": "file.created",
        "folderId": "// Replace with your Google Drive folder ID",
        "options": {
          "fileTypes": ["pdf", "doc", "docx"]
        }
      },
      "id": "1",
      "name": "Google Drive Trigger",
      "type": "n8n-nodes-base.googleDriveTrigger",
      "typeVersion": 1,
      "position": [200, 300],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "// Replace with your Google Drive credential ID",
          "name": "Google Drive Account"
        }
      }
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $json.id }}",
        "options": {
          "binaryPropertyName": "cvData"
        }
      },
      "id": "2",
      "name": "Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 1,
      "position": [400, 300],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "// Replace with your Google Drive credential ID",
          "name": "Google Drive Account"
        }
      }
    },
    {
      "parameters": {
        "inputBinaryField": "cvData",
        "outputBinaryField": "cvText"
      },
      "id": "3",
      "name": "Extract Text",
      "type": "n8n-nodes-base.extractFromFile",
      "typeVersion": 1,
      "position": [600, 300]
    },
    {
      "parameters": {
        "operation": "text",
        "model": "gpt-4",
        "messages": [
          {
            "role": "system",
            "content": "You are an HR screening assistant. Score CVs from 1-100 based on job requirements. Return only a JSON object with score, strengths (max 3), weaknesses (max 2), and recommendation (yes/no/maybe)."
          },
          {
            "role": "user", 
            "content": "Score this CV for a Software Developer role requiring: JavaScript, React, 3+ years experience, team leadership. CV content: {{ $node[\"Extract Text\"].json.text }}"
          }
        ],
        "options": {
          "maxTokens": 500,
          "temperature": 0.3
        }
      },
      "id": "4",
      "name": "OpenAI",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [800, 300],
      "credentials": {
        "openAiApi": {
          "id": "// Replace with your OpenAI credential ID",
          "name": "OpenAI Account"
        }
      }
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "candidateName",
              "value": "={{ $node[\"Google Drive Trigger\"].json.name.split('.')[0] }}"
            },
            {
              "name": "fileName", 
              "value": "={{ $node[\"Google Drive Trigger\"].json.name }}"
            }
          ],
          "number": [
            {
              "name": "score",
              "value": "={{ JSON.parse($node[\"OpenAI\"].json.choices[0].message.content).score }}"
            }
          ],
          "object": [
            {
              "name": "strengths",
              "value": "={{ JSON.parse($node[\"OpenAI\"].json.choices[0].message.content).strengths }}"
            },
            {
              "name": "recommendation", 
              "value": "={{ JSON.parse($node[\"OpenAI\"].json.choices[0].message.content).recommendation }}"
            }
          ]
        }
      },
      "id": "5",
      "name": "Set Variables",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [1000, 300]
    },
    {
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.score }}",
              "operation": "largerEqual",
              "value2": 70
            }
          ]
        }
      },
      "id": "6",
      "name": "IF",
      "type": "n8n-nodes-base.if", 
      "typeVersion": 1,
      "position": [1200, 300]
    },
    {
      "parameters": {
        "operation": "send",
        "email": "hiring-manager@company.com",
        "subject": "New Qualified Candidate: {{ $json.candidateName }} (Score: {{ $json.score }})",
        "emailType": "html",
        "message": "<h3>New CV Screening Result</h3><p><strong>Candidate:</strong> {{ $json.candidateName }}</p><p><strong>AI Score:</strong> {{ $json.score }}/100</p><p><strong>Recommendation:</strong> {{ $json.recommendation }}</p><p><strong>Key Strengths:</strong></p><ul>{{ $json.strengths.map(s => '<li>' + s + '</li>').join('') }}</ul><p><strong>File:</strong> {{ $json.fileName }}</p>"
      },
      "id": "7",
      "name": "Gmail",
      "type": "n8n-nodes-base.gmail",
      "typeVersion": 1, 
      "position": [1400, 220],
      "credentials": {
        "gmailOAuth2": {
          "id": "// Replace with your Gmail credential ID",
          "name": "Gmail Account"
        }
      }
    }
  ],
  "connections": {
    "Google Drive Trigger": {
      "main": [
        [
          {
            "node": "Google Drive",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Drive": {
      "main": [
        [
          {
            "node": "Extract Text",
            "type": "main", 
            "index": 0
          }
        ]
      ]
    },
    "Extract Text": {
      "main": [
        [
          {
            "node": "OpenAI",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },