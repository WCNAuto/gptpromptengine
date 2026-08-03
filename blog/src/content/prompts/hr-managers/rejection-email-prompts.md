---
title: "25 ChatGPT Prompts for Candidate Rejection Emails in 2026"
description: "25 ready-to-use ChatGPT prompts for candidate rejection emails. Save time, stay compliant, and send rejections that protect your employer brand."
profession: "HR Managers"
category: "Recruitment"
contentType: prompt
tags: ["chatgpt prompts for candidate rejection emails", "ai rejection email prompts", "candidate rejection email templates chatgpt", "hr rejection letter prompts", "job applicant rejection email ai"]
pubDate: 2026-08-03
featured: true
promptCount: 25
---

This page is for HR Managers who need to clear a rejection backlog, respond to a specific candidate promptly, or write a rejection that handles a sensitive situation without causing a complaint. Each prompt below produces a finished email you can copy, lightly edit, and send today.

These prompts pair well with [Jasper AI](https://jasper.ai/affiliates) for HR Managers-specific tone control, or [Copy.ai](https://www.copy.ai/affiliates) for fast iteration across high-volume pipelines.

---

## High-Volume Post-Interview Rejections

> You are an HR Manager sending a post-first-interview rejection email.
>
> Candidate name: {candidate_name}
> Role they applied for: {job_title}
> Interview stage completed: {interview_stage} (e.g. phone screen, first-round panel)
> Primary reason for not progressing (internal use only, do not state explicitly): {internal_reason}
> Company name: {company_name}
> Tone: {tone} (warm / neutral / formal)
>
> Write a 120 to 150 word rejection email. Open by thanking them for their time at the {interview_stage}. State clearly they have not been selected to move forward. Do not give the {internal_reason} verbatim. Close with a genuine but non-committal encouragement to apply for future roles. Do not use "we regret to inform you" or "at this time". Sign off from the HR team, not a named individual.

**When to use it:** Monday morning after a Friday interview round when you have six candidates to reject before the hiring manager wants to move to final stage.

**Pro tip:** Set `{internal_reason}` to "overqualified" and the output will soften the tone naturally without exposing you to age discrimination risk — but review the draft yourself before sending when that's the real reason.

---

> You are an HR Manager writing a post-final-interview rejection for a candidate who reached the last stage but was not selected.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Number of interview rounds completed: {rounds_completed}
> Specific strength to acknowledge: {candidate_strength}
> Reason for not selecting (do not quote directly): {selection_reason}
> Hiring manager first name: {hiring_manager_name}
>
> Write a 180 to 220 word rejection email. Acknowledge the effort of going through {rounds_completed} rounds. Name {candidate_strength} explicitly — this must feel personal, not generic. State clearly they were not selected. Attribute the final decision to a close call between strong candidates, not a deficit in the candidate. Close by offering a brief feedback call if they want one. Sign from {hiring_manager_name} and the HR team jointly.

**When to use it:** When a candidate made it to the final two and will be confused or upset if they receive a form rejection. This email prevents the follow-up call from being adversarial.

**Pro tip:** If your company policy prohibits offering feedback calls, replace `{hiring_manager_name}` with just the HR team name and delete the feedback call line. Run a second prompt asking ChatGPT to remove that sentence while keeping tone consistent — faster than editing manually.

---

> You are an HR Manager sending rejection emails to a large pool of applicants who were screened but never interviewed.
>
> Role: {job_title}
> Department: {department}
> Number of applicants in this batch (for context only): {applicant_count}
> Application close date: {close_date}
> Company name: {company_name}
> Tone: {tone} (neutral / warm)
>
> Write a 90 to 110 word rejection email suitable for bulk sending to applicants who were not shortlisted after CV screening. Do not imply they were interviewed. Do not list rejection criteria. Thank them for applying. State the role has moved forward with other candidates. Encourage them to follow the company's careers page for future openings. Keep language human, not automated-sounding. No first name merge tag — write it so it reads naturally without personalisation.

**When to use it:** After closing a high-application-volume role (50+ applicants) where most people received no acknowledgement during the process. Clears the ATS and protects your Glassdoor rating.

**Pro tip:** Ask ChatGPT to generate three tone variants in one go by adding "produce three versions: one neutral, one warm, one brief/direct" at the end. Pick the one that matches your employer brand without rerunning the prompt.

---

> You are an HR Manager rejecting a candidate who applied via a referral from a current employee.
>
> Candidate name: {candidate_name}
> Role applied for: {job_title}
> Referring employee name: {referrer_name}
> Referring employee's relationship to HR (e.g. direct report, peer): {referrer_relationship}
> Reason for rejection (do not state explicitly): {rejection_reason}
> Company name: {company_name}
>
> Write a 150 to 180 word rejection email to {candidate_name}. Acknowledge the referral from {referrer_name} warmly without over-promising what a referral means. State clearly they have not been selected. Do not imply {referrer_name} did anything wrong. Close by encouraging the candidate to apply directly in future. Separately, at the end, write one sentence HR can use to inform {referrer_name} their referral was not progressed — keep it under 20 words, factual, non-apologetic.

**When to use it:** When a senior employee's referred candidate didn't make the cut and you need to close the loop without damaging that internal relationship.

**Pro tip:** The 20-word closing line for the referrer is the most important part of this output. If ChatGPT makes it overly apologetic, add: "Rewrite the referrer update line. Neutral tone. No apology. State only that the candidate was not selected."

---

> You are an HR Manager sending a rejection to a candidate who applied for a role that has since been put on hold or cancelled.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Stage reached before hold: {stage_reached}
> Reason for hold (internal, do not state directly): {hold_reason}
> Estimated time before role may reopen (if known): {reopen_timeline}
> Company name: {company_name}
>
> Write a 140 to 170 word rejection email. Be honest that the role is on hold without revealing {hold_reason}. Acknowledge {stage_reached} so the candidate understands you reviewed their application. If {reopen_timeline} is known, mention the possibility of re-engagement without making a commitment. If {reopen_timeline} is unknown, omit this entirely. Close by asking if they consent to keeping their CV on file. No false positivity.

**When to use it:** When a hiring freeze hits mid-process and you have candidates sitting in your pipeline expecting a decision.

**Pro tip:** If `{reopen_timeline}` is "unknown", explicitly type that word into the variable. If you leave it blank, ChatGPT will often invent a timeline, which creates a candidate expectation you cannot manage.

---

## Rejections After Skills Tests or Assessments

> You are an HR Manager rejecting a candidate after a technical skills test or work sample submission.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Test or assessment type: {assessment_type} (e.g. Excel task, writing sample, coding test)
> Specific gap identified (internal, do not reproduce verbatim): {skill_gap}
> Time candidate invested in the assessment: {time_investment} (e.g. "a two-hour task")
> Company name: {company_name}
>
> Write a 150 to 180 word rejection email. Acknowledge the effort of completing a {time_investment} assessment. State they have not been progressed. Give one piece of general, non-damaging feedback that hints at {skill_gap} without quoting internal scores or notes. Do not invite them to reapply immediately. Close with genuine thanks. Tone: professional and human.

**When to use it:** When a candidate completed a meaningful assessment and a form rejection would feel dismissive or unfair — and you want to close the door without inviting a long feedback exchange.

**Pro tip:** Feeding a specific but vague version of `{skill_gap}` (e.g. "depth of analysis" rather than "scored 3/10 on data interpretation") produces feedback language that is honest without being quotable in a complaint.

---

> You are an HR Manager rejecting a candidate after a video interview submission (async, not live).
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Platform used: {platform} (e.g. HireVue, Spark Hire)
> Number of questions in the video interview: {question_count}
> Key reason for not progressing (internal): {internal_reason}
> Company name: {company_name}
>
> Write a 130 to 160 word rejection email. Acknowledge that async video interviews take effort and thank {candidate_name} specifically. State clearly they are not progressing. Do not mention the {platform} by name in the body. Do not reference anything that could be construed as appearance-based feedback. Close with a brief note about their CV remaining in consideration for similar roles if a vacancy arises. Tone: warm and direct.

**When to use it:** After processing a batch of async video interviews — typically 15 to 40 — where each person spent 20 to 45 minutes completing the task.

**Pro tip:** The instruction to exclude `{platform}` by name protects you if that vendor changes their product or reputation. It also prevents candidates from framing complaints around platform-specific bias arguments.

---

> You are an HR Manager rejecting a candidate who passed the skills test but failed to progress due to cultural fit or team composition reasons.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Assessment result: {assessment_result} (e.g. passed, strong pass)
> Reason not progressing (do not state directly): {internal_reason}
> Hiring team's actual concern in plain language: {team_concern}
> Company name: {company_name}
>
> Write a 160 to 190 word rejection email. Acknowledge their strong {assessment_result}. State clearly they have not been progressed. Do not use the phrase "cultural fit" or "team fit" — these phrases invite scrutiny. Instead, explain the decision was based on a close comparison with other candidates' specific experience profile. Do not apologise excessively. Close by noting you will retain their details. Tone: direct and respectful.

**When to use it:** When a technically strong candidate was rejected for reasons that are legitimate but hard to articulate without opening a legal conversation.

**Pro tip:** Never paste `{team_concern}` into the prompt using language like "personality clash" or "attitude issue" — the model will echo phrases that can surface in an FOI or subject access request. Keep `{team_concern}` descriptive and outcome-focused.

---

> You are an HR Manager following up with a candidate who completed an assessment weeks ago and has been waiting for a decision due to internal delays.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Assessment completed date: {assessment_date}
> Number of weeks since assessment: {weeks_waiting}
> Decision outcome: {outcome} (rejection)
> Reason for delay (internal, do not state): {delay_reason}
> Company name: {company_name}
>
> Write a 140 to 170 word rejection email. Open by acknowledging the wait has been longer than expected — name the {weeks_waiting} directly. Apologise briefly (one sentence, not grovelling). State the outcome clearly. Do not give {delay_reason} as an explanation — it is not the candidate's concern. Close by thanking them for their patience and professionalism. Tone: honest and accountable.

**When to use it:** When your ATS flags candidates who submitted work samples more than three weeks ago with no update — a situation that damages your employer brand if left unresolved.

**Pro tip:** Naming `{weeks_waiting}` in the prompt forces the output to include a specific acknowledgement rather than a vague "we're sorry for any delay." Specificity in the apology reads as genuine rather than automated.

---

> You are an HR Manager rejecting a candidate immediately after a live technical interview where the candidate clearly underperformed relative to the role's requirements.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Interviewer names: {interviewer_names}
> Interview date: {interview_date}
> Specific technical area where gap was observed (general language): {technical_gap_area}
> Company name: {company_name}
>
> Write a 150 to 180 word rejection email sent within 24 hours of {interview_date}. Thank them for attending. State they have not been progressed. Include one sentence of honest, constructive feedback referencing {technical_gap_area} — phrased as a development area, not a failure. Do not CC {interviewer_names} on the email — this is HR's communication. Close with encouragement to build that area and apply again in 12 months. Tone: direct and respectful.

**When to use it:** When the gap was obvious, the candidate is likely to know it, and a vague rejection feels dishonest and less useful than a brief honest note.

**Pro tip:** The "apply again in 12 months" line is a deliberate signal. If you don't want the candidate to reapply at all, replace `{technical_gap_area}` feedback with a neutral "the decision was based on overall fit with the current team's needs" and remove the reapplication line entirely.

---

## Sensitive and High-Risk Rejection Scenarios

> You are an HR Manager rejecting a candidate who is an internal employee who applied for an internal promotion or transfer.
>
> Employee name: {employee_name}
> Current role: {current_role}
> Role applied for: {target_role}
> Interview stage reached: {stage_reached}
> Core reason for not selecting (internal, do not state directly): {selection_reason}
> Manager informed before this email: {manager_informed} (yes / no)
> Company name: {company_name}
>
> Write a 180 to 220 word rejection email. Acknowledge that internal applications take courage. State clearly they were not selected for {target_role}. Do not give specific feedback in this email — redirect to a follow-up conversation instead. If {manager_informed} is "no", include a line saying their current manager will not be notified via this channel and they can choose how to share the news. Close by affirming their value in {current_role}. Tone: warm and direct.

**When to use it:** When an internal candidate applied without their line manager knowing — common in organisations with open internal mobility policies.

**Pro tip:** If `{manager_informed}` is "yes", delete that confidentiality line entirely — leaving it in when the manager already knows creates confusion about what the employee was told and when.

---

> You are an HR Manager rejecting a candidate who disclosed a disability during the application process and who did not meet the essential criteria for the role.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Reasonable adjustments offered: {adjustments_offered} (yes / no / not applicable)
> Specific essential criteria not met: {unmet_criteria}
> Company name: {company_name}
> Legal jurisdiction: {jurisdiction} (e.g. UK Equality Act 2010 / US ADA / Australian DDA)
>
> Write a 160 to 200 word rejection email. State clearly they have not been progressed. Attribute the decision only to {unmet_criteria} — do not reference the disability disclosure in any form. Do not over-explain or add excessive language that would only appear in a rejection where a protected characteristic was disclosed. Keep the tone identical to a standard rejection. Include one sentence noting your commitment to an inclusive process. Avoid any language that implies the decision was difficult because of the disclosure.

**When to use it:** When you need to document that the rejection reason was criteria-based and the email itself does not create evidence of differential treatment.

**