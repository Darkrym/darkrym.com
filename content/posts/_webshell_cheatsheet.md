---
author:
  name: "Darkrym"
date: 2025-06-02
linktitle: Webshell Detection
type:
- post
- posts
title: Webshell Detection & Investigation Cheat Sheet
weight: 10
tags:
  - cheatsheet
  - webshell
  - dfir
  - iis
  - exchange
series:
- Cheatsheets
series_order: 11
summary: Comprehensive guide to detecting webshells across IIS, Apache, Nginx, Tomcat, and WordPress. Includes indicators, log analysis, server-specific paths, and investigation techniques.
---

> View all cheatsheets in an interactive format at [Cheat Sheets](/cheat-sheets/).

This webshell detection cheat sheet is designed for SOC analysts, incident responders, and threat hunters investigating web server compromises. It covers detection indicators, log analysis techniques, and server-specific investigation paths.

For a real-world example of webshell analysis, see my breakdown of the [Nezha China-Nexus Threat Actor Tool](https://www.huntress.com/blog/nezha-china-nexus-threat-actor-tool).

---

## General Indicators

### File-Based Indicators
```
# Unexpected files in web directories
.php, .asp, .aspx, .jsp, .jspx, .ashx, .asa, .config, .cshtml

# Naming patterns
Short/random names: x.php, cmd.jsp, a1b2.php, shell.aspx
Single character: a.php, 1.asp
Encoded names: %61%62%63.php

# File characteristics
Tiny files (<10KB) with obfuscated code
File timestamps out of sync with legitimate deployments
Recently modified files in otherwise static directories
```

### Code-Level Indicators
```
# PHP dangerous functions
eval(), base64_decode(), system(), exec(), passthru()
shell_exec(), proc_open(), popen(), assert()
preg_replace() with /e modifier

# ASP/ASPX dangerous patterns
Request.Form, Request.QueryString, Request[]
Server.Execute, Response.Write with Request data
System.Diagnostics.Process, ProcessStartInfo
FromBase64String, Assembly.Load

# JSP dangerous patterns
Runtime.getRuntime().exec()
ProcessBuilder
```

---

## Log Analysis

### Suspicious Query Parameters
```
?cmd=       ?exec=      ?eval=      ?pass=
?shell=     ?c=         ?run=       ?payload=
?command=   ?execute=   ?action=    ?do=
```

### Log Anomalies to Flag
- POST requests to static/media paths (e.g. `/uploads/`)
- Long base64-encoded request bodies or query strings
- Unexpected IPs accessing admin or auth paths
- 200 responses to newly appeared script files
- Requests with unusually long URLs or POST bodies
- Multiple rapid requests to same suspicious file

### Process Spawning (Critical)
```
# Windows IIS
w3wp.exe spawning cmd.exe, powershell.exe, or other interpreters

# Linux Apache/Nginx
httpd or nginx worker spawning /bin/sh, /bin/bash, python, perl
```

---

## Where Webshells Hide

| Platform | Common Paths |
| --- | --- |
| Apache/Nginx | `/var/www/html/`, `/var/www/html/uploads/`, `/usr/share/nginx/html/` |
| IIS/Exchange | `C:\inetpub\wwwroot\`, `FrontEnd\HttpProxy\owa\auth\`, `FrontEnd\HttpProxy\ecp\auth\`, App Pool dirs |
| Tomcat | `$CATALINA_HOME/webapps/ROOT/`, `$CATALINA_HOME/webapps/*/` |
| WordPress | `wp-content/uploads/`, `wp-content/themes/*/`, `wp-content/plugins/*/` |

---

## Server-Specific Reference

### Tomcat / Java

**Config:**
```
$CATALINA_HOME/conf/server.xml
```

**Log Paths:**
```
$CATALINA_HOME/logs/
localhost_access_log.*.txt
catalina.out
```

**Suspicious Directories:**
```
$CATALINA_HOME/webapps/ROOT/
$CATALINA_HOME/webapps/*/
```

**Key Indicator:** Malicious `.war` dropped to `webapps/` auto-deploys a shell. Monitor for unexpected `.war`/`.jar` additions.

**Suspicious Extensions:** `.jsp` `.jspx` `.war` `.jar`

---

### Nginx

**Log Paths:**
```
/var/log/nginx/access.log
/var/log/nginx/error.log
```

**Suspicious Directories:**
```
/usr/share/nginx/html/uploads/
/var/www/html/
```

**Key Check:** `.php` execution in upload paths should never occur. If it does, check nginx config for misconfigured `location` blocks.

**Suspicious Extensions:** `.php` `.phtml`

---

### Apache

**Log Paths (Linux):**
```
# Debian/Ubuntu
/var/log/apache2/access.log

# RHEL/CentOS
/var/log/httpd/access_log
```

**Log Paths (Windows):**
```
C:\*\apache\logs\access.log
C:\Program Files\Apache Group\Apache2\logs\
```

**Suspicious Directories:**
```
/var/www/html/
C:\*\cgi-bin\
C:\*\apache\htdocs\
```

**Suspicious Extensions:** `.php` `.phtml` `.phar` `.php5`

---

### IIS / Exchange

**Config:**
```
C:\Windows\System32\inetsrv\config\applicationHost.config
# Maps App Pools ↔ directories
```

**Log Paths:**
```
C:\inetpub\logs\LogFiles\W3SVC*
# Sort by recently modified
```

**Suspicious Directories:**
```
C:\inetpub\wwwroot\
FrontEnd\HttpProxy\owa\auth\
FrontEnd\HttpProxy\ecp\auth\
```

**Key Note:** Shells inherit the service account of their App Pool. Check `applicationHost.config` to scope lateral movement risk.

**Suspicious Extensions:** `.asp` `.aspx` `.ashx` `.asa` `.config` `.cshtml`

---

### WordPress (PHP CMS)

**Suspicious Directories:**
```
wp-content/uploads/          # Media only — NO .php should exist
wp-content/themes/[theme]/
wp-content/plugins/[plugin]/
wp-includes/
wp-admin/
```

**File & Log Indicators:**
- `.php` files in `uploads/` (should be media only)
- Modified core files: `index.php`, `wp-config.php`, `functions.php`
- POST to media paths: `/uploads/shell.php`
- Suspicious params: `cmd=`, `exec=`, `pass=`

**Suspicious Extensions:** `.php` `.phtml` `.phar`

---

## Investigation Workflow

### 1. Identify the Web Server

**1a. Determine what's running (Linux):**
```bash
# Linux - Check running web services
ps aux | grep -E "nginx|apache|httpd|tomcat|java"
systemctl status nginx apache2 httpd tomcat
```
**1b. Determine what's running (Windows):**

```
# Check for web server processes spawning command interpreters
# Look in EDR/Sysmon for:

# IIS
w3wp.exe → cmd.exe
w3wp.exe → powershell.exe

# Apache (Windows)
httpd.exe → cmd.exe
httpd.exe → powershell.exe

# Tomcat (Windows)
java.exe → cmd.exe
java.exe → powershell.exe
```

#### IIS Only
Once you identify `w3wp.exe` spawning suspicious processes, map the command line to its App Pool:

**Step 1: Get App Pool from w3wp.exe command line**
```
# w3wp.exe command line shows the App Pool name:
w3wp.exe -ap "DefaultAppPool" -v "v4.0" ...

# The -ap parameter reveals which App Pool is executing
```

**Step 2: Query registry for App Pool identity**
```
# App Pool configurations in registry:
HKLM\SOFTWARE\Microsoft\InetStp\AppPools\[AppPoolName]

# Query the App Pool settings:
reg query "HKLM\SOFTWARE\Microsoft\InetStp\AppPools\[AppPoolName]"
```

**Step 3: Map App Pool to site directories**
```
# Physical paths configured in:
C:\Windows\System32\inetsrv\config\applicationHost.config

# Check <sites> section to see which directories each pool serves
```

### 2. What to Look for in Logs

**Suspicious Query Parameters:**
```
?cmd=       ?exec=      ?eval=      ?pass=
?shell=     ?c=         ?run=       ?payload=
?command=   ?execute=   ?action=    ?do=
```

**Request Anomalies:**
```
# POST requests to static/media paths
POST /uploads/image.php
POST /wp-content/uploads/123.php

# Long base64-encoded query strings or POST bodies
GET /page.aspx?data=SGVsbG8gV29ybGQ...

# 200 responses to newly appeared script files
# Multiple rapid requests to same suspicious file
```
> **Tip:** Establish a baseline first. Compare current logs against the same time period from last week to identify anomalies and new patterns.

### 3. Search for Suspicious Files

**Key Directories to Check:**
| Platform | Paths |
| --- | --- |
| IIS/Exchange | `C:\inetpub\wwwroot\`, `FrontEnd\HttpProxy\owa\auth\`, `FrontEnd\HttpProxy\ecp\auth\` |
| Tomcat | `$CATALINA_HOME/webapps/ROOT/`, `$CATALINA_HOME/webapps/*/` |
| WordPress | `wp-content/uploads/` (NO .php here), `wp-content/themes/*/`, `wp-content/plugins/*/` |
| Apache/Nginx | `/var/www/html/`, `/var/www/html/uploads/`, `/usr/share/nginx/html/` |

**By extension:**
```bash
# Linux
find /var/www/html -type f \( -name "*.php" -o -name "*.phtml" \) -mtime -7

# Windows IIS
dir /s /b C:\inetpub\wwwroot\*.aspx C:\inetpub\wwwroot\*.asp C:\inetpub\wwwroot\*.ashx
```

**By recent modification:**
```bash
# Linux - files modified in last 7 days
find /var/www/html -type f -mtime -7 -ls

# Windows - sort by date
dir /s /od C:\inetpub\wwwroot\
```

**By size (tiny files often suspicious):**
```bash
# Linux - files under 10KB
find /var/www/html -type f -size -10k -name "*.php"
```

> **Tip:** A shell can be as small as 50 characters buried in a much larger file. Always inspect files thoroughly - I once found an AntSword shell hidden in the middle of a log file with a `.php` extension. The weird extension was the only giveaway I initially spotted.

### 4. Traditional Host Analysis

Once you've identified the webshell, pivot to traditional DFIR analysis to understand what the attacker executed and what persistence they dropped.

**Windows - Check child processes and commands:**
```
# Sysmon Event ID 1 - Process Creation
# Filter for w3wp.exe as parent process
# Look at CommandLine field to see what was executed

# Check scheduled tasks (persistence)
schtasks /query /fo LIST /v

# Check services (persistence)
sc query state= all

# Check Run keys (persistence)
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
reg query "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
```

**Linux - Check child processes and commands:**
```bash
# Check auth logs for commands executed
cat /var/log/auth.log | grep -i "command"

# Check bash history (if attacker didn't clear it)
cat /home/*/.bash_history
cat /root/.bash_history

# Check cron jobs (persistence)
crontab -l
ls -la /etc/cron.*

# Check systemd services (persistence)
systemctl list-unit-files --type=service
```

**What to look for:**
- Reconnaissance commands (whoami, id, hostname, ipconfig/ifconfig)
- Download cradles (curl, wget, certutil, PowerShell download)
- Lateral movement tools dropped
- Scheduled tasks or services created
- User accounts added

---

## Useful Tools

| Tool | Use |
| --- | --- |
| [**YARA**](https://github.com/VirusTotal/yara) | Pattern-based webshell detection |
| [**Loki**](https://github.com/Neo23x0/Loki) | IOC scanner with webshell rules |
| [**NeoPI**](https://github.com/CiscoCXSecurity/NeoPI) | Entropy-based webshell detection |
| [**BackdoorMan**](https://github.com/cys3c/BackdoorMan) | Python webshell scanner |
| [**Web Shell Detector**](https://github.com/emposha/PHP-Shell-Detector) | PHP/signature-based scanner |
| [**Microsoft Safety Scanner**](https://docs.microsoft.com/en-us/microsoft-365/security/intelligence/safety-scanner-download) | Windows webshell detection |

---

## Additional Resources

- [Nezha China-Nexus Threat Actor Tool Analysis](https://www.huntress.com/blog/nezha-china-nexus-threat-actor-tool) — Real-world webshell investigation
- [OWASP Web Shell Detection](https://owasp.org/www-community/attacks/Web_Shell)
- [CISA Alert on Web Shells](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-259a)

---
