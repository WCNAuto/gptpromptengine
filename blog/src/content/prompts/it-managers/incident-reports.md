---
title: "Free ChatGPT Prompts for IT Incident Report Writing (2026 Complete Guide)"
description: "25 ready-to-use ChatGPT prompts for IT incident reports. Copy, paste, fill variables, get professional documentation in 30 seconds."
profession: "IT Managers"
category: "Incidents"
contentType: prompt
tags: ["free chatgpt prompts for it incident report writing", "IT incident documentation templates", "ChatGPT prompts for system outages", "incident response reporting", "IT crisis communication prompts"]
pubDate: 2026-05-13
featured: true
promptCount: 25
---

Ready-to-use ChatGPT prompts for IT incident reports that actually get results. Copy any prompt, fill in the variables, and get professional incident documentation in under a minute. These prompts produce finished reports, not templates you still need to complete.

These prompts pair well with [Jasper AI](https://jasper.ai) for IT Managers-specific tone control, or [Copy.ai](https://www.copy.ai) for fast iteration.

## Critical System Outages

> You are an IT Manager writing an incident report for a critical system outage that affected business operations.
>
> Incident: {incident_title}
> System affected: {system_name}
> Start time: {outage_start_time_date}
> End time: {outage_end_time_date}
> Business impact: {revenue_loss_or_user_count_affected}
> Root cause: {technical_root_cause}
> Discovery method: {how_outage_was_detected}
> Stakeholders notified: {list_of_people_departments_notified}
> Recovery actions: {steps_taken_to_restore_service}
>
> Write a 400-500 word incident report using the ITIL framework. Start with executive summary in 2 sentences. Include timeline section with specific timestamps. End with 3 concrete action items to prevent recurrence, each with owner and due date.

**When to use it:** Tuesday morning after a weekend system failure when executives need the full story before the 9am leadership meeting.

**Pro tip:** Always convert technical jargon in the root cause to business language in the executive summary. CTO reads the summary, engineers read the timeline.

---

> You are documenting a database corruption incident that caused data integrity issues across multiple applications.
>
> Database: {database_name_version}
> Corruption discovered: {discovery_date_time}
> Data affected: {table_names_or_record_count}
> Applications impacted: {affected_application_list}
> Detection method: {monitoring_alert_user_report}
> Recovery time: {total_hours_minutes_to_fix}
> Data recovery status: {fully_recovered_partial_loss_percentage}
> Team members involved: {names_and_roles}
>
> Create a 300-350 word technical incident report. Open with impact statement quantifying affected records. Include recovery procedure section with step-by-step actions taken. Close with lessons learned focusing on monitoring gaps.

**When to use it:** When your backup worked but you need to document the scary 4-hour window where customer data was at risk.

**Pro tip:** Include the exact SQL commands or backup procedures used in recovery. Future incidents move faster when the playbook is already written.

---

> You are writing an incident report for a security breach that triggered your incident response plan.
>
> Breach type: {malware_phishing_unauthorized_access}
> Discovery time: {when_breach_was_detected}
> Affected systems: {list_of_compromised_systems}
> Data at risk: {customer_data_financial_internal_none}
> Response team: {security_team_members_external_vendors}
> Containment time: {hours_to_isolate_threat}
> Investigation status: {ongoing_complete_external_review}
> Compliance requirements: {GDPR_HIPAA_SOX_none}
>
> Write a 500-600 word security incident report suitable for compliance audit. Start with breach classification and severity level. Include detailed containment actions. End with regulatory notification requirements and timeline.

**When to use it:** When legal needs documentation for insurance claims or regulatory bodies want proof of proper incident response.

**Pro tip:** Keep technical attack vectors separate from business impact sections. Auditors care about process compliance, not exploitation techniques.

---

> You are documenting a network infrastructure failure that affected multiple office locations.
>
> Network component: {router_switch_firewall_ISP_connection}
> Failure time: {exact_timestamp_of_failure}
> Locations affected: {office_names_or_regions}
> Users impacted: {employee_count_and_departments}
> Redundancy status: {failover_worked_failed_not_configured}
> Vendor involvement: {ISP_name_support_ticket_number}
> Workaround implemented: {mobile_hotspots_alternate_connection}
> Business continuity: {remote_work_office_closure_reduced_capacity}
>
> Create a 350-400 word network incident report. Begin with service availability impact percentage. Detail failover performance and gaps. Conclude with infrastructure resilience recommendations.

**When to use it:** Friday afternoon when the internet dies and everyone's asking why the backup connection didn't kick in automatically.

**Pro tip:** Calculate actual downtime vs. theoretical RTO from your disaster recovery plan. The gap becomes your budget justification for infrastructure upgrades.

---

> You are writing an incident report for a cloud service provider outage that affected your SaaS applications.
>
> Cloud provider: {AWS_Azure_GCP_other}
> Service affected: {specific_service_name_region}
> Provider incident ID: {cloud_providers_reference_number}
> Our applications impacted: {list_of_your_affected_apps}
> Customer notification: {when_how_customers_were_informed}
> SLA credits: {estimated_credit_amount_or_none}
> Mitigation attempts: {what_your_team_tried_during_outage}
> Recovery verification: {how_you_confirmed_services_restored}
>
> Write a 250-300 word third-party incident report. Open with provider acknowledgment and reference number. Focus on your response actions, not provider's technical details. End with SLA impact assessment.

**When to use it:** When AWS has a bad day and your CEO wants to know why your "cloud-first" strategy didn't prevent the outage.

**Pro tip:** Reference the provider's public status page timeline, but emphasize your proactive customer communication. Shows you own the relationship even when you don't own the infrastructure.

## Security Incidents

> You are documenting a phishing attack that compromised employee email accounts and potentially exposed sensitive information.
>
> Attack vector: {email_link_attachment_description}
> Compromised accounts: {number_and_departments_affected}
> Data potentially accessed: {customer_files_financial_data_passwords}
> Detection source: {user_report_security_tool_IT_monitoring}
> Response time: {hours_from_detection_to_containment}
> Remediation steps: {password_resets_account_lockouts_training}
> External notifications: {customers_partners_regulatory_none}
> Attack sophistication: {basic_targeted_advanced_persistent}
>
> Create a 450-500 word security incident report for executive briefing. Start with attack timeline and scope. Include detailed response actions taken by your team. Finish with user training recommendations and budget implications.

**When to use it:** Monday morning when HR forwards you the "I think I clicked something bad" email from Friday evening.

**Pro tip:** Quantify the potential exposure even if no actual data theft occurred. "Could have accessed 10,000 customer records" gets security budget approved faster than "no confirmed breach."

---

> You are writing an incident report for ransomware that encrypted production servers but was stopped by your backup and recovery procedures.
>
> Malware variant: {ransomware_name_or_type}
> Initial infection: {email_USB_network_vulnerability}
> Encrypted systems: {server_names_and_functions}
> Ransom demand: {amount_and_cryptocurrency_type}
> Backup integrity: {clean_backups_available_or_compromised}
> Recovery time: {total_hours_to_restore_operations}
> Business disruption: {departments_affected_revenue_impact}
> Law enforcement: {FBI_local_police_reported_or_not}
>
> Write a 400-450 word ransomware incident report emphasizing successful recovery. Open with attack containment success. Detail backup restoration process. Close with insurance claim requirements and preventive improvements.

**When to use it:** When your disaster recovery plan actually worked and you need to document why paying the ransom wasn't necessary.

**Pro tip:** Include the exact backup age and recovery point objective achieved. Insurance companies reduce premiums when you prove your backup strategy works under pressure.

---

> You are documenting unauthorized access to your network through a compromised VPN account with elevated privileges.
>
> Compromised account: {username_and_privilege_level}
> Access duration: {estimated_time_attacker_was_in_network}
> Systems accessed: {servers_databases_applications_viewed}
> Geographic indicators: {login_location_IP_addresses}
> Privilege escalation: {additional_accounts_or_systems_compromised}
> Detection method: {SIEM_alert_unusual_activity_user_report}
> Forensic findings: {files_accessed_data_exfiltrated_malware_installed}
> Account security: {2FA_enabled_password_complexity_last_change}
>
> Create a 500-550 word privileged access incident report suitable for cyber insurance claim. Begin with breach scope and data classification. Include forensic investigation timeline. End with identity management improvements.

**When to use it:** When your SIEM dashboard lights up like Christmas and the suspicious login came from a country where none of your employees are vacationing.

**Pro tip:** Document the exact privileged access the compromised account had, not just what the attacker used. Insurance adjusters want to know worst-case exposure, not actual damage.

---

> You are writing an incident report for a SQL injection attack that was blocked by your web application firewall before reaching the database.
>
> Target application: {application_name_and_version}
> Attack pattern: {SQL_injection_technique_used}
> WAF protection: {security_tool_name_and_rule_triggered}
> Attack frequency: {number_of_attempts_over_time_period}
> Source analysis: {IP_addresses_geographic_origin}
> Vulnerability scan: {confirmed_patch_status_of_application}
> Log retention: {attack_data_preserved_for_analysis}
> Performance impact: {application_slowdown_or_normal_operation}
>
> Write a 300-350 word attempted breach report focusing on defense effectiveness. Start with attack prevention success. Include threat intelligence analysis. Conclude with application security validation results.

**When to use it:** Wednesday afternoon when your security tools actually did their job and you want to prove to the board that the cybersecurity budget was worth it.

**Pro tip:** Include attack geolocation and timing patterns. Repeated attacks from the same region suggest targeted reconnaissance, not random scanning.

---

> You are documenting a data leak incident where employee personal information was accidentally exposed through a misconfigured cloud storage bucket.
>
> Data exposed: {employee_records_payroll_medical_background_checks}
> Exposure duration: {days_weeks_data_was_publicly_accessible}
> Discovery method: {security_scan_external_notification_employee_report}
> Affected employees: {number_and_departments}
> Configuration error: {specific_cloud_setting_misconfigured}
> Access logs: {evidence_of_external_access_or_no_downloads}
> Regulatory requirements: {GDPR_CCPA_state_privacy_laws}
> Employee notification: {timeline_and_communication_method}
>
> Create a 450-500 word data privacy incident report for legal review. Open with exposure scope and affected data types. Detail remediation actions and timeline. Close with regulatory notification obligations and employee communication plan.

**When to use it:** When someone checks the "public" box instead of "private" on cloud storage and your employee database becomes temporarily available to the entire internet.

**Pro tip:** Distinguish between "publicly accessible" and "actually accessed" in your impact assessment. Most privacy regulations focus on potential exposure, but business impact depends on actual access.

## Performance Issues

> You are writing an incident report for a critical application that experienced severe performance degradation during peak business hours.
>
> Application: {application_name_and_business_function}
> Performance issue: {slow_response_timeouts_crashes}
> Peak impact time: {specific_hours_when_worst_performance_occurred}
> User complaints: {number_of_help_desk_tickets_or_calls}
> Resource utilization: {CPU_memory_disk_network_percentages}
> Root cause analysis: {database_queries_server_capacity_network_bottleneck}
> Temporary fixes: {server_restarts_query_optimization_traffic_routing}
> Business impact: {transactions_lost_revenue_affected_SLA_breach}
>
> Write a 400-450 word performance incident report with quantified impact. Start with business metrics affected. Include detailed root cause analysis with monitoring data. End with capacity planning recommendations and timeline.

**When to use it:** Thursday morning after your e-commerce site crawled to a halt during the busiest shopping hour and customer service is drowning in complaints.

**Pro tip:** Convert technical metrics to business language. "Database response time increased 400%" becomes "checkout process took 2 minutes instead of 30 seconds."

---

> You are documenting a database performance crisis where query response times degraded to the point of application timeouts.
>
> Database system: {database_type_version_and_size}
> Query performance: {specific_response_time_degradation}
> Affected queries: {report_generation_user_searches_transactions}
> Resource bottleneck: {CPU_memory_disk_IO_locks}
> Monitoring alerts: {when_performance_thresholds_were_exceeded}
> Optimization actions: {index_rebuilding_query_tuning_hardware_scaling}
> Recovery timeline: {time_to_restore_acceptable_performance}
> Preventive measures: {query_analysis_capacity_monitoring_scheduled_maintenance}
>
> Create a 350-400 word database performance incident report. Begin with query performance baselines vs. incident levels. Detail optimization steps taken. Conclude with database maintenance schedule adjustments.

**When to use it:** When your monthly reports that usually take 5 minutes are still running after 2 hours and users think the system is broken.

**Pro tip:** Include the specific queries or reports that triggered the performance cascade. Often one poorly optimized query can bring down an entire database.

---

> You are writing an incident report for network bandwidth saturation that caused VoIP quality issues and video conference failures.
>
> Network segment: {WAN_link_internal_backbone_internet_connection}
> Bandwidth utilization: {peak_percentage_and_capacity_limit}
> Traffic analysis: {backup_jobs_file_transfers_streaming_video}
> Service degradation: {call_quality_issues_meeting_failures}
> Users affected: {departments_and_employee_count}
> Traffic shaping: {QoS_policies_applied_or_missing}
> Resolution method: {traffic_prioritization_bandwidth_upgrade_usage_restriction}
> Monitoring gaps: {bandwidth_alerts_not_configured_or_ignored}
>
> Write a 300-350 word network performance incident report focusing on business communication impact. Start with service quality measurements. Include traffic pattern analysis. End with network capacity planning recommendations.

**When to use it:** Tuesday during the all-hands meeting when the CEO's video keeps freezing because someone decided to backup 500GB during business hours.

**Pro tip:** Identify the specific traffic that consumed bandwidth beyond normal patterns. Random saturation suggests infrastructure problems, but identifiable traffic means policy problems.

---

> You are documenting a server hardware failure that caused gradual performance degradation before complete system failure.
>
> Server hardware: {server_model_age_and_primary_function}
> Failure component: {hard_drive_memory_CPU_power_supply}
> Warning signs: {error_logs_performance_alerts_user_complaints}
> Degradation timeline: {days_or_weeks_of_declining_performance}
> Monitoring response: {hardware_alerts_ignored_or_missed}
> Failover status: {high_availability_worked_failed_not_configured}
> Recovery method: {hardware_replacement_VM_migration_restore_from_backup}
> Business continuity: {service_interruption_duration_and_workarounds}
>
> Create a 400-450 word hardware failure incident report emphasizing early warning signs. Open with failure progression timeline. Detail monitoring and alerting gaps. Close with predictive maintenance recommendations.

**When to use it:** Friday evening when that server you've been meaning to replace finally dies, taking the accounting system with it right before month-end closing.

**Pro tip:** Document all the warning signs that were ignored or missed. Hardware failures rarely happen without advance notice, and this evidence supports preventive maintenance budgets.

---

> You are writing an incident report for cloud service performance issues that affected your hybrid infrastructure during a traffic spike.
>
> Cloud service: {specific_service_and_region}
> Performance metrics: {response_time_throughput_error_rates}
> Traffic pattern: {normal_vs_spike_usage_levels}
> Auto-scaling: {scaling_worked_failed_insufficient_limits}
> Hybrid impact: {on_premise_systems_affected_or_isolated}
> Cost implications: {unexpected_charges_from_scaling_or_overages}
> Service degradation: {user_experience_impact_and_duration}
> Cloud provider: {support_ticket_status_and_response}
>
> Write a 350-400 word cloud performance incident report for budget review. Start with traffic spike quantification. Include auto-scaling effectiveness analysis. End with cloud architecture optimization and cost control recommendations.

**When to use it:** When your "infinitely scalable" cloud application hits scaling limits during a marketing campaign that actually worked too well.

**Pro tip:** Separate cloud provider performance issues from your application architecture problems. Scaling limits you configured aren't the same as cloud service degradation.

## Communication Failures

> You are documenting an email system outage that prevented critical business communication during a product launch event.
>
> Email system: {Exchange_Gmail_other_email_platform}
> Outage duration: {total_hours_minutes_email_was_unavailable}
> Business timing: {product_launch_quarter_end_conference_other_critical_event}
> Communication impact: {customer_inquiries_sales_leads_internal_coordination}
> Alternative methods: {phone_calls_instant_messaging_mobile_apps}
> Root cause: {server_failure_network_issue_software_update}
> Recovery actions: {system_restart_failover_vendor_support}
> Business cost: {lost_sales_missed_deadlines_customer_complaints}
>
> Write a 450-500 word communication system incident report emphasizing business timing impact. Start with outage scope during critical business event. Detail alternative communication methods deployed. Close with business continuity communication plan improvements.

**When to use it:** Monday morning when email dies during your biggest product launch and the sales team is manually calling every prospect.

**Pro tip:** Calculate the specific business cost of communication delays, not just technical restoration time. Lost sales and missed opportunities justify redundant communication systems.

---

> You are writing an incident report for a conference call system failure that disrupted a board meeting with external investors.
>
> Conference platform: {Zoom_Teams_WebEx_other}
> Meeting importance: {board_meeting_investor_presentation_customer_demo}
> Technical failure: {audio_issues_video_problems_complete_disconnect}
> Attendee count: {internal_participants_external_stakeholders}
> Backup plan: {dial_in_numbers_alternative_platform_in_person_option}
> Recovery time: {minutes_to_restore_or_switch_platforms}
> Meeting outcome: {rescheduled_continued_successfully_compromised}
> Reputation impact: {client_perception_investor_confidence_internal_credibility}
>
> Create a 300-350 word conference system incident report for executive review. Begin with meeting criticality and stakeholder impact. Include backup plan execution. Conclude with vendor reliability assessment and alternative platform evaluation.

**When to use it:** When your video conference crashes during the most important investor pitch of the quarter and everyone's staring at frozen screens.

**Pro tip:** Document external stakeholder reactions and any follow-up required to rebuild confidence. Technical problems during high-stakes meetings have relationship costs beyond the incident.

---

> You are documenting a VoIP system failure that affected customer service operations and resulted in dropped calls and missed sales opportunities.
>
> VoIP system: {phone_system_name_and_configuration}
> Service impact: {dropped_calls_no_dial_tone_poor_call_quality}
> Customer service: {call_center_size_and_daily_call_volume}
> Business hours: {peak_call_times_affected}
> Failover options: {mobile_phones_traditional_landlines_call_forwarding}
> Call volume lost: {estimated_missed_calls_and_revenue}
> Resolution method: {system_restart_ISP_fix_hardware_replacement}
> Customer satisfaction: {complaints_received_service_level_impact}
>
> Write a 400-450 word VoIP incident report quantifying customer service impact. Start with call volume and revenue calculations. Detail emergency communication procedures. End with telecommunications redundancy recommendations.

**When to use it:** Wednesday afternoon when your phone system goes silent and customers are getting busy signals instead of reaching your award-winning support team.

**Pro tip:** Track the customer service ticket backlog created by phone system downtime. Missed calls don't disappear, they become email tickets and chat requests that strain other channels.

---

> You are writing an incident report for instant messaging platform failure that disrupted real-time collaboration during a critical project deadline.
>
> Messaging platform: {Slack_Teams_Discord_internal_system}
> Project deadline: {specific_project_and_urgency_level}
> Team coordination: {departments_involved_and_dependencies}
> Communication volume: {typical_daily_messages_during_crunch_time}
> Workaround methods: {email_phone_calls_in_person_meetings}
> Productivity impact: {project_delays_missed_deadlines_coordination_errors}
> Platform recovery: {time_to_restore_service_and_message_history}
> Collaboration continuity: {alternative_tools_used_effectiveness}
>
> Create a 350-400 word collaboration platform incident report focusing on project delivery impact. Begin with project criticality and timing. Include team adaptation to alternative communication methods. Conclude with collaboration tool redundancy planning.

**When to use it:** Thursday morning when Slack dies and your development team realizes they've forgotten how to talk to each other without emoji reactions.

**Pro tip:** Measure the productivity impact in terms of project velocity, not just communication volume. Teams lose momentum when real-time collaboration disappears during critical phases.

---

> You are documenting a mobile device management system failure that prevented remote workers from accessing corporate email and applications.
>
> MDM platform: {mobile_device_management_system_name}
> Remote workforce: {number_of_mobile_users_affected}
> Access restrictions: {email_apps_VPN_documents_blocked}
> Device types: {iPhones_Android_tablets_laptops}
> Security implications: {devices_locked_unlocked_data_at_risk}
> Workaround solutions: {personal_devices_web_access_temporary_policies}
> Business functions: {sales_support_field_service_executives_affected}
> Recovery priority: {critical_users_restored_first}
>
> Write a 400-450 word mobile access incident report emphasizing remote work impact. Start with remote workforce dependency on mobile access. Detail security vs. productivity balance during outage. End with mobile workforce continuity improvements.

**When to use it:** Friday when your MDM system locks out the entire sales team's phones right before the biggest trade show of the year.

**Pro tip:** Prioritize mobile access recovery by business function, not seniority. Field service and sales teams lose revenue immediately, while office workers have desktop alternatives.

## Vendor and Integration Issues

> You are writing an incident report for a critical third-party API failure that disrupted your e-commerce payment processing during peak shopping hours.
>
> API provider: {payment_processor_name}
> Integration: {checkout_process_subscription_billing_refund_system}
> Failure type: {API_timeouts_authentication_errors_service_unavailable}
> Business impact: {failed_transactions_abandoned_carts_revenue_loss}
> Peak timing: {Black_Friday_lunch_hour_end_of_month}
> Fallback options: {alternative_payment_processor_offline_processing_manual_orders}
> Customer communication: {error_messages_email_notifications_social_media}
> Recovery verification: {transaction_testing_payment_reconciliation}
>
> Create a 450-500 word API integration incident report with revenue impact focus. Begin with transaction failure rates and timing. Include customer experience during outage. Conclude with