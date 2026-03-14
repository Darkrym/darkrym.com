---
author:
  name: Darkrym
date: 2025-03-15
linktitle: Splunk
type:
  - post
  - posts
title: Splunk SPL Cheat Sheet
weight: 10
tags:
  - cheatsheet
  - splunk
  - spl
  - siem
  - threat-hunting
series:
  - Cheatsheets
series_order: 11
summary: Practical SPL reference for security analysts covering search commands, filtering, field operations, statistics, and data transformations for threat hunting and log analysis.
---

> View all cheatsheets in an interactive format at [Cheat Sheets](/cheat-sheets/).

A practical guide to Splunk Search Processing Language (SPL) for security analysts and threat hunters. Covers essential commands, filtering techniques, statistical operations, and performance tips for effective log analysis.

---
## Query Structure

SPL queries flow through a pipeline using the pipe `|` character. Each command processes data and passes results to the next.

```
index=main sourcetype=syslog | where status=500 | stats count by host
```

---

## Source Commands

Commands that retrieve or generate data.

| Command | Purpose | Example |
|---------|---------|---------|
| `index` | Retrieve events from indexes | `index=security action=failed` |
| `inputlookup` | Load data from lookup files | `| inputlookup users.csv` |
| `makeresults` | Generate test events | `| makeresults count=5` |
| `tstats` | Fast indexed field queries | `| tstats count where index=* by sourcetype` |

---

## Filtering

### Basic Search Syntax

| Pattern | Meaning |
|---------|---------|
| `field=value` | Exact match |
| `field="value with spaces"` | Quoted string match |
| `field=*` | Field exists |
| `field!=value` | Not equal (field must exist) |
| `NOT field=value` | Exclude (includes missing field) |

### Boolean Logic

- Terms separated by space = implicit AND
- `OR` evaluated before `AND`
- Use parentheses for grouping: `(status=200 OR status=201) AND host=web*`

### Where Command

Filter using expressions:

```
| where status >= 400
| where like(user, "admin%")
| where cidrmatch("10.0.0.0/8", src_ip)
| where match(url, "(?i)login")
```

### Search Directives

| Directive | Purpose |
|-----------|---------|
| `CASE(value)` | Case-sensitive matching |
| `TERM(value)` | Treat as single indexed term |

---

## Field Operations

### Eval - Create/Modify Fields

```
| eval full_name = first_name . " " . last_name
| eval status_text = if(status >= 400, "error", "ok")
| eval bytes_kb = round(bytes / 1024, 2)
| eval time_diff = now() - _time
```

### Common Eval Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `if(cond, true, false)` | Conditional | `if(status=200, "ok", "fail")` |
| `case(c1, v1, c2, v2, ...)` | Multiple conditions | `case(level=1, "low", level=2, "med", 1=1, "high")` |
| `coalesce(f1, f2, default)` | First non-null | `coalesce(user, "unknown")` |
| `in(field, v1, v2, ...)` | Value in list | `in(status, 200, 201, 204)` |
| `match(field, regex)` | Regex match | `match(host, "^web\d+$")` |
| `like(field, pattern)` | Wildcard match | `like(path, "/api/%")` |
| `cidrmatch(cidr, ip)` | IP in range | `cidrmatch("192.168.0.0/16", src)` |

### String Functions

| Function | Purpose |
|----------|---------|
| `upper(s)` / `lower(s)` | Case conversion |
| `substr(s, start, len)` | Extract substring |
| `len(s)` | String length |
| `replace(s, regex, new)` | Replace pattern |
| `split(s, delim)` | Split to multi-value |
| `urldecode(s)` | Decode URL encoding |

### Time Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `now()` | Current epoch time | `eval age = now() - _time` |
| `strftime(time, format)` | Format timestamp | `strftime(_time, "%Y-%m-%d")` |
| `strptime(str, format)` | Parse timestamp | `strptime(date_str, "%m/%d/%Y")` |
| `relative_time(t, spec)` | Calculate relative time | `relative_time(now(), "-1d@d")` |

**Time Format Codes:** `%Y` (year), `%m` (month), `%d` (day), `%H` (hour), `%M` (minute), `%S` (second)

---

## Field Extraction

### Rex - Regex Extraction

See [Regex Cheat Sheet](/posts/regex_cheatsheet/) for pattern syntax.

```
| rex field=_raw "user=(?<username>\w+)"
| rex field=message "from\s+(?<src_ip>\d+\.\d+\.\d+\.\d+)"
| rex field=url mode=sed "s/password=[^&]+/password=REDACTED/g"
```

### Spath - JSON/XML Extraction

```
| spath output=user_name path=user.name
| spath output=first_item path=items{0}.id
```

### Field Management

| Command | Purpose | Example |
|---------|---------|---------|
| `fields` | Keep/remove fields | `fields host, src_ip, action` |
| `rename` | Rename fields | `rename src_ip AS source` |
| `fillnull` | Replace nulls | `fillnull value="N/A" user` |

---

## Statistics & Aggregation

### Stats Command

```
| stats count by host
| stats count, avg(duration), max(bytes) by status
| stats dc(user) AS unique_users by src_ip
| stats earliest(_time) AS first_seen, latest(_time) AS last_seen by host
| stats list(action) AS actions, values(user) AS users by session_id
```

### Aggregation Functions

| Function | Purpose |
|----------|---------|
| `count` / `count(field)` | Count events/field values |
| `dc(field)` | Distinct count |
| `sum(field)` | Total |
| `avg(field)` | Average |
| `min(field)` / `max(field)` | Extremes |
| `median(field)` | Median value |
| `stdev(field)` | Standard deviation |
| `perc95(field)` | 95th percentile |
| `earliest(field)` / `latest(field)` | First/last by time |
| `list(field)` | All values (with duplicates) |
| `values(field)` | Unique values |

### Time-Based Statistics

```
| timechart span=1h count by status
| timechart span=5m avg(response_time) by host
| bucket _time span=1d | stats count by _time, action
```

### Eventstats - Add Stats to Events

```
| eventstats avg(bytes) AS avg_bytes by host
| where bytes > avg_bytes * 2
```

### Streamstats - Running Calculations

```
| streamstats count AS row_num
| streamstats sum(bytes) AS running_total by host
| streamstats current=f last(status) AS prev_status
```

---

## Data Transformation

### Table & Sort

```
| table _time, host, user, action
| sort -count, host
| sort 0 -_time
```

### Dedup - Remove Duplicates

```
| dedup user
| dedup host, src_ip sortby -_time
| dedup 3 user
```

### Head & Tail

```
| head 10
| tail 5
```

### Top & Rare

```
| top 10 user by host
| rare action useother=f
```

### Transpose

```
| stats count by status | transpose
```

---

## Data Enrichment

### Lookup - Enrich Events

```
| lookup users.csv username AS user OUTPUT department, role
| lookup threat_intel.csv ip AS src_ip OUTPUTNEW threat_score
```

- `OUTPUT` overwrites existing fields
- `OUTPUTNEW` preserves existing values

### Join - Combine Results

```
| join type=left user [search index=hr | fields user, department]
```

*Note: Lookups are generally more performant than joins.*

### Append - Stack Results

```
| append [search index=other | stats count]
```

---

## Multi-Value Fields

| Command | Purpose | Example |
|---------|---------|---------|
| `makemv` | Split to multi-value | `makemv delim="," tags` |
| `mvexpand` | Expand to rows | `mvexpand tags` |
| `mvcombine` | Combine to multi-value | `mvcombine delim="," user` |
| `mvcount(field)` | Count values | `eval num_tags = mvcount(tags)` |
| `mvfilter(expr)` | Filter values | `mvfilter(match(tags, "^sec_"))` |
| `mvjoin(field, delim)` | Join to string | `mvjoin(tags, ", ")` |

---

## Subsearch

Embed a search within another:

```
| search [search index=alerts | dedup src_ip | fields src_ip]
```

The subsearch returns values used in the outer search.

---

## Transaction

Group related events:

```
| transaction session_id maxspan=30m
| transaction user startswith="login" endswith="logout"
```

---

## Performance Tips

1. **Filter early** - Use indexed fields first (`index`, `sourcetype`, `host`, `_time`)
2. **Be specific** - Avoid leading wildcards (`*admin` is slow)
3. **Remove _raw** - Use `fields - _raw` before stats when not needed
4. **Prefer lookups** - Faster than joins for enrichment
5. **Use tstats** - For indexed field queries on large datasets
6. **Limit time range** - Narrow `earliest` and `latest` where possible
7. **Include over exclude** - `status=200` is faster than `NOT status=404`

---

## Relative Time Syntax

| Syntax | Meaning |
|--------|---------|
| `-1h` | 1 hour ago |
| `-7d@d` | 7 days ago, rounded to day start |
| `-1w@w` | 1 week ago, rounded to week start |
| `@d` | Start of today |
| `-1mon@mon` | Start of last month |

---

## Regex Quick Reference

| Pattern | Matches |
|---------|---------|
| `.` | Any character |
| `*` / `+` / `?` | Zero+, one+, zero/one |
| `\d` | Digit |
| `\w` | Word character |
| `\s` | Whitespace |
| `[abc]` | Character set |
| `^` / `$` | Start/end |
| `(?<name>...)` | Named capture group |
| `(?i)` | Case insensitive |

---

## Helpful Links

| Name | Description |
|------|-------------|
| [Splunk Docs - Search Reference](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference) | Official command reference |
| [Splunk Lantern](https://lantern.splunk.com/) | Use cases and tutorials |
| [BOTS Datasets](https://github.com/splunk/botsv3) | Practice datasets for threat hunting |
| [Splunk Security Essentials](https://splunkbase.splunk.com/app/3435/) | Pre-built security searches |

