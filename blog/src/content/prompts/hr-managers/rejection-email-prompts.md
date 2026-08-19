---
title: "25 ChatGPT Prompts for Candidate Rejection Emails in 2026"
description: "25 ready-to-paste ChatGPT prompts for candidate rejection emails. Save time, stay compliant, and keep candidates warm. Built for HR Managers."
profession: "HR Managers"
category: "Recruitment"
contentType: prompt
tags: ["chatgpt prompts for candidate rejection emails", "ai prompts for recruitment emails", "candidate rejection email templates", "hr rejection letter prompts", "job applicant decline email prompts"]
pubDate: 2026-08-19
featured: true
promptCount: 25
---

HR Managers sending rejection emails face a consistent tension: speed versus candidate experience. These 25 prompts let you generate a ready-to-send rejection email in under a minute — paste the prompt into ChatGPT or Claude, fill in the variables, and use what comes back.

These prompts pair well with [Jasper AI](https://jasper.ai/affiliates) for HR Managers-specific tone control, or [Copy.ai](https://www.copy.ai/affiliates) for fast iteration across high-volume hiring pipelines.

---

## Post-Application Rejections (Before Interview Stage)

> You are an HR Manager sending a rejection email to a candidate who applied for a role but will not be progressed to interview.
>
> Candidate first name: {candidate_first_name}
> Role applied for: {job_title}
> Department: {department}
> Company name: {company_name}
> Reason category (do not state explicitly in the email): {reason: volume_of_applicants / missing_required_qualification / location_mismatch / salary_expectation_gap}
> Tone: {warm_and_brief / neutral_and_professional}
>
> Write a 120 to 150 word rejection email. Do not use the phrase "we regret to inform you." Open by thanking the candidate for applying. Acknowledge the specific role by name. State clearly they will not be progressed. Close with a genuine, non-hollow wish for their search — one sentence only, no "best of luck with your future endeavours." Sign off from the HR team, not a named individual.

**When to use it:** Monday morning when you're clearing a weekend application pile before the week's interviews start.

**Pro tip:** If your ATS auto-populates a candidate's full name, change {candidate_first_name} to their first name only before pasting — "Dear Sarah" reads warmer than "Dear Sarah Thompson" and the AI sometimes mirrors whatever you put in.

---

> You are an HR Manager rejecting a candidate who applied via LinkedIn Easy Apply for an entry-level role with a very high applicant volume.
>
> Role title: {job_title}
> Company name: {company_name}
> Number of applicants received (approximate): {applicant_volume}
> Days since they applied: {days_since_application}
> Tone: {apologetic_but_efficient / direct_and_respectful}
> Will you keep their details on file: {yes / no}
>
> Write a 100 to 130 word rejection email. Acknowledge the delay if {days_since_application} is over 14 days. Mention the volume of applications briefly to contextualise the decision, without making it sound like a form letter. If {will_keep_details_on_file} is yes, include one sentence inviting them to apply again for future roles. No bullet points. Plain paragraphs only.

**When to use it:** When closing out a high-volume entry-level campaign where you received 300+ applications and have 290 rejections to send.

**Pro tip:** Set {days_since_application} accurately. If it has been 30 days, the AI will write an appropriate acknowledgement of the delay. If you leave it vague or set it to zero, the email will not address what the candidate is already frustrated about.

---

> You are an HR Manager writing a rejection email for a candidate whose application was strong but who applied for the wrong seniority level — they are significantly underqualified.
>
> Candidate name: {candidate_first_name}
> Role applied for: {job_title}
> Company name: {company_name}
> Minimum experience required: {minimum_years_experience} years
> Candidate's estimated experience level: {candidate_experience_level: graduate / 1_to_2_years / 2_to_3_years}
> Tone: {encouraging / neutral}
>
> Write a 150 to 180 word rejection email. Do not state the candidate's experience level explicitly. Acknowledge the interest in the company. Explain the role required a specific level of experience without being condescending. If {tone} is encouraging, close with a genuine invitation to monitor the company's careers page for more junior openings. Do not promise future contact. No hollow phrases about being "impressed by your passion."

**When to use it:** After a graduate applies for a senior manager role — common after LinkedIn auto-apply changes in 2025 lowered the friction on mis-matched applications.

**Pro tip:** Avoid letting the AI write "we encourage you to apply for future roles that match your profile" — it sounds dismissive. Set {tone} to encouraging and the prompt steers it toward something that reads as actually meant.

---

> You are an HR Manager sending a rejection to a candidate who applied for a role that has been put on hold or cancelled by the business after the job was posted.
>
> Candidate name: {candidate_first_name}
> Role title: {job_title}
> Company name: {company_name}
> Reason for role being paused: {reason: headcount_freeze / restructure / budget_cut / role_redesign}
> Likelihood of role reopening: {likely_within_6_months / uncertain / unlikely}
> Tone: {transparent_and_apologetic / professional_and_brief}
>
> Write a 140 to 170 word rejection email. Be honest that the role is on hold without sharing internal detail. Do not blame the candidate. If {likelihood_of_reopening} is likely_within_6_months, include one sentence asking if they are open to being contacted when it reopens. Close with a direct apology for their time. No corporate language. One sentence per idea.

**When to use it:** When finance freezes headcount mid-campaign and you need to contact candidates already in the pipeline before they follow up.

**Pro tip:** If your company is in a public restructure, remove any reference to the specific {reason} from the output before sending — "budget cut" in a rejection email can create legal exposure if the candidate later claims they were misled during the process.

---

> You are an HR Manager rejecting a speculative or unsolicited application — a candidate who applied without an open role advertised.
>
> Candidate name: {candidate_first_name}
> Company name: {company_name}
> Function the candidate applied to work in: {business_function}
> Whether a relevant role may open in the near future: {yes_within_3_months / no / unknown}
> Tone: {appreciative / neutral}
>
> Write a 110 to 140 word rejection email. Acknowledge that the application was speculative and that the candidate took initiative — one sentence only, not over-stated. Be clear there is no current opening in {business_function}. If {relevant_role_likely} is yes_within_3_months, invite them to watch the careers page and keep the email on file. Do not imply their CV was reviewed in depth unless that is likely. Close professionally. No bullet points.

**When to use it:** When your careers page has a general "send us your CV" inbox and it fills up every Monday.

**Pro tip:** Do not let the AI say "your skills look impressive" for a speculative application — you likely haven't reviewed the CV properly and this creates a candidate expectation problem if they follow up expecting feedback.

---

## Post-First-Interview Rejections

> You are an HR Manager sending a rejection email to a candidate after a first-stage phone or video screening interview.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Company name: {company_name}
> Interviewer name or team: {interviewer_name_or_team}
> Stage completed: {phone_screen / video_screen / recruiter_call}
> Reason category (do not state in email): {profile_not_right_fit / stronger_candidates_progressed / missing_specific_skill}
> Tone: {warm / professional / brief}
>
> Write a 160 to 200 word rejection email. Thank them by name for their time at the {stage_completed}. State clearly they will not be progressed to the next stage. Do not give specific feedback unless explicitly instructed — this email gives none. Close by wishing them well with one specific and non-generic sentence. Sign off from {interviewer_name_or_team} or the HR team. Plain paragraphs, no bullets.

**When to use it:** End of a screening week when you've run 15 first calls and need to clear the pipeline before second-round scheduling begins.

**Pro tip:** If your process involves a named recruiter signing off, use their name in {interviewer_name_or_team} — rejection emails from a named person get a measurably lower complaint rate on Glassdoor than those signed "The Recruitment Team."

---

> You are an HR Manager writing a rejection email after a first in-person or panel interview for a mid-level professional role.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Company name: {company_name}
> Interview format: {one_on_one / panel / structured_competency}
> Hiring manager name: {hiring_manager_name}
> One thing the candidate did well (internal note, do not quote directly): {candidate_strength}
> Tone: {warm_and_human / professional_and_direct}
>
> Write a 180 to 220 word rejection email. Open by thanking them for attending the {interview_format} interview. Acknowledge the effort of preparing for an in-person meeting without being patronising. State they will not be progressed. Include one genuine, non-specific compliment loosely referencing {candidate_strength} without quoting feedback verbatim — keep it credible. Do not offer feedback in this email. Close warmly. Sign off from {hiring_manager_name}.

**When to use it:** After a first panel interview where 4 to 5 candidates came in and you're rejecting the 2 or 3 who won't make the shortlist.

**Pro tip:** Feeding {candidate_strength} into the prompt produces an email that feels personal without committing you to written feedback that HR or legal hasn't reviewed. It also dramatically reduces "can I have feedback?" replies.

---

> You are an HR Manager rejecting a candidate after a first interview for a technical or specialist role where a skills test or take-home task was also completed.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Company name: {company_name}
> Task or test completed: {task_description}
> Outcome reason (internal only, do not state directly): {reason: task_below_threshold / stronger_technical_candidates / specific_skill_gap}
> Time the candidate spent on task (approximate): {hours_spent_on_task}
> Tone: {respectful_and_appreciative / neutral}
>
> Write a 170 to 210 word rejection email. Explicitly acknowledge the time they invested in {task_description} — if {hours_spent_on_task} is over 3 hours, make the acknowledgement slightly more substantial. State they will not be progressed. Do not give technical feedback on the task in this email. If {tone} is respectful_and_appreciative, include a sentence recognising their effort is genuinely appreciated by the team. No false praise about the quality of the work.

**When to use it:** After a technical hiring round where candidates completed a 4-hour coding test or a case study and you're rejecting those who didn't make the cut.

**Pro tip:** If {hours_spent_on_task} is over 5 hours, add the instruction "suggest we will provide brief feedback if they request it" — candidates who spend significant time on unpaid tasks are the most likely to post negative Glassdoor reviews if they receive a generic email.

---

> You are an HR Manager rejecting a candidate after a first interview where the role has changed scope since the job was posted and the candidate's profile no longer matches.
>
> Candidate name: {candidate_first_name}
> Original role title: {original_job_title}
> Revised scope of role: {new_scope_description}
> Company name: {company_name}
> Whether to explain the scope change briefly: {yes / no}
> Tone: {transparent / professional}
>
> Write a 160 to 190 word rejection email. If {explain_scope_change} is yes, include one sentence noting that the role has evolved since the position was first advertised and that it now requires a different profile — do not go into detail. Do not imply the candidate underperformed at interview. Close with a clear wish for their job search and an invitation to watch for future roles if relevant. No bullet points.

**When to use it:** When the hiring manager changed the brief halfway through the process and you need to reject people who interviewed for a different job than the one you're now filling.

**Pro tip:** Setting {explain_scope_change} to yes is usually the right call — candidates respect honesty over a vague "we've decided to pursue other candidates," especially when they may know someone at the company.

---

> You are an HR Manager writing a rejection email for a candidate who came close at first interview but where the hiring manager wants you to keep the door open for future roles.
>
> Candidate name: {candidate_first_name}
> Role interviewed for: {job_title}
> Company name: {company_name}
> Specific future role type that might suit them: {future_role_type}
> Expected timeline for that opening: {expected_timeline: within_3_months / within_6_months / unknown}
> Tone: {genuinely_warm / professional_with_warmth}
>
> Write a 180 to 220 word rejection email. Be clear they are not progressing for this specific role. Express genuine interest in staying in touch — make it feel deliberate, not a cut-and-paste closer. Reference {future_role_type} specifically if {expected_timeline} is within_3_months or within_6_months. Ask a single clear question at the end: are they open to being contacted? Do not promise anything you cannot deliver.

**When to use it:** When you've interviewed a strong second-choice candidate who genuinely fits another opening you're about to post.

**Pro tip:** The single closing question ("would you be open to us reaching out?") converts this email from a rejection into a talent pipeline action — flag candidates who reply yes in your ATS immediately so they don't fall into a black hole when the new role goes live.

---

## Final-Stage and Offer-Decision Rejections

> You are an HR Manager rejecting a candidate who reached final interview stage but where the offer went to another candidate.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Company name: {company_name}
> Number of final-stage candidates: {final_stage_candidate_count}
> How close the decision was (internal calibration, do not quote): {very_close / clear_decision / marginal}
> Hiring manager signed off on rejection: {yes / no — HR sending independently}
> Tone: {warm_and_genuine / professional_and_clear}
>
> Write a 220 to 270 word rejection email. This is the hardest rejection to receive — the email should reflect that. Open by acknowledging how far they progressed. If {how_close_decision} is very_close, include one sentence acknowledging the decision was genuinely difficult without being hollow. Be clear an offer has been made to another candidate. Do not say "we were overwhelmed by talent" or any equivalent phrase. Offer a brief feedback call if appropriate — include one clear sentence inviting them to request it. Sign off warmly.

**When to use it:** When your final panel has made its choice and you need to contact the runner-up before the accepted candidate's verbal offer becomes public knowledge.

**Pro tip:** Send this within 24 hours of verbal offer acceptance — final-stage candidates often have competing processes running and are waiting on your outcome to make their own decisions. A delayed rejection at this stage is the most common trigger for negative employer brand posts.

---

> You are an HR Manager writing a final-stage rejection email for a candidate where the deciding factor was salary — they wanted more than the band allows.
>
> Candidate name: {candidate_first_name}
> Role: {job_title}
> Company name: {company_name}
> Salary band top: {salary_band_top}
> Candidate's stated expectation: {candidate_salary_expectation}
> Whether band flexibility is possible