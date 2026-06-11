---
title: "n8n automation: Transform meeting recordings to structured Notion docs and Google Docs backup in 2026"
description: "Copy-paste n8n workflow that converts meeting recordings into formatted minutes in Notion and Google Docs. Saves 45 minutes of manual note-taking per meeting."
profession: "Operations"
category: "Meetings"
contentType: workflow
tags: ["n8n automation for meeting minutes to notion google docs", "meeting transcription automation", "notion meeting notes workflow", "google docs meeting minutes", "automated note taking"]
pubDate: 2026-06-11
featured: false
---

This workflow automatically converts meeting recordings into structured meeting minutes stored in both Notion and Google Docs. When a recording file is uploaded to a specific Google Drive folder, it transcribes the audio, formats the content into proper meeting minutes, creates a Notion page with the structured content, and generates a Google Doc backup. This replaces 45 minutes of manual transcription and formatting work per meeting.

## Why this automation matters

Manual meeting minute creation involves downloading recordings, transcribing conversations, formatting notes, and distributing them to stakeholders across multiple platforms. Without automation, meeting notes often get delayed by days or contain incomplete information because note-takers miss details while trying to keep up. This workflow ensures every meeting has complete, searchable notes available within 10 minutes of upload.

## What you need before starting

- Google Drive OAuth2 credential with access to the folder containing meeting recordings
- OpenAI API credential for transcription and formatting
- Notion API credential with write access to your meeting notes database
- Google Docs OAuth2 credential for document creation
- A Notion database with properties: Meeting Title (title), Date (date), Attendees (multi-select), Action Items (rich text), Summary (rich text)
- A dedicated Google Drive folder for meeting recordings

## How to build it: step by step

### 1. Google Drive Trigger — Watch for new recording files

Node type: Google Drive Trigger
Trigger Event: File Created
Folder ID: Your meeting recordings folder ID
File Types: mp4, mp3, wav, m4a
Output: Triggers when new audio/video files are uploaded, passing file metadata to the next node.
Why this matters: The file type filter ensures only meeting recordings trigger the workflow, preventing false activations from other documents.

### 2. Google Drive — Download recording file

Node type: Google Drive
Operation: Download File
File ID: {{ $trigger.item.json.id }}
Binary Property Name: recording
Output: Downloads the meeting recording as binary data for transcription processing.
Why this matters: The binary data format is required for OpenAI's transcription API to process the audio content.

### 3. OpenAI — Transcribe meeting audio

Node type: OpenAI
Operation: Transcribe
File: {{ $binary.recording }}
Model: whisper-1
Language: en
Temperature: 0.1
Output: Returns the full transcription text of the meeting conversation.
Why this matters: Low temperature ensures accurate transcription with minimal hallucinations for professional meeting content.

### 4. OpenAI — Structure meeting content

Node type: OpenAI
Operation: Chat
Model: gpt-4
System Message: "You are a professional meeting secretary. Format the provided transcript into structured meeting minutes with: Meeting Title, Date, Attendees list, Key Discussion Points, Action Items with owners, and Executive Summary. Use clear headers and bullet points."
User Message: "Format this meeting transcript into professional minutes:\n\n{{ $node['OpenAI'].json.text }}\n\nMeeting file: {{ $node['Google Drive Trigger'].json.name }}"
Temperature: 0.3
Output: Returns formatted meeting minutes with structured sections ready for publication.
Why this matters: The structured prompt ensures consistent formatting across all meeting minutes for easy scanning and reference.

### 5. Code — Extract structured data

Node type: Code
Language: JavaScript
Code:
```javascript
const content = $node['OpenAI 1'].json.choices[0].message.content;
const fileName = $node['Google Drive Trigger'].json.name;

// Extract meeting title from filename or content
const meetingTitle = fileName.replace(/\.(mp4|mp3|wav|m4a)$/i, '').replace(/_/g, ' ');

// Extract date from filename or use current date
const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/);
const meetingDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

// Parse attendees (look for names after "Attendees:" in content)
const attendeesMatch = content.match(/Attendees:?\s*(.*?)(?=\n\n|\n[A-Z])/s);
const attendees = attendeesMatch ? attendeesMatch[1].split(',').map(name => name.trim()) : [];

// Extract action items
const actionMatch = content.match(/Action Items?:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/s);
const actionItems = actionMatch ? actionMatch[1] : '';

// Extract summary
const summaryMatch = content.match(/(?:Executive )?Summary:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/s);
const summary = summaryMatch ? summaryMatch[1] : '';

return [{
  meetingTitle,
  meetingDate,
  attendees,
  actionItems,
  summary,
  fullContent: content
}];
```
Output: Structured data object with extracted meeting components for Notion and Google Docs creation.
Why this matters: Parsing the content into specific fields allows Notion to properly categorize and make the meeting minutes searchable.

### 6. Notion — Create meeting page

