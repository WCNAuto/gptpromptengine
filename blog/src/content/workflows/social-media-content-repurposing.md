---
title: "Automate Blog to Social Media Post Repurposing with n8n"
description: "Complete n8n workflow guide for Social Media Managers to automatically transform blog content into engaging social media posts across multiple platforms"
profession: "Social Media Manager"
category: "Content Marketing"
contentType: "workflow"
tags: ["social media", "content repurposing", "automation", "blog", "AI", "scheduling"]
pubDate: "2026-05-30"
featured: false
---

# Automate Blog to Social Media Post Repurposing with n8n

## Why This Automation Matters

As a Social Media Manager, you know that consistent, high-quality content is the backbone of successful social media strategy. However, creating unique posts for every platform is time-consuming and often leads to burnout. This n8n automation solves that challenge by:

- **Maximizing Content ROI**: Transform one blog post into multiple social media assets
- **Maintaining Platform-Specific Optimization**: Automatically adapt content length, tone, and format for each platform
- **Ensuring Consistent Posting**: Schedule content across all platforms simultaneously
- **Saving 5+ Hours Weekly**: Eliminate manual content repurposing tasks
- **Improving Engagement**: Use AI to optimize messaging for each platform's audience

This workflow monitors your blog's RSS feed, extracts key insights, generates platform-specific content using AI, and schedules posts across Twitter, LinkedIn, and Facebook automatically.

## What You Need Before Starting

### Required Tools & Accounts
- **n8n Cloud or Self-hosted Instance**: Active n8n installation
- **OpenAI API Key**: For AI-powered content generation
- **RSS Feed**: Your blog's RSS feed URL
- **Social Media Platform APIs**:
  - Twitter API v2 credentials
  - LinkedIn API credentials
  - Facebook Graph API credentials
- **Scheduling Tool** (Optional): Buffer, Hootsuite, or similar for advanced scheduling

### Prerequisites
- Basic understanding of n8n workflows
- Admin access to your social media accounts
- Blog with active RSS feed
- Content strategy guidelines for each platform

### Estimated Setup Time
45-60 minutes

## Complete Node-by-Node Build Instructions

### Step 1: Set Up the RSS Feed Trigger

1. **Add RSS Feed Read Node**
   - Search for "RSS Feed Read" in the node panel
   - Drag it to your workflow canvas
   - Configure the node:
     - **URL**: Enter your blog's RSS feed URL
     - **Trigger Rules**: Set to "Poll every 1 hour"
     - **Property to Return**: Select "All Items"

### Step 2: Filter New Blog Posts

1. **Add IF Node**
   - Connect it to the RSS Feed Read node
   - Configure conditions:
     - **Condition Type**: Date/Time
     - **Value 1**: `{{ $json.pubDate }}`
     - **Operation**: "After"
     - **Value 2**: `{{ DateTime.now().minus({hours: 2}).toISO() }}`

### Step 3: Extract Blog Content

1. **Add HTTP Request Node**
   - Connect to the IF node's "true" branch
   - Configure:
     - **Method**: GET
     - **URL**: `{{ $json.link }}`
     - **Headers**: Add "User-Agent": "Mozilla/5.0..."
   
2. **Add HTML Extract Node**
   - Connect to HTTP Request node
   - Configure:
     - **Extraction Type**: "CSS Selector"
     - **CSS Selector**: "article, .content, .post-content" (adjust for your blog)
     - **Return**: "Text"

### Step 4: Generate Platform-Specific Content with AI

1. **Add OpenAI Node (Twitter Content)**
   - Connect to HTML Extract node
   - Configure:
     - **Resource**: "Text"
     - **Operation**: "Complete"
     - **Model**: "gpt-3.5-turbo"
     - **Prompt**: 
     ```
     Based on this blog post, create an engaging Twitter thread (3-5 tweets):
     
     Blog Title: {{ $node["RSS Feed Read"].json["title"] }}
     Blog Content: {{ $json.extractedText }}
     
     Requirements:
     - First tweet should be a hook with the main insight
     - Include relevant hashtags
     - Keep each tweet under 280 characters
     - Include emojis where appropriate
     - End with a call-to-action to read the full blog
     
     Format as numbered tweets.
     ```

2. **Add OpenAI Node (LinkedIn Content)**
   - Duplicate the previous OpenAI node
   - Modify the prompt:
     ```
     Transform this blog post into a professional LinkedIn post:
     
     Blog Title: {{ $node["RSS Feed Read"].json["title"] }}
     Blog Content: {{ $json.extractedText }}
     
     Requirements:
     - Professional tone, engaging hook
     - 1300-3000 characters
     - Include 3-5 relevant hashtags
     - Add industry insights
     - Include call-to-action to read full article
     - Structure with line breaks for readability
     ```

3. **Add OpenAI Node (Facebook Content)**
   - Duplicate and modify for Facebook:
     ```
     Create an engaging Facebook post from this blog content:
     
     Blog Title: {{ $node["RSS Feed Read"].json["title"] }}
     Blog Content: {{ $json.extractedText }}
     
     Requirements:
     - Conversational, engaging tone
     - 500-1000 characters
     - Include question to drive engagement
     - Add 2-3 relevant hashtags
     - Include call-to-action
     - Use emojis appropriately
     ```

### Step 5: Format and Structure Content

1. **Add Function Node (Content Formatter)**
   - Connect all OpenAI nodes to this node
   - Add this JavaScript code:
   ```javascript
   const twitterContent = $input.all().find(item => item.json.choices[0].message.content.includes('1.')).json.choices[0].message.content;
   const linkedinContent = $input.all().find(item => item.json.choices[0].message.content.includes('#')).json.choices[0].message.content;
   const facebookContent = $input.all().find(item => !item.json.choices[0].message.content.includes('1.') && !item.json.choices[0].message.content.includes('Requirements:')).json.choices[0].message.content;
   
   return [
     {
       json: {
         platform: 'twitter',
         content: twitterContent,
         blogTitle: $node["RSS Feed Read"].json["title"],
         blogUrl: $node["RSS Feed Read"].json["link"],
         publishTime: new Date().toISOString()
       }
     },
     {
       json: {
         platform: 'linkedin',
         content: linkedinContent,
         blogTitle: $node["RSS Feed Read"].json["title"],
         blogUrl: $node["RSS Feed Read"].json["link"],
         publishTime: new Date().toISOString()
       }
     },
     {
       json: {
         platform: 'facebook',
         content: facebookContent,
         blogTitle: $node["RSS Feed Read"].json["title"],
         blogUrl: $node["RSS Feed Read"].json["link"],
         publishTime: new Date().toISOString()
       }
     }
   ];
   ```

### Step 6: Split and Route to Platforms

1. **Add Item Lists Node**
   - Connect to Function node
   - This will split the array into individual items

2. **Add IF Node (Platform Router)**
   - Connect to Item Lists node
   - Create three branches:
     - Twitter: `{{ $json.platform === "twitter" }}`
     - LinkedIn: `{{ $json.platform === "linkedin" }}`
     - Facebook: `{{ $json.platform === "facebook" }}`

### Step 7: Publish to Social Platforms

1. **Add Twitter Node**
   - Connect to Twitter branch of IF node
   - Configure:
     - **Operation**: "Create Tweet"
     - **Text**: `{{ $json.content }}`

2. **Add LinkedIn Node**
   - Connect to LinkedIn branch
   - Configure:
     - **Operation**: "Create Post"
     - **Text**: `{{ $json.content }}`
     - **Visibility**: "PUBLIC"

3. **Add Facebook Node**
   - Connect to Facebook branch
   - Configure:
     - **Operation**: "Create Post"
     - **Message**: `{{ $json.content }}`

### Step 8: Add Monitoring and Notifications

1. **Add Slack Node (Success Notification)**
   - Connect all social platform nodes
   - Configure:
     - **Channel**: "#social-media"
     - **Text**: 
     ```
     ✅ Blog post automatically repurposed!
     
     📝 Blog: {{ $json.blogTitle }}
     🔗 URL: {{ $json.blogUrl }}
     📱 Platform: {{ $json.platform }}
     ⏰ Published: {{ $json.publishTime }}
     ```

2. **Add Error Handling**
   - Add Error Trigger node
   - Connect to Slack node for error notifications

## Full Workflow JSON Code Block

