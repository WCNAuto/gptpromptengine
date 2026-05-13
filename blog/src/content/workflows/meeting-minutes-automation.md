---
title: "Automated Meeting Minutes to Notion Integration"
description: "Streamline your operations workflow by automatically capturing and organizing meeting minutes in Notion, eliminating manual note-taking and ensuring consistent documentation."
profession: "Operations"
category: "Documentation Automation"
contentType: "workflow"
tags: ["notion", "meeting-minutes", "operations", "automation", "documentation"]
pubDate: "2026-05-13"
featured: false
---

# Automated Meeting Minutes to Notion Integration

## Why This Automation Matters

Operations professionals spend countless hours manually transcribing, formatting, and organizing meeting minutes. This workflow eliminates that bottleneck by automatically capturing meeting content and creating structured, searchable records in Notion. You'll save 2-3 hours per week while ensuring no critical action items or decisions slip through the cracks. The automation maintains consistent formatting across all meeting records, making it easier to track progress and reference past discussions.

## What You Need Before Starting

### Required Accounts & Credentials
- n8n instance (cloud or self-hosted)
- Notion workspace with admin access
- Notion integration token
- Meeting platform with webhook capability (Zoom, Teams, or Google Meet)

### Prerequisites
- Basic understanding of n8n workflow creation
- Notion database for meeting minutes (create one with properties: Title, Date, Attendees, Summary, Action Items)
- Meeting transcription service access (optional but recommended)

### API Keys & Tokens
- Notion Internal Integration Token
- Meeting platform API credentials
- Webhook URLs configured in your meeting platform

## Complete Node-by-Node Build Instructions

### Node 1: Webhook Trigger
1. Add a **Webhook** node as your starting point
2. Set HTTP Method to `POST`
3. Copy the webhook URL for later configuration
4. Set Response Code to `200`
5. Configure Response Data as `JSON`

### Node 2: Extract Meeting Data
1. Add a **Code** node after the webhook
2. Set it to run for "Each Item"
3. Add this JavaScript code to extract meeting information:
```javascript
const meetingData = $input.item.json;

return {
  meeting_title: meetingData.topic || 'Untitled Meeting',
  meeting_date: meetingData.start_time,
  duration: meetingData.duration,
  attendees: meetingData.participants || [],
  recording_url: meetingData.recording_url,
  transcript: meetingData.transcript || ''
};
```

### Node 3: Process Transcript (Optional)
1. Add a **HTTP Request** node for AI processing
2. Set Method to `POST`
3. Configure URL for your preferred AI service (OpenAI, Claude)
4. In the body, send the transcript for summarization
5. Request structured output with action items, decisions, and key points

### Node 4: Format Attendees List
1. Add another **Code** node
2. Transform attendees array into readable format:
```javascript
const attendees = $input.item.json.attendees;
const formattedAttendees = attendees.map(person => person.name || person.email).join(', ');

return {
  ...items[0].json,
  attendees_formatted: formattedAttendees
};
```

### Node 5: Create Notion Page
1. Add **Notion** node
2. Select "Create a database item"
3. Choose your meeting minutes database
4. Map fields:
   - Title: `{{ $node["Extract Meeting Data"].json.meeting_title }}`
   - Date: `{{ $node["Extract Meeting Data"].json.meeting_date }}`
   - Attendees: `{{ $node["Format Attendees List"].json.attendees_formatted }}`
   - Summary: `{{ $node["Process Transcript"].json.summary }}`
   - Action Items: `{{ $node["Process Transcript"].json.action_items }}`

### Node 6: Error Handling
1. Add **If** node connected to error output
2. Set condition to check if Notion creation failed
3. Add **Email** or **Slack** node to notify about failures
4. Include meeting details and error message in notification

### Node 7: Success Notification
1. Add final **Slack** or **Email** node for success path
2. Send confirmation with link to created Notion page
3. Include meeting title and date in message

## Full Workflow JSON Code

