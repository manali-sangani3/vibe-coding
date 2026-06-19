<!-- Use all these prompts without spacing and gaps as spaces consumes tokens. Below prompts are for understanding purpose.-->

# AI Prompt Playbook

## 1. Research Topic

Role:
Act as a domain expert researcher.

Task:
Research [TOPIC].

Requirements:

* Explain fundamentals
* Current trends
* Advantages
* Limitations
* Future outlook

Output:
Executive summary + detailed analysis.

---

## 2. Software Requirement Analysis

Role:
Act as a senior business analyst.

Task:
Analyze the following requirement.

Requirements:

* Functional requirements
* Non-functional requirements
* Assumptions
* Risks
* User stories

Output:
Professional BRD.

---

## 3. Flutter Architecture Design

Role:
Act as a senior Flutter architect.

Task:
Design architecture for the following project.

Requirements:

* Modular Folder structure
* State management
* Dependency injection
* API layer
* Error handling
* Offline support
* MVVM + Clean Architecture
* Melos monorepo

Output:
Enterprise architecture document.

---

## 4. Code Generation

Role:
Act as a senior software engineer.

Task:
Generate production-ready code.

Requirements:

* Clean architecture
* Best practices
* Documentation
* Error handling
* Unit tests

Output:
Ready-to-use code.

---

## 5. Code Review

Role:
Act as a principal engineer.

Task:
Review the following code.

Requirements:

* Bugs
* Performance issues
* Security issues
* Readability
* Maintainability

Output:
Review report + improved code.

---

## 6. Debugging

Role:
Act as an expert debugger.

Task:
Identify root cause.

Requirements:

* Analyze error
* Explain issue
* Suggest fixes
* Prevent recurrence

Output:
Root cause analysis report.

---

## 7. Prompt Optimization

Role:
Act as a prompt engineering expert.

Task:
Improve the following prompt.

Requirements:

* Remove ambiguity
* Add context
* Improve output quality
* Add constraints

Output:
Optimized prompt + explanation.

---
## 8. Hallucination Prevention Prompt

Rules:

1. Never assume missing information.
2. Never fabricate facts, numbers, APIs, requirements, files, or business logic.
3. If information is missing, ambiguous, or unclear:

   * Stop immediately.
   * Explain what information is missing.
   * Ask a clarifying question.
4. Do not continue until the required information is provided.
5. Distinguish clearly between:

   * Facts
   * Assumptions
   * Recommendations
6. If confidence is below 90%, state the uncertainty explicitly.
7. For technical tasks:

   * Validate requirements before implementation.
   * Identify edge cases.
   * Confirm assumptions with the user.
8. If multiple interpretations are possible:

   * List the interpretations.
   * Ask the user which one is correct.
9. Never generate placeholder business logic as if it were real.
10. When stuck, use:

"Insufficient information to proceed accurately.
I need clarification on the following points before continuing:

1. ...
2. ...
3. ..."

Response Mode:

Think → Validate → Ask → Continue

Never:

* Guess
* Assume
* Fill gaps with invented details
* Continue after uncertainty without confirmation

Always:

* Stop
* Clarify
* Confirm
* Then proceed

---

## 9. Generate KPI for a problem statement

Role:
Act as a Senior Business Analyst, Product Manager, and KPI Strategy Consultant.

Task:
Based on the provided problem statement, create a comprehensive KPI document.

Objectives:

* Clearly define the business problem.
* Identify measurable success criteria.
* Establish key performance indicators (KPIs).
* Create a framework to track progress and outcomes.

Instructions:
For the given problem statement, generate:

1. Problem Overview

   * Problem title
   * Background
   * Current challenges
   * Impact on business/users

2. Goal Definition

   * Primary objective
   * Secondary objectives

3. KPI Matrix
   For each KPI include:

   * KPI Name
   * Description
   * Business Rationale
   * Formula/Calculation
   * Baseline Value
   * Target Value
   * Measurement Frequency
   * Data Source
   * KPI Owner

4. Success Metrics

   * Leading Indicators
   * Lagging Indicators

5. Risks and Assumptions

   * Potential risks
   * Dependencies
   * Assumptions

6. Tracking Framework

   * Weekly metrics
   * Monthly metrics
   * Quarterly review metrics

7. Executive Summary

   * Expected outcomes
   * Business impact
   * ROI considerations

Output Format:
Generate the response in a professional KPI document format using tables wherever applicable.

Problem Statement:
[Insert Problem Statement Here]

---

## 10. Generate PRD Doc from KPI Doc

Role:
Act as a Senior Flutter Developer

Context:
You are provided with a KPI document that contains the problem statement, business goals, KPIs, success metrics, risks, assumptions, and tracking framework.

Task:
Analyze the KPI document and create a comprehensive Product Requirements Document (PRD).

Objective:
Translate business objectives and KPIs into actionable product requirements that can be used by flutter developers, project managers, designers, QA engineers, and stakeholders.

Instructions:

Generate the following sections:

1. Executive Summary

   * Product overview
   * Business context
   * Vision statement
   * Expected business impact

2. Problem Statement

   * Existing challenges
   * User pain points
   * Business impact
   * Opportunity statement

3. Goals & Success Criteria

   * Business goals
   * Product goals
   * KPI mapping
   * Success metrics

4. Stakeholder Analysis

   * Stakeholders
   * Responsibilities
   * Decision makers

5. User Personas

   * Primary users
   * Secondary users
   * User needs
   * Motivations
   * Frustrations

6. User Journey

   * Current state journey
   * Future state journey
   * Key touchpoints

7. Functional Requirements
   For each requirement include:

   * Requirement ID
   * Title
   * Description
   * Priority (Must Have / Should Have / Could Have)
   * Business Justification
   * Related KPI
   * API required

8. Feature Breakdown
   For each feature include:

   * Feature Name
   * Purpose
   * User Value
   * Business Value
   * Dependencies

9. User Stories
   Format:

   * As a [user]
   * I want [goal]
   * So that [benefit]

10. Acceptance Criteria
    Use Gherkin format:

    * Given
    * When
    * Then

11. Non-Functional Requirements

    * Performance
    * Scalability
    * Security
    * Accessibility
    * Reliability
    * Compliance

12. Technical Considerations

    * API requirements
    * Third-party integrations
    * Data requirements
    * Analytics requirements

13. Risks & Constraints

    * Business risks
    * Technical risks
    * Assumptions
    * Dependencies

14. Release Planning

    * MVP scope
    * Phase 2 scope
    * Future enhancements

15. KPI Traceability Matrix
    Create a table showing:
    KPI → Product Goal → Feature → User Story → Success Metric

16. Open Questions
    List unclear areas, missing information, assumptions, and decisions requiring stakeholder validation.

Output Format:
Generate a professional PRD document using structured sections, tables, and requirement matrices. Ensure every feature and requirement directly maps back to a KPI or business objective from the provided KPI document.

Input:
[Paste KPI Document Here]

## OR

Act as a senior product manager and system architect.
Generate a comprehensive Product Requirements Document (PRD) for the following project:
Project Name: 
Project Description: kpi points

---

## 11. Flutter Error Resolution Prompt

Act as a Senior Flutter Developer.

Analyze the following Flutter issue.

Requirements:

* Find root cause
* Give exact fix
* Show only changed code
* Mention affected files
* Explain briefly
* No assumptions
* If information is missing, stop and ask questions

Issue:
[ERROR]

Code:
[CODE]

## OR

Act as a Senior Flutter Developer.

Issue: [ERROR]

Files:
[FILE_LIST]

Goal: Fix this error with minimal code changes.

---

## 12. Flutter Error Resolution Prompt

Act as a Senior Flutter Developer and QA Architect.

Using the provided PRD.md, generate TDD.md.

Requirements:

* Extract features and acceptance criteria.
* Create positive, negative, and edge test cases.
* Define unit, widget, and integration tests.
* Include validation rules, expected results, coverage goals, risks, and Definition of Done.
* No assumptions.
* If requirements are unclear, stop and ask questions.

Output:
Markdown TDD.md only.

---

## 13. TDD document genertaion from PRD document prompt

Act as a Senior Flutter Developer and QA Architect. 

Using the provided prd.md, generate TDD.md.

Requirements:
* Extract features and acceptance criteria.
* Create positive, negative, and edge test cases.
* Define unit, widget, and integration tests.
* Include validation rules, expected results, coverage goals, risks, and Definition of Done.
* No assumptions.
* If requirements are unclear, stop and ask questions.

Output: 
Markdown TDD.md only.

---

## 14. Test Cases Prompt

kpi.md, prd.md by refering this file genrate proper and crisp test cases file test_specification_flutter.md

---

## 15. Unit Test Cases Prompt
"Act as a persona_qa.md. Task: Analyze implemented code inside flashgenius-app and KPI_v2.md and generate test cases and execute with mock data. Output: generate test cases inside flashgenius-app/tests"
 
"run test files just created and create test report file in flashgenius-app/tests according to test_case_execution_template.md"

 ---
