---
title: "Free ChatGPT Prompts for User Story Writing Agile 2026: 25 Ready-to-Use Templates"
description: "25 proven ChatGPT prompts for agile user story writing. Copy, paste, fill variables, get production-ready stories in 30 seconds. For Product Managers."
profession: "Product Management"
category: "Agile"
contentType: prompt
tags: ["free chatgpt prompts for user story writing agile", "agile user story templates", "product manager story writing", "scrum user stories", "backlog refinement prompts"]
pubDate: 2026-05-13
featured: true
promptCount: 25
---

These prompts help Product Managers write user stories for sprint planning when the backlog refinement meeting is tomorrow and you need stories ready now. Copy any prompt, fill in the variables, paste into ChatGPT, and get production-ready user stories your dev team can estimate and build.

These prompts pair well with [Jasper AI](https://jasper.ai/?via=PLACEHOLDER) for Product Management-specific tone control, or [Copy.ai](https://copy.ai/?via=PLACEHOLDER) for fast iteration.

## Epic Breakdown Stories

> You are a Product Manager breaking down an epic into implementable user stories for sprint planning.
> 
> Epic: {epic_title}
> Target user: {primary_user_type}
> Business goal: {what_business_outcome_this_achieves}
> Technical constraints: {platform_limitations_or_dependencies}
> Sprint capacity: {story_points_available}
> Definition of done: {your_teams_completion_criteria}
> Priority dependencies: {what_must_be_built_first}
> 
> Write 5 to 7 user stories that break this epic into 2-week sprint chunks. Use "As a [user], I want [goal] so that [benefit]" format. Include acceptance criteria with 3 to 5 testable conditions per story. Arrange stories by dependency order. Keep each story under 8 story points based on typical velocity.

**When to use it:** Tuesday before sprint planning when you realize the epic you committed to is too big and needs decomposition by Thursday.

**Pro tip:** Add technical spikes as separate stories if your epic touches unfamiliar APIs or frameworks. Developers will thank you during estimation.

---

> You are a Product Manager writing user stories for a mobile app feature that needs cross-platform consistency.
> 
> Feature: {feature_name}
> Platforms: {ios_android_web}
> User persona: {primary_user_description}
> Current user pain point: {what_frustrates_users_now}
> Success metric: {measurable_outcome}
> Design system: {existing_component_library}
> Backend readiness: {api_status}
> 
> Write 4 user stories covering the core user journey across platforms. Include platform-specific acceptance criteria where iOS and Android behavior differs. Each story should deliver user value independently. Use given-when-then format for acceptance criteria. Target 5 story point stories maximum.

**When to use it:** When design handoff is complete but you need stories written before the iOS and Android teams start asking questions.

**Pro tip:** Call out platform differences explicitly in acceptance criteria. "iOS uses native date picker, Android uses material design variant" saves three Slack conversations.

---

> You are a Product Manager creating user stories for API integration work that non-technical stakeholders need to understand.
> 
> Integration: {third_party_service_name}
> Business driver: {why_we_need_this_integration}
> User-facing impact: {how_users_experience_this}
> Technical complexity: {simple_medium_complex}
> Data requirements: {what_data_gets_exchanged}
> Error scenarios: {what_happens_when_api_fails}
> Timeline pressure: {hard_deadline_or_flexible}
> 
> Write 3 user stories that explain this integration from the user perspective, not the technical implementation. Focus on user value in each story title. Include acceptance criteria covering happy path, error states, and performance expectations. Add definition of done that non-developers can verify.

**When to use it:** When engineering says "we need to integrate the payment API" and your stakeholders ask "what does that mean for users?"

**Pro tip:** Write one story for happy path, one for error handling, one for edge cases. It's easier to estimate three focused stories than one mega-integration story.

---

> You are a Product Manager writing user stories for a feature that replaces existing functionality users are attached to.
> 
> Legacy feature: {what_currently_exists}
> New feature: {replacement_functionality}
> User segment: {who_uses_old_feature_most}
> Migration complexity: {data_settings_preferences_to_preserve}
> User communication: {how_youll_announce_changes}
> Rollback plan: {if_new_feature_fails}
> Success criteria: {adoption_metrics}
> 
> Write 4 user stories covering feature replacement, user migration, rollback capability, and success measurement. Include acceptance criteria for preserving user data and settings. Address user change management in story descriptions. Plan for gradual rollout with feature flags.

**When to use it:** When you're sunsetting a feature that 40% of users love but the other 60% never discovered, and engineering needs implementation guidance.

**Pro tip:** Write the rollback story first. If you can't articulate how to undo the change, the feature isn't ready for users.

---

> You are a Product Manager creating user stories for performance optimization work that impacts user experience.
> 
> Performance issue: {specific_slowness_or_problem}
> Current metrics: {load_times_error_rates_user_complaints}
> Target improvement: {specific_speed_or_reliability_goal}
> User impact: {how_slowness_affects_user_workflow}
> Technical approach: {caching_optimization_infrastructure_changes}
> Measurement tools: {how_youll_track_improvement}
> Affected user segments: {power_users_mobile_users_enterprise}
> 
> Write 3 user stories that frame performance work as user value delivery. Include acceptance criteria with specific timing benchmarks. Address different user segments separately if performance impact varies. Make success measurable for QA testing.

**When to use it:** When your engineering team wants to "make things faster" but you need user-focused stories that justify sprint capacity to stakeholders.

**Pro tip:** Include baseline measurements in acceptance criteria. "Page loads in under 2 seconds" is testable; "page loads faster" creates arguments.

## Backlog Refinement Stories

> You are a Product Manager preparing user stories for backlog refinement when requirements are still evolving.
> 
> Feature concept: {high_level_feature_idea}
> User research findings: {key_insights_from_recent_research}
> Stakeholder requests: {what_business_stakeholders_want}
> Technical unknowns: {what_engineering_needs_to_investigate}
> Competitive pressure: {what_competitors_have_launched}
> Resource constraints: {team_size_timeline_budget_limits}
> User priority: {high_medium_low_based_on_user_feedback}
> 
> Write 2 user stories ready for story pointing plus 1 technical spike story for unknowns. Focus stories on core user value that everyone agrees on. Include acceptance criteria for testable outcomes only. Flag assumptions that need validation. Keep scope minimal for initial version.

**When to use it:** Sunday night before Monday refinement when you realize half your stories aren't ready for estimation because requirements keep shifting.

**Pro tip:** Lead with the spike story during refinement. Get technical unknowns estimated first so the feature stories make sense to developers.

---

> You are a Product Manager writing user stories for accessibility compliance that needs to ship this quarter.
> 
> Compliance standard: {wcag_ada_section_508_requirements}
> Current accessibility gaps: {specific_issues_found_in_audit}
> Affected user groups: {screen_reader_users_mobility_impaired_etc}
> Legal timeline: {compliance_deadline}
> Testing approach: {automated_tools_manual_testing_user_testing}
> Priority screens: {most_critical_user_flows_to_fix}
> Success measurement: {audit_scores_user_feedback}
> 
> Write 4 user stories covering high-impact accessibility improvements. Frame each story from the perspective of users with disabilities. Include acceptance criteria using accessibility testing tools. Prioritize stories by compliance risk and user impact. Make each story independently valuable.

**When to use it:** When legal says "we need accessibility compliance" and you need stories that developers can estimate and implement without becoming accessibility experts overnight.

**Pro tip:** Pair each accessibility story with specific testing instructions. "Verify with VoiceOver on iOS" is actionable; "ensure accessibility" is not.

---

> You are a Product Manager creating user stories for A/B test implementation that engineering can build and measure.
> 
> Hypothesis: {what_you_believe_will_improve_user_behavior}
> Test variants: {control_version_vs_treatment_version}
> Target metrics: {conversion_engagement_retention_revenue}
> User segment: {who_gets_included_in_test}
> Test duration: {how_long_test_needs_to_run}
> Technical requirements: {feature_flags_analytics_tracking}
> Success criteria: {statistical_significance_business_impact}
> 
> Write 3 user stories covering test setup, variant delivery, and results measurement. Include acceptance criteria for tracking implementation and statistical validity. Address both user experience and data collection requirements. Plan for test conclusion and winner rollout.

**When to use it:** When you want to test a controversial design change but need stories written before the data team starts asking about tracking requirements.

**Pro tip:** Write the "analyze results" story with your data analyst. They'll catch tracking requirements you missed and save debugging time later.

---

> You are a Product Manager writing user stories for customer support feature requests that keep generating tickets.
> 
> Support ticket theme: {common_user_problem_from_support_queue}
> Ticket volume: {how_many_tickets_per_week}
> Current workaround: {how_support_team_helps_users_now}
> User frustration level: {low_medium_high_based_on_ticket_tone}
> Support team impact: {time_spent_on_these_tickets}
> Proposed solution: {feature_change_that_eliminates_tickets}
> Success measurement: {ticket_reduction_user_satisfaction}
> 
> Write 2 user stories that address the root cause of support tickets, not just symptoms. Include acceptance criteria that eliminate the need for current workarounds. Frame stories from user perspective, not support team perspective. Add definition of done that support can verify.

**When to use it:** When your support team says "if we just built X, we'd eliminate 200 tickets per month" and you need stories to get it prioritized.

**Pro tip:** Include your support lead in story acceptance criteria review. They know edge cases that users hit but never make it into requirements documents.

---

> You are a Product Manager creating user stories for onboarding improvement based on user drop-off data.
> 
> Drop-off point: {specific_step_where_users_abandon_onboarding}
> Current completion rate: {percentage_who_finish_onboarding}
> User feedback: {common_complaints_about_onboarding_flow}
> Business impact: {revenue_or_adoption_lost_to_poor_onboarding}
> Proposed changes: {specific_improvements_to_test}
> Success metrics: {completion_rate_time_to_value_activation}
> User segments: {different_user_types_with_different_needs}
> 
> Write 3 user stories targeting onboarding friction points. Focus on user motivation and early value delivery. Include acceptance criteria for measuring improvement. Address different user segments if onboarding needs vary. Plan for iterative testing and improvement.

**When to use it:** When user activation metrics are terrible and you need to fix onboarding, but the stories need to be specific enough for developers to implement.

**Pro tip:** Write onboarding stories from the perspective of a user's first session. "As a first-time user trying to understand if this app solves my problem" hits differently than generic onboarding stories.

## Cross-Team Collaboration Stories

> You are a Product Manager writing user stories for a feature requiring coordination between mobile, backend, and data teams.
> 
> Feature scope: {what_users_will_experience}
> Team dependencies: {which_teams_need_to_deliver_what}
> Integration points: {where_systems_connect}
> Data requirements: {tracking_storage_reporting_needs}
> Timeline constraints: {hard_deadlines_or_milestones}
> Risk factors: {what_could_delay_or_break_coordination}
> Success criteria: {user_outcome_and_business_metrics}
> 
> Write 4 user stories that can be developed in parallel by different teams. Include acceptance criteria covering integration points and data handoffs. Specify team responsibilities clearly. Add definition of done that requires cross-team verification before story completion.

**When to use it:** When you're coordinating a feature across three teams who all attend different standups and you need stories that prevent finger-pointing when something breaks.

**Pro tip:** Schedule integration testing as a separate story with all teams involved. Don't assume individual team stories will work together without explicit coordination.

---

> You are a Product Manager creating user stories for marketing feature requests that impact product development.
> 
> Marketing campaign: {specific_campaign_or_promotion}
> User experience change: {how_product_behavior_needs_to_change}
> Campaign timeline: {launch_date_and_duration}
> Target audience: {user_segment_for_campaign}
> Success measurement: {campaign_metrics_and_product_metrics}
> Technical complexity: {simple_configuration_vs_new_development}
> Rollback requirements: {how_to_turn_off_after_campaign}
> 
> Write 3 user stories covering campaign setup, user experience during campaign, and post-campaign cleanup. Include acceptance criteria for campaign configuration and measurement. Plan for campaign start/stop functionality. Address user experience for both targeted and non-targeted users.

**When to use it:** When marketing announces a Black Friday campaign that needs product changes, and the campaign launches in two sprints whether you're ready or not.

**Pro tip:** Write the "turn off campaign" story before writing the "launch campaign" story. Marketing campaigns that can't be disabled become permanent technical debt.

---

> You are a Product Manager writing user stories for customer success team requests about enterprise user management.
> 
> Enterprise client: {company_or_client_segment}
> Current limitation: {what_enterprise_users_cannot_do}
> Business impact: {revenue_risk_or_expansion_opportunity}
> User workflow: {how_enterprise_admins_work_differently}
> Compliance needs: {security_audit_reporting_requirements}
> Scale requirements: {number_of_users_data_volume}
> Success criteria: {client_satisfaction_expansion_revenue}
> 
> Write 3 user stories addressing enterprise user administration needs. Focus on admin user workflows and permissions. Include acceptance criteria for scale and compliance requirements. Address both end-user and administrator perspectives in separate stories.

**When to use it:** When customer success says "our biggest client needs admin controls or they'll churn" and you need to translate enterprise requirements into developable stories.

**Pro tip:** Interview the actual enterprise admin users, not just your customer success team. Admin workflows are more complex than internal teams realize.

---

> You are a Product Manager creating user stories for sales tool integration that impacts user-facing product.
> 
> Sales tool: {crm_or_sales_platform_name}
> Integration purpose: {why_sales_team_needs_product_data}
> User data involved: {what_user_information_gets_shared}
> Sales workflow: {how_sales_team_uses_integrated_data}
> User privacy impact: {how_integration_affects_user_experience}
> Compliance requirements: {gdpr_privacy_security_needs}
> Success measurement: {sales_efficiency_user_satisfaction}
> 
> Write 2 user stories covering user consent for data sharing and sales team data access. Include acceptance criteria for privacy compliance and user control. Address user transparency about data sharing. Plan for user opt-out capability.

**When to use it:** When sales wants to integrate HubSpot with your product and you need stories that protect user privacy while enabling sales workflows.

**Pro tip:** Write user privacy stories first, sales efficiency stories second. It's easier to add sales features than to retrofit privacy compliance.

---

> You are a Product Manager writing user stories for executive dashboard requests that require new data collection.
> 
> Executive audience: {ceo_board_investors_department_heads}
> Metrics requested: {specific_kpis_executives_want_to_track}
> Current data gaps: {what_metrics_arent_currently_measured}
> Reporting frequency: {real_time_daily_weekly_monthly}
> User behavior tracking: {new_events_or_data_points_needed}
> Privacy considerations: {user_consent_anonymization_requirements}
> Technical implementation: {analytics_platform_database_changes}
> 
> Write 3 user stories covering new user tracking, data processing, and executive reporting. Frame tracking stories from user perspective with clear value exchange. Include acceptance criteria for data accuracy and privacy compliance. Plan for gradual rollout of new tracking.

**When to use it:** When the CEO asks for metrics you don't currently track, and you need to implement user tracking without degrading user experience.

**Pro tip:** Audit existing analytics before adding new tracking. You might already capture the data executives want, just not in the format they expect.

## User Research Integration Stories

> You are a Product Manager creating user stories based on recent usability testing that revealed workflow problems.
> 
> Usability test findings: {specific_user_struggles_observed}
> User tasks tested: {what_users_were_trying_to_accomplish}
> Failure points: {where_users_got_confused_or_stuck}
> User quotes: {actual_user_feedback_from_testing}
> Current design assumptions: {what_we_thought_users_would_do}
> Proposed solutions: {design_changes_to_test}
> Success measurement: {task_completion_rates_user_satisfaction}
> 
> Write 4 user stories addressing major usability issues discovered in testing. Include acceptance criteria based on observed user behavior, not assumptions. Reference specific user quotes in story descriptions. Plan for follow-up usability validation after implementation.

**When to use it:** When user research delivers a 20-slide deck of usability problems and you need stories that fix the highest-impact issues first.

**Pro tip:** Include actual user quotes in acceptance criteria. "User can complete checkout without asking 'where do I enter my address'" is more specific than "improve checkout usability."

---

> You are a Product Manager writing user stories for persona-based feature differentiation discovered through user interviews.
> 
> Primary persona: {main_user_type_and_their_goals}
> Secondary persona: {different_user_type_with_different_needs}
> Behavioral differences: {how_these_users_approach_tasks_differently}
> Feature usage patterns: {what_each_persona_values_most}
> Interview insights: {direct_quotes_about_user_needs}
> Current one-size-fits-all problems: {where_current_design_fails_both_personas}
> Personalization opportunities: {how_to_adapt_experience_per_persona}
> 
> Write 3 user stories creating persona-specific user experiences. Include acceptance criteria for detecting user type and adapting interface. Address onboarding and ongoing experience customization. Plan for measuring persona-specific success metrics.

**When to use it:** When user research proves your power users and casual users need completely different experiences, but you've been designing for an imaginary "average" user.

**Pro tip:** Start with onboarding persona detection before building persona-specific features. You can't personalize experience until you know which persona you're serving.

---

> You are a Product Manager creating user stories for accessibility improvements identified through disabled user testing.
> 
> User testing participants: {types_of_disabilities_represented}
> Specific barriers found: {what_prevented_task_completion}
> Assistive technology used: {screen_readers_voice_control_etc}
> User workarounds observed: {how_users_currently_cope_with_barriers}
> High-impact fixes: {changes_that_help_most_users}
> User feedback quotes: {direct_quotes_about_experience}
> Success measurement: {task_completion_user_satisfaction_for_disabled_users}
> 
> Write 3 user stories addressing critical accessibility barriers found in user testing. Include acceptance criteria based on assistive technology compatibility. Reference specific user testing observations. Plan for follow-up testing with disabled users after implementation.

**When to use it:** When you've done accessibility user testing with actual disabled users and discovered your "accessible" design still creates barriers.

**Pro tip:** Recruit the same disabled users for post-implementation testing. They'll catch regressions and validate improvements better than automated accessibility tools.

---

> You are a Product Manager writing user stories for mobile user behavior insights that conflict with desktop user patterns.
> 
> Mobile user behavior: {how_mobile_users_interact_differently}
> Desktop user behavior: {how_desktop_patterns_dont_work_on_mobile}
> Context differences: {when_where_why_users_choose_each_platform}
> Feature usage variance: {what_mobile_users_prioritize_vs_desktop}
> Performance expectations: {mobile_user_tolerance_for_loading_complexity}
> Research methodology: {user_testing_analytics_surveys_used}
> Success metrics: {mobile_specific_conversion_engagement_goals}
> 
> Write 4 user stories optimizing mobile user experience based on observed behavior differences. Include acceptance criteria for mobile-specific success metrics. Address context-aware functionality and mobile performance requirements. Plan for mobile-first design validation.

**When to use it:** When mobile analytics show completely different user behavior than desktop, but your product treats mobile like "small desktop" instead of a different user context.

**Pro tip:** Test mobile stories on actual mobile devices, not browser developer tools. Real thumb navigation reveals usability issues that simulated mobile testing misses.

---

> You are a Product Manager creating user stories for international user research findings about cultural usability preferences.
> 
> Target markets: {specific_countries_or_cultural_regions}
> Cultural differences found: {how_users_in_different_markets_behave}
> Localization gaps: {beyond_translation_what_needs_cultural_adaptation}
> User workflow preferences: {how_task_completion_varies_by_culture}
> Trust and credibility factors: {what_makes_users_comfortable_by_region}
> Payment and privacy expectations: {regional_differences_in_user_expectations}
> Success metrics: {market_specific_adoption_engagement_goals}
> 
> Write 3 user stories addressing cultural usability adaptation for international markets. Include acceptance criteria for cultural appropriateness and local user behavior patterns. Address market-specific trust factors and workflow preferences. Plan for regional user testing validation.

**When to use it:** When you're expanding internationally and user research shows that direct translation doesn't work because users in different markets have completely different expectations.

**Pro tip:** Include local team members in story acceptance criteria review. Cultural nuances are easily missed by teams who don't live in the target market.

## Frequently Asked Questions

### What makes a good user story for agile development teams?
A good agile user story focuses on user value, includes testable acceptance criteria, and can be completed in one sprint. It follows the "As a [user], I want [goal] so that [benefit]" format with specific constraints and measurable outcomes that developers can estimate and QA can verify.

### How do I write user stories when requirements keep changing during development?
Start with the user value that everyone agrees on, then add acceptance criteria only for testable outcomes. Flag assumptions explicitly and create separate spike stories for technical unknowns. This lets teams estimate core user value while investigating unclear requirements in parallel.

### Should user stories include technical implementation details?
User stories should focus on user outcomes, not technical implementation. However, include technical constraints that affect user experience, like performance requirements, platform compatibility, or integration dependencies. Let developers choose implementation approaches that deliver the user value specified in acceptance criteria.