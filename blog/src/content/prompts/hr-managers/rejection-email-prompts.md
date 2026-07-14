---
title: "25 ChatGPT Prompts for Candidate Rejection Emails (2026) — HR Managers"
description: "25 ready-to-use ChatGPT prompts for candidate rejection emails. Save time, stay compliant, and send rejection emails that protect your employer brand."
profession: "HR Managers"
category: "Recruitment"
contentType: prompt
tags: ["chatgpt prompts for candidate rejection emails", "ai rejection email prompts", "candidate rejection letter prompts", "hr rejection email chatgpt", "recruitment rejection email templates ai"]
pubDate: 2026-07-14
featured: true
promptCount: 25
---

You are an HR Manager who needs rejection emails written fast and written right. This page gives you 25 ChatGPT prompts for candidate rejection emails covering every scenario you hit in a real hiring cycle — post-application, post-phone-screen, post-interview, late-stage near-misses, and internal candidates. Paste the prompt, fill in the variables, and you have a draft ready to send.

These prompts pair well with [Jasper AI](https://jasper.ai/affiliates) for HR Managers-specific tone control, or [Copy.ai](https://www.copy.ai/affiliates) for fast iteration across bulk rejection sends.

---

## Post-Application Rejections (No Interview Offered)

> You are an HR Manager sending a rejection email to a candidate who applied for an open role but will not be progressed to interview.
>
> Role applied for: {job_title}
> Candidate first name: {candidate_first_name}
> Company name: {company_name}
> Primary reason for rejection (internal only, do not state explicitly): {internal_reason}
> Tone: {tone: warm and brief / professional and neutral / empathetic}
> Encourage future applications: {yes / no}
>
> Write a 100 to 150 word rejection email. Open by thanking the candidate for their application. State clearly they will not be progressed without using passive or vague language. Do not disclose the internal reason. If encourage future applications is "yes", include one sentence inviting them to apply for future roles. Close warmly. Use plain, direct sentences. No legal disclaimers unless they arise naturally from the scenario.

**When to use it:** Monday morning when you have a batch of 40+ applicants to clear before the hiring manager asks for a shortlist by noon.

**Pro tip:** Set `{internal_reason}` to something honest, like "overqualified for salary band" or "missing required certification." The AI uses it to calibrate the warmth of the email without revealing it — if you leave it blank, the output gets generic fast.

---

> You are an HR Manager writing a bulk rejection email for candidates who applied to a high-volume entry-level role and did not pass the initial screening criteria.
>
> Role applied for: {job_title}
> Company name: {company_name}
> Number of applications received (approximate): {application_volume}
> Screening criteria that disqualified most candidates: {screening_criteria}
> Tone: {professional and brief / warm and concise}
> Turnaround time from application to this email: {days_since_application}
>
> Write a 90 to 120 word rejection email suitable for sending to all disqualified applicants at once. Do not personalise beyond the first name merge field placeholder [FIRST NAME]. Acknowledge the volume of applicants without making excuses. Thank them for their time. Close with a single positive sentence. Do not invite future applications unless the tone variable is "warm and concise," in which case add one line.

**When to use it:** When you are closing a graduate intake campaign and need one email body that works for 200 sends without sounding automated or cold.

**Pro tip:** Including `{days_since_application}` forces the AI to adjust the apology framing — a 3-day turnaround needs no apology; a 45-day turnaround should briefly acknowledge the wait. This prevents the awkward mismatch of an apologetic email going out to someone who applied yesterday.

---

> You are an HR Manager rejecting a candidate whose application was strong on paper but who does not meet a non-negotiable legal or regulatory requirement for the role.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Non-negotiable requirement not met: {requirement_not_met}
> Is the requirement publicly listed in the job ad: {yes / no}
> Company name: {company_name}
> Tone: {factual and respectful}
>
> Write a 120 to 160 word rejection email. If the requirement was publicly listed in the job ad, reference it plainly so the candidate understands immediately. If it was not listed, state that a mandatory qualification for the role has not been met without specifying which one. Do not apologise excessively. Do not invite the candidate to reapply unless they could realistically meet the requirement in future, in which case add one concrete sentence about that path.

**When to use it:** When rejecting a candidate who lacks a required professional licence, right-to-work status, or security clearance — situations where vague language creates legal risk or false hope.

**Pro tip:** If `{requirement_not_met}` touches right-to-work or protected characteristics, run the output past your legal team before sending regardless of how clean the email looks. The prompt keeps you factual, but jurisdiction-specific compliance is still on you.

---

> You are an HR Manager sending a rejection email to a candidate who applied speculatively (no open role exists) and cannot be offered a position or added to a talent pool.
>
> Candidate first name: {candidate_first_name}
> Company name: {company_name}
> Role or function they expressed interest in: {expressed_interest_area}
> Reason speculative applications cannot be accommodated right now: {internal_context}
> Tone: {appreciative and brief}
> Offer to keep CV on file: {yes / no}
>
> Write a 100 to 130 word email. Thank the candidate for reaching out proactively — this is rare and worth noting. Be direct that there is no current opportunity. If "offer to keep CV on file" is "yes," add one sentence with a realistic timeframe for review (use {review_timeframe} variable). Do not overpromise. Close with a genuine-feeling sign-off.

**When to use it:** When a strong speculative applicant lands in your inbox during a hiring freeze and you want to respond respectfully without creating an implied commitment.

**Pro tip:** Only set "offer to keep CV on file" to "yes" if you will actually action it. If your ATS does not support a talent pool workflow, set it to "no" — a promise you cannot keep damages employer brand more than a clean decline.

---

> You are an HR Manager rejecting a candidate who applied for a senior leadership role and is clearly underqualified in experience — not skills — for the level.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Level of role (e.g. VP, Director, Head of): {role_level}
> Years of relevant experience the candidate has (approximate): {candidate_experience_years}
> Years of experience the role requires: {required_experience_years}
> Company name: {company_name}
> Tone: {respectful and direct}
>
> Write a 130 to 170 word rejection email. Do not be condescending. Acknowledge the candidate's application genuinely. State clearly that the experience threshold for the level of the role has not been met. Where appropriate, note that a more junior opening at {company_name} might be a fit — only include this if it feels natural given the gap between {candidate_experience_years} and {required_experience_years}. Close professionally.

**When to use it:** When a mid-level manager applies for a C-suite or VP role and you need to decline without closing the door on them as a future candidate at the right level.

**Pro tip:** If the gap is fewer than 3 years, the AI will naturally lean toward the softer redirect. If the gap is 10+ years, set tone to "direct" and let it skip the redirect — a hollow "apply for something junior" suggestion reads as dismissive when the seniority gap is that large.

---

## Post-Phone-Screen Rejections

> You are an HR Manager sending a rejection email after a recruiter phone screen where the candidate did not progress.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Recruiter name: {recruiter_name}
> Date of phone screen: {screen_date}
> Primary reason for not progressing (internal): {screen_fail_reason}
> Tone: {warm and professional}
> Turnaround from screen to this email: {days_since_screen}
>
> Write a 120 to 160 word rejection email. Open by thanking the candidate for their time on the call with {recruiter_name}. Reference the date so the candidate knows exactly which conversation this relates to. Decline clearly. Do not give detailed feedback unless the prompt is specifically asked to — keep feedback absent here. Close with a positive sentence. Do not leave the door open for reapplication unless the internal reason is something the candidate could address (e.g. salary misalignment), in which case add one careful sentence.

**When to use it:** Friday afternoon when your recruiter has completed a week of screens and you need to clear the pipeline before roles move to interview stage Monday.

**Pro tip:** If `{screen_fail_reason}` is "salary expectation mismatch," the AI will add a softer close naturally. If it is "communication concerns" or "unprofessional conduct," the AI will produce a clean, brief close with no door left open — which is exactly right.

---

> You are an HR Manager writing a rejection email to a candidate who passed the phone screen but cannot be progressed because the role has been put on hold by the business.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Company name: {company_name}
> Date of phone screen: {screen_date}
> Expected timeframe before role may reopen: {role_reopen_timeframe}
> Tone: {transparent and professional}
> Offer to re-contact if role reopens: {yes / no}
>
> Write a 140 to 180 word email. Be honest that the role is on hold due to business reasons — do not fabricate a performance-based rejection. Acknowledge this is disappointing given the candidate invested time in the screen. If "offer to re-contact" is "yes," be specific about what re-contact means (a direct email if the role reopens within {role_reopen_timeframe}) and that this is not a guaranteed interview. Close warmly.

**When to use it:** When a headcount freeze hits mid-pipeline and you have five screened candidates to notify before word gets out through other channels.

**Pro tip:** "Role on hold" emails are high-risk for candidate ghosting when the role does reopen. If you set re-contact to "yes," add the candidate to a tracked list in your ATS the same day you send — the email creates an expectation you have to honour.

---

> You are an HR Manager writing a rejection email to a candidate who was screened for multiple open roles simultaneously and was not selected for any of them.
>
> Candidate first name: {candidate_first_name}
> Roles considered for: {roles_considered}
> Company name: {company_name}
> Overall reason for not progressing across all roles: {consolidated_rejection_reason}
> Tone: {respectful and final}
> Has the candidate applied before: {yes / no}
>
> Write a 130 to 160 word email that rejects the candidate from all roles in a single communication. Do not list each role and give a separate reason — consolidate cleanly. If the candidate has applied before (yes), acknowledge their continued interest in one sentence without it sounding like an obligation. Make clear this closes their current candidacy. Do not offer an open invitation to apply again without a specific qualifier.

**When to use it:** When a candidate applied to three roles at once, you have screened them once, and none of them are a match — you need one email, not three separate rejections landing in their inbox.

**Pro tip:** Listing every role title in `{roles_considered}` and then a single consolidated reason forces the AI to write a tighter, more honest email than if you leave roles vague. Vague inputs produce hedge-heavy outputs full of "at this time" and "on this occasion."

---

> You are an HR Manager rejecting a candidate after a phone screen where the candidate's salary expectation significantly exceeds the approved budget for the role.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Approved salary range for role: {salary_range}
> Candidate's stated expectation: {candidate_salary_expectation}
> Company name: {company_name}
> Tone: {honest and respectful}
>
> Write a 120 to 150 word rejection email that is transparent about the reason: the salary expectation and the approved budget are not aligned. Do not imply the candidate is wrong to expect that salary. Do not promise the budget will change. If the gap is within 15%, acknowledge there may be future roles at a higher band and invite them to keep an eye on the careers page. If the gap is larger, close cleanly without false hope.

**When to use it:** When a candidate disclosed a salary expectation 40% above your band on the screen and you want to decline without wasting their time or yours on an interview.

**Pro tip:** Fill in both `{salary_range}` and `{candidate_salary_expectation}` as numbers — e.g. "£45,000 to £50,000" and "£72,000." The AI calculates the gap contextually and adjusts the close accordingly. If you leave them as vague descriptions, it defaults to a generic salary mismatch line that tells the candidate nothing useful.

---

> You are an HR Manager sending a rejection email after a phone screen where the candidate was strong but a faster-moving candidate has already been offered the role.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Company name: {company_name}
> Date the role was filled: {role_filled_date}
> Was the candidate genuinely strong: {yes / no}
> Tone: {warm and genuine}
> Future pipeline invitation: {yes / no}
>
> Write a 130 to 170 word email. Be honest that the role has been filled. Do not fabricate a skills-based reason. If the candidate was genuinely strong (yes), acknowledge this specifically — not with empty praise, but with a reference to what impressed during the screen (use {screen_highlight} variable). If future pipeline invitation is "yes," make the commitment specific: state you will reach out if a comparable role opens and give a rough timeframe.

**When to use it:** When timing worked against a good candidate and you want the rejection to leave them positively disposed to your company rather than annoyed they wasted time on a screen for a role already filled.

**Pro tip:** If you set "genuinely strong" to "yes" but leave `{screen_highlight}` blank, the output will fall back on generic praise that reads as insincere. Even a short note like "depth of experience managing distributed teams" makes the email land entirely differently.

---

## Post-Interview Rejections (First and Second Round)

> You are an HR Manager writing a post-first-interview rejection email for a candidate who interviewed well but was outperformed by another candidate on a specific competency.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Interview date: {interview_date}
> Interviewer(s): {interviewer_names}
> Competency where another candidate was stronger: {differentiating_competency}
> Tone: {warm and specific}
> Offer written feedback: {yes / no}
>
> Write a 150 to 200 word rejection email. Thank the candidate for their time with {interviewer_names}. Decline clearly. Name the differentiating competency as the area where the selected candidate had stronger demonstrated experience — frame this as comparative, not as a flaw in the candidate. If "offer written feedback" is "yes," add one sentence inviting them to request a brief feedback call. Do not over-explain the decision or apologise repeatedly.

**When to use it:** After a competitive first interview where two strong candidates split the panel and one was marginally better — you want the rejected candidate to understand the decision without feeling they failed.

**Pro tip:** Naming a single `{differentiating_competency}` — like "stakeholder management at board level" or "hands-on SQL at the required depth" — makes the email feel fair and specific. If you try to list two or three differentiators, the email starts to read as a performance review rather than a respectful decline.

---

> You are an HR Manager writing a post-second-interview rejection