```json
{
  "name": "Blog to Social Media Repurposing",
  "nodes": [
    {
      "parameters": {
        "url": "https://yourblog.com/rss",
        "options": {
          "ignoreSSL": true
        }
      },
      "id": "863c4525-3a9e-4c59-8b1e-8d5c7a9e8f3c",
      "name": "RSS Feed Read",
      "type": "n8n-nodes-base.rssFeedRead",
      "typeVersion": 1,
      "position": [240, 300],
      "alwaysOutputData": true
    },
    {
      "parameters": {
        "conditions": {
          "dateTime": [
            {
              "value1": "={{ $json.pubDate }}",
              "operation": "after",
              "value2": "={{ DateTime.now().minus({hours: 2}).toISO() }}"
            }
          ]
        }
      },
      "id": "d5f7e9a1-2b3c-4d5e-6f7a-8b9c0d1e2f3a",
      "name": "Filter New Posts",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "={{ $json.link }}",
        "options": {
          "headers": {
            "user-agent": "Mozilla/5.0 (compatible; n8n)"
          }
        }
      },
      "id": "f1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6",
      "name": "Fetch Blog Content",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [680, 300]
    },
    {
      "parameters": {
        "dataType": "string",
        "value1": "={{ $json.data }}",
        "extractionValues": {
          "values": [
            {
              "key": "content",
              "cssSelector": "article, .content, .post-content",
              "returnValue": "text"
            }
          ]
        }
      },
      "id": "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
      "name": "Extract Content",
      "type": "n8n-nodes-base.htmlExtract",
      "typeVersion": 1,
      "position": [900, 300]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "messageValues": [
            {
              "role": "user",
              "message": "=Based on this blog post, create an engaging Twitter thread (3-5 tweets):\n\nBlog Title: {{ $node[\"RSS Feed Read\"].json[\"title\"] }}\nBlog Content: {{ $json.content }}\n\nRequirements:\n- First tweet should be a hook with the main insight\n- Include relevant hashtags\n- Keep each tweet under 280 characters\n- Include emojis where appropriate\n- End with a call-to-action to read the full blog\n\nFormat as numbered tweets."
            }
          ]
        }
      },
      "id": "b2c3d4e5-f6a7-b8c9-d0e1-f2a3b4c5d6e7",
      "name": "Generate Twitter Content",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1120, 180]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "messageValues": [
            {
              "role": "user",
              "message": "=Transform this blog post into a professional LinkedIn post:\n\nBlog Title: {{ $node[\"RSS Feed Read\"].json[\"title\"] }}\nBlog Content: {{ $json.content }}\n\nRequirements:\n- Professional tone, engaging hook\n- 1300-3000 characters\n- Include 3-5 relevant hashtags\n- Add industry insights\n- Include call-to-action to read full article\n- Structure with line breaks for readability"
            }
          ]
        }
      },
      "id": "c3d4e5f6-a7b8-c9d0-e1f2-a3b4c5d6e7f8",
      "name": "Generate LinkedIn Content",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "model": "gpt-3.5-turbo",
        "messages": {
          "messageValues": [
            {
              "role": "user",
              "message": "=Create an engaging Facebook post from this blog content:\n\nBlog Title: {{ $node[\"RSS Feed Read\"].json[\"title\"] }}\nBlog Content: {{ $json.content }}\n\nRequirements:\n- Conversational, engaging tone\n- 500-1000 characters\n- Include question to drive engagement\n- Add 2-3 relevant hashtags\n- Include call-to-action\n- Use emojis appropriately"
            }
          ]
        }
      },
      "id": "d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9",
      "name": "Generate Facebook Content",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1120, 420]
    },
    {
      "parameters": {
        "jsCode": "const items = $input.all();\nconst rssData = $node[\"RSS Feed Read\"].json;\n\nconst results = [];\n\nfor (let i = 0; i < items.length; i++) {\n  const content = items[i].json.choices[0].message.content;\n  let platform;\n  \n  if (content.includes('1.') && content.includes('thread')) {\n    platform = 'twitter';\n  } else if (content.includes('LinkedIn') || content.length > 1000) {\n    platform = 'linkedin';\n  } else {\n    platform = 'facebook';\n  }\n  \n  results.push({\n    json: {\n      platform: platform,\n      content: content,\n      blogTitle: rssData.title,\n      blogUrl: rssData.link