```json
{
  "name": "Meeting Minutes to Notion",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "meeting-webhook",
        "responseMode": "onReceived",
        "responseCode": 200,
        "responseData": "json"
      },
      "id": "webhook-trigger",
      "name": "Meeting Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "const meetingData = $input.item.json;\n\nreturn {\n  meeting_title: meetingData.topic || 'Untitled Meeting',\n  meeting_date: meetingData.start_time,\n  duration: meetingData.duration,\n  attendees: meetingData.participants || [],\n  recording_url: meetingData.recording_url,\n  transcript: meetingData.transcript || ''\n};"
      },
      "id": "extract-data",
      "name": "Extract Meeting Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "openAiApi",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "gpt-3.5-turbo"
            },
            {
              "name": "messages",
              "value": "[{\"role\": \"system\", \"content\": \"Summarize this meeting transcript into key points, decisions, and action items.\"}, {\"role\": \"user\", \"content\": \"{{ $json.transcript }}\"}]"
            }
          ]
        }
      },
      "id": "process-transcript",
      "name": "Process Transcript",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "const attendees = $input.item.json.attendees;\nconst formattedAttendees = attendees.map(person => person.name || person.email).join(', ');\n\nreturn {\n  ...items[0].json,\n  attendees_formatted: formattedAttendees\n};"
      },
      "id": "format-attendees",
      "name": "Format Attendees",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "operation": "create",
        "resource": "databaseItem",
        "databaseId": "your-database-id",
        "properties": {
          "Title": {
            "title": [
              {
                "text": {
                  "content": "={{ $node['Extract Meeting Data'].json.meeting_title }}"
                }
              }
            ]
          },
          "Date": {
            "date": {
              "start": "={{ $node['Extract Meeting Data'].json.meeting_date }}"
            }
          },
          "Attendees": {
            "rich_text": [
              {
                "text": {
                  "content": "={{ $node['Format Attendees'].json.attendees_formatted }}"
                }
              }
            ]
          }
        }
      },
      "id": "create-notion-page",
      "name": "Create Notion Page",
      "type": "n8n-nodes-base.notion",
      "typeVersion": 2,
      "position": [1120, 300]
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
              "id": "error-check",
              "leftValue": "={{ $json.error }}",
              "rightValue": "",
              "operator": {
                "type": "string",
                "operation": "notExists"
              }
            }
          ]
        }
      },
      "id": "check-success",
      "name": "Check Success",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [1340, 300]
    },
    {
      "parameters": {
        "channel": "#operations",
        "text": "✅ Meeting minutes created: {{ $node['Extract Meeting Data'].json.meeting_title }}",
        "otherOptions": {}
      },
      "id": "success-notification",
      "name": "Success Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 2,
      "position": [1560, 200]
    }
  ],
  "pinData": {},
  "connections": {
    "Meeting Webhook": {
      "main": [
        [
          {
            "node": "Extract Meeting Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Extract Meeting Data": {
      "main": [
        [
          {
            "node": "Process Transcript",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Transcript": {
      "main": [
        [
          {
            "node": "Format Attendees",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Attendees": {
      "main": [
        [
          {
            "node": "Create Notion Page",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Create Notion Page": {
      "main": [
        [
          {
            "node": "Check Success",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check Success": {
      "main": [
        [
          {
            "node": "Success Notification",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "1",
  "meta": {
    "templateCredsSetupCompleted": true
  },
  "id": "meeting-minutes-automation",
  "tags": []
}
```

## FAQ

### How do I handle different meeting platforms?
The workflow is designed to be platform-agnostic. Configure your meeting platform (Zoom, Teams, Google Meet) to send webhook data to your n8n webhook URL. You may need to adjust the data extraction code in the "Extract Meeting Data" node based on your platform's payload structure. Most platforms provide similar data points: meeting title, participants, date, and transcript.

### What if my meeting doesn't have automatic transcription?
You can still use this workflow by manually uploading transcripts or audio files. Add a File Trigger node as an alternative entry point, then use a transcription service like Whisper API or Rev.com to convert audio to text before processing. The workflow will handle the text the same way once transcribed.

### Can I customize the Notion database structure?
Absolutely! Modify the "Create Notion Page" node to match your specific database properties. You can add fields for meeting type, project tags, priority levels, or custom status tracking. Just ensure your Notion database has the corresponding properties created, and update the mapping in the node configuration.

---

Ready to streamline your meeting documentation process? [Start automating with n8n Cloud](N8N_AFFILIATE_LINK) and never manually type meeting minutes again!