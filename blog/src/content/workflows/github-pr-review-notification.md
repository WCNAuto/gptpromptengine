---
title: "Automated GitHub Pull Request Review Workflow"
description: "Streamline your code review process with automated PR analysis, quality checks, and team notifications using n8n"
profession: "Developers"
category: "Development"
contentType: "workflow"
tags: ["github", "pull-request", "code-review", "automation", "ci-cd", "quality-assurance"]
pubDate: "2026-06-01"
featured: false
---

## Why This Automation Matters

Managing pull requests efficiently is crucial for maintaining code quality and team productivity. This n8n workflow automates the initial review process by performing quality checks, analyzing code changes, and notifying relevant team members. It reduces manual overhead, ensures consistent review standards, and accelerates the development cycle while maintaining high code quality.

Benefits include:
- Automated code quality assessment
- Intelligent reviewer assignment based on file changes
- Standardized review checklist enforcement
- Real-time notifications to stakeholders
- Reduced time-to-review for pull requests

## What You Need Before Starting

### Prerequisites
- n8n instance (cloud or self-hosted)
- GitHub repository with admin access
- GitHub Personal Access Token with repo permissions
- Slack workspace (optional, for notifications)
- Basic understanding of GitHub API and webhooks

### Required Credentials
- GitHub credentials (Personal Access Token)
- Slack credentials (if using Slack notifications)
- Webhook URL from your n8n instance

### Repository Setup
- Enable GitHub webhooks in your repository settings
- Configure webhook to trigger on pull request events
- Ensure your repository has a CODEOWNERS file (optional)

## Complete Node-by-Node Build Instructions

### Node 1: Webhook Trigger
1. Add a **Webhook** node as your starting point
2. Set the HTTP Method to **POST**
3. Copy the webhook URL for GitHub configuration
4. Set Response Mode to **Respond to Webhook**
5. Configure Response Data to return status confirmation

### Node 2: GitHub PR Data Extraction
1. Add a **Code** node after the webhook
2. Set the language to **JavaScript**
3. Extract PR data from the webhook payload:
   - Pull request number
   - Repository information
   - Changed files
   - Author details
   - Base and head branches

### Node 3: Filter PR Events
1. Add an **IF** node to filter relevant events
2. Configure conditions:
   - Action equals "opened" OR "synchronize"
   - Pull request state equals "open"
   - Skip draft pull requests (optional)

### Node 4: Get Changed Files
1. Add a **GitHub** node
2. Set Operation to **Get**
3. Resource: **Pull Request**
4. Configure to fetch files changed in the PR
5. Map the repository owner, name, and PR number from previous nodes

### Node 5: Code Quality Analysis
1. Add a **Code** node for quality checks
2. Implement checks for:
   - File size limits
   - Code complexity indicators
   - Naming conventions
   - Documentation requirements
   - Test file presence

### Node 6: Determine Reviewers
1. Add another **Code** node
2. Implement logic to assign reviewers based on:
   - Changed file paths
   - CODEOWNERS file content
   - Team expertise areas
   - Workload balancing

### Node 7: Create Review Checklist
1. Add a **Code** node
2. Generate a standardized checklist based on:
   - File types changed
   - Feature/bugfix classification
   - Security considerations
   - Performance impact areas

### Node 8: Post Review Comment
1. Add a **GitHub** node
2. Set Operation to **Create**
3. Resource: **Issue Comment**
4. Post automated analysis results and checklist
5. Include reviewer assignments and quality metrics

### Node 9: Request Reviewers
1. Add another **GitHub** node
2. Set Operation to **Update**
3. Resource: **Pull Request**
4. Add determined reviewers to the PR
5. Set appropriate labels based on analysis

### Node 10: Slack Notification (Optional)
1. Add a **Slack** node
2. Configure to send notifications to:
   - Team channels
   - Individual reviewers
   - Project stakeholders
3. Include PR summary and review assignments

### Node 11: Error Handling
1. Add an **IF** node to check for errors
2. Connect error paths from critical nodes
3. Configure fallback notifications
4. Log errors for debugging

## Full Workflow JSON Code Block

```json
{
  "name": "Automated GitHub PR Review",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "responseMode": "respondToWebhook",
        "responseData": "allEntries",
        "responseBinaryPropertyName": "",
        "options": {}
      },
      "name": "GitHub Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "auto-pr-review"
    },
    {
      "parameters": {
        "jsCode": "const payload = $input.first().json;\nconst action = payload.action;\nconst pullRequest = payload.pull_request;\nconst repository = payload.repository;\n\nreturn [{\n  json: {\n    action: action,\n    pr_number: pullRequest.number,\n    pr_title: pullRequest.title,\n    pr_body: pullRequest.body,\n    author: pullRequest.user.login,\n    base_branch: pullRequest.base.ref,\n    head_branch: pullRequest.head.ref,\n    repo_owner: repository.owner.login,\n    repo_name: repository.name,\n    draft: pullRequest.draft,\n    state: pullRequest.state,\n    html_url: pullRequest.html_url\n  }\n}];"
      },
      "name": "Extract PR Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "leftValue": "",
            "caseSensitive": true,
            "typeValidation": "strict"
          },
          "conditions": [
            {
              "id": "condition1",
              "leftValue": "={{ $json.action }}",
              "rightValue": "opened",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            },
            {
              "id": "condition2",
              "leftValue": "={{ $json.action }}",
              "rightValue": "synchronize",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ],
          "combinator": "or"
        },
        "options": {}
      },
      "name": "Filter PR Events",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "resource": "pullRequest",
        "operation": "getFiles",
        "owner": {
          "__rl": true,
          "value": "={{ $json.repo_owner }}",
          "mode": "name"
        },
        "repository": {
          "__rl": true,
          "value": "={{ $json.repo_name }}",
          "mode": "name"
        },
        "pullRequestNumber": "={{ $json.pr_number }}"
      },
      "name": "Get Changed Files",
      "type": "n8n-nodes-base.github",
      "typeVersion": 1,
      "position": [900, 300],
      "credentials": {
        "githubApi": {
          "id": "github-credentials",
          "name": "GitHub API"
        }
      }
    },
    {
      "parameters": {
        "jsCode": "const files = $input.all().map(item => item.json);\nconst qualityIssues = [];\nconst metrics = {\n  totalFiles: files.length,\n  additions: 0,\n  deletions: 0,\n  largeFiles: [],\n  missingTests: false,\n  hasDocumentation: false\n};\n\nfiles.forEach(file => {\n  metrics.additions += file.additions;\n  metrics.deletions += file.changes;\n  \n  // Check for large files\n  if (file.changes > 500) {\n    metrics.largeFiles.push(file.filename);\n    qualityIssues.push(`Large file detected: ${file.filename} (${file.changes} lines)`);\n  }\n  \n  // Check for test files\n  if (file.filename.includes('.test.') || file.filename.includes('.spec.')) {\n    metrics.hasTests = true;\n  }\n  \n  // Check for documentation\n  if (file.filename.includes('README') || file.filename.includes('.md')) {\n    metrics.hasDocumentation = true;\n  }\n});\n\n// Flag if no tests found for code changes\nconst hasCodeChanges = files.some(f => \n  f.filename.endsWith('.js') || \n  f.filename.endsWith('.ts') || \n  f.filename.endsWith('.py')\n);\n\nif (hasCodeChanges && !metrics.hasTests) {\n  qualityIssues.push('No test files detected for code changes');\n}\n\nreturn [{\n  json: {\n    qualityIssues,\n    metrics,\n    files: files.map(f => f.filename)\n  }\n}];"
      },
      "name": "Analyze Code Quality",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "jsCode": "const files = $json.files;\nconst reviewers = [];\nconst labels = ['needs-review'];\n\n// Simple reviewer assignment logic\nconst teamMapping = {\n  frontend: ['john-doe', 'jane-smith'],\n  backend: ['bob-wilson', 'alice-brown'],\n  devops: ['charlie-davis'],\n  docs: ['eve-miller']\n};\n\n// Determine team based on file paths\nconst teams = new Set();\nfiles.forEach(filename => {\n  if (filename.includes('frontend/') || filename.endsWith('.vue') || filename.endsWith('.jsx')) {\n    teams.add('frontend');\n  }\n  if (filename.includes('backend/') || filename.endsWith('.py') || filename.endsWith('.java')) {\n    teams.add('backend');\n  }\n  if (filename.includes('docker') || filename.includes('.yml') || filename.includes('.yaml')) {\n    teams.add('devops');\n  }\n  if (filename.endsWith('.md') || filename.includes('docs/')) {\n    teams.add('docs');\n  }\n});\n\n// Add reviewers from relevant teams\nteams.forEach(team => {\n  if (teamMapping[team]) {\n    reviewers.push(...teamMapping[team]);\n    labels.push(`team-${team}`);\n  }\n});\n\n// Add priority label for large PRs\nif ($json.metrics.totalFiles > 10) {\n  labels.push('large-pr');\n}\n\nif ($json.qualityIssues.length > 0) {\n  labels.push('quality-review');\n}\n\nreturn [{\n  json: {\n    reviewers: [...new Set(reviewers)], // Remove duplicates\n    labels,\n    teams: Array.from(teams)\n  }\n}];"
      },
      "name": "Determine Reviewers",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1340, 300]
    },
    {
      "parameters": {
        "jsCode": "const data = $('Extract PR Data').first().json;\nconst quality = $('Analyze Code Quality').first().json;\nconst assignment = $json;\n\nlet comment = `## 🤖 Automated PR Review\\n\\n`;\ncomment += `**Pull Request Summary:**\\n`;\ncomment += `- **Files Changed:** ${quality.metrics.totalFiles}\\n`;\ncomment += `- **Lines Added:** ${quality.metrics.additions}\\n`;\ncomment += `- **Lines Deleted:** ${quality.metrics.deletions}\\n\\n`;\n\n// Quality issues\nif (quality.qualityIssues.length > 0) {\n  comment += `### ⚠️ Quality Concerns\\n`;\n  quality.qualityIssues.forEach(issue => {\n    comment += `- ${issue}\\n`;\n  });\n  comment += `\\n`;\n}\n\n// Review checklist\ncomment += `### 📋 Review Checklist\\n`;\ncomment += `- [ ] Code follows project style guidelines\\n`;\ncomment += `- [ ] Changes are properly tested\\n`;\ncomment += `- [ ] Documentation is updated if needed\\n`;\ncomment += `- [ ] No obvious security vulnerabilities\\n`;\ncomment += `- [ ] Performance impact considered\\n\\n`;\n\n// Assigned reviewers\nif (assignment.reviewers.length > 0) {\n  comment += `### 👥 Assigned Reviewers\\n`;\n  assignment.reviewers.forEach(reviewer => {\n    comment += `- @${reviewer}\\n`;\n  });\n  comment += `\\n`;\n}\n\ncomment += `### 🏷️ Labels Applied\\n`;\nassignment.labels.forEach(label => {\n  comment += `- \\`${label}\\`\\n`;\n});\n\nreturn [{\n  json: {\n    comment,\n    pr_data: data\n  }\n}];"
      },
      "name": "Create Review Comment",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1560, 300]
    },
    {
      "parameters": {
        "resource": "issue",
        "operation": "createComment",
        "owner": {
          "__rl": true,
          "value": "={{ $json.pr_data.repo_owner }}",
          "mode": "name"
        },
        "repository": {
          "__rl": true,
          "value": "={{ $json.pr_data.repo_name }}",
          "mode": "name"
        },
        "issueNumber": "={{ $json.pr_data.pr_number }}",
        "body": "={{ $json.comment }}"
      },
      "name": "Post Review Comment",
      "type": "n8n-nodes-base.github",
      "typeVersion": 1,
      "position": [1780, 300],
      "credentials": {
        "githubApi": {
          "id": "github-credentials",
          "name": "GitHub API"
        }
      }
    },
    {
      "parameters": {
        "resource": "pullRequest",
        "operation": "update",
        "owner": {
          "__rl": true,
          "value": "={{ $('Create Review Comment').first().json.pr_data.repo_owner }}",
          "mode": "name"
        },
        "repository": {
          "__rl": true,
          "value": "={{ $('Create Review Comment').first().json.pr_data.repo_name }}",
          "mode": "name"
        },
        "pullRequestNumber": "={{ $('Create Review Comment').first().json.pr_data.pr_number }}",
        "additionalFields": {
          "reviewers": "={{ $