---
title: "Automate LinkedIn Job Posting with n8n"
description: "Complete workflow guide for HR managers to automatically post job listings to LinkedIn using n8n automation"
profession: "HR Managers"
category: "Recruitment"
contentType: "workflow"
tags: ["linkedin", "job-posting", "hr", "recruitment", "automation", "social-media"]
pubDate: "2026-05-13"
featured: false
---

# Automate LinkedIn Job Posting with n8n

## Why This Automation Matters

As an HR manager, posting job openings across multiple platforms can be time-consuming and repetitive. This n8n workflow automates the process of posting job listings to LinkedIn, ensuring consistent formatting, reducing manual errors, and freeing up your time for more strategic recruiting activities. The automation can pull job data from your ATS, format it appropriately, and post directly to your company's LinkedIn page.

## What You Need Before Starting

- **n8n instance** (cloud or self-hosted)
- **LinkedIn Company Page** with admin access
- **LinkedIn API credentials** (Client ID and Client Secret)
- **Data source** (Google Sheets, Airtable, or ATS with API)
- **Company LinkedIn Page ID**
- Basic understanding of OAuth 2.0 authentication

### Required Credentials:
1. LinkedIn OAuth2 API credentials
2. Data source credentials (Google Sheets/Airtable)
3. Company Page administrator permissions

## Node-by-Node Build Instructions

### 1. Schedule Trigger Node
- Add **Schedule Trigger** node
- Set interval to run daily at 9:00 AM
- Configure timezone to match your business hours

### 2. Google Sheets Node (Data Source)
- Add **Google Sheets** node
- Connect your Google account
- Select your job postings spreadsheet
- Choose "Read" operation
- Map columns: Job Title, Description, Location, Job Type, Requirements

### 3. IF Node (Check for New Jobs)
- Add **IF** node to filter new job postings
- Set condition: `{{ $json.status }}` equals "Ready to Post"
- This prevents reposting existing jobs

### 4. Set Node (Format Job Data)
- Add **Set** node to structure data for LinkedIn
- Map fields:
  - `jobTitle`: `{{ $json.job_title }}`
  - `jobDescription`: `{{ $json.description }}`
  - `location`: `{{ $json.location }}`
  - `jobType`: `{{ $json.job_type }}`
  - `companyId`: Your LinkedIn Company ID

### 5. HTTP Request Node (LinkedIn API)
- Add **HTTP Request** node
- Method: POST
- URL: `https://api.linkedin.com/v2/shares`
- Authentication: OAuth2
- Headers: 
  - `Content-Type`: `application/json`
  - `X-Restli-Protocol-Version`: `2.0.0`

### 6. LinkedIn Credentials Setup
- Configure OAuth2 with LinkedIn
- Authorization URL: `https://www.linkedin.com/oauth/v2/authorization`
- Access Token URL: `https://www.linkedin.com/oauth/v2/accessToken`
- Scope: `w_member_social,w_organization_social`

### 7. Google Sheets Update Node
- Add another **Google Sheets** node
- Operation: Update
- Update the status column to "Posted"
- Add timestamp of posting

### 8. Slack Notification Node (Optional)
- Add **Slack** node for notifications
- Send confirmation message to HR channel
- Include job title and LinkedIn post link

## Complete Workflow JSON

```json
{
  "name": "LinkedIn Job Posting Automation",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "cronExpression": "0 9 * * *"
            }
          ]
        }
      },
      "name": "Daily Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "operation": "read",
        "sheetId": "YOUR_SHEET_ID",
        "range": "A:H",
        "options": {
          "useHeader": true
        }
      },
      "name": "Get Job Postings",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [460, 300],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "YOUR_GOOGLE_CREDENTIALS_ID",
          "name": "Google Sheets account"
        }
      }
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.status }}",
              "operation": "equal",
              "value2": "Ready to Post"
            }
          ]
        }
      },
      "name": "Check if Ready to Post",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [680, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "jobTitle",
              "value": "={{ $json.job_title }}"
            },
            {
              "name": "location",
              "value": "={{ $json.location }}"
            },
            {
              "name": "jobType",
              "value": "={{ $json.job_type }}"
            },
            {
              "name": "companyId",
              "value": "YOUR_COMPANY_ID"
            }
          ],
          "text": [
            {
              "name": "jobDescription",
              "value": "={{ $json.description }}"
            }
          ]
        }
      },
      "name": "Format Job Data",
      "type": "n8n-nodes-base.set",
      "typeVersion": 1,
      "position": [900, 180]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.linkedin.com/v2/shares",
        "authentication": "predefinedCredentialType",
        "nodeCredentialType": "linkedInOAuth2Api",
        "headers": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "X-Restli-Protocol-Version",
              "value": "2.0.0"
            }
          ]
        },
        "body": {
          "mode": "json",
          "json": "={\n  \"author\": \"urn:li:organization:{{ $json.companyId }}\",\n  \"lifecycleState\": \"PUBLISHED\",\n  \"specificContent\": {\n    \"com.linkedin.ugc.ShareContent\": {\n      \"shareCommentary\": {\n        \"text\": \"🚀 We're hiring! {{ $json.jobTitle }} - {{ $json.location }}\\n\\n{{ $json.jobDescription }}\\n\\n#hiring #jobs #{{ $json.jobType }}\"\n      },\n      \"shareMediaCategory\": \"NONE\"\n    }\n  },\n  \"visibility\": {\n    \"com.linkedin.ugc.MemberNetworkVisibility\": \"PUBLIC\"\n  }\n}"
        }
      },
      "name": "Post to LinkedIn",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 3,
      "position": [1120, 180],
      "credentials": {
        "linkedInOAuth2Api": {
          "id": "YOUR_LINKEDIN_CREDENTIALS_ID",
          "name": "LinkedIn account"
        }
      }
    },
    {
      "parameters": {
        "operation": "update",
        "sheetId": "YOUR_SHEET_ID",
        "range": "H{{ $node[\"Get Job Postings\"].json[\"row_number\"] }}",
        "options": {
          "valueInputOption": "RAW"
        },
        "values": {
          "values": [
            [
              "Posted - {{ $now.format('yyyy-MM-dd HH:mm') }}"
            ]
          ]
        }
      },
      "name": "Update Status",
      "type": "n8n-nodes-base.googleSheets",
      "typeVersion": 3,
      "position": [1340, 180],
      "credentials": {
        "googleSheetsOAuth2Api": {
          "id": "YOUR_GOOGLE_CREDENTIALS_ID",
          "name": "Google Sheets account"
        }
      }
    },
    {
      "parameters": {
        "channel": "#hr-notifications",
        "text": "✅ Job posted to LinkedIn: {{ $node[\"Format Job Data\"].json[\"jobTitle\"] }}",
        "otherOptions": {
          "username": "n8n Bot"
        }
      },
      "name": "Slack Notification",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [1560, 180],
      "credentials": {
        "slackApi": {
          "id": "YOUR_SLACK_CREDENTIALS_ID",
          "name": "Slack account"
        }
      }
    }
  ],
  "connections": {
    "Daily Schedule": {
      "main": [
        [
          {
            "node": "Get Job Postings",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Get Job Postings": {
      "main": [
        [
          {
            "node": "Check if Ready to Post",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Check if Ready to Post": {
      "main": [
        [
          {
            "node": "Format Job Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Job Data": {
      "main": [
        [
          {
            "node": "Post to LinkedIn",
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
            "node": "Update Status",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update Status": {
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
  },
  "active": true,
  "settings": {},
  "createdAt": "2026-05-13T10:00:00.000Z",
  "updatedAt": "2026-05-13T10:00:00.000Z",
  "id": "linkedin-job-posting-workflow"
}
```

## FAQ

**Q: How do I get LinkedIn API credentials for my company?**
A: Visit the LinkedIn Developer Portal, create a new app, select your company page, and request the necessary permissions (w_member_social, w_organization_social). You'll need to verify your company domain and may need LinkedIn's approval for posting permissions.

**Q: Can I customize the job post format and add company branding?**
A: Yes, you can modify the post template in the HTTP Request node's JSON body. Add your company hashtags, emojis, call-to-action links, and customize the text format. You can also include media attachments by modifying the shareMediaCategory section.

**Q: What happens if the LinkedIn API returns an error?**
A: Add an IF node after the LinkedIn post to check for successful responses (status code 201). For errors, you can set up alternative paths to log the error, send notifications, or retry the posting. Consider adding a webhook node to capture failed posts for manual review.

---

Ready to streamline your recruitment process? [Start automating with n8n Cloud](N8N_AFFILIATE_LINK) and transform how you handle job postings across all your channels.