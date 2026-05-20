---
title: "n8n Workflow: Automate Job Posting to LinkedIn for HR Managers (2026)"
description: "Step-by-step n8n workflow guide for HR Managers. Fill in a form, Claude writes the post, it goes live on LinkedIn and updates your Notion tracker — automatically."
profession: "HR Managers"
category: "Recruitment Automation"
contentType: workflow
tags: ["hr managers automation", "n8n job posting", "linkedin automation hr", "recruitment workflow", "n8n hr workflow"]
pubDate: 2026-05-01
featured: true
---

This workflow automates the full job posting process — from filling in a form to publishing on LinkedIn and logging the post in Notion.

## What This Workflow Does

A 7-node n8n workflow that handles the entire job posting pipeline without any manual copy-pasting.

**Trigger:** n8n Form (you fill in job title, department, requirements)

**Step 1 → Claude API** writes the LinkedIn post copy in your company tone

**Step 2 → LinkedIn API** publishes the post to your company page

**Step 3 → Notion API** logs the job post, date, and LinkedIn URL in your recruitment tracker

**Step 4 → Email notification** confirms the post is live

---

## Node-by-Node Breakdown

### Node 1: Form Trigger
Collects: job title, department, location, key requirements, tone (formal / conversational), hiring manager name.

### Node 2: Claude API — Write LinkedIn Post
Prompt sent to Claude:

> Write a LinkedIn job post for a {job_title} role in our {department} team based in {location}. Tone: {tone}. Key requirements: {requirements}. Hiring manager: {hiring_manager}. 150–200 words. End with a clear application CTA.

### Node 3: HTTP Request — Post to LinkedIn
Method: POST to `https://api.linkedin.com/v2/ugcPosts`
Auth: LinkedIn OAuth2
Body: Claude's output as the post text.

### Node 4: Notion — Log the Post
Database: Your recruitment tracker
Fields updated: Job Title, Date Posted, LinkedIn URL, Status (set to "Live")

### Node 5: Send Email Confirmation
To: hiring manager's email
Content: Job title, LinkedIn post URL, date posted.

---

## How to Set This Up

1. Import the JSON file below into your n8n instance
2. Connect your LinkedIn OAuth2 credentials
3. Connect your Notion integration and set the database ID
4. Connect your Anthropic API key for the Claude node
5. Test with a sample job posting
6. Activate the workflow

**Download the JSON:** Coming soon — [join the waitlist](mailto:we@white.agency?subject=HR%20Workflow%20JSON%20Download) to be notified when the file is available.

---

## Pro Tips

**Tone matters:** If your company LinkedIn page has a formal tone, set the tone variable to "formal" — Claude will mirror it. For startups, "conversational" produces better engagement.

**Add an approval step:** Insert a Gmail or Outlook node between the Claude node and the LinkedIn node. Route the draft to the hiring manager for approval before it goes live. Use an n8n Wait node to pause until they respond.

**Batch postings:** If you have multiple roles to post in one week, trigger the workflow from a Google Sheets row loop instead of a form. One run per row.

---

## Frequently Asked Questions

### Do I need an n8n Cloud account or can I self-host?
Either works. The workflow JSON is compatible with both n8n Cloud and self-hosted instances running n8n v1.0+. Self-hosting is free; n8n Cloud has a free tier with 2,500 executions/month.

### Does this work with personal LinkedIn profiles or only company pages?
The LinkedIn API node in this workflow is configured for company page posts (Organisation URN). You can adapt it for personal profiles by switching the author field to your personal member URN.

### What if the Claude output is too long for LinkedIn?
LinkedIn caps posts at 3,000 characters. The prompt instructs Claude to keep output at 150–200 words (roughly 900–1,200 characters), well within the limit. If you extend the prompt, add a constraint: "Maximum 2,800 characters."

## Want every HR Manager workflow in one pack?

3 automation workflows for HR Managers — job posting, onboarding, and performance review scheduling. Ready to import.

[Get the HR Automation Pack for $19](mailto:we@white.agency?subject=Waitlist)
