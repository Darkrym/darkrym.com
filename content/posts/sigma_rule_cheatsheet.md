---
author:
  name: Darkrym
date: 2025-07-02
linktitle: Sigma
type:
  - post
  - posts
title: Sigma Rule Cheat Sheet
weight: 10
tags:
  - cheatsheet
  - sigma
  - detection-engineering
  - siem
series:
  - Cheatsheets
series_order: 9
summary: Concise guide for writing Sigma detection rules covering structure, modifiers, best practices, and tools for SOC analysts and detection engineers working with Splunk, Elastic, or LogPoint.
---

A concise guide for writing, editing, and testing Sigma detection rules. Covers rule structure, value modifiers, best practices, common pitfalls, and tools. Perfect for SOC analysts, threat hunters, and detection engineers working with SIEMs like Splunk, Elastic, or LogPoint.

---
## Rule Anatomy 
 ### Metadata

| Field              | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| **title**          | Rule name / alert title                                                              |
| **id**             | UUID (generate at https://www.uuidgenerator.net)                                     |
| **status**         | `stable`, `test`, or `experimental`                                                  |
| **description**    | Brief summary of what the rule detects                                               |
| **author**         | Author’s name(s)                                                                     |
| **date**           | Date of creation                                                                     |
| **tags**           | Use lowercase, Mitre ATT&CK tags (e.g., `execution`, `persistence`)                  |
| **logsource**      | `product`, `service`, and `category` (e.g., `windows -> sysmon -> process_creation`) |
| **references**     | External docs or URLs                                                                |
| **level**          | `informational`, `low`, `medium`, `high`, or `critical`                              |
| **falsepositives** | Describe possible benign triggers                                                    |

---

### Detection

The core of a rule – where logic is applied.

#### Structure

```yaml
detection:
  selection:
    FieldName: value
  filter:
    FieldName: benign_value
  condition: selection and not filter
```

---

#### Data Types

| Type   | Syntax | Meaning |
|--------|--------|---------|
| **List** (OR) | `FieldName:`<br>`- value1`<br>`- value2` | Matches *any* listed value |
| **Map** (AND) | `FieldName1: value1`<br>`FieldName2: value2` | Matches *all* values together |

---

#### Value Modifiers

Attach with `|` to the field name to change behaviour:

| Modifier                       | Function                                           |
| ------------------------------ | -------------------------------------------------- |
| `contains`                     | Match value anywhere in string                     |
| `startswith`                   | Match value at start                               |
| `endswith`                     | Match value at end                                 |
| `all`                          | Match *all* values in list (instead of default OR) |
| `re`                           | Use regex                                          |
| `base64` / `base64offset`      | For encoded strings                                |
| `utf16le` / `utf16be` / `wide` | Encoded text matching                              |
| `windash`                      | Match both `-` and `/` cmdline switches            |
| `cidr`                         | Match IP ranges (e.g., `source_ip                  |

---

#### Condition Logic

Tie search identifiers together with logical operators:

| Syntax | Meaning |
|--------|---------|
| `and`, `or` | Logical operations |
| `not`       | Negate condition |
| `1 of`, `all of` | Match one/all of multiple identifiers |
| `()`        | Group logic for precedence |
| `near`      | Search items near each other in logs (e.g. `near selection1 and not filter`) |

---

#### Examples

#### Match RDP activity but exclude known good:
```yaml
detection:
  rdp_outbound:
    DestinationPort: 3389
    Initiated: true
  filter:
    Image: "known-good.exe"
  condition: rdp_outbound and not filter
```

#### Match command lines containing suspicious tools:
```yaml
detection:
  selection:
    CommandLine|contains:
      - "mimikatz"
      - "procdump"
  condition: selection
```

#### Use regex to match encoded hostnames:
```yaml
detection:
  selection:
    Hostname|re: '^[A-Za-z0-9]{16}$'
  condition: selection
```

---
## Best Practices

- Keep rule logic clear and modular
- Use descriptive names for search identifiers (`selection_admin`, `filter_legit_admin`)
- Test rules with sample logs before deploying
- Use specific field values (avoid overuse of wildcards or `*`)
- Avoid matching on `CommandLine` alone
- Use `contains|all` to match multiple args regardless of order
- Where possible match on behaviour, not just indicators.
- Use `filter` sections to reduce noise and false positives

---
## **Common Pitfalls**

- **Title**: Avoid explanations keep it short and alert-friendly
- **Backslashes**: Use plain where possible (`C:\Path\File.exe`), escape only when needed
    - `\\` = single `\`, `\\\\` = `\\`, `\*` = wildcard, `\\*` = `\` + wildcard
- **Tags**: Don’t use MITRE links—use tags instead
	- Use proper formats: `attack.execution`, `attack.t1003.002`, `cve.2021-34527`
- **False Positives**: Don’t skip this section it helps analysts
    - Be specific: e.g. “Backup software may trigger this”

---

## Creation Work-Flow 

**1. Get the Repository**
- Clone: `https://github.com/SigmaHQ/sigma`
- Rules: `./rules`
- Compiler: `./tools/sigmac`

**2. Edit Existing Rule or Templates**
- Use **VSCode** for YAML editing
	- Optional VSCode extensions: YAML support, linter
- Use existing rule as a template
- Modify these fields:
    - `title`, `description`, `status` (set to `experimental`)
    - `reference`, `author`, `level` (low/medium/high/critical)
    - `date` in `%Y/%m%d` format
    - `logsource` accuracy is important
- Adjust detection logic to match your use case

**4. Test the Rule**
- Find a good dataset with know bad and known good.
	- Splunk has some great datasets
- Use `sigmac` or `pysigma` (requires Python 3) to compile into different languages
-  include:
    - `es-qs`, `kibana`, `xpack-watcher`
    - `logpoint`, `splunk`, `grep`, `fieldlist`

---
## Helpful links:

| Name                                                                                   | Description                                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [SIGMA-Resources](https://github.com/nasbench/SIGMA-Resources)                         | Curated list of Sigma rule examples, templates, and threat hunting tools        |
| [Sigma Rule Creation Guide](https://github.com/SigmaHQ/sigma/wiki/Rule-Creation-Guide) | Official guide to writing Sigma rules with standards and best practices         |
| [pySigma](https://github.com/SigmaHQ/pySigma)                                          | Modern Python framework for compiling, manipulating, and converting Sigma rules |
| [Sigconverter](https://sigconverter.io/)                                               | Online tool for converting Sigma rules into SIEM-specific queries               |