Node type: Notion
Operation: Create Page
Database ID: Your meeting notes database ID
Title: {{ $node['Code'].json.meetingTitle }}
Properties:
- Date: {{ $node['Code'].json.meetingDate }}
- Attendees: {{ $node['Code'].json.attendees }}
- Action Items: {{ $node['Code'].json.actionItems }}
- Summary: {{ $node['Code'].json.summary }}
Page Content: {{ $node['Code'].json.fullContent }}
Output: Creates a new Notion page with structured meeting data and returns the page URL.
Why this matters: Storing data in database properties makes meeting information filterable and allows for automated follow-up workflows.

### 7. Google Docs — Create backup document

Node type: Google Docs
Operation: Create Document
Title: {{ $node['Code'].json.meetingTitle }} - {{ $node['Code'].json.meetingDate }}
Content: {{ $node['Code'].json.fullContent }}
Folder ID: Your meeting docs backup folder ID
Output: Creates a Google Doc with the formatted meeting minutes and returns the document URL.
Why this matters: Google Docs backup ensures meeting minutes remain accessible even if Notion experiences downtime or access issues.

## Full workflow JSON

```json
{
  "name": "Meeting Recording to Notion and Google Docs",
  "nodes": [
    {
      "parameters": {
        "event": "fileCreated",
        "folderId": "// Replace with your Google Drive folder ID",
        "options": {
          "fileTypes": ["mp4", "mp3", "wav", "m4a"]
        }
      },
      "id": "trigger-node",
      "name": "Google Drive Trigger",
      "type": "n8n-nodes-base.googleDriveTrigger",
      "typeVersion": 1,
      "position": [200, 300],
      "webhookId": "auto-generated"
    },
    {
      "parameters": {
        "operation": "download",
        "fileId": "={{ $trigger.item.json.id }}",
        "options": {
          "binaryPropertyName": "recording"
        }
      },
      "id": "download-node",
      "name": "Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 1,
      "position": [400, 300],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "// Replace with your Google Drive credential ID",
          "name": "Google Drive OAuth2"
        }
      }
    },
    {
      "parameters": {
        "operation": "transcribe",
        "inputType": "binary",
        "binaryPropertyName": "recording",
        "model": "whisper-1",
        "options": {
          "language": "en",
          "temperature": 0.1
        }
      },
      "id": "transcribe-node",
      "name": "OpenAI",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [600, 300],
      "credentials": {
        "openAiApi": {
          "id": "// Replace with your OpenAI credential ID",
          "name": "OpenAI API"
        }
      }
    },
    {
      "parameters": {
        "operation": "chat",
        "model": "gpt-4",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "You are a professional meeting secretary. Format the provided transcript into structured meeting minutes with: Meeting Title, Date, Attendees list, Key Discussion Points, Action Items with owners, and Executive Summary. Use clear headers and bullet points."
            },
            {
              "role": "user",
              "content": "=Format this meeting transcript into professional minutes:\n\n{{ $node['OpenAI'].json.text }}\n\nMeeting file: {{ $node['Google Drive Trigger'].json.name }}"
            }
          ]
        },
        "options": {
          "temperature": 0.3
        }
      },
      "id": "format-node",
      "name": "OpenAI1",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [800, 300],
      "credentials": {
        "openAiApi": {
          "id": "// Replace with your OpenAI credential ID",
          "name": "OpenAI API"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const content = $node['OpenAI1'].json.choices[0].message.content;\nconst fileName = $node['Google Drive Trigger'].json.name;\n\nconst meetingTitle = fileName.replace(/\\.(mp4|mp3|wav|m4a)$/i, '').replace(/_/g, ' ');\n\nconst dateMatch = fileName.match(/(\\d{4}-\\d{2}-\\d{2})/);\nconst meetingDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];\n\nconst attendeesMatch = content.match(/Attendees:?\\s*(.*?)(?=\\n\\n|\\n[A-Z])/s);\nconst attendees = attendeesMatch ? attendeesMatch[1].split(',').map(name => name.trim()) : [];\n\nconst actionMatch = content.match(/Action Items?:?\\s*(.*?)(?=\\n\\n|\\n[A-Z]|$)/s);\nconst actionItems = actionMatch ? actionMatch[1] : '';\n\nconst summaryMatch = content.match(/(?:Executive )?Summary:?\\s*(.*?)(?=\\n\\n|\\n[A-Z]|$)/s);\nconst summary = summaryMatch ? summaryMatch[1] : '';\n\nreturn [{\n  meetingTitle,\n  meetingDate,\n  attendees,\n  actionItems,\n  summary,\n  fullContent: content\n}];"
      },
      "id": "parse-node",
      "name": "Code",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1000, 300]
    },
    {
      "parameters": {
        "operation": "create",
        "databaseId": "// Replace with your Notion database ID",
        "title": "={{ $node['Code'].json.meetingTitle }}",
        "propertiesUi": {