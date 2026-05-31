```markdown
---
title: "Automate Blog Post to Email Newsletter Conversion with n8n"
description: "Streamline your content marketing by automatically converting blog posts into formatted email newsletters, saving hours of manual work for copywriters."
profession: "Copywriters"
category: "Content Marketing"
contentType: "workflow"
tags: ["email marketing", "blog automation", "newsletter", "content repurposing", "copywriting"]
pubDate: "2026-05-31"
featured: false
---

# Automate Blog Post to Email Newsletter Conversion with n8n

## Why This Automation Matters

As a copywriter, you know that repurposing content across multiple channels is essential for maximizing reach and engagement. However, manually converting blog posts into email newsletters is time-consuming and repetitive. This n8n automation eliminates that burden by automatically:

- Extracting blog post content and formatting it for email
- Creating engaging email subject lines from blog titles
- Adding newsletter-specific elements like CTAs and footer content
- Sending formatted newsletters to your email marketing platform
- Maintaining consistent branding across all communications

This workflow can save you 2-3 hours per newsletter while ensuring consistent quality and formatting across your email campaigns.

## What You Need Before Starting

### Required Tools and Accounts
- **n8n Cloud account** or self-hosted n8n instance
- **WordPress website** or **RSS feed** for blog posts
- **Email marketing platform** (Mailchimp, ConvertKit, or similar)
- **OpenAI API key** for content enhancement (optional but recommended)

### Prerequisites
- Basic understanding of n8n workflows
- Access to your blog's RSS feed or WordPress API
- Email marketing platform API credentials
- Newsletter template or design preferences

### Information to Gather
- Blog RSS feed URL or WordPress site credentials
- Email marketing platform API key
- Newsletter template HTML (if using custom design)
- Default sender information and branding elements

## Complete Node-by-Node Build Instructions

### Step 1: RSS Feed Trigger Node

1. Add an **RSS Read** node as your starting point
2. Configure the following settings:
   - **URL**: Enter your blog's RSS feed URL (e.g., `https://yourblog.com/feed`)
   - **Ignore SSL Issues**: Toggle on if needed
   - **Options > Max Items**: Set to 1 to process the latest post only

### Step 2: Data Processing Node

1. Add a **Code** node after the RSS node
2. Set the mode to "Run Once for All Items"
3. Add this JavaScript code to extract and clean blog data:

```javascript
const items = $input.all();
const processedItems = items.map(item => {
  const data = item.json;
  
  // Extract and clean content
  const title = data.title || '';
  const content = data.contentSnippet || data.content || '';
  const link = data.link || '';
  const pubDate = data.pubDate || new Date().toISOString();
  
  // Clean HTML tags from content
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
  
  // Create email-friendly excerpt (first 200 words)
  const words = cleanContent.split(' ');
  const excerpt = words.slice(0, 200).join(' ') + (words.length > 200 ? '...' : '');
  
  return {
    json: {
      originalTitle: title,
      emailSubject: `📧 ${title}`,
      excerpt: excerpt,
      fullContent: cleanContent,
      blogUrl: link,
      publishDate: pubDate,
      processed: true
    }
  };
});

return processedItems;
```

### Step 3: AI Content Enhancement (Optional)

1. Add an **OpenAI** node for content enhancement
2. Configure settings:
   - **Resource**: Chat
   - **Operation**: Message a Model
   - **Model**: gpt-3.5-turbo or gpt-4
   - **Messages**: Add this system prompt:

```
You are a professional copywriter specializing in email newsletters. Take the provided blog post content and:

1. Create an engaging email subject line (max 50 characters)
2. Write a compelling newsletter introduction (2-3 sentences)
3. Summarize the key points in 3-4 bullet points
4. Add a clear call-to-action encouraging readers to read the full post

Blog Title: {{$json["originalTitle"]}}
Blog Excerpt: {{$json["excerpt"]}}
Blog URL: {{$json["blogUrl"]}}

Respond in JSON format with keys: subject, introduction, keyPoints, cta
```

### Step 4: Newsletter Template Builder

1. Add another **Code** node to build the email template
2. Use this code to create HTML newsletter content:

```javascript
const item = $input.first();
const blogData = item.json;

// Use AI-enhanced content if available, otherwise use processed data
const aiContent = $('OpenAI').first()?.json || {};
const subject = aiContent.subject || blogData.emailSubject;
const intro = aiContent.introduction || `Check out our latest blog post: ${blogData.originalTitle}`;
const keyPoints = aiContent.keyPoints || [blogData.excerpt];
const cta = aiContent.cta || `<a href="${blogData.blogUrl}">Read the full post</a>`;

// Build HTML email template
const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
        .content { padding: 20px 0; }
        .key-points { background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; }
        .cta-button { background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📧 Newsletter Update</h1>
        <p>Fresh from our blog</p>
    </div>
    
    <div class="content">
        <h2>${blogData.originalTitle}</h2>
        <p>${intro}</p>
        
        <div class="key-points">
            <h3>Key Highlights:</h3>
            <ul>
                ${Array.isArray(keyPoints) ? keyPoints.map(point => `<li>${point}</li>`).join('') : `<li>${keyPoints}</li>`}
            </ul>
        </div>
        
        <div style="text-align: center;">
            ${cta}
        </div>
    </div>
    
    <div class="footer">
        <p>This newsletter was automatically generated from our latest blog post.</p>
        <p>Published on: ${new Date(blogData.publishDate).toLocaleDateString()}</p>
    </div>
</body>
</html>
`;

return [{
  json: {
    subject: subject,
    htmlContent: emailHTML,
    textContent: `${blogData.originalTitle}\n\n${intro}\n\n${blogData.excerpt}\n\nRead more: ${blogData.blogUrl}`,
    blogData: blogData
  }
}];
```

### Step 5: Email Platform Integration

1. Add your email marketing platform node (e.g., **Mailchimp** or **ConvertKit**)
2. For Mailchimp configuration:
   - **Resource**: Campaign
   - **Operation**: Create
   - **Type**: Regular
   - **List ID**: Your subscriber list ID
   - **Subject Line**: `{{$json["subject"]}}`
   - **From Name**: Your name/brand
   - **From Email**: Your sending email
   - **HTML Content**: `{{$json["htmlContent"]}}`

### Step 6: Success Notification (Optional)

1. Add a **Slack** or **Discord** node for notifications
2. Configure to send a success message:
   - **Message**: `✅ Newsletter created successfully for: {{$('Code1').item.json["originalTitle"]}}`

## Complete Workflow JSON

```json
{
  "name": "Blog to Newsletter Automation",
  "nodes": [
    {
      "parameters": {
        "url": "https://yourblog.com/feed",
        "options": {
          "maxItems": 1
        }
      },
      "name": "RSS Feed Reader",
      "type": "n8n-nodes-base.rssFeedRead",
      "position": [240, 300],
      "id": "1"
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const items = $input.all();\nconst processedItems = items.map(item => {\n  const data = item.json;\n  \n  const title = data.title || '';\n  const content = data.contentSnippet || data.content || '';\n  const link = data.link || '';\n  const pubDate = data.pubDate || new Date().toISOString();\n  \n  const cleanContent = content.replace(/<[^>]*>/g, '').trim();\n  const words = cleanContent.split(' ');\n  const excerpt = words.slice(0, 200).join(' ') + (words.length > 200 ? '...' : '');\n  \n  return {\n    json: {\n      originalTitle: title,\n      emailSubject: `📧 ${title}`,\n      excerpt: excerpt,\n      fullContent: cleanContent,\n      blogUrl: link,\n      publishDate: pubDate,\n      processed: true\n    }\n  };\n});\n\nreturn processedItems;"
      },
      "name": "Process Blog Data",
      "type": "n8n-nodes-base.code",
      "position": [460, 300],
      "id": "2"
    },
    {
      "parameters": {
        "resource": "chat",
        "operation": "message",
        "model": "gpt-3.5-turbo",
        "messages": {
          "values": [
            {
              "role": "system",
              "content": "You are a professional copywriter specializing in email newsletters. Take the provided blog post content and create: 1) engaging email subject line (max 50 chars), 2) compelling introduction (2-3 sentences), 3) key points in 3-4 bullets, 4) clear call-to-action. Blog Title: {{$json[\"originalTitle\"]}}, Blog Excerpt: {{$json[\"excerpt\"]}}, Blog URL: {{$json[\"blogUrl\"]}}. Respond in JSON format with keys: subject, introduction, keyPoints, cta"
            }
          ]
        },
        "options": {}
      },
      "name": "OpenAI Enhancement",
      "type": "n8n-nodes-base.openAi",
      "position": [680, 300],
      "id": "3"
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "jsCode": "const item = $input.first();\nconst blogData = item.json;\nconst aiContent = $('OpenAI Enhancement').first()?.json || {};\nconst subject = aiContent.subject || blogData.emailSubject;\nconst intro = aiContent.introduction || `Check out our latest blog post: ${blogData.originalTitle}`;\nconst keyPoints = aiContent.keyPoints || [blogData.excerpt];\nconst cta = aiContent.cta || `<a href=\"${blogData.blogUrl}\">Read the full post</a>`;\n\nconst emailHTML = `<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>${subject}</title><style>body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }.header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px; }.content { padding: 20px 0; }.key-points { background: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; }.cta-button { background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }.footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666; text-align: center; }</style></head><body><div class=\"header\"><h1>📧 Newsletter Update</h1><p>Fresh from our blog</p></div><div class=\"content\"><h2>${blogData.originalTitle}</h2><p>${intro}</p><div class=\"key-points\"><h3>Key Highlights:</h3><ul>${Array.isArray(keyPoints) ? keyPoints.map(point => `<li>${point}</li>`).join('') : `<li>${keyPoints}</li>`}</ul></div><div style=\"text-align: center;\">${cta}</div></div><div class=\"footer\"><p>This newsletter was automatically generated from our latest blog post.</p><p>Published on: ${new Date(blogData.publishDate).toLocaleDateString()}</p></div></body></html>`;\n\nreturn [{\n  json: {\n    subject: subject,\n    htmlContent: emailHTML,\n    textContent: `${blogData.originalTitle}\\n\\n${intro}\\n\\n${blogData.excerpt}\\n\\nRead more: ${blogData.blogUrl}`,\n    blogData: blogData\n  }\n}];"
      },
      "name": "Build Email Template",
      "type": "n8n-nodes-base.code",
      "position": [900, 300],
      "id": "4"
    },
    {
      "parameters": {
        "resource": "campaign",
        "operation": "create",
        "type": "regular",
        "listId": "YOUR_LIST_ID",
        "subject": "={{$json[\"subject\"]}}",
        "fromName": "Your Name",
        "fromEmail": "your-email@domain.com",
        "htmlContent": "={{$json[\"htmlContent\"]}}"
      },
      "name": "Send to Mailchimp",
      "type": "n8n-nodes-base.mailchimp",
      "position": [1120, 300],
      "id": "5"
    }
  ],
  "connections": {
    "RSS Feed Reader": {
      "main": [[{"node": "Process Blog Data", "type": "main", "index": 0}]]
    },
    "Process Blog Data": {
      "main": [[{"node": "OpenAI Enhancement", "type": "main", "index": 0}]]
    },
    "OpenAI Enhancement": {
      "main": [[{"node": "Build Email Template", "type": "main", "index": 0}]]
    },
    "Build Email Template": {
      "main": [[{"node": "Send to Mailchimp", "type": "