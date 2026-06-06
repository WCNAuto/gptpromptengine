---
title: "n8n automation for YouTube to social media distribution 2026: Complete workflow"
description: "Automatically cross-post your YouTube videos to Twitter, LinkedIn, and Facebook with custom captions. Save 45 minutes per upload with this complete n8n workflow."
profession: "YouTubers"
category: "Distribution"
contentType: workflow
tags: ["n8n automation for youtube to social media distribution", "youtube cross posting automation", "social media distribution workflow", "automated video promotion", "youtube to twitter linkedin facebook"]
pubDate: 2026-06-06
featured: false
---

This workflow automatically detects when you publish a new YouTube video and cross-posts it to Twitter, LinkedIn, and Facebook with platform-specific captions and your video thumbnail. Instead of spending 45 minutes manually posting to each platform after every upload, this runs in the background and completes the distribution in under 2 minutes.

## Why this automation matters

Without automation, you manually check YouTube, copy video details, resize thumbnails, write platform-specific captions, and post to each social network separately. One missed platform means lost views and engagement. This workflow eliminates the manual copy-paste cycle and ensures every video reaches all your social audiences within minutes of going live on YouTube.

## What you need before starting

- YouTube Data API v3 credential with access to your channel
- Twitter API v2 credential with tweet creation permissions
- LinkedIn API credential connected to your creator account
- Facebook Graph API credential for your business page
- HTTP Request node capability enabled in your n8n instance
- Google Drive or similar file storage credential for thumbnail processing

## How to build it: step by step

### 1. YouTube Trigger — Monitor for new videos

Node type: YouTube
Operation: Get Channel Videos  
Channel ID: Your YouTube channel ID (found in YouTube Studio > Settings > Channel)
Trigger: Poll every 15 minutes
Output: New video objects with title, description, thumbnail URL, and video ID when detected.
Why this matters: The 15-minute polling ensures your social posts go live quickly without overwhelming the YouTube API rate limits.

### 2. HTTP Request — Download video thumbnail

Node type: HTTP Request
Method: GET
URL: `{{$node["YouTube"].json["snippet"]["thumbnails"]["maxres"]["url"]}}`
Response Format: File
Output: Thumbnail image file binary data passed to social media nodes.
Why this matters: Social platforms perform better with native image uploads rather than external thumbnail links.

### 3. Code — Generate platform-specific captions

Node type: Code
Language: JavaScript
Code: Creates customized captions for Twitter (with hashtags), LinkedIn (professional tone), and Facebook (engaging community language)
Output: Three separate caption strings optimized for each platform's audience and character limits.
Why this matters: Generic captions perform poorly compared to platform-native messaging that matches user expectations.

### 4. Twitter — Post video announcement

Node type: Twitter
Operation: Create Tweet
Text: `{{$node["Code"].json["twitterCaption"]}}`
Media: Attach thumbnail from HTTP Request node
Include Link: `https://youtu.be/{{$node["YouTube"].json["snippet"]["resourceId"]["videoId"]}}`
Output: Posted tweet with engagement tracking data.
Why this matters: Twitter's algorithm favors posts with native images over bare links, increasing reach and click-through rates.

### 5. LinkedIn — Share to company page

Node type: LinkedIn  
Operation: Create Share
Text: `{{$node["Code"].json["linkedinCaption"]}}`
Visibility: Public
Media: Video thumbnail image
Link: YouTube video URL with UTM parameters for LinkedIn traffic tracking
Output: LinkedIn post confirmation with post ID for analytics.
Why this matters: LinkedIn's professional audience responds to longer-form captions and values educational content positioning.

### 6. Facebook — Post to business page

Node type: Facebook Graph API
Operation: Create Page Post
Page ID: Your Facebook business page ID
Message: `{{$node["Code"].json["facebookCaption"]}}`
Attachment: Video thumbnail and YouTube link
Output: Facebook post ID and initial engagement metrics.
Why this matters: Facebook's algorithm prioritizes posts that generate immediate engagement, and custom captions increase comment rates.

## Full workflow JSON

```json
{
  "name": "YouTube to Social Media Distribution",
  "nodes": [
    {
      "parameters": {
        "resource": "channel",
        "operation": "getVideos",
        "channelId": "// Replace with your YouTube channel ID",
        "part": [
          "snippet"
        ],
        "maxResults": 5
      },
      "id": "f8d4c8e0-1234-4567-8901-abcdefghijkl",
      "name": "YouTube",
      "type": "n8n-nodes-base.youTube",
      "typeVersion": 1,
      "position": [
        240,
        300
      ],
      "credentials": {
        "youTubeOAuth2Api": "// Replace with your YouTube credential ID"
      }
    },
    {
      "parameters": {
        "url": "={{$node[\"YouTube\"].json[\"snippet\"][\"thumbnails\"][\"maxres\"][\"url\"]}}",
        "options": {
          "response": {
            "response": {
              "responseFormat": "file"
            }
          }
        }
      },
      "id": "a1b2c3d4-5678-9012-3456-789012345678",
      "name": "Download Thumbnail",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [
        460,
        300
      ]
    },
    {
      "parameters": {
        "jsCode": "const videoTitle = $input.item.json.snippet.title;\nconst videoDescription = $input.item.json.snippet.description;\nconst videoId = $input.item.json.snippet.resourceId.videoId;\nconst videoUrl = `https://youtu.be/${videoId}`;\n\n// Twitter caption (280 char limit)\nconst twitterCaption = `🎥 New video: ${videoTitle.substring(0, 100)}... ${videoUrl} #YouTube #Creator`;\n\n// LinkedIn caption (professional tone)\nconst linkedinCaption = `I just published a new video: \"${videoTitle}\"\n\n${videoDescription.substring(0, 200)}...\n\nWatch here: ${videoUrl}\n\n#ContentCreator #YouTube #Education`;\n\n// Facebook caption (community focused)\nconst facebookCaption = `Hey everyone! 👋 New video is live: \"${videoTitle}\"\n\n${videoDescription.substring(0, 150)}...\n\nLet me know what you think in the comments! 💬\n\n${videoUrl}`;\n\nreturn {\n  twitterCaption,\n  linkedinCaption,\n  facebookCaption,\n  videoTitle,\n  videoUrl,\n  videoId\n};"
      },
      "id": "b2c3d4e5-6789-0123-4567-890123456789",
      "name": "Generate Captions",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [
        680,
        300
      ]
    },
    {
      "parameters": {
        "resource": "tweet",
        "operation": "create",
        "text": "={{$node[\"Generate Captions\"].json[\"twitterCaption\"]}}",
        "additionalFields": {
          "attachments": {
            "media_ids": [
              "={{$node[\"Download Thumbnail\"].json[\"media_id\"]}}"
            ]
          }
        }
      },
      "id": "c3d4e5f6-7890-1234-5678-901234567890",
      "name": "Post to Twitter",
      "type": "n8n-nodes-base.twitter",
      "typeVersion": 2,
      "position": [
        900,
        200
      ],
      "credentials": {
        "twitterOAuth2Api": "// Replace with your Twitter credential ID"
      }
    },
    {
      "parameters": {
        "resource": "share",
        "operation": "create",
        "text": "={{$node[\"Generate Captions\"].json[\"linkedinCaption\"]}}",
        "visibility": "public",
        "additionalFields": {
          "media": {
            "title": "={{$node[\"Generate Captions\"].json[\"videoTitle\"]}}",
            "originalUrl": "={{$node[\"Generate Captions\"].json[\"videoUrl\"]}}"
          }
        }
      },
      "id": "d4e5f6g7-8901-2345-6789-012345678901",
      "name": "Post to LinkedIn",
      "type": "n8n-nodes-base.linkedIn",
      "typeVersion": 1,
      "position": [
        900,
        300
      ],
      "credentials": {
        "linkedInOAuth2Api": "// Replace with your LinkedIn credential ID"
      }
    },
    {
      "parameters": {
        "resource": "page",
        "operation": "createPost",
        "pageId": "// Replace with your Facebook page ID",
        "content": "={{$node[\"Generate Captions\"].json[\"facebookCaption\"]}}",
        "additionalFields": {
          "link": "={{$node[\"Generate Captions\"].json[\"videoUrl\"]}}"
        }
      },
      "id": "e5f6g7h8-9012-3456-7890-123456789012",
      "name": "Post to Facebook",
      "type": "n8n-nodes-base.facebookGraphApi",
      "typeVersion": 1,
      "position": [
        900,
        400
      ],
      "credentials": {
        "facebookGraphApi": "// Replace with your Facebook credential ID"
      }
    }
  ],
  "connections": {
    "YouTube": {
      "main": [
        [
          {
            "node": "Download Thumbnail",
            "type": "main",
            "index": 0
          },
          {
            "node": "Generate Captions",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Generate Captions": {
      "main": [
        [
          {
            "node": "Post to Twitter",
            "type": "main",
            "index": 0
          },
          {
            "node": "Post to LinkedIn",
            "type": "main",
            "index": 0
          },
          {
            "node": "Post to Facebook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "createdAt": "2026-06-06T10:00:00.000Z",
  "id": "12345678-1234-1234-1234-123456789012",
  "settings": {
    "timezone": "America/New_York"
  },
  "tags": [],
  "updatedAt": "2026-06-06T10:00:00.000Z",
  "versionId": "12345678-1234-1234-1234-123456789012"
}
```

## Frequently Asked Questions

### What happens if one social platform is down but the others are working?
Each social media node operates independently. If Twitter fails but LinkedIn and Facebook succeed, the workflow continues and only logs an error for the failed node. You can enable email notifications for failed nodes to retry manual posting to the affected platform.

### How do I customize the captions for my specific brand voice?
Edit the JavaScript code in the "Generate Captions" node. Modify the template strings for twitterCaption, linkedinCaption, and facebookCaption to match your tone, add your specific hashtags, or include your signature phrases. The code preserves video titles and descriptions as variables you can reference.

### Can I add Instagram or TikTok to this workflow?
Instagram requires Facebook Business API integration through your connected Facebook page - add a Facebook Graph API node with Instagram posting operation. TikTok doesn't offer public API access for automated posting as of 2