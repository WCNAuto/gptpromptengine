---
title: "ChatGPT Prompts for Code Refactoring Clean Code: 25 Ready-to-Use Templates for Developers (2026)"
description: "Get 25 ChatGPT prompts for code refactoring and clean code. Copy, paste, and instantly improve legacy code, optimize functions, and write cleaner code."
profession: "Developers"
category: "Refactoring"
contentType: prompt
tags: ["chatgpt prompts for code refactoring clean code", "code refactoring prompts", "clean code chatgpt", "ai code improvement", "refactoring templates"]
pubDate: 2026-06-01
featured: true
promptCount: 25
---

These prompts help working developers refactor messy code, improve performance, and write cleaner functions using ChatGPT. Each prompt takes 30 seconds to customize and returns code you can commit immediately.

These prompts pair well with [Jasper AI](https://jasper.ai/affiliates) for Developers-specific tone control, or [Copy.ai](https://www.copy.ai/affiliates) for fast iteration.

## Legacy Code Modernization

> You are a senior developer refactoring legacy code for maintainability.
> 
> Original code language: {programming_language}
> Code purpose: {what_the_code_does}
> Current code:
> {paste_original_code_here}
> Framework/library constraints: {any_required_frameworks}
> Performance requirements: {response_time_or_memory_constraints}
> Team coding standards: {naming_conventions_or_patterns}
> 
> Refactor this code following modern {programming_language} best practices. Apply SOLID principles where relevant. Replace deprecated methods with current alternatives. Add clear variable names and extract functions where the code does multiple things. Include 2-3 line comments explaining complex logic. Keep the same functionality but make it readable for a junior developer joining next week.

**When to use it:** When you inherit a working but messy codebase and need to make it maintainable before adding new features.

**Pro tip:** Paste the refactored code back into ChatGPT with "explain the changes you made" to get a summary for your commit message.

---

> You are a developer updating outdated API integrations in production code.
> 
> Current API integration code:
> {paste_current_api_code}
> API documentation URL: {new_api_docs_url}
> Language/framework: {tech_stack}
> Error handling requirements: {how_errors_should_be_handled}
> Authentication method: {api_key_oauth_bearer_token}
> Rate limiting: {requests_per_minute_limit}
> 
> Rewrite this API integration using modern async/await patterns. Add proper error handling with specific catch blocks for network timeouts, 4xx errors, and 5xx errors. Include retry logic with exponential backoff. Add input validation and response parsing with clear error messages. Structure it so another developer can easily add new endpoints later.

**When to use it:** When third-party APIs deprecate endpoints or your current integration lacks proper error handling.

**Pro tip:** Test the refactored code with intentionally bad API keys to verify error handling actually works in practice.

---

> You are refactoring a monolithic function that handles multiple responsibilities.
> 
> Original function:
> {paste_large_function_here}
> Programming language: {language}
> Main business logic: {what_the_function_accomplishes}
> Input parameters: {list_current_parameters}
> Expected output: {return_type_and_format}
> Testing framework: {jest_pytest_junit_etc}
> 
> Break this function into 4-6 smaller, single-purpose functions. Each function should do one thing well and have a clear, descriptive name. Maintain the original function as a coordinator that calls the smaller functions. Add type hints or JSDoc comments. Structure it so each small function can be unit tested independently. Return the refactored code with a simple test case for each new function.

**When to use it:** When you have a 50+ line function that's hard to debug and impossible to test properly.

**Pro tip:** Run the tests on both old and new versions with the same inputs to verify behavior hasn't changed during refactoring.

---

> You are modernizing database query code that uses outdated patterns.
> 
> Current database code:
> {paste_db_query_code}
> Database type: {mysql_postgres_mongodb_etc}
> ORM/query builder: {sequelize_sqlalchemy_mongoose_etc}
> Query purpose: {what_data_youre_fetching}
> Performance issues: {slow_queries_n_plus_1_memory_usage}
> Security requirements: {sql_injection_prevention_needs}
> 
> Refactor this database code using modern query patterns. Replace string concatenation with parameterized queries. Fix N+1 query problems with proper joins or eager loading. Add connection pooling if missing. Include error handling for connection failures and constraint violations. Optimize for readability and performance. Add inline comments explaining complex joins or business logic in WHERE clauses.

**When to use it:** When database queries are slow, vulnerable to injection, or scattered throughout your codebase without consistent patterns.

**Pro tip:** Use EXPLAIN PLAN on the refactored queries to verify they're actually faster, not just cleaner looking.

---

> You are cleaning up inconsistent error handling across a codebase.
> 
> Current error handling examples:
> {paste_2_3_examples_of_current_error_code}
> Programming language: {language}
> Application type: {web_api_cli_desktop_mobile}
> Logging framework: {winston_logback_serilog_etc}
> Error reporting service: {sentry_rollbar_bugsnag_none}
> User-facing error requirements: {technical_or_friendly_messages}
> 
> Create a consistent error handling pattern for this codebase. Design custom exception classes for different error types (validation, network, database, business logic). Add structured logging with correlation IDs. Include error boundaries or global handlers. Show how to handle errors at different layers (service, controller, view). Make error messages helpful for debugging but safe for users. Provide 3 examples of the new pattern applied to different scenarios.

**When to use it:** When your app crashes with unhelpful error messages or logs don't give you enough context to fix production issues.

**Pro tip:** Set up error alerting thresholds after implementing consistent logging so you catch issues before users report them.

## Performance Optimization

> You are optimizing a slow-running function for better performance.
> 
> Current slow function:
> {paste_performance_problem_code}
> Language/runtime: {programming_language_and_version}
> Current execution time: {how_long_it_takes_now}
> Target performance: {desired_execution_time}
> Memory constraints: {available_ram_limits}
> Input size range: {typical_data_volume}
> Caching options: {redis_memcached_in_memory_none}
> 
> Optimize this function for speed without changing its external interface. Replace O(n²) operations with more efficient algorithms. Add memoization for expensive calculations. Use appropriate data structures (sets instead of arrays for lookups, maps for key-value access). Implement lazy loading where possible. Include performance benchmarks showing before/after timing. Add comments explaining why each optimization improves performance.

**When to use it:** When profiling shows a specific function consuming most of your application's CPU time.

**Pro tip:** Measure performance with realistic data sizes, not toy examples, since Big O complexity matters more at scale.

---

> You are reducing memory usage in code that processes large datasets.
> 
> Memory-intensive code:
> {paste_memory_heavy_code}
> Programming language: {language}
> Typical dataset size: {number_of_records_or_file_size}
> Available memory: {ram_limit_in_gb}
> Processing requirements: {what_transformation_you_need}
> Output format: {json_csv_database_api}
> Streaming capability: {can_process_in_chunks_yes_no}
> 
> Refactor this code to use streaming or batch processing instead of loading everything into memory. Implement generators or iterators where appropriate. Replace eager evaluation with lazy evaluation. Add memory monitoring and garbage collection hints. Break large operations into smaller chunks. Show how to process the data incrementally while maintaining the same final output. Include memory usage estimates for the refactored approach.

**When to use it:** When your application runs out of memory processing large files or datasets that are growing over time.

**Pro tip:** Test with datasets 2-3x larger than current production size to ensure the optimization scales as your data grows.

---

> You are caching expensive operations to improve response times.
> 
> Expensive operation code:
> {paste_slow_operation_code}
> Operation type: {api_call_database_query_calculation}
> Current response time: {how_long_it_takes}
> Acceptable response time: {target_response_time}
> Cache technology: {redis_memcached_local_memory}
> Data freshness requirements: {how_old_can_cached_data_be}
> Cache invalidation triggers: {when_to_clear_cache}
> 
> Add intelligent caching to this operation. Implement cache-aside pattern with proper key generation. Add cache warming for predictable requests. Handle cache misses gracefully with fallback to original operation. Include cache invalidation logic based on business rules. Add monitoring for cache hit rates. Show error handling when cache service is unavailable. Structure the code so caching can be disabled for testing.

**When to use it:** When the same expensive operations run repeatedly and stale data is acceptable for short periods.

**Pro tip:** Start with conservative cache expiration times and increase them based on actual usage patterns and business requirements.

---

> You are optimizing database queries that cause performance bottlenecks.
> 
> Slow query code:
> {paste_database_query_code}
> Database system: {mysql_postgres_mongodb_etc}
> Query execution time: {current_time_in_milliseconds}
> Target execution time: {desired_time}
> Table sizes: {approximate_row_counts}
> Existing indexes: {list_current_indexes}
> Query frequency: {how_often_this_runs}
> 
> Optimize these database queries for production performance. Add appropriate indexes based on WHERE clauses and JOIN conditions. Replace subqueries with more efficient JOINs where possible. Add query result caching for read-heavy operations. Use database-specific optimizations (query hints, partition pruning). Include EXPLAIN PLAN analysis showing the improvement. Add connection pooling and prepared statements. Structure queries so they can leverage database query plan caching.

**When to use it:** When database queries take more than 100ms or consume significant server resources during peak traffic.

**Pro tip:** Test optimizations on a copy of production data, not empty development tables, since query performance changes dramatically with real data volumes.

---

> You are implementing efficient data structures to replace inefficient ones.
> 
> Current data structure code:
> {paste_inefficient_data_structure_code}
> Programming language: {language}
> Primary operations: {search_insert_delete_update}
> Data access patterns: {random_sequential_sorted}
> Data size: {approximate_number_of_elements}
> Performance bottleneck: {specific_operation_thats_slow}
> Memory constraints: {available_memory_limits}
> 
> Replace inefficient data structures with optimal ones for the use case. Use hash maps for O(1) lookups instead of linear searches. Implement binary search trees or balanced trees for sorted data. Add sets for membership testing. Use appropriate collection types (deque for FIFO, priority queue for scheduling). Include Big O analysis comparing old vs new approaches. Add benchmarks showing performance improvement with realistic data sizes.

**When to use it:** When you're using arrays for everything and operations get slower as your dataset grows.

**Pro tip:** Consider the 80/20 rule - optimize for your most common operations even if it makes rare operations slightly slower.

## Code Structure Improvements

> You are extracting reusable utility functions from duplicated code.
> 
> Duplicated code examples:
> {paste_2_3_similar_code_blocks}
> Programming language: {language}
> Common functionality: {what_the_duplicated_code_does}
> Input variations: {how_the_inputs_differ}
> Output requirements: {expected_return_types}
> Project structure: {folder_organization}
> Testing framework: {unit_testing_setup}
> 
> Extract the common logic into reusable utility functions. Create a clear interface that handles input variations through parameters. Add proper error handling and input validation. Design the API so it's easy to use correctly and hard to use wrong. Include comprehensive JSDoc/docstring documentation. Create a utils module with logical function grouping. Provide unit tests covering edge cases and typical usage scenarios.

**When to use it:** When you find yourself copy-pasting code blocks and changing small details each time.

**Pro tip:** Name utility functions based on what they accomplish, not how they work internally, so the names stay relevant if implementation changes.

---

> You are implementing proper separation of concerns in tightly coupled code.
> 
> Tightly coupled code:
> {paste_code_with_mixed_responsibilities}
> Application type: {web_api_desktop_mobile}
> Architecture pattern: {mvc_mvvm_clean_architecture}
> Current layers: {database_business_presentation}
> Programming language: {language}
> Framework: {express_spring_django_react_etc}
> Testing requirements: {unit_integration_e2e}
> 
> Separate business logic from presentation and data access layers. Create clear interfaces between components using dependency injection or similar patterns. Move validation logic to appropriate layers. Extract configuration and constants. Add abstractions for external dependencies (APIs, file system, database). Structure code so business logic can be tested without databases or external services. Include examples of how to test each layer independently.

**When to use it:** When business logic is scattered across controllers, views, and database code, making testing and changes difficult.

**Pro tip:** Start by identifying pure functions (same input always produces same output) and extract those first since they're easiest to test and reuse.

---

> You are adding proper type safety to dynamically typed code.
> 
> Untyped code:
> {paste_code_without_types}
> Programming language: {javascript_python_ruby_etc}
> Type system option: {typescript_mypy_sorbet_flow}
> API interfaces: {external_apis_or_database_schemas}
> Expected data shapes: {json_structures_or_object_types}
> Validation requirements: {runtime_checking_needed}
> IDE/editor: {vscode_intellij_vim_etc}
> 
> Add comprehensive type annotations to improve code safety and developer experience. Define interfaces for complex objects and API responses. Add generic types for reusable functions. Include union types for values that can be multiple types. Set up strict type checking configuration. Add runtime validation for external data using libraries like Zod or Pydantic. Structure types so they catch common bugs at compile time rather than runtime.

**When to use it:** When runtime type errors cause production bugs or new team members struggle to understand expected data formats.

**Pro tip:** Add types incrementally starting with public interfaces and API boundaries, then work inward to internal functions.

---

> You are creating consistent naming conventions across an inconsistent codebase.
> 
> Examples of inconsistent naming:
> {paste_examples_of_variable_and_function_names}
> Programming language: {language}
> Domain/industry: {business_context}
> Team size: {number_of_developers}
> Code review process: {formal_informal_none}
> Existing style guide: {company_standards_or_none}
> Linting tools: {eslint_pylint_rubocop_etc}
> 
> Standardize naming conventions throughout the codebase. Create clear rules for variables, functions, classes, and constants based on language best practices. Handle domain-specific terminology consistently. Add automated linting rules to enforce naming standards. Provide refactoring suggestions for the most problematic existing names. Include a style guide with examples showing good vs bad naming. Structure naming so intent is clear without needing comments.

**When to use it:** When code reviews spend more time discussing naming than functionality, or new developers ask what variables represent.

**Pro tip:** Use automated refactoring tools to rename consistently across the codebase rather than doing it manually and missing references.

---

> You are modularizing a large file into focused, single-purpose modules.
> 
> Large file content:
> {paste_oversized_file_code}
> Programming language: {language}
> File current purpose: {what_the_large_file_handles}
> Module system: {es6_commonjs_python_imports}
> Project structure: {current_folder_organization}
> Dependencies between functions: {which_functions_call_others}
> Public API requirements: {what_other_files_import}
> 
> Split this large file into focused modules with clear responsibilities. Group related functions and classes together. Create logical module boundaries based on business concepts, not technical implementation. Add proper import/export statements. Maintain backward compatibility for existing imports. Include module-level documentation explaining each module's purpose. Structure the split so related functionality stays together and dependencies flow in one direction.

**When to use it:** When a single file has grown beyond 300-500 lines or contains multiple unrelated concepts that change for different reasons.

**Pro tip:** Use dependency analysis tools to visualize which functions call each other before splitting, so you don't create circular dependencies.

## Documentation and Comments

> You are adding comprehensive documentation to undocumented functions and classes.
> 
> Undocumented code:
> {paste_code_without_documentation}
> Programming language: {language}
> Documentation format: {jsdoc_sphinx_rdoc_javadoc}
> Intended audience: {junior_developers_external_users_api_consumers}
> Code complexity level: {simple_moderate_complex}
> Usage context: {internal_library_public_api}
> Examples needed: {basic_usage_edge_cases_integration}
> 
> Add comprehensive documentation that explains purpose, parameters, return values, and usage examples. Include preconditions and side effects. Document error conditions and exceptions. Add code examples showing typical usage and edge cases. Explain any non-obvious business logic or algorithms. Structure documentation so developers can understand and use the code without reading the implementation. Include performance characteristics for complex operations.

**When to use it:** When you or teammates spend time reading implementation code to understand how to use functions correctly.

**Pro tip:** Write documentation from the perspective of someone who has never seen this code before, not someone who wrote it yesterday.

---

> You are replacing unclear comments with self-documenting code.
> 
> Code with unclear comments:
> {paste_code_with_bad_comments}
> Programming language: {language}
> Business domain: {what_the_code_accomplishes}
> Comment problems: {outdated_obvious_misleading}
> Refactoring constraints: {api_compatibility_requirements}
> Code review standards: {what_good_comments_look_like}
> 
> Refactor code to be self-documenting and replace comments with better variable names, extracted functions, and clear logic flow. Keep only comments that explain "why" not "what". Add comments for business rules, algorithms, or non-obvious optimizations. Remove obvious comments that duplicate what the code clearly shows. Extract magic numbers into named constants. Create intention-revealing function names that eliminate the need for explanatory comments.

**When to use it:** When comments contradict the code, state the obvious, or haven't been updated when functionality changed.

**Pro tip:** If you need a comment to explain what code does, first try extracting it into a well-named function before adding the comment.

---

> You are creating API documentation for external developers.
> 
> API code to document:
> {paste_api_endpoints_or_functions}
> Programming language/framework: {language_and_framework}
> API type: {rest_graphql_rpc_library}
> Authentication method: {api_key_oauth_jwt}
> Documentation tool: {swagger_postman_github_pages}
> Target audience: {external_developers_partners_internal}
> Integration complexity: {simple_moderate_advanced}
> 
> Create comprehensive API documentation with clear endpoint descriptions, request/response examples, error codes, and authentication instructions. Include rate limiting information, SDK examples in multiple languages, and common integration patterns. Add troubleshooting section for typical errors. Provide working code samples that developers can copy and modify. Structure documentation so developers can integrate successfully without contacting support.

**When to use it:** When external developers struggle to integrate with your API or support tickets ask basic integration questions.

**Pro tip:** Test your documentation by having someone unfamiliar with the API follow it step-by-step to build a working integration.

---

> You are documenting complex business logic for future maintainers.
> 
> Complex business logic code:
> {paste_business_logic_code}
> Business domain: {industry_or_problem_space}
> Logic complexity: {algorithms_rules_calculations}
> Programming language: {language}
> Stakeholder requirements: {business_rules_source}
> Compliance requirements: {regulatory_or_legal_constraints}
> Change frequency: {how_often_rules_change}
> 
> Add comprehensive documentation explaining the business logic, regulatory requirements, and decision rationale. Document edge cases and special handling rules. Include references to business requirements documents or compliance standards. Add examples showing how the logic behaves with different inputs. Explain any mathematical formulas or industry-specific calculations. Structure documentation so future developers can modify logic confidently without breaking business rules.

**When to use it:** When complex business rules are implemented without context about why they exist or what they're trying to accomplish.

**Pro tip:** Include links to business stakeholders or compliance experts who can clarify requirements when code needs to change.

---

> You are creating troubleshooting guides for production issues.
> 
> Problematic code area:
> {paste_code_that_causes_production_issues}
> Common failure modes: {typical_errors_or_problems}
> Programming language: {language}
> Deployment environment: {cloud_onprem_containers}
> Monitoring tools: {logging_metrics_alerting}
> Support team access: {what_support_can_see}
> Recovery procedures: {restart_rollback_manual_fix}
> 
> Create troubleshooting documentation for production support teams. Document common error symptoms, root causes, and resolution steps. Include log patterns to search for and what they indicate. Add escalation procedures for complex issues. Provide commands or scripts for common recovery actions. Include preventive measures and monitoring recommendations. Structure guides so support staff can diagnose and resolve issues quickly without developer involvement.

**When to use it:** When the same production issues require developer intervention repeatedly or support tickets lack enough detail for diagnosis.

**Pro tip:** Update troubleshooting guides immediately after resolving new types of production issues while the investigation steps are fresh.

## Testing and Quality Assurance

> You are adding comprehensive unit tests to untested legacy code.
> 
> Untested code:
> {paste_code_without_tests}
> Programming language: {language}
> Testing framework: {jest_pytest_junit_rspec}
> Code dependencies: {database_api_file_system}
> Testing complexity: {simple_functions_complex_integrations}
> Mocking library: {sinon_unittest_mock_mockito}
> Coverage target: {percentage_coverage_goal}
> 
> Create comprehensive unit tests covering normal cases, edge cases, and error conditions. Mock external dependencies to isolate the code under test. Add parameterized tests for functions with multiple input scenarios. Include negative test cases for invalid inputs. Set up proper test fixtures and teardown. Add assertions that verify both expected outputs and side effects. Structure tests so they're fast, reliable, and easy to understand when they fail.

**When to use it:** When you need to refactor legacy code but have no tests to verify behavior stays the same after changes.

**Pro tip:** Write tests for current behavior first, even if it's buggy, so you can verify your refactoring doesn't introduce new problems.

---

> You are implementing integration tests for API endpoints.
> 
> API endpoints to test:
> {paste_api_endpoint_code}
> Framework: {express_spring_django_fastapi}
> Authentication method: {jwt_api_key_oauth}
> Database setup: {test_database_strategy}
> External dependencies: {third_party_apis_services}
> Testing tools: {supertest_requests_httpclient}
> Test data requirements: {fixtures_factories_seeds}
> 
> Create integration tests that verify API endpoints work correctly end-to-end. Test authentication, authorization, input validation, and proper HTTP status codes. Include tests for malformed requests and edge cases. Set up test database with appropriate fixtures. Mock external API calls with realistic responses. Add tests for rate limiting and error handling. Structure tests so they can run independently and clean up after themselves.

**When to use it:** When unit tests pass but API integration still fails in production due to middleware, authentication, or data layer issues.

**Pro tip:** Use separate test databases and reset them between test runs to avoid test pollution and flaky results.

---

> You are setting up automated code quality checks and linting.
> 
> Codebase language: {programming_language}
> Current quality issues: {formatting_style_bugs}
> Team size: {number_of