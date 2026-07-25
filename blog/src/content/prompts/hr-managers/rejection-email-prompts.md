---
title: "25 ChatGPT Prompts for Candidate Rejection Emails in 2026"
description: "25 ready-to-use ChatGPT prompts for candidate rejection emails. HR Managers fill in variables and get a send-ready draft in under a minute."
profession: "HR Managers"
category: "Recruitment"
contentType: prompt
tags: ["chatgpt prompts for candidate rejection emails", "ai rejection email prompts", "candidate decline email chatgpt", "hr rejection letter prompts", "automated candidate rejection messages"]
pubDate: 2026-07-25
featured: true
promptCount: 25
---

This page is for HR Managers who need to send rejection emails today, not draft a process for sending them next quarter. Each prompt below produces a finished email you can copy, adjust one or two lines, and send. Fill in the variables, paste the prompt into ChatGPT or Claude, and you're done.

These prompts pair well with [Jasper AI](https://jasper.ai/affiliates) for HR Managers-specific tone control, or [Copy.ai](https://www.copy.ai/affiliates) for fast iteration across high-volume rejection batches.

---

## Early-Stage Rejections: After Application Review

> You are an HR Manager sending a post-application rejection email to a candidate who applied online but was not selected for a phone screen.
>
> Candidate name: {candidate_name}
> Role applied for: {job_title}
> Company name: {company_name}
> Reason category (do not state directly): {reason: underqualified / role filled internally / location mismatch / too many applicants}
> Tone: {warm_and_brief / professional_and_neutral}
> Encourage to reapply in future: {yes / no}
>
> Write a 100 to 130 word rejection email. Do not mention the reason category explicitly. Open by thanking them for applying. State clearly they will not be moving forward. If reapply is yes, include one sentence inviting them to watch for future openings. Close warmly. Do not use phrases like "we regret to inform you" or "unfortunately at this time."

**When to use it:** Monday morning when you have 40 unreviewed applications to clear and need to action the obvious no-fits before your 10am hiring manager call.

**Pro tip:** Set `{reason}` to `too many applicants` only when it's genuinely true — candidates increasingly ask for feedback and "too many applicants" with no other context reads as a brush-off. If the real reason is a skills gap, set `underqualified` so the AI keeps the language appropriately vague but accurate.

---

> You are an HR Manager writing a rejection email to a candidate who submitted a CV for a role that has already been filled internally before it was formally closed.
>
> Candidate name: {candidate_name}
> Role applied for: {job_title}
> Department: {department}
> Company name: {company_name}
> Time since application: {days_since_application} days
> Tone: {apologetic_and_brief / straightforward}
>
> Write a 90 to 120 word rejection email. Acknowledge the delay if `{days_since_application}` is over 14 days. Explain the role has been filled without naming the internal candidate. Do not invite speculation about the process. Close by thanking them for their interest and wishing them well.

**When to use it:** When a req closes internally mid-pipeline and you have five to fifteen candidates still technically active who were never formally told.

**Pro tip:** If `{days_since_application}` is over 30 days, add one sentence of genuine apology for the delay — candidates who have been waiting that long and receive no acknowledgement of the wait post negatively on Glassdoor at a much higher rate.

---

> You are an HR Manager writing a high-volume batch rejection email for candidates who applied to an entry-level role that received over 200 applications. You need one email that feels personal enough not to damage employer brand.
>
> Role title: {job_title}
> Company name: {company_name}
> Number of applicants (approximate, for internal context only): {applicant_volume}
> Stage reached: {cv_screen / initial_application}
> Tone: {warm / neutral}
> Company career page URL: {careers_page_url}
>
> Write a 110 to 140 word rejection email suitable for sending to all non-shortlisted applicants at this stage. Use {candidate_name} as a merge field placeholder so the sender knows where to insert it. Do not promise individual feedback. Include one sentence pointing to the careers page. Do not use passive constructions like "a decision has been made."

**When to use it:** After closing a high-volume graduate or entry-level role where you need to reject 180 people before the shortlist interviews start on Thursday.

**Pro tip:** Keep `{careers_page_url}` in the prompt even if it feels like a small detail — when the AI includes it in the draft, it saves you the manual step of adding it to 180 outgoing emails and reduces the chance it gets forgotten entirely.

---

> You are an HR Manager writing a rejection email to a candidate whose application was strong but who applied for a role in a location they are not able to commute to or relocate for, based on their stated preferences.
>
> Candidate name: {candidate_name}
> Role applied for: {job_title}
> Office location: {office_location}
> Candidate's stated location: {candidate_location}
> Remote work availability for this role: {fully_remote / hybrid / on_site_only}
> Company name: {company_name}
>
> Write a 120 to 150 word rejection email. Do not frame location as a failing. Acknowledge their application positively without inflating expectations. If `{remote_work_availability}` is hybrid or on_site_only, note this clearly as the reason. Close by encouraging them to monitor future remote or hybrid openings if they exist. Do not imply the company will contact them — only that they can check back.

**When to use it:** When you have a genuinely strong candidate you'd have shortlisted if the role weren't tied to a specific office, and you want the email to reflect that without creating false hope.

**Pro tip:** Avoid phrases like "we hope our paths cross again" — they read as hollow. The AI sometimes generates these by default; if the draft includes them, delete and replace with a specific action like "check our careers page for remote roles."

---

> You are an HR Manager writing a rejection email to a candidate who applied speculatively without a live vacancy existing for their skill set.
>
> Candidate name: {candidate_name}
> Candidate's apparent specialism: {specialism}
> Company name: {company_name}
> Likelihood of relevant future vacancy: {high / low / uncertain}
> Tone: {encouraging / neutral}
> Retain in talent pool: {yes / no}
>
> Write a 100 to 130 word email. Acknowledge the speculative application. Confirm there is no current vacancy matching their profile. If `{retain_in_talent_pool}` is yes, include a clear opt-in invitation with one sentence explaining what that means. If no, close cleanly without implying future contact. Do not use "we'll keep your CV on file" as a phrase — it implies more than HR typically delivers.

**When to use it:** When your careers inbox has accumulated three weeks of speculative CVs and you need to clear them before a recruitment audit.

**Pro tip:** If you set `{retain_in_talent_pool}` to yes, make sure your ATS actually has a talent pool tag ready before sending. The email creates an expectation — if the system isn't set up to surface that candidate when a vacancy opens, the message does more damage than a clean rejection.

---

## Post-Phone-Screen Rejections

> You are an HR Manager writing a rejection email after a 20 to 30 minute phone screen where the candidate did not meet the minimum requirements for the role.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Company name: {company_name}
> Specific gap identified (for internal framing, do not quote directly): {gap: years_experience / technical_skill / salary_mismatch / availability}
> Tone: {direct_and_respectful / warm}
> Interviewer name: {interviewer_name}
>
> Write a 130 to 160 word rejection email from {interviewer_name}. Thank them for their time on the call. Confirm they are not moving forward. Do not state the gap explicitly, but do not give vague non-reasons. Use phrasing that reflects the category — for salary_mismatch use "the package for this role doesn't align with your expectations", for availability use "the start date and your current notice period don't align for this hire." Close with genuine good wishes. Do not invite a reply asking for more detail unless you intend to respond.

**When to use it:** The afternoon after a run of phone screens where two or three candidates clearly weren't a fit and you need the rejections out before close of business.

**Pro tip:** The `{gap: salary_mismatch}` path is the most important to personalise — candidates who are rejected post-screen for salary reasons often reapply later at the right level, and a vague "not the right fit" email kills that goodwill permanently.

---

> You are an HR Manager writing a rejection email to a candidate who passed the phone screen but whose availability or notice period makes them unworkable for this hire cycle.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Company name: {company_name}
> Candidate's notice period: {notice_period}
> Role's required start date: {required_start_date}
> Gap in weeks: {gap_in_weeks}
> Open to future consideration: {yes / no}
>
> Write a 120 to 150 word email. Be direct about the timing mismatch — do not imply other reasons. If `{open_to_future_consideration}` is yes, include one sentence that names this specifically and tells the candidate what to do (e.g. reapply, email a named contact). Close warmly. Do not use "we will be in touch" if future contact is not guaranteed.

**When to use it:** When a strong candidate is sitting at a 3-month notice period and the hiring manager needs someone in 6 weeks — and you want to leave the door open for the next hire without overpromising.

**Pro tip:** Include the actual `{gap_in_weeks}` in the prompt so the AI produces specific language rather than generic "timing doesn't work" phrasing. Specificity signals respect — candidates remember it.

---

> You are an HR Manager writing a rejection email to a candidate after a phone screen where culture fit concerns were raised by the interviewer, but there is no single concrete reason you can state.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Company name: {company_name}
> Interviewer's concern (internal, do not quote): {concern: communication_style / energy_mismatch / values_conflict / unclear_motivation}
> Tone: {professional_and_brief}
> Offer to provide any feedback: {yes / no}
>
> Write a 110 to 130 word rejection email. Do not use the word "culture fit" — it has legal and perception risks. Use neutral, role-specific language such as "after our conversation we don't feel this role is the right match at this stage." Do not over-explain. If `{offer_to_provide_feedback}` is yes, add one sentence offering a brief call, but only if you are genuinely available to take it.

**When to use it:** When the interviewer has said "just not the right vibe" and you need to translate that into something legally defensible and professionally respectful before end of day.

**Pro tip:** Never let the AI use the phrase "cultural fit" in a rejection email — it appears in discrimination claims at a disproportionate rate. If the draft includes it, regenerate. This prompt instructs against it, but always check the output.

---

> You are an HR Manager writing a rejection email after a phone screen where the candidate was clearly overqualified and would likely leave within six months, but you cannot state this as a reason.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Seniority of role: {junior / mid-level}
> Company name: {company_name}
> Candidate's evident experience level: {candidate_level: senior / director / vp}
> Tone: {respectful_and_direct}
>
> Write a 120 to 140 word rejection email. Do not use the word "overqualified" — it can imply age bias in some jurisdictions. Frame the decision around role scope and the level of challenge the position offers. Keep it specific to the role, not the candidate's career history. Close by acknowledging their calibre without inviting false expectations.

**When to use it:** When a senior candidate applied for a junior role and you want to reject them without implying their experience is the problem — because legally and ethically, that's the right framing.

**Pro tip:** "Overqualified" rejections are among the most frequently challenged. Run the AI output through one read specifically checking for age-adjacent language like "extensive career history" or "many years of experience" — remove both if present.

---

> You are an HR Manager writing a rejection email to a candidate who passed the phone screen but whose salary expectations came in significantly above the approved band for the role.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Company name: {company_name}
> Approved salary band top: {band_ceiling}
> Candidate's stated expectation: {candidate_expectation}
> Role open to renegotiation: {yes / no}
> Tone: {transparent_and_professional}
>
> Write a 130 to 160 word rejection email. Be direct about the salary gap — state clearly that the approved budget is {band_ceiling} and the role cannot move beyond this. Do not soften it to the point of ambiguity. If `{role_open_to_renegotiation}` is yes, include one sentence asking if they'd be willing to discuss the package further. If no, close cleanly without suggesting a workaround that doesn't exist.

**When to use it:** When a candidate has quoted £20,000 above your approved band and your hiring manager won't move — and you want to close the loop cleanly rather than ghosting.

**Pro tip:** Including the actual `{band_ceiling}` figure in the prompt produces an email with the number in it. This is deliberate — candidates who know the exact band sometimes come back at the right level on a future role. Vague rejections for salary reasons waste everyone's time.

---

## Post-Interview Rejections: First and Second Round

> You are an HR Manager writing a rejection email after a first-round panel interview for a mid-level role. The candidate performed adequately but another candidate was significantly stronger.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Company name: {company_name}
> Panel interview date: {interview_date}
> Specific strength to acknowledge: {one_genuine_strength}
> Offer written feedback: {yes / no}
> Tone: {warm_and_honest / professional_and_brief}
>
> Write a 150 to 180 word rejection email. Thank them for their time at interview on {interview_date}. Acknowledge {one_genuine_strength} specifically — not generically. State clearly they have not been successful. If `{offer_written_feedback}` is yes, offer it explicitly and state a response window (e.g. "reply within 5 working days"). Do not say "we had many strong candidates" — it is overused and adds nothing.

**When to use it:** After a first-round interview day where you've selected your shortlist and need to inform the remaining candidates before you move to second round.

**Pro tip:** The `{one_genuine_strength}` variable is worth spending 30 seconds on per candidate — when the AI includes a real, specific strength, the rejection reads completely differently. Candidates who receive specific acknowledgement are more likely to reapply and less likely to leave negative reviews.

---

> You are an HR Manager writing a rejection email to a candidate who reached the final two for a senior manager role but was not selected. The decision was close. The candidate invested significant time in the process, including a presentation.
>
> Candidate name: {candidate_name}
> Role: {job_title}
> Company name: {company_name}
> Number of interview rounds completed: {rounds_completed}
> Presentation or task completed: {yes / no}
> Hiring manager willing to give verbal feedback: {yes / no}
> Tone: {warm_and_genuine}
>
> Write a 200 to 240 word rejection email. Open by acknowledging the