---
title: "AI-Generated Social Media Posts with n8n Automation"
description: "Automate content creation for multiple social platforms using AI and smart scheduling workflows"
profession: "Social Media Managers"
category: "Content Creation"
contentType: "workflow"
tags: ["ai", "social-media", "automation", "content-creation", "scheduling"]
pubDate: "2026-05-30"
featured: false
---

# AI-Generated Social Media Posts with n8n Automation

## Why This Automation Matters

Social media managers spend countless hours creating, adapting, and scheduling content across multiple platforms. This workflow eliminates the repetitive task of content creation by leveraging AI to generate platform-specific posts, automatically adapting tone and format for each channel. The automation can create weeks of content in minutes, maintain consistent posting schedules, and ensure your brand voice remains cohesive across all platforms.

## What You Need Before Starting

- **n8n instance** (self-hosted or cloud)
- **OpenAI API key** for content generation
- **Social media platform credentials** (Twitter, LinkedIn, Facebook, Instagram)
- **Google Sheets** or Airtable account for content management
- **Basic understanding** of API authentication
- **Content guidelines document** for your brand voice

## Complete Node-by-Node Build Instructions

### Node 1: Schedule Trigger
1. Add a **Schedule Trigger** node
2. Set interval to "Custom"
3. Configure cron expression: `0 9 * * 1,3,5` (Monday, Wednesday, Friday at 9 AM)
4. Set timezone to your preferred zone

### Node 2: Google Sheets (Get Content Topics)
1. Add **Google Sheets** node
2. Connect your Google account
3. Set operation to "Read"
4. Select your content planning spreadsheet
5. Choose the sheet containing topic ideas
6. Set range: "A2:D10" (adjust based on your structure)

### Node 3: OpenAI (Generate Content)
1. Add **OpenAI** node
2. Connect your OpenAI API key
3. Set resource to "Text"
4. Operation: "Complete"
5. Model: "gpt-4"
6. Configure prompt:
```
Create 4 social media posts for the topic: "{{ $json.topic }}"

Requirements:
- Twitter: 280 chars, engaging, with hashtags
- LinkedIn: Professional tone, 1-2 paragraphs
- Facebook: Conversational, community-focused
- Instagram: Visual-focused with emoji

Brand voice: {{ $json.brand_voice }}
Target audience: {{ $json.audience }}

Format as JSON with keys: twitter, linkedin, facebook, instagram
```
7. Set max tokens: 1000
8. Temperature: 0.7

### Node 4: Function (Parse AI Response)
1. Add **Function** node
2. Insert JavaScript code:
```javascript
const aiResponse = items[0].json.choices[0].text;
const parsedContent = JSON.parse(aiResponse);

return [{
  json: {
    topic: items[0].json.topic,
    posts: parsedContent,
    generated_at: new Date().toISOString()
  }
}];
```

### Node 5: Google Sheets (Save Generated Content)
1. Add **Google Sheets** node
2. Set operation to "Append"
3. Select your content calendar sheet
4. Map fields:
   - Date: `{{ new Date().toISOString().split('T')[0] }}`
   - Topic: `{{ $json.topic }}`
   - Twitter: `{{ $json.posts.twitter }}`
   - LinkedIn: `{{ $json.posts.linkedin }}`
   - Facebook: `{{ $json.posts.facebook }}`
   - Instagram: `{{ $json.posts.instagram }}`

### Node 6: Switch (Platform Router)
1. Add **Switch** node
2. Mode: "Rules"
3. Create 4 routes:
   - Route 1: Platform equals "twitter"
   - Route 2: Platform equals "linkedin"
   - Route 3: Platform equals "facebook"
   - Route 4: Platform equals "instagram"

### Node 7a: Twitter API (Post Tweet)
1. Add **Twitter** node
2. Authenticate with Twitter API v2
3. Operation: "Create a Tweet"
4. Text: `{{ $json.posts.twitter }}`
5. Add media IDs if images are available

### Node 7b: LinkedIn API (Create Post)
1. Add **LinkedIn** node
2. Connect LinkedIn credentials
3. Operation: "Create a Post"
4. Text: `{{ $json.posts.linkedin }}`
5. Set visibility to "PUBLIC"

### Node 7c: Facebook API (Create Post)
1. Add **Facebook Graph API** node
2. Authenticate with Facebook
3. Operation: "POST"
4. Resource: "/me/feed"
5. Message: `{{ $json.posts.facebook }}`

### Node 7d: Instagram API (Create Media)
1. Add **Instagram** node
2. Connect Instagram Business account
3. Operation: "Create Media"
4. Caption: `{{ $json.posts.instagram }}`
5. Media type: "IMAGE" or "VIDEO"

### Node 8: Merge (Combine Results)
1. Add **Merge** node
2. Mode: "Combine All"
3. Connect all platform posting nodes

### Node 9: Slack Notification (Optional)
1. Add **Slack** node
2. Connect Slack workspace
3. Operation: "Send Message"
4. Channel: "#social-media"
5. Message: 
```
✅ AI Content Posted Successfully!
Topic: {{ $json.topic }}
Platforms: Twitter, LinkedIn, Facebook, Instagram
Generated at: {{ $json.generated_at }}
```

## Full Workflow JSON Code

```json
{
  "name": "AI Social Media Content Generator",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * 1,3,5"
            }
          ]
        }
      },
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [
        240,
        300
      ]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "operation": "read",
        "documentId": "your-spreadsheet-id",
        "sheetName": "Topics",
        "range": "A2:D10"
      },
      "name": "Get Content Topics",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [
        460,
        300
      ]
    },
    {
      "parameters": {
        "resource": "text",
        "operation": "complete",
        "model": "gpt-4",
        "prompt": "Create 4 social media posts for the topic: \"{{ $json.topic }}\"\n\nRequirements:\n- Twitter: 280 chars, engaging, with hashtags\n- LinkedIn: Professional tone, 1-2 paragraphs\n- Facebook: Conversational, community-focused\n- Instagram: Visual-focused with emoji\n\nBrand voice: {{ $json.brand_voice }}\nTarget audience: {{ $json.audience }}\n\nFormat as JSON with keys: twitter, linkedin, facebook, instagram",
        "maxTokens": 1000,
        "temperature": 0.7
      },
      "name": "Generate AI Content",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [
        680,
        300
      ]
    },
    {
      "parameters": {
        "functionCode": "const aiResponse = items[0].json.choices[0].text;\nconst parsedContent = JSON.parse(aiResponse);\n\nreturn [{\n  json: {\n    topic: items[0].json.topic,\n    posts: parsedContent,\n    generated_at: new Date().toISOString()\n  }\n}];"
      },
      "name": "Parse AI Response",
      "type": "n8n-nodes-base.function",
      "typeVersion": 1,
      "position": [
        900,
        300
      ]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "operation": "append",
        "documentId": "your-content-calendar-id",
        "sheetName": "Generated Content",
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Date": "{{ new Date().toISOString().split('T')[0] }}",
            "Topic": "{{ $json.topic }}",
            "Twitter": "{{ $json.posts.twitter }}",
            "LinkedIn": "{{ $json.posts.linkedin }}",
            "Facebook": "{{ $json.posts.facebook }}",
            "Instagram": "{{ $json.posts.instagram }}"
          }
        }
      },
      "name": "Save to Content Calendar",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [
        1120,
        300
      ]
    },
    {
      "parameters": {
        "mode": "rules",
        "rules": {
          "values": [
            {
              "conditions": {
                "all": [
                  {
                    "value1": "twitter",
                    "value2": "twitter"
                  }
                ]
              }
            },
            {
              "conditions": {
                "all": [
                  {
                    "value1": "linkedin",
                    "value2": "linkedin"
                  }
                ]
              }
            },
            {
              "conditions": {
                "all": [
                  {
                    "value1": "facebook",
                    "value2": "facebook"
                  }
                ]
              }
            },
            {
              "conditions": {
                "all": [
                  {
                    "value1": "instagram",
                    "value2": "instagram"
                  }
                ]
              }
            }
          ]
        }
      },
      "name": "Platform Router",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [
        1340,
        300
      ]
    },
    {
      "parameters": {
        "operation": "tweet",
        "text": "{{ $json.posts.twitter }}"
      },
      "name": "Post to Twitter",
      "type": "n8n-nodes-base.twitter",
      "typeVersion": 1,
      "position": [
        1560,
        200
      ]
    },
    {
      "parameters": {
        "operation": "create",
        "postAs": "person",
        "text": "{{ $json.posts.linkedin }}"
      },
      "name": "Post to LinkedIn",
      "type": "n8n-nodes-base.linkedIn",
      "typeVersion": 1,
      "position": [
        1560,
        300
      ]
    },
    {
      "parameters": {
        "operation": "create",
        "message": "{{ $json.posts.facebook }}"
      },
      "name": "Post to Facebook",
      "type": "n8n-nodes-base.facebookGraphApi",
      "typeVersion": 1,
      "position": [
        1560,
        400
      ]
    },
    {
      "parameters": {
        "operation": "uploadImage",
        "caption": "{{ $json.posts.instagram }}"
      },
      "name": "Post to Instagram",
      "type": "n8n-nodes-base.instagram",
      "typeVersion": 1,
      "position": [
        1560,
        500
      ]
    },
    {
      "parameters": {
        "mode": "combine",
        "combinationMode": "combineAll"
      },
      "name": "Merge Platform Results",
      "type": "n8n-nodes-base.merge",
      "typeVersion": 2,
      "position": [
        1780,
        350
      ]
    },
    {
      "parameters": {
        "channel": "#social-media",
        "text": "✅ AI Content Posted Successfully!\nTopic: {{ $json.topic }}\nPlatforms: Twitter, LinkedIn, Facebook, Instagram\nGenerated at: {{ $json.generated_at }}"
      },
      "name": "Slack Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [
        2000,
        350
      ]
    }
  ],
  "connections": {
    "Schedule Trigger": {
      "main": [
        [
          {
            "node": "Get Content Topics",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Content Topics": {
      "main": [
        [
          {
            "node": "Generate AI Content",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate AI Content": {
      "main": [
        [
          {
            "node": "Parse AI Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Parse AI Response": {
      "main": [
        [
          {
            "node": "Save to Content Calendar",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Save to Content Calendar": {
      "main": [
        [
          {
            "node": "Platform Router",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Platform Router": {
      "main": [
        [
          {
            "node": "Post to Twitter",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Post to LinkedIn",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Post to Facebook",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Post to Instagram",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Post to Twitter": {
      "main": [
        [
          {
            "node": "Merge Platform Results",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Post to LinkedIn": {
      "main": [
        [
          {
            "node": "Merge Platform Results",
            "type": "main",
            "index": 1
          }
        ]
      ]
    },
    "Post to Facebook": {
      "main": [
        [
          {
            "node": "Merge Platform Results",
            "type": "main",
            "index": 2
          }
        ]
      ]
    },
    "Post to Instagram": {
      "main": [
        [
          {
            "node": "Merge Platform Results",
            "type": "main",
            "index": 3
          }
        ]
      ]
    },
    "Merge Platform Results": {
      "main": [
        [
          {
            "node": "Slack Notification",
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

### How can I customize the AI-generated content for my brand voice?
Modify the OpenAI prompt to include specific brand guidelines, tone preferences, and style requirements. You can also add a separate