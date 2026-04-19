**PRD creation brownfield***

Create a modular Skill called prd-master. Its objective is to analyze the code of this Brownfield project and generate an optimized PRD for agent execution.

Skill Instructions:

Initial Analysis: Perform a “harvest” of the existing business logic. If you detect undocumented rules, mention them in a section called “Current State.”

Impact Analysis: Mandatorily generate an impact table covering: Affected requirements, Architecture, QA/Regression, and Technical Debt detected.

Acceptance Criteria: Write atomic criteria in bullet point format to guide a later testing agent.

Non-Functional: Include sections for Security, Observability, and Maintainability based on Red Hat standards.

Interaction: If you find conflicts between my request and the current code, stop and give me a list of specific questions. Do not apply vibe-coding.

Format: Deliver the document in Markdown, structured to be the “North Star” for future implementation sessions.

**PRD creation greenfield**

Act as a Senior Product Engineer. Create a Skill called greenfield-prd-creator. Its function is to transform abstract ideas into technical execution plans without the restrictions of legacy code.

Your mandatory instructions are:

Problem Focus: Before proposing features, you must enforce a clear definition of the problem we are solving and for whom (Personas).

MVP Definition: Identify and prioritize the minimum set of functionalities (P0) necessary to test value in the market.

Architecture of Intention: Define the ideal technology stack (microservices, serverless, etc.) based on future needs, not past limitations.

‘Shift-Left’ Standards: Establish Non-Functional Requirements (NFR) from the start, such as scalability, security by design, and observability.

Socratic Questioning: If my idea is vague or lacks business justification, stop and ask me critical questions about the market, competition, and expected success.

Binary Acceptance Criteria: Generate a list of pass/fail conditions that serve as a contract for the development team.
