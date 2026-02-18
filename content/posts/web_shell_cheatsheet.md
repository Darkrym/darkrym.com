---
author:
  name: "Darkrym"
date: 2026-01-12
linktitle: Web Shell
type:
- post
- posts
title: Web Shell Cheat Sheet
weight: 10
series:
- cheat_sheets
---

This webshell cheat sheet is designed for digital forensics, incident response, and threat hunting. It covers detection techniques, common webshell types, log analysis, and response strategies across multiple web server platforms including Apache, Nginx, IIS/Exchange, Tomcat, and WordPress. Perfect for SOC analysts, incident responders, and security investigators hunting for compromised web servers.

---
## Common attack pattern from compromised Web Server:

```
w3wp.exe → cmd.exe → powershell.exe
```

**What to look for:**

- Unusual child processes from SQL Server
 - i.e `cmd.exe` or `powershell.exe` spawned by web server processes
- PowerShell with encoded commands (`-enc`, `-encodedcommand`)
- Download cradles (`IEX`, `Invoke-WebRequest`, `wget`)

**Detection:**

**Windows (PowerShell):**
```powershell
# Find w3wp.exe spawning child processes
Get-WmiObject Win32_Process | Where-Object {$_.ParentProcessId -eq (Get-Process w3wp).Id}
```

**Linux:**
```bash
# Find apache/nginx spawning shells
ps auxf | grep -A5 'httpd\|nginx' | grep -E 'bash|sh|cmd'
```

## General Indicators

| Category | Indicators |
|---|---|
| **Files** | Unexpected `.php`, `.asp`, `.aspx`, `.jsp` in web-accessible directories · Short/randomised names (`x.php`, `a1b2.php`, `cmd.jsp`) |
| **Timestamps** | File modification times out of line with legitimate deployments or recent changes |
| **Obfuscation** | Tiny files (<10KB) containing `eval`, `base64_decode`, `system`, `exec`, `passthru` |
| **Logs** | POST requests to files not designed for uploads · Long encoded parameters · Unusual source IPs |
| **Process Activity** | Web server processes spawning shells (`w3wp.exe` → `cmd.exe`, `httpd` → `bash`) |

---

## Suspicious Log Signals

**Query parameters to flag:** `?cmd=` `?exec=` `?eval=` `?pass=` `?shell=` `?c=` `?run=` `?payload=`

**Common log anomalies:**
- POST requests to static/media paths (e.g. `/uploads/`, image dirs)
- POST requests with HTTP responses ≤ 403 to `.php`, `.jsp`, `.asp`, `.aspx` files
- Long base64-encoded request bodies or query strings
- Unexpected IPs accessing admin or auth paths
- `200` responses to requests for newly appeared script files
- Successful Basic HTTP authentication to unusual files
- Multiple failed authentication attempts followed by success
- `w3wp.exe` or `httpd` spawning child processes (`cmd.exe`, `sh`)

---

## Where Web Shells Hide — Quick Reference

| Platform | Common Paths |
|---|---|
| **Apache / Nginx** | `/var/www/html/`, `/var/www/html/uploads/`, `/usr/share/nginx/html/` |
| **IIS / Exchange** | `C:\inetpub\wwwroot\`, `FrontEnd\HttpProxy\owa\auth\`, `FrontEnd\HttpProxy\ecp\auth\`, App Pool dirs |
| **Tomcat** | `webapps/ROOT/`, `webapps/[app]/` |
| **WordPress** | `wp-content/uploads/`, theme & plugin dirs |

---

## Server-Specific Notes

### Nginx

**Log Paths**
- `/var/log/nginx/access.log`
- `/var/log/nginx/error.log`

**Suspicious Directories**
- `/usr/share/nginx/html/uploads/`
- `/var/www/html/`

**Key Check:** `.php` execution in upload paths should never occur.

**Extensions:** `.php` `.phtml`

---

### Apache (Linux / Windows, PHP-heavy)

**Log Paths — Linux**
- Debian/Ubuntu: `/var/log/apache2/access.log`, `/var/log/apache2/error.log`
- RHEL/CentOS: `/var/log/httpd/access_log`, `/var/log/httpd/error_log`

**Log Paths — Windows**
- `C:\*\apache\logs\access.log`, `C:\*\apache\logs\error.log`
- `C:\Program Files\Apache Group\Apache2\logs\`

**Suspicious Directories**
- `/var/www/html/` and subfolders
- `C:\*\cgi-bin\`, `C:\*\apache\htdocs\`

**Key Checks**
- POST to `.php` files not designed for input
- Long base64-encoded request bodies

**Extensions:** `.php` `.phtml` `.phar` `.php5`

---

### IIS / Exchange (Windows, ASP/ASPX)

**Config File**
- `C:\Windows\System32\inetsrv\config\applicationHost.config` — maps App Pools ↔ directories and logs

**Log Paths**
- `C:\inetpub\logs\LogFiles\W3SVC*` — sort by recently modified

**Suspicious Directories**
- Directories tied to App Pools (identify via `applicationHost.config`)
- `FrontEnd\HttpProxy\owa\auth\`
- `FrontEnd\HttpProxy\ecp\auth\`

> **App Pool Permissions:** Web shells inherit the service account of the App Pool they're dropped into. Identify the pool via `applicationHost.config` to scope lateral movement risk.

**Key Indicators**
- `w3wp.exe` spawning child processes
- POST requests to unusual `.aspx` files in OWA/ECP paths

**Extensions:** `.asp` `.aspx` `.ashx` `.asa` `.config` `.cshtml`

---

### Tomcat / Java Servers

**Config**
- `$CATALINA_HOME/conf/server.xml`

**Log Paths**
- `$CATALINA_HOME/logs/`
- `$CATALINA_HOME/logs/localhost_access_log.*.txt`
- `$CATALINA_HOME/logs/catalina.out`

**Suspicious Directories**
- `$CATALINA_HOME/webapps/ROOT/`
- `$CATALINA_HOME/webapps/*/`

> **WAR Deployment:** Dropping a malicious `.war` file into `webapps/` auto-deploys a shell. Monitor for unexpected `.war` or `.jar` additions.

**Extensions:** `.jsp` `.jspx` `.war` `.jar`

---

### WordPress (PHP CMS)

**Suspicious Directories**
- `wp-content/uploads/` — media only, no `.php` files should exist here
- `wp-content/themes/[theme]/`
- `wp-content/plugins/[plugin]/`
- `wp-includes/`
- `wp-admin/`

**File Indicators**
- `.php` files in `uploads/` (should be media only)
- Modified core files: `index.php`, `wp-config.php`, `functions.php`
- Small obfuscated PHP snippets: `<?php eval($_POST['x']); ?>`

**Log Indicators**
- POST requests to media paths, e.g. `/uploads/shell.php`
- Query params: `cmd=`, `exec=`, `pass=`

**Extensions:** `.php` `.phtml` `.phar`

---

## Detection Tools & Techniques

### Static Analysis Tools

| Tool | Description |
|---|---|
| **LOKI** | Free IOC scanner using YARA rules for webshell detection |
| **ShellSweepPlus** | Static code analysis with pattern-based and heuristic detection |
| **BackdoorMan** | PHP webshell scanner with signature database |


### Log Analysis Queries

**Find POST requests to script files:**
```bash
# Apache/Nginx
grep -E 'POST.*\.(php|jsp|asp|aspx).*HTTP.*200' access.log

# IIS (W3C format)
awk '$6 == "POST" && $9 ~ /\.(php|jsp|asp|aspx)/ && $11 < 404' u_ex*.log
```

**Find base64-encoded requests:**
```bash
grep -E 'base64|eval|exec|cmd=' access.log | grep -v 'data:image'
```

**Find unusual user agents:**
```bash
# Look for scripting tools, curl, wget, python
grep -E 'curl|wget|python|perl|ruby|Scanner' access.log
```

---

### Common Webshell Locations to Check

**Windows:**
```
C:\inetpub\wwwroot\
C:\inetpub\wwwroot\aspnet_client\
C:\Program Files\Microsoft\Exchange Server\*\FrontEnd\HttpProxy\owa\auth\
C:\Windows\Temp\
Application pool directories
```

**Linux:**
```
/var/www/html/
/var/www/html/uploads/
/usr/share/nginx/html/
/tmp/
/var/tmp/
```

---

## Further Reading

- [NSA/CISA: Detect and Prevent Web Shell Malware](https://media.defense.gov/2020/Jun/09/2002313081/-1/-1/0/CSI-DETECT-AND-PREVENT-WEB-SHELL-MALWARE-20200422.PDF)
- [CISA: China Chopper Analysis Report](https://www.cisa.gov/news-events/analysis-reports/ar21-102a)
- [NSA: Mitigating Web Shells (GitHub)](https://github.com/nsacyber/Mitigating-Web-Shells)
- [Recorded Future: Web Shell Analysis](https://www.recordedfuture.com/blog/web-shell-analysis-part-1)
- [WebShell Repository (tennc)](https://github.com/tennc/webshell)
- [MITRE ATT&CK T1505.003 — Web Shell](https://attack.mitre.org/techniques/T1505/003/)
- [Huntress: Nezha China Nexus Threat Actor Tool](https://www.huntress.com/blog/nezha-china-nexus-threat-actor-tool)

---
