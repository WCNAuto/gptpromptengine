---
title: "n8n Workflow: YouTube Video to Blog Post Automation (2026 Complete Setup)"
description: "Copy this n8n workflow JSON to auto-convert YouTube videos to blog posts using AI transcription and formatting. Save 2+ hours per video in 2026."
profession: "YouTubers"
category: "Repurposing"
contentType: workflow
tags: ["n8n workflow youtube video to blog post automation", "youtube to blog automation", "video transcription to text", "automated content repurposing", "youtube seo blog posts"]
pubDate: 2026-06-06
featured: false
---

This workflow automatically converts your YouTube videos into SEO-optimized blog posts by extracting the video URL from a Google Sheet, transcribing the audio with OpenAI Whisper, formatting it into blog structure with GPT-4, and publishing directly to your WordPress site. It saves you 2+ hours of manual transcription and formatting work per video.

## Why this automation matters

Without this workflow, you're manually downloading video files, running them through transcription tools, copying and pasting into word processors, reformatting for web readability, adding SEO elements, and uploading to WordPress. One missed step means a video never becomes a blog post, losing potential search traffic. This workflow ensures every video in your content calendar becomes a published blog post within 30 minutes of adding the YouTube URL to your tracking sheet.

## What you need before starting

- Google Sheets OAuth2 credential connected to a sheet with YouTube URLs in column A
- OpenAI credential with GPT-4 and Whisper API access
- WordPress credential for your blog site
- YouTube Data API v3 credential for video metadata extraction
- n8n Cloud account or self-hosted instance running version 1.45+

## How to build it: step by step

### 1. Google Sheets Trigger — Monitor new video URLs

Node type: Google Sheets Trigger
Operation: On Row Added
Document: Your content calendar sheet
Sheet: Sheet1
Trigger On: Row Added
Output: Fires when a new row with YouTube URL is added, passing the row data to the next node.
Why this matters: The trigger only activates for new entries, preventing the workflow from reprocessing old videos.

### 2. YouTube Data API — Extract video metadata

Node type: HTTP Request
Method: GET
URL: `https://www.googleapis.com/youtube/v3/videos?id={{$json["A"]}}&part=snippet&key={{$credentials.youtube_api.key}}`
Authentication: Use YouTube API credential
Output: Returns video title, description, and thumbnail URL as JSON.
Why this matters: The video metadata becomes the foundation for your blog post title and meta description.

### 3. HTTP Request — Download video audio

Node type: HTTP Request
Method: GET
URL: `https://api.youtubedl-org.com/api/download?url={{$json["A"]}}&format=bestaudio`
Headers: User-Agent: n8n-workflow
Output: Returns direct download link to MP3 audio file.
Why this matters: OpenAI Whisper requires audio files, not video URLs, for transcription.

### 4. OpenAI — Transcribe audio to text

Node type: OpenAI
Operation: Transcribe
Model: whisper-1
File: Use the audio URL from previous node
Response Format: text
Language: en
Output: Returns full transcript as plain text.
Why this matters: Raw transcription captures everything you said, including filler words and run-on sentences that need formatting.

### 5. OpenAI — Format transcript into blog post

Node type: OpenAI
Operation: Message a Model
Model: gpt-4
System Message: "Convert this video transcript into an SEO-optimized blog post. Add headings, bullet points, and paragraphs. Remove filler words. Keep the conversational tone but make it readable."
User Message: "Video title: {{$node["YouTube Data API"].json["items"][0]["snippet"]["title"]}} \n\nTranscript: {{$node["OpenAI"].json["text"]}}"
Max Tokens: 3000
Output: Returns formatted blog post with HTML structure.
Why this matters: GPT-4 transforms rambling speech into scannable web content while preserving your voice and key points.

### 6. WordPress — Publish blog post

Node type: WordPress
Operation: Create Post
Site URL: Your WordPress site
Title: {{$node["YouTube Data API"].json["items"][0]["snippet"]["title"]}}
Content: {{$node["OpenAI1"].json["choices"][0]["message"]["content"]}}
Status: publish
Categories: Video Content
Featured Media: Use thumbnail URL from YouTube metadata
Output: Returns published post URL and WordPress post ID.
Why this matters: Direct publishing eliminates the copy-paste step and ensures the post goes live immediately with proper SEO elements.

## Full workflow JSON

```json
{
  "name": "YouTube to Blog Post Automation",
  "nodes": [
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": "// Replace with your Google Sheets document ID",
        "sheetName": "Sheet1",
        "columnToMatchOn": "A",
        "valueToMatchOn": "={{ $json.url }}",
        "options": {}
      },
      "id": "google-sheets-trigger",
      "name": "Google Sheets Trigger",
      "type": "n8n-nodes-base.googleSheetsTrigger",
      "typeVersion": 2,
      "position": [240, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "// Replace with your Google Sheets credential ID",
          "name": "Google Sheets OAuth2"
        }
      }
    },
    {
      "parameters": {
        "url": "=https://www.googleapis.com/youtube/v3/videos?id={{ $json.A.split('v=')[1].split('&')[0] }}&part=snippet&key={{ $credentials.youtubeApi.key }}",
        "options": {}
      },
      "id": "youtube-metadata",
      "name": "YouTube Data API",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [460, 300],
      "credentials": {
        "youtubeApi": {
          "id": "// Replace with your YouTube API credential ID",
          "name": "YouTube API"
        }
      }
    },
    {
      "parameters": {
        "url": "=https://api.youtubedl-org.com/api/download?url={{ $json.A }}&format=bestaudio",
        "options": {
          "headers": {
            "User-Agent": "n8n-workflow"
          }
        }
      },
      "id": "download-audio",
      "name": "Download Audio",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "operation": "transcribe",
        "model": "whisper-1",
        "file": "={{ $json.download_url }}",
        "options": {
          "response_format": "text",
          "language": "en"
        }
      },
      "id": "transcribe-audio",
      "name": "Transcribe Audio",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [900, 300],
      "credentials": {
        "openAiApi": {
          "id": "// Replace with your OpenAI credential ID",
          "name": "OpenAI"
        }
      }
    },
    {
      "parameters": {
        "model": "gpt-4",
        "messages": {
          "messageValues": [
            {
              "role": "system",
              "content": "Convert this video transcript into an SEO-optimized blog post. Add headings, bullet points, and paragraphs. Remove filler words. Keep the conversational tone but make it readable."
            },
            {
              "role": "user",
              "content": "=Video title: {{ $node[\"YouTube Data API\"].json[\"items\"][0][\"snippet\"][\"title\"] }}\n\nTranscript: {{ $node[\"Transcribe Audio\"].json[\"text\"] }}"
            }
          ]
        },
        "options": {
          "max_tokens": 3000
        }
      },
      "id": "format-blog-post",
      "name": "Format Blog Post",
      "type": "n8n-nodes-base.openAi",
      "typeVersion": 1,
      "position": [1120, 300],
      "credentials": {
        "openAiApi": {
          "id": "// Replace with your OpenAI credential ID",
          "name": "OpenAI"
        }
      }
    },
    {
      "parameters": {
        "operation": "create",
        "resource": "post",
        "title": "={{ $node[\"YouTube Data API\"].json[\"items\"][0][\"snippet\"][\"title\"] }}",
        "content": "={{ $node[\"Format Blog Post\"].json[\"choices\"][0][\"message\"][\"content\"] }}",
        "status": "publish",
        "categories": "Video Content",
        "featuredMedia": "={{ $node[\"YouTube Data API\"].json[\"items\"][0][\"snippet\"][\"thumbnails\"][\"high\"][\"url\"] }}"
      },
      "id": "publish-wordpress",
      "name": "Publish to WordPress",
      "type": "n8n-nodes-base.wordpress",
      "typeVersion": 1,
      "position": [1340, 300],
      "credentials": {
        "wordpressApi": {
          "id": "// Replace with your WordPress credential ID",
          "name": "WordPress"
        }
      }
    }
  ],
  "connections": {
    "Google Sheets Trigger": {
      "main": [
        [
          {
            "node": "YouTube Data API",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "YouTube Data API": {
      "main": [
        [
          {
            "node": "Download Audio",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Download Audio": {
      "main": [
        [
          {
            "node": "Transcribe Audio",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Transcribe Audio": {
      "main": [
        [
          {
            "node": "Format Blog Post",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Blog Post": {
      "main": [
        [
          {
            "node": "Publish to WordPress",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Frequently Asked Questions

### What happens if the YouTube video is private or deleted?
The YouTube Data API node will return an empty response, causing the workflow to stop before attempting transcription. Add an IF node after the YouTube API call to check if the response contains video data, and route failed attempts to a different Google Sheets tab for manual review.

### Can I customize the blog post formatting beyond the GPT-4 prompt?
Yes, modify the System Message in the "Format Blog Post" node to include specific instructions like "Add exactly 3 H2 headings" or "Include a FAQ section at the end." You can also add a second OpenAI node to generate SEO meta descriptions using the formatted content.

### How do I handle videos longer than OpenAI's file size limit?
The workflow will fail on videos over 25MB audio files. Add an HTTP Request node before transcription to check the audio file size, and route large files through a different path that splits the audio into chunks using FFmpeg before sending to Whisper.

---

Ready to run this in production? [Start your free n8n Cloud trial](https://n8n.io/) and