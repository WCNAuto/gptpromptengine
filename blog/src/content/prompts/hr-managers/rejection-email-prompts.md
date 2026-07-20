---
title: "25 ChatGPT Prompts for Candidate Rejection Emails (2026) — HR Managers"
description: "25 ready-to-paste ChatGPT prompts for candidate rejection emails. Save time, stay compliant, and send rejections that protect your employer brand."
profession: "HR Managers"
category: "Recruitment"
contentType: prompt
tags: ["chatgpt prompts for candidate rejection emails", "ai rejection email prompts", "candidate rejection email templates chatgpt", "hr rejection letter prompts", "automated candidate decline email"]
pubDate: 2026-07-20
featured: true
promptCount: 25
---

This page is for HR Managers who need to send rejection emails today, not tomorrow. Each prompt below is ready to paste into ChatGPT or Claude, fill in the variables, and produce a finished email you can send with light editing. All 25 cover different scenarios — post-screen, post-interview, internal candidates, overqualified applicants, and more.

These prompts pair well with [Jasper AI](https://jasper.ai/affiliates) for HR Managers-specific tone control, or [Copy.ai](https://www.copy.ai/affiliates) for fast iteration.

---

## After-Phone-Screen Rejections

> You are an HR Manager sending a post-phone-screen rejection email.
>
> Candidate name: {candidate_first_name}
> Role applied for: {job_title}
> Department: {department}
> Reason (internal only, do not state directly): {internal_reason: skills_gap / salary_mismatch / role_filled_internally / culture_fit / other}
> Time since application: {days_since_application} days
> Tone: {warm_and_brief / professional_and_neutral}
>
> Write a 100 to 140 word rejection email. Open with thanks for their time on the call. Decline without stating the specific reason. Encourage them to apply for future roles only if the internal reason is skills_gap or culture_fit — otherwise omit that line. Close with a genuine good-luck sign-off. Do not use "we regret to inform you" or "after careful consideration".

**When to use it:** Monday morning after a Friday phone screen batch, when you have six rejections to send before your 10am standup.

**Pro tip:** If `{internal_reason}` is `salary_mismatch`, remove the future-roles invite — candidates who know they were rejected on budget will find it hollow and occasionally reply asking you to reconsider at their number.

---

> You are an HR Manager writing a rejection email to a candidate who completed a phone screen but was not progressed because another applicant was stronger, not because of a flaw in their application.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Strongest competing differentiator (internal only): {what_the_hired_candidate_had}
> Your company name: {company_name}
> Recruiter first name: {recruiter_name}
> Tone: {empathetic / neutral}
>
> Write a 120 to 150 word email. Be honest that it was a competitive field without revealing the other candidate's details. Do not apologise excessively. Close by leaving the door open for a specific type of future role if relevant.

**When to use it:** When a genuinely good candidate lost out on volume, not quality, and you want to preserve the relationship for a pipeline role opening in Q4.

**Pro tip:** Replace `{what_the_hired_candidate_had}` with something like "ten years in SaaS fintech vs. a generalist background" — the more concrete your input, the more honest-sounding the output, even though that detail never appears in the final email.

---

> You are an HR Manager sending a rejection email to a candidate who was screened out because the role was put on hold after they applied.
>
> Candidate name: {candidate_first_name}
> Job title: {job_title}
> Approximate hold duration: {hold_duration: indefinite / 3_months / 6_months}
> Whether to invite reapplication: {invite_reapplication: yes / no}
> Company name: {company_name}
> Tone: {transparent / brief_and_professional}
>
> Write a 100 to 130 word email. Explain the role is paused, not that they were rejected on merit. If `{invite_reapplication}` is yes, include one clear sentence inviting them to watch for the role relisting. Do not over-explain the business reason for the hold.

**When to use it:** When a hiring freeze hits mid-pipeline and you have candidates in limbo who deserve an honest update, not a standard rejection.

**Pro tip:** If `{hold_duration}` is `indefinite`, do not invite reapplication — it creates false expectation and often generates follow-up emails you then have to manage for months.

---

> You are an HR Manager writing a post-phone-screen rejection for a candidate who is clearly overqualified for the role.
>
> Candidate name: {candidate_first_name}
> Role applied for: {job_title}
> Seniority of the role: {role_level: junior / mid / individual_contributor}
> Candidate's apparent seniority based on CV: {candidate_apparent_level}
> Whether you have a more senior opening: {senior_role_available: yes / no}
> Company name: {company_name}
>
> Write a 130 to 160 word email. Acknowledge their strong background without being patronising. Decline for this specific role. If `{senior_role_available}` is yes, name the level of role and invite them to express interest. If no, close warmly without a hollow promise.

**When to use it:** When a senior candidate applied for a role two levels below them, likely because they are between jobs, and you want to handle it with care rather than a generic decline.

**Pro tip:** Never write "this role may not fully utilise your experience" — candidates read it as "you're too old." Instead prompt the AI to say the scope of the role doesn't align with where they are in their career.

---

> You are an HR Manager sending a high-volume batch rejection email for candidates who applied but were not selected for a phone screen.
>
> Role: {job_title}
> Number of applicants (for AI context only, not to appear in the email): {total_applicants}
> Primary screening criteria that narrowed the field: {top_screening_criteria}
> Company name: {company_name}
> Days since application: {days_since_application}
> Sign-off name: {hr_team_name_or_individual}
>
> Write a 80 to 110 word rejection email. It must work as a merge-sendable email — no personalisation beyond {candidate_first_name}. Decline clearly in the first sentence. Do not use passive voice. Do not promise feedback. Close with a brief, genuine sentence about their job search.

**When to use it:** After closing applications on a high-volume role where you had 300+ applicants and need to clear the pipeline before the hiring manager asks why candidates are still in "under review."

**Pro tip:** Tell ChatGPT the `{top_screening_criteria}` (e.g. "must-have AWS certification") so it can write a rejection that sounds considered rather than automated, even though it is going to 280 people.

---

## Post-First-Interview Rejections

> You are an HR Manager writing a post-first-interview rejection email.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Interview format: {interview_format: panel / one_to_one / competency_based}
> One genuine strength observed: {observed_strength}
> Primary reason for not progressing (internal only): {rejection_reason}
> Offer feedback: {offer_feedback: yes / no}
> Tone: {warm / formal}
>
> Write a 150 to 200 word rejection email. Open by thanking them for attending. Name the one genuine strength — do not fabricate one if unsure, leave that variable blank and skip that sentence. If `{offer_feedback}` is yes, include one sentence inviting them to reply for a brief call. Close with a specific good-luck message, not a generic one.

**When to use it:** Tuesday afternoon after Monday interview debrief, when you have four or five first-round rejections to send before candidates start chasing.

**Pro tip:** Only set `{offer_feedback}` to yes if you have 20 minutes this week to actually take the calls. Candidates will reply. If your diary is full, set it to no — a promise you don't keep damages your employer brand more than not offering it.

---

> You are an HR Manager writing a rejection email to a candidate who interviewed well but was rejected because the role's requirements shifted after their interview.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> How the role shifted: {role_change_description}
> Whether to share the reason: {share_reason: yes / no}
> Recruiter name: {recruiter_name}
> Company name: {company_name}
>
> Write a 140 to 170 word email. If `{share_reason}` is yes, explain that the role scope changed after their interview in one clear sentence — do not over-detail. If no, decline without explanation but acknowledge they performed well. Do not imply it was a close decision if the reason is purely structural.

**When to use it:** When a late-stage scope change kills a promising candidate's progression and you owe them an honest, specific explanation rather than a boilerplate decline.

**Pro tip:** If the role shift involved a headcount cut, do not share that detail — it invites speculation about company stability and sometimes gets screenshotted to Glassdoor.

---

> You are an HR Manager writing a rejection email to a candidate who was not progressed after a first interview because of a specific technical skills gap.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Skills gap (internal framing): {skills_gap_description}
> Whether to mention the gap in the email: {mention_gap: yes / no}
> Whether this gap is closeable: {gap_closeable: yes_within_a_year / no / unsure}
> Company name: {company_name}
>
> Write a 150 to 180 word rejection email. If `{mention_gap}` is yes and `{gap_closeable}` is yes_within_a_year, include one sentence framing the gap as a development area and encourage reapplication in future. If `{mention_gap}` is no, decline without specifics. Never frame a technical gap as a personality issue.

**When to use it:** When the hiring manager gave you a clear, specific technical reason for rejection and you want to pass that signal on without exposing the company to a complaint.

**Pro tip:** Check with your legal or ER team before naming specific skills gaps in writing for roles where the gap could overlap with a protected characteristic — e.g. digital skills rejections that skew older.

---

> You are an HR Manager writing a post-first-interview rejection email to a candidate who was strong but lost out to an internal candidate who was given priority.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Whether to disclose the internal candidate reason: {disclose_internal: yes / no}
> Candidate pipeline value (internal only): {pipeline_value: high / medium / low}
> Future role type that may suit them: {future_role_type}
> Recruiter name: {recruiter_name}
>
> Write a 160 to 200 word email. If `{disclose_internal}` is yes, state clearly but briefly that the role was filled by an internal candidate — this is honest and candidates respect it. If no, decline without reason. If `{pipeline_value}` is high, include a specific sentence about a type of role you'd want to discuss with them in future. Do not promise a timeline.

**When to use it:** When your internal mobility policy gave a current employee first right of refusal, and you have a strong external candidate you genuinely want to keep warm.

**Pro tip:** Setting `{disclose_internal}` to yes almost always produces a better candidate experience. "The role was filled internally" closes the loop cleanly. Vague rejections generate reply emails asking what happened.

---

> You are an HR Manager writing a brief same-day rejection email to a candidate after a first interview where it was clear within the first ten minutes they were significantly misaligned with the role.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Misalignment type (internal only): {misalignment_type: seniority / domain / expectations / communication}
> Tone required: {professional_and_brief / empathetic}
> Recruiter name: {recruiter_name}
> Company name: {company_name}
>
> Write a 90 to 120 word rejection email. Send-it-today energy — polite, clear, no filler. Do not give false hope. Do not enumerate the reasons. Close with genuine respect for their time. This email should read like it was written by a human who cares, not generated by a system.

**When to use it:** When you know immediately after the interview and it is kinder to send today than let the candidate wait four days hoping.

**Pro tip:** "Send-it-today energy" in the prompt is an intentional instruction — it prevents ChatGPT from padding the output with corporate softeners that slow down what should be a clean, fast close.

---

## Post-Final-Interview and Offer-Stage Rejections

> You are an HR Manager writing a post-final-interview rejection email to a candidate who reached the last round but was not selected.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Number of interview rounds completed: {rounds_completed}
> Key reason for not selecting (internal): {final_rejection_reason}
> Whether to offer a feedback call: {feedback_call: yes / no}
> Hiring manager name (optional, for sign-off): {hiring_manager_name}
> Tone: {sincere / formal}
>
> Write a 200 to 250 word rejection email. Acknowledge the length of the process explicitly — they earned that acknowledgment. Express genuine regret. If `{feedback_call}` is yes, offer a specific 20-minute call with the recruiter. Do not pad with corporate language. Close with a specific, personalised wish for their career — not "all the best."

**When to use it:** After a three or four round process where the candidate invested real time and a generic email would damage your employer brand on Glassdoor within 48 hours.

**Pro tip:** At final-round rejection, the feedback call offer converts at about 60-70% in most talent functions. Block the time before you send the email — don't offer and then scramble.

---

> You are an HR Manager writing a rejection email to a candidate to whom a verbal offer was extended but formal paperwork was not yet sent, and the offer is now being withdrawn due to a hiring freeze.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Date verbal offer was made: {verbal_offer_date}
> Reason for withdrawal: {withdrawal_reason: hiring_freeze / role_restructured / budget_cut}
> Whether to offer a future conversation: {future_conversation: yes / no}
> HR Director or VP name for sign-off: {senior_signatory_name}
>
> Write a 200 to 230 word email. Open with a direct acknowledgment that a verbal offer was made. Apologise clearly — this is not a standard rejection. Briefly explain the reason. If `{future_conversation}` is yes, offer a call with a named person. This email must be reviewed by a senior signatory before sending.

**When to use it:** When a hiring freeze hits after verbal acceptance but before written contract — one of the highest-risk moments for candidate relations and potential legal exposure.

**Pro tip:** Before generating this email, check with employment counsel in your jurisdiction — in some regions a verbal offer combined with candidate actions (e.g. handing in notice) creates legal obligations regardless of whether paperwork was signed.

---

> You are an HR Manager writing a rejection email after a final interview where the candidate's salary expectations significantly exceeded the approved band.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Approved salary band top: {band_ceiling}
> Whether to disclose the band: {disclose_band: yes / no}
> Whether the band may increase in the next cycle: {band_review_timing: 6_months / 12_months / no_review_planned}
> Company name: {company_name}
>
> Write a 150 to 180