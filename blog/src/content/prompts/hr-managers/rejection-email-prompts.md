---
title: "25 ChatGPT Prompts for Candidate Rejection Emails That HR Managers Can Use in 2026"
description: "25 ready-to-use ChatGPT prompts for candidate rejection emails. Save time, stay compliant, and keep your employer brand intact at every hiring stage."
profession: "HR Managers"
category: "Recruitment"
contentType: prompt
tags: ["chatgpt prompts for candidate rejection emails", "ai prompts for recruitment rejection", "candidate rejection email templates chatgpt", "hr rejection email prompts", "applicant decline email ai prompts"]
pubDate: 2026-08-21
featured: true
promptCount: 25
---

You are an HR Manager who needs a rejection email out the door before your next interview block. Every prompt on this page produces a finished email you can copy, lightly edit, and send — no extra drafting, no second-guessing the tone. Paste the prompt into ChatGPT or Claude, fill in the variables, and use what comes back.

These prompts pair well with [Jasper AI](https://jasper.ai/affiliates) for HR Managers-specific tone control, or [Copy.ai](https://www.copy.ai/affiliates) for fast iteration across high-volume hiring pipelines.

---

## After-Application Rejections (No Interview Offered)

> You are an HR Manager writing a post-application rejection email to a candidate who applied for a role but was not selected for an interview.
>
> Candidate first name: {candidate_first_name}
> Role applied for: {job_title}
> Department: {department}
> Reason category (do not state directly in email): {reason: overqualified / missing_required_qualification / volume_of_stronger_applicants / location_mismatch}
> Company name: {company_name}
> Tone: {warm_and_brief / formal / neutral}
>
> Write a 100 to 130 word rejection email. Open by thanking the candidate for applying. Decline clearly in the second sentence — do not bury the decision. Do not give a specific reason. Close with a genuine wish for their search. Do not invite them to reapply unless the reason category is volume_of_stronger_applicants, in which case include one sentence encouraging future applications. No hollow phrases like "we were overwhelmed with talent."

**When to use it:** Monday morning when you have 40 unreviewed applications from last week and need to clear the queue before your hiring manager calls.

**Pro tip:** If your ATS auto-populates candidate names from a CSV, set `{candidate_first_name}` as a merge field and batch-generate 20 emails in one ChatGPT session by pasting the prompt 20 times with names swapped. The output length is short enough that the AI stays consistent across the batch.

---

> You are an HR Manager writing a rejection email to a candidate who applied speculatively (no open role) and cannot be progressed.
>
> Candidate first name: {candidate_first_name}
> Role or function they expressed interest in: {expressed_interest_area}
> Company name: {company_name}
> Whether to add to talent pool: {yes / no}
> Talent pool contact for future roles: {talent_pool_email_or_link}
> Tone: {appreciative / neutral}
>
> Write a 120 to 150 word email. Acknowledge the initiative it takes to make a speculative approach. Decline clearly. If {add_to_talent_pool} is yes, include a specific next step for joining the talent pool. If no, wish them well without suggesting future contact. No vague "we'll keep your CV on file" language unless backed by the talent pool action.

**When to use it:** When your careers page has an open "send us your CV" submission and someone has sent in a speculative application for a function you genuinely are not hiring for this quarter.

**Pro tip:** The "we'll keep your CV on file" line creates legal exposure in jurisdictions with strict data retention rules (UK GDPR, GDPR). If your company's retention policy is under 6 months, use the talent pool opt-in version so candidates actively consent to being held in your database.

---

> You are an HR Manager writing a post-application rejection to a candidate who is clearly junior for the role they applied for, but shows potential worth acknowledging.
>
> Candidate first name: {candidate_first_name}
> Role they applied for: {job_title}
> Experience gap (do not state directly): {experience_gap_summary}
> Company name: {company_name}
> Junior or entry-level role that might suit them better: {alternative_role_or_none}
> Tone: {encouraging / professional}
>
> Write a 130 to 160 word rejection email. Decline the application for this specific role. Frame the decline around role fit, not the candidate's capability. If {alternative_role_or_none} is not "none", include one sentence pointing them toward the more suitable opening with a direct link or instruction. Do not over-promise or suggest the candidate "just needs more time" in a way that sounds patronising.

**When to use it:** When a strong-looking graduate applies for a Senior Manager role and you want to decline without damaging their impression of the company — especially if you have a graduate scheme running simultaneously.

**Pro tip:** Avoid writing "you're not quite there yet" in any form. It reads as condescending in writing even when it sounds kind verbally. The prompt avoids this, but watch for it if you edit the output before sending.

---

> You are an HR Manager writing a bulk application rejection for candidates who applied to a high-volume hourly or shift-based role and were not shortlisted.
>
> Role: {job_title}
> Location or site: {work_location}
> Company name: {company_name}
> Number of applicants in this wave: {approximate_number}
> Whether the role is still open: {still_open / now_filled}
> Tone: {brief / warm_and_brief}
>
> Write a 90 to 110 word rejection email suitable for bulk send. Do not personalise beyond the opening greeting placeholder. Decline clearly. If the role is still open, do not say it is filled. If it is filled, say so. Do not invite all declined candidates to reapply immediately — this generates a second wave of applications to manage. Close with a genuine, short wish for their job search.

**When to use it:** After closing applications for a warehouse, hospitality, or retail role where you received 200+ applications and need a respectful, legally clean email you can send via your ATS bulk-send function.

**Pro tip:** For bulk sends, strip the `{candidate_first_name}` variable from this prompt and use your ATS merge tag instead. Do not paste 200 names into ChatGPT — the model does not batch-personalise reliably at that volume without a script.

---

> You are an HR Manager writing a rejection email to a candidate who applied for an internal transfer or promotion and was not selected at the application screening stage — before any interview.
>
> Employee name: {employee_name}
> Current role and department: {current_role_and_department}
> Role they applied for internally: {target_role}
> Hiring manager who will also be informed: {hiring_manager_name}
> Whether a conversation with their current manager is recommended: {yes / no}
> Tone: {direct_and_respectful}
>
> Write a 150 to 180 word rejection email. Acknowledge the internal application specifically — do not treat it like an external rejection. Decline clearly. If a manager conversation is recommended, include one sentence encouraging that follow-up without making it sound like a warning. Close with recognition that applying internally takes courage. Do not copy the hiring manager on this email — this is between HR and the employee.

**When to use it:** When an internal employee applied for a lateral move or step-up and did not make the interview shortlist, and you need to decline before they hear through the grapevine.

**Pro tip:** The final instruction ("do not copy the hiring manager") matters. Internal rejections handled poorly become employee relations issues. Send this directly to the employee first, then align separately with their line manager.

---

## Post-First Interview Rejections

> You are an HR Manager writing a rejection email to a candidate who completed a first-round interview but will not be progressed to the next stage.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Interview format (phone / video / in-person): {interview_format}
> General reason category (do not quote directly): {reason: skills_gap / cultural_fit_concern / stronger_field / salary_expectation_mismatch}
> Interviewer name (optional, for personalising close): {interviewer_name_or_omit}
> Tone: {warm / professional / formal}
>
> Write a 160 to 200 word rejection email. Open by thanking the candidate for their time. Decline clearly by the second paragraph. Include one genuine, specific-sounding positive observation about the interview without fabricating detail — use phrasing like "we appreciated your questions about X" or "your background in Y came through clearly." Do not give detailed feedback unless it is specifically requested. Close warmly. Do not say "we had many strong candidates" — it reads as filler.

**When to use it:** Tuesday afternoon when you have three first-round rejections to send before the hiring manager pushes second-round invites and candidates start comparing notes.

**Pro tip:** The instruction to avoid "we had many strong candidates" is deliberate — candidates have flagged this phrase on Glassdoor reviews as dismissive. The AI will default to it without the constraint. Keep it in the prompt.

---

> You are an HR Manager writing a rejection email to a candidate who completed a first-round interview and proactively followed up asking for a status update before you have sent the rejection.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Days since interview: {days_since_interview}
> Company name: {company_name}
> Reason for delay in communicating (do not state in email): {reason_for_delay}
> Tone: {apologetic_but_professional / direct}
>
> Write a 150 to 180 word rejection email. Acknowledge that the candidate reached out. Apologise briefly (one sentence) for the delay without over-explaining. Deliver the rejection decision clearly. Do not let the apology overshadow the actual decision. Close with a genuine note of appreciation for their patience. Do not promise feedback unless you intend to provide it.

**When to use it:** When a candidate emails you "just checking in" and you realise you forgot to send the rejection after the debrief two weeks ago.

**Pro tip:** Do not add an offer to provide feedback reactively in this email just because the candidate chased. If feedback is not in your process, including it here will generate a follow-up email you will have to answer. The prompt intentionally omits it.

---

> You are an HR Manager writing a rejection email after a first-round panel interview where multiple interviewers were involved and the candidate performed well but was edged out by one stronger candidate.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Number of panel interviewers: {panel_size}
> One genuine strength the candidate demonstrated: {specific_strength}
> Company name: {company_name}
> Tone: {warm / professional}
>
> Write a 170 to 210 word rejection email. Open by thanking the candidate for their time with the panel. Name the specific strength in a way that sounds personal, not generic. Decline clearly without comparing them to the successful candidate or saying "we went with someone else." Close by encouraging them to watch for future openings if appropriate to the role level, but only if that is a genuine possibility.

**When to use it:** After a competitive shortlist where you had two finalists at first-round stage and one strong candidate needs a rejection that reflects how close the decision was.

**Pro tip:** Do not name the specific strength as a competency the hiring panel flagged as a gap — e.g., if the panel's note says "lacked strategic thinking," do not write "your strategic approach stood out." Cross-check your interview notes before filling in `{specific_strength}`.

---

> You are an HR Manager writing a first-round rejection email for a candidate who disclosed a disability or adjustment need during the process and was not progressed for reasons unrelated to the disclosure.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Adjustment that was requested: {adjustment_type}
> Reason for rejection (unrelated to adjustment): {rejection_reason_category: skills_gap / stronger_field / role_requirements_mismatch}
> Company name: {company_name}
> Legal review needed before send: {yes / no}
>
> Write a 160 to 190 word rejection email. Do not reference the adjustment or disclosure in the email body — the rejection must read identically to any other first-round decline to avoid any implication that the disclosure influenced the decision. Decline clearly. Maintain a warm, respectful tone. Include no language that could be read as connecting the decision to any protected characteristic.

**When to use it:** When a candidate disclosed a hearing impairment, mobility need, or similar before their interview, adjustments were provided, and they were declined for skills reasons after interview.

**Pro tip:** Before sending, remove any AI-generated phrasing that says the candidate "wasn't the right fit" — "fit" language near a disability disclosure is a litigation risk in UK employment law and under the ADA in the US. The prompt avoids it, but AI outputs occasionally drift. Read the output once before sending.

---

> You are an HR Manager writing a rejection email to a candidate who completed a first-round video interview via an asynchronous platform (e.g., HireVue, Spark Hire) and was not progressed.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Platform used: {video_platform_name}
> Company name: {company_name}
> Whether candidate invested significant time in the recording: {high_effort / standard}
> Tone: {respectful / warm_and_brief}
>
> Write a 140 to 170 word rejection email. Acknowledge the asynchronous format specifically — the candidate recorded responses without a live interviewer, which takes more discipline than a live call. Decline clearly. If `{high_effort}` is selected, add one sentence acknowledging the quality of their preparation without being vague. Do not use the word "unfortunately" more than once.

**When to use it:** After reviewing async video interview submissions in bulk, when you need to reject candidates who took the time to record thoughtful responses to your competency questions.

**Pro tip:** Async video rejection rates spike employer brand complaints on Glassdoor more than any other rejection type, because candidates feel they submitted effort with no human interaction. Acknowledging the format directly — which this prompt does — measurably reduces the sting. Do not skip that line when editing the output.

---

## Post-Final Interview and Offer-Stage Rejections

> You are an HR Manager writing a rejection email to a final-round candidate who was not selected after a full interview process including multiple rounds.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Number of interview rounds completed: {rounds_completed}
> Total time candidate invested (weeks): {process_duration_weeks}
> One genuine differentiator of the successful candidate (do not name them): {differentiator_for_context_only}
> Tone: {warm / candid / professional}
>
> Write a 220 to 270 word rejection email. This candidate invested significant time — the email must reflect that weight. Open with direct acknowledgement of the process length. Deliver the rejection clearly and early — do not bury it. Include a genuine paragraph on what the candidate did well based on available context. Do not compare them to the hired candidate or use "we went with another direction." Offer to provide structured feedback with a specific response window (e.g., "if you would like feedback, reply within two weeks and I will schedule 20 minutes"). Close with warmth and specificity.

**When to use it:** When your preferred candidate has accepted and you need to notify the runner-up who made it through four rounds over six weeks.

**Pro tip:** If you genuinely intend to offer feedback, add the interviewer's availability to `{differentiator_for_context_only}` before filling in the variable — you will need it to write an accurate feedback offer. If feedback is not available, remove that sentence from the output before sending.

---

> You are an HR Manager writing a rejection email to a candidate who received a verbal offer that was subsequently withdrawn before a written offer was issued, due to a business decision (headcount freeze, role elimination) — not candidate performance.
>
> Candidate first name: {candidate_first_name}
> Role: {job_title}
> Reason for withdrawal: {headcount_freeze / role_eliminated