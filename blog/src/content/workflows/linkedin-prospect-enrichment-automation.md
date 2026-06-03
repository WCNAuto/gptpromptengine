---
title: "LinkedIn Prospect Enrichment Automation with n8n"
description: "Automatically enrich prospect data from LinkedIn profiles using n8n workflow automation to streamline your sales process and improve lead quality."
profession: "Sales"
category: "Lead Generation"
contentType: "workflow"
tags: ["linkedin", "prospect-enrichment", "sales-automation", "lead-generation", "crm"]
pubDate: "2026-06-03"
featured: false
---

# LinkedIn Prospect Enrichment Automation with n8n

## Why This Automation Matters

Manually researching and enriching prospect data from LinkedIn is time-consuming and prone to errors. This workflow automates the entire process, allowing sales professionals to:

- **Save 3-4 hours per day** on manual prospect research
- **Increase data accuracy** by eliminating manual copy-paste errors
- **Scale outreach efforts** by processing multiple prospects simultaneously
- **Maintain updated CRM records** with fresh LinkedIn data
- **Focus on selling** instead of data entry tasks

The automation pulls comprehensive prospect information including job titles, company details, contact information, and social profiles, then organizes everything directly into your CRM or database.

## What You Need Before Starting

### Required Tools and Accounts
- **n8n Cloud or self-hosted instance** (v1.0+)
- **LinkedIn Sales Navigator** (recommended) or LinkedIn Premium account
- **CRM system** (HubSpot, Salesforce, Pipedrive, or Airtable)
- **Email enrichment service** (Hunter.io, Apollo, or ZeroBounce)

### Required Credentials
- LinkedIn session cookies or API access
- CRM API credentials
- Email enrichment service API key
- Google Sheets API (optional for backup storage)

### Preparation Steps
1. Set up your LinkedIn account with Sales Navigator access
2. Create API credentials for your chosen CRM platform
3. Obtain API key from email enrichment service
4. Prepare a list of LinkedIn profile URLs or company domains
5. Configure webhook URL for real-time processing (optional)

## Complete Node-by-Node Build Instructions

### Node 1: Manual Trigger
1. Add a **Manual Trigger** node to start the workflow
2. Configure the trigger to accept prospect data input
3. Set up the following input fields:
   - `linkedin_url` (LinkedIn profile URL)
   - `company_name` (Company name)
   - `prospect_name` (Full name)

### Node 2: LinkedIn Data Extraction
1. Add an **HTTP Request** node
2. Configure the following settings:
   - **Method**: GET
   - **URL**: `{{ $json.linkedin_url }}`
   - **Headers**: Add User-Agent and LinkedIn session cookies
3. Set up authentication using LinkedIn session cookies
4. Configure error handling for rate limiting

### Node 3: HTML Parser
1. Add a **HTML Extract** node
2. Extract the following data points:
   - Name: CSS selector `.text-heading-xlarge`
   - Job Title: CSS selector `.text-body-medium`
   - Company: CSS selector `.pv-entity__secondary-title`
   - Location: CSS selector `.text-body-small`
   - About: CSS selector `.pv-about__summary-text`

### Node 4: Company Enrichment
1. Add another **HTTP Request** node for company data
2. Configure to call Clearbit or similar company API:
   - **Method**: GET
   - **URL**: `https://company.clearbit.com/v2/companies/find?domain={{ $json.company_domain }}`
   - **Headers**: Add Authorization with Clearbit API key
3. Extract company size, industry, and funding information

### Node 5: Email Discovery
1. Add **HTTP Request** node for Hunter.io
2. Configure email finding:
   - **Method**: GET
   - **URL**: `https://api.hunter.io/v2/email-finder?domain={{ $json.company_domain }}&first_name={{ $json.first_name }}&last_name={{ $json.last_name }}&api_key={{ $credentials.hunter_api_key }}`
3. Set up email verification and confidence scoring

### Node 6: Data Transformation
1. Add a **Set** node to clean and structure data
2. Map the following fields:
   - `full_name`: Cleaned prospect name
   - `email`: Verified email address
   - `job_title`: Standardized job title
   - `company_name`: Company name
   - `company_size`: Employee count
   - `industry`: Company industry
   - `linkedin_url`: Original LinkedIn URL
   - `location`: Geographic location
   - `enrichment_date`: Current timestamp

### Node 7: CRM Integration
1. Add your CRM node (HubSpot/Salesforce/Pipedrive)
2. Configure to create or update contact:
   - **Operation**: Create or Update Contact
   - **Map fields** from the Set node output
   - **Set duplicate handling** to update existing records
3. Configure lead scoring based on enriched data

### Node 8: Backup to Google Sheets
1. Add **Google Sheets** node as backup storage
2. Configure to append row with enriched data
3. Set up the following columns:
   - Name, Email, Job Title, Company, Industry, LinkedIn URL, Date Added

### Node 9: Slack Notification
1. Add **Slack** node for team notifications
2. Configure message with enriched prospect summary:
   - Prospect name and company
   - Job title and email found
   - LinkedIn profile link
   - CRM record link

### Node 10: Error Handling
1. Add **IF** node to check for missing data
2. Configure fallback HTTP Request for alternative data sources
3. Set up email alerts for failed enrichments
4. Add retry logic for API rate limits

## Complete Workflow JSON

```json
{
  "name": "LinkedIn Prospect Enrichment",
  "nodes": [
    {
      "parameters": {},
      "id": "manual-trigger",
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [240, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "={{ $json.linkedin_url }}",
        "options": {
          "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        }
      },
      "id": "linkedin-scrape",
      "name": "LinkedIn Scraper",
      "type": "n8n-nodes-base.httpRequest",
      "position": [460, 300],
      "typeVersion": 3
    },
    {
      "parameters": {
        "dataPropertyName": "data",
        "extractionValues": {
          "values": [
            {
              "key": "name",
              "cssSelector": ".text-heading-xlarge",
              "returnValue": "text"
            },
            {
              "key": "title",
              "cssSelector": ".text-body-medium",
              "returnValue": "text"
            },
            {
              "key": "company",
              "cssSelector": ".pv-entity__secondary-title",
              "returnValue": "text"
            },
            {
              "key": "location",
              "cssSelector": ".text-body-small",
              "returnValue": "text"
            }
          ]
        }
      },
      "id": "html-parser",
      "name": "Parse LinkedIn Data",
      "type": "n8n-nodes-base.htmlExtract",
      "position": [680, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "https://company.clearbit.com/v2/companies/find",
        "qs": {
          "domain": "={{ $json.company_domain }}"
        },
        "authentication": "headerAuth",
        "options": {}
      },
      "id": "company-enrichment",
      "name": "Enrich Company Data",
      "type": "n8n-nodes-base.httpRequest",
      "position": [900, 300],
      "typeVersion": 3,
      "credentials": {
        "httpHeaderAuth": {
          "id": "clearbit-auth",
          "name": "Clearbit API"
        }
      }
    },
    {
      "parameters": {
        "url": "https://api.hunter.io/v2/email-finder",
        "qs": {
          "domain": "={{ $json.company_domain }}",
          "first_name": "={{ $json.first_name }}",
          "last_name": "={{ $json.last_name }}",
          "api_key": "={{ $credentials.hunter_api_key }}"
        }
      },
      "id": "email-finder",
      "name": "Find Email",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1120, 300],
      "typeVersion": 3
    },
    {
      "parameters": {
        "values": {
          "string": [
            {
              "name": "full_name",
              "value": "={{ $json.name }}"
            },
            {
              "name": "email",
              "value": "={{ $json.email }}"
            },
            {
              "name": "job_title",
              "value": "={{ $json.title }}"
            },
            {
              "name": "company_name",
              "value": "={{ $json.company }}"
            },
            {
              "name": "linkedin_url",
              "value": "={{ $json.linkedin_url }}"
            },
            {
              "name": "enrichment_date",
              "value": "={{ $now }}"
            }
          ]
        },
        "options": {}
      },
      "id": "data-transform",
      "name": "Transform Data",
      "type": "n8n-nodes-base.set",
      "position": [1340, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "operation": "upsert",
        "objectType": "contact",
        "matchingColumns": [
          "email"
        ],
        "values": {
          "email": "={{ $json.email }}",
          "firstname": "={{ $json.first_name }}",
          "lastname": "={{ $json.last_name }}",
          "jobtitle": "={{ $json.job_title }}",
          "company": "={{ $json.company_name }}",
          "linkedin_url": "={{ $json.linkedin_url }}"
        }
      },
      "id": "crm-update",
      "name": "Update CRM",
      "type": "n8n-nodes-base.hubspot",
      "position": [1560, 300],
      "typeVersion": 1,
      "credentials": {
        "hubspotApi": {
          "id": "hubspot-creds",
          "name": "HubSpot Account"
        }
      }
    },
    {
      "parameters": {
        "operation": "appendOrUpdate",
        "documentId": {
          "__rl": true,
          "value": "1ABC123DEF456GHI789JKL",
          "mode": "id"
        },
        "sheetName": {
          "__rl": true,
          "value": "gid=0",
          "mode": "id"
        },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Name": "={{ $json.full_name }}",
            "Email": "={{ $json.email }}",
            "Job Title": "={{ $json.job_title }}",
            "Company": "={{ $json.company_name }}",
            "LinkedIn": "={{ $json.linkedin_url }}",
            "Date": "={{ $json.enrichment_date }}"
          }
        }
      },
      "id": "sheets-backup",
      "name": "Backup to Sheets",
      "type": "n8n-nodes-base.googleSheets",
      "position": [1780, 300],
      "typeVersion": 4
    },
    {
      "parameters": {
        "channel": "sales-prospects",
        "text": "🎯 New prospect enriched!\n*{{ $json.full_name }}* at {{ $json.company_name }}\n📧 {{ $json.email }}\n💼 {{ $json.job_title }}\n🔗 {{ $json.linkedin_url }}",
        "otherOptions": {
          "mrkdwn": true
        }
      },
      "id": "slack-notification",
      "name": "Slack Notification",
      "type": "n8n-nodes-base.slack",
      "position": [2000, 300],
      "typeVersion": 1,
      "credentials": {
        "slackApi": {
          "id": "slack-creds",
          "name": "Slack Workspace"
        }
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [
        [
          {
            "node": "LinkedIn Scraper",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "LinkedIn Scraper": {
      "main": [
        [
          {
            "node": "Parse LinkedIn Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Parse LinkedIn Data": {
      "main": [
        [
          {
            "node": "Enrich Company Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Enrich Company Data": {
      "main": [
        [
          {
            "node": "Find Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Find Email": {
      "main": [
        [
          {
            "node": "Transform Data",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Transform Data": {
      "main": [
        [
          {
            "node": "Update CRM",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Update CRM": {
      "main": [
        [
          {
            "node": "Backup to Sheets",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Backup to Sheets": {
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
  "settings": {
    "timezone": "America/New_York"
  }
}
```

## Frequently Asked Questions

### How do I handle LinkedIn's rate limiting and avoid getting blocked?

LinkedIn has strict anti-scraping measures, so implement these safeguards:
- Add random delays between requests (2-5 seconds)
- Use residential proxies or rotate IP addresses
- Limit to 50-100 profiles per hour maximum
- Use proper browser headers and session cookies
- Consider using LinkedIn's official Sales Navigator API when available
- Implement exponential backoff for failed requests

### What should I do if the email enrichment services can't find contact information?

When email discovery fails, set up these fallback strategies:
- Try multiple email enrichment services (Hunter.io, Apollo, ZeroBounce)
- Use company domain patterns (firstname.lastname@company.com)
- Check for contact forms or alternative social profiles
- Flag prospects for manual research by sales team
- Store partial data and retry enrichment later
- Use the workflow to prioritize prospects with complete data

### How can I customize this workflow for different sales processes or CRM systems?

The workflow is highly adaptable:
- **CRM Integration**: