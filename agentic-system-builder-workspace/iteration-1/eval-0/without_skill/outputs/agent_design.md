---
agent_id: pdf-extractor
name: PDF Text Extractor Agent
type: specialist
description: Extracts text content from PDF documents using various extraction strategies
specialization: pdf_text_extraction
version: "1.0.0"
---

name: PDF Text Extractor Agent
description: |
  A specialist agent that extracts text content from PDF documents using 
  multiple extraction strategies (OCR, native text, layout analysis).

capabilities:
  - Native text extraction from PDFs
  - OCR-based extraction for scanned documents
  - Layout analysis and structure preservation
  - Table and image detection
  - Multi-language support

tools:
  - pdf_plumber
  - pytesseract
  - pdfminer.six

workflow:
  1. Analyze PDF structure and detect content types
  2. Choose extraction strategy (native/OCR/hybrid)
  3. Extract text while preserving structure
  4. Handle embedded images and tables
  5. Output structured text data

input:
  type: file
  format: PDF
  schema:
    - file_path: string
    - extraction_mode: enum[native, ocr, hybrid]
    - language: string

output:
  type: structured_data
  format: JSON
  schema:
    - text: string
    - metadata: object
    - pages: array
    - tables: array
    - images: array
---
agent_id: markdown-converter
name: Markdown Converter Agent
type: specialist
description: Converts extracted text to well-formatted markdown with proper structure
specialization: text_to_markdown_conversion
version: "1.0.0"
---

name: Markdown Converter Agent
description: |
  A specialist agent that converts structured text content into properly 
  formatted Markdown, handling headings, lists, tables, code blocks, 
  and formatting elements.

capabilities:
  - Markdown formatting and syntax generation
  - Heading hierarchy management
  - Table conversion to Markdown format
  - Code block detection and formatting
  - Link and image reference handling

tools:
  - markdown-it
  - turndown
  - custom parsers

workflow:
  1. Analyze input text structure
  2. Detect content types (headings, lists, tables, code)
  3. Apply appropriate Markdown conversion rules
  4. Handle special characters and escape sequences
  5. Generate clean, valid Markdown output
  6. Validate Markdown syntax

input:
  type: structured_data
  format: JSON
  schema:
    - text: string
    - metadata: object
    - content_type: enum[document, article, report]

output:
  type: text
  format: Markdown
  schema:
    - content: string
    - word_count: integer
    - format_errors: array
---
agent_id: quality-validator
name: Quality Validator Agent
type: specialist
description: Validates markdown output for quality, consistency, and completeness
specialization: content_quality_validation
version: "1.0.0"
---

name: Quality Validator Agent
description: |
  A specialist agent that validates Markdown output against quality criteria
  including completeness, formatting, readability, and structural integrity.

capabilities:
  - Markdown syntax validation
  - Content completeness checking
  - Readability scoring
  - Formatting consistency analysis
  - Error detection and reporting
  - Quality metrics calculation

tools:
  - remark
  - retext
  - custom validators
  - readability-formulas

workflow:
  1. Parse Markdown content
  2. Validate syntax and structure
  3. Check completeness against source
  4. Calculate quality metrics
  5. Generate validation report
  6. Suggest improvements

input:
  type: text
  format: Markdown
  schema:
    - content: string
    - source_reference: string
    - validation_rules: array

output:
  type: structured_data
  format: JSON
  schema:
    - is_valid: boolean
    - quality_score: float
    - errors: array
    - warnings: array
    - suggestions: array
    - metrics: object

---
orchestrator_id: document-pipeline-orchestrator
name: Document Pipeline Orchestrator
type: orchestrator
description: Coordinates the document processing pipeline and manages agent communication
specialization: pipeline_coordination
version: "1.0.0"
---

name: Document Pipeline Orchestrator
description: |
  The main orchestrator that manages the document processing pipeline,
  coordinating between specialist agents and handling error recovery.

capabilities:
  - Pipeline flow orchestration
  - Agent communication management
  - Error handling and recovery
  - Progress tracking and reporting
  - Result aggregation

agents:
  - pdf-extractor
  - markdown-converter
  - quality-validator

workflow:
  1. Receive PDF input
  2. Dispatch to PDF Extractor Agent
  3. Pass extracted text to Markdown Converter Agent
  4. Send Markdown to Quality Validator Agent
  5. Aggregate results and handle failures
  6. Return final output with validation report

pipeline:
  stages:
    - name: extraction
      agent: pdf-extractor
      retry: 3
    - name: conversion
      agent: markdown-converter
      retry: 2
    - name: validation
      agent: quality-validator
      retry: 2

error_handling:
  - Graceful degradation on agent failure
  - Retry logic with exponential backoff
  - Fallback extraction strategies
  - Detailed error logging