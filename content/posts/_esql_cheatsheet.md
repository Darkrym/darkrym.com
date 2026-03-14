---
author:
  name: Darkrym
date: 2025-03-14
linktitle: ESQL
type:
  - post
  - posts
title: ES|QL Cheat Sheet
weight: 13
tags:
  - cheatsheet
  - elasticsearch
  - esql
  - elastic
  - siem
  - threat-hunting
series:
  - Cheatsheets
series_order: 13
summary: Practical ES|QL reference for security analysts covering query structure, filtering, aggregations, field operations, and data transformations for threat hunting in Elastic Security.
---

> View all cheatsheets in an interactive format at [Cheat Sheets](/cheat-sheets/).

A practical guide to Elasticsearch Query Language (ES|QL) for security analysts and threat hunters. Covers essential commands, filtering, statistical operations, and field transformations for effective log analysis in Elastic.

---
## Query Structure

ES|QL uses a pipe-based syntax where each command processes data and passes results to the next. Queries start with a source command.

```esql
FROM logs-endpoint
| WHERE process.name == "curl.exe"
| STATS count = COUNT(*) BY host.name
| SORT count DESC
| LIMIT 10
```

---

## Syntax Basics

### Comments

```esql
// Single line comment
/* Multi-line
   comment */
```

### Literals

| Type | Example |
|------|---------|
| String | `"value"` or `"""value with "quotes" """` |
| Number | `42`, `3.14`, `4E5` |
| Boolean | `true`, `false` |
| Null | `null` |
| Timespan | `1day`, `2h`, `30m` |

### Identifiers

Use backticks for special characters:

```esql
FROM index | KEEP `field.name`, `@timestamp`
```

---

## Source Commands

Commands that initiate a query.

| Command | Purpose | Example |
|---------|---------|---------|
| `FROM` | Query index/data stream | `FROM logs-*` |
| `ROW` | Generate test data | `ROW a = 1, b = "test"` |
| `SHOW` | Display system info | `SHOW INFO` |

### FROM with Metadata

```esql
FROM logs-endpoint METADATA _index, _id
```

---

## Filtering

### WHERE Command

```esql
FROM logs | WHERE status >= 400
FROM logs | WHERE user.name == "admin"
FROM logs | WHERE event.action IS NOT NULL
FROM logs | WHERE process.name LIKE "*.exe"
FROM logs | WHERE source.ip RLIKE "^10\\..*"
FROM logs | WHERE event.category IN ("authentication", "network")
```

### Comparison Operators

| Operator | Purpose |
|----------|---------|
| `==`, `!=` | Equality |
| `<`, `<=`, `>`, `>=` | Comparison |
| `IS NULL`, `IS NOT NULL` | Null checks |
| `LIKE` | Wildcard pattern (`*` and `?`) |
| `RLIKE` | Regex pattern |
| `IN` | Value in list |

### Logical Operators

```esql
FROM logs
| WHERE status == 200 AND response_time > 1000
| WHERE event.type == "start" OR event.type == "end"
| WHERE NOT user.name == "system"
```

---

## Field Operations

### EVAL - Create/Modify Fields

```esql
FROM logs
| EVAL duration_sec = event.duration / 1000000000
| EVAL full_name = CONCAT(user.first_name, " ", user.last_name)
| EVAL is_error = status >= 400
```

### KEEP - Select Fields

```esql
FROM logs | KEEP @timestamp, host.name, message
FROM logs | KEEP host.*, event.*
```

### DROP - Remove Fields

```esql
FROM logs | DROP _raw, _source
FROM logs | DROP temp_*
```

### RENAME - Rename Fields

```esql
FROM logs | RENAME source.ip AS src, destination.ip AS dst
```

---

## String Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `CONCAT(s1, s2, ...)` | Join strings | `CONCAT(first, " ", last)` |
| `LENGTH(s)` | String length | `LENGTH(message)` |
| `SUBSTRING(s, start, len)` | Extract portion | `SUBSTRING(path, 1, 10)` |
| `TO_UPPER(s)` / `TO_LOWER(s)` | Case conversion | `TO_LOWER(user.name)` |
| `TRIM(s)` | Remove whitespace | `TRIM(field)` |
| `REPLACE(s, old, new)` | Replace text | `REPLACE(url, "http", "https")` |
| `SPLIT(s, delim)` | Split to array | `SPLIT(tags, ",")` |
| `STARTS_WITH(s, prefix)` | Check prefix | `STARTS_WITH(path, "/api")` |
| `ENDS_WITH(s, suffix)` | Check suffix | `ENDS_WITH(file.name, ".exe")` |
| `CONTAINS(s, substr)` | Check contains | `CONTAINS(message, "error")` |

---

## Date Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `NOW()` | Current timestamp | `EVAL age = NOW() - @timestamp` |
| `DATE_EXTRACT(unit, date)` | Extract component | `DATE_EXTRACT("hour", @timestamp)` |
| `DATE_FORMAT(format, date)` | Format timestamp | `DATE_FORMAT("yyyy-MM-dd", @timestamp)` |
| `DATE_PARSE(format, str)` | Parse string | `DATE_PARSE("yyyy-MM-dd", date_str)` |
| `DATE_TRUNC(unit, date)` | Round to interval | `DATE_TRUNC(1 hour, @timestamp)` |
| `DATE_DIFF(unit, d1, d2)` | Time difference | `DATE_DIFF("day", start, end)` |

---

## Conditional Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `CASE(c1, v1, ..., default)` | Conditional | `CASE(status < 400, "ok", "error")` |
| `COALESCE(f1, f2, ...)` | First non-null | `COALESCE(user.name, "unknown")` |
| `GREATEST(v1, v2, ...)` | Maximum value | `GREATEST(a, b, c)` |
| `LEAST(v1, v2, ...)` | Minimum value | `LEAST(a, b, c)` |

---

## Type Conversion

| Function | Purpose |
|----------|---------|
| `TO_STRING(v)` | Convert to string |
| `TO_INTEGER(v)` / `TO_LONG(v)` | Convert to integer |
| `TO_DOUBLE(v)` | Convert to float |
| `TO_BOOLEAN(v)` | Convert to boolean |
| `TO_DATETIME(v)` | Convert to timestamp |
| `TO_IP(v)` | Convert to IP address |

---

## Statistics & Aggregation

### STATS Command

```esql
FROM logs | STATS total = COUNT(*)
FROM logs | STATS avg_duration = AVG(event.duration) BY host.name
FROM logs | STATS requests = COUNT(*), errors = COUNT(*) WHERE status >= 400 BY url.path
```

### Aggregation Functions

| Function | Purpose |
|----------|---------|
| `COUNT(*)` / `COUNT(field)` | Count events/values |
| `COUNT_DISTINCT(field)` | Unique count |
| `SUM(field)` | Total |
| `AVG(field)` | Average |
| `MIN(field)` / `MAX(field)` | Extremes |
| `MEDIAN(field)` | Median value |
| `PERCENTILE(field, p)` | Percentile value |
| `STD_DEV(field)` | Standard deviation |
| `TOP(field, n, order)` | Top N values |
| `VALUES(field)` | Unique values list |

### Grouping

```esql
FROM logs
| STATS count = COUNT(*) BY status, host.name
| SORT count DESC
```

### Time-Based Grouping

```esql
FROM logs
| EVAL hour = DATE_TRUNC(1 hour, @timestamp)
| STATS count = COUNT(*) BY hour
| SORT hour
```

---

## Sorting & Limiting

### SORT

```esql
FROM logs | SORT @timestamp DESC
FROM logs | SORT status ASC, response_time DESC
FROM logs | SORT user.name ASC NULLS FIRST
```

### LIMIT

```esql
FROM logs | SORT @timestamp DESC | LIMIT 100
```

*Note: Default limit is 1000 rows, maximum is 10,000.*

---

## Field Extraction

### DISSECT - Delimiter-Based

```esql
FROM logs
| DISSECT message "%{date} - %{level} - %{msg}"
| KEEP date, level, msg
```

### GROK - Regex-Based

```esql
FROM logs
| GROK message "%{TIMESTAMP_ISO8601:timestamp} %{IP:client_ip} %{WORD:method}"
| KEEP timestamp, client_ip, method
```

---

## Data Enrichment

### ENRICH

Add data from enrichment policies:

```esql
FROM logs
| ENRICH geo_policy ON source.ip WITH geo.country, geo.city
```

### LOOKUP JOIN

Join with lookup indices:

```esql
FROM firewall_logs
| LOOKUP JOIN threat_intel ON source.ip
```

---

## Multi-Value Fields

### MV_EXPAND

Expand multi-value fields to rows:

```esql
FROM logs | MV_EXPAND tags
```

### Multi-Value Functions

| Function | Purpose |
|----------|---------|
| `MV_COUNT(field)` | Count values |
| `MV_MIN(field)` / `MV_MAX(field)` | Min/max value |
| `MV_SUM(field)` / `MV_AVG(field)` | Sum/average |
| `MV_CONCAT(field, delim)` | Join to string |
| `MV_DEDUPE(field)` | Remove duplicates |
| `MV_SORT(field)` | Sort values |

---

## Search Functions

For full-text and pattern matching:

```esql
FROM logs | WHERE MATCH(message, "error authentication")
FROM logs | WHERE MATCH_PHRASE(message, "login failed")
FROM logs | WHERE KQL("user.name: admin AND status: 401")
```

---

## Practical Examples

### Failed Login Analysis

```esql
FROM logs-*
| WHERE event.category == "authentication" AND event.outcome == "failure"
| STATS failures = COUNT(*) BY user.name, source.ip
| WHERE failures > 5
| SORT failures DESC
```

### Bytes Transferred by Source

```esql
FROM logs-endpoint
| STATS total_bytes = SUM(network.bytes) BY source.address
| EVAL total_mb = ROUND(total_bytes / 1048576, 2)
| SORT total_mb DESC
| LIMIT 20
```

### Hourly Event Distribution

```esql
FROM logs-*
| EVAL hour = DATE_EXTRACT("hour", @timestamp)
| STATS count = COUNT(*) BY hour
| SORT hour
```

### Process Execution Summary

```esql
FROM logs-endpoint
| WHERE event.category == "process" AND event.type == "start"
| STATS executions = COUNT(*), hosts = COUNT_DISTINCT(host.name) BY process.name
| SORT executions DESC
| LIMIT 25
```

---

## Math Functions

| Function | Purpose |
|----------|---------|
| `ABS(n)` | Absolute value |
| `ROUND(n, decimals)` | Round number |
| `CEIL(n)` / `FLOOR(n)` | Round up/down |
| `POW(base, exp)` | Exponentiation |
| `SQRT(n)` | Square root |
| `LOG(n)` / `LOG10(n)` | Logarithms |

---

## Hash Functions

For data anonymization and integrity:

| Function | Purpose |
|----------|---------|
| `MD5(s)` | MD5 hash |
| `SHA1(s)` | SHA-1 hash |
| `SHA256(s)` | SHA-256 hash |

---

## Helpful Links

| Name | Description |
|------|-------------|
| [ES\|QL Reference](https://www.elastic.co/docs/reference/query-languages/esql) | Official ES\|QL documentation |
| [ES\|QL Commands](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql-commands.html) | Complete command reference |
| [ES\|QL Functions](https://www.elastic.co/guide/en/elasticsearch/reference/current/esql-functions-operators.html) | All functions and operators |
| [Elastic Security Labs](https://www.elastic.co/security-labs/) | Threat research and detection rules |

