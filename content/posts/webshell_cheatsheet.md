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
summary: Quick-reference for detecting webshells across IIS, Apache, Nginx, Tomcat, and WordPress. Includes indicators, common hiding spots, suspicious extensions, and a detailed IIS investigation walkthrough.
---

This webshell detection cheat sheet covers indicators, common hiding spots, and investigation techniques across major web server platforms. Designed for SOC analysts, incident responders, and threat hunters dealing with web server compromises.

For a real-world example of webshell analysis, see my breakdown of the [Nezha China-Nexus Threat Actor Tool](https://www.huntress.com/blog/nezha-china-nexus-threat-actor-tool).

---

## General Indicators

| Category | Detail |
| --- | --- |
| Files | Unexpected `.php` `.asp` `.aspx` `.jsp` in web-accessible dirs. Short/randomised names (`x.php`, `a1b2.php`, `cmd.jsp`) |
| Timestamps | File modification times out of line with legitimate deployments |
| Obfuscation | Tiny files <10KB containing dangerous functions |
| Logs | POST to non-upload files. Long encoded params. Unusual source IPs |

---

## Suspicious Log Signals

**Query parameters to flag:**

```
?cmd=    ?exec=    ?pass=
?shell=  ?c=       ?run=     ?payload=
```

**Other indicators:**
- POST requests to static/media paths (e.g. `/uploads/`)
- Long base64-encoded request bodies or query strings
- Unexpected IPs accessing admin or auth paths
- 200 responses to newly appeared script files
- Web worker processes spawning command interpreters

---

## Where Webshells Hide

| Platform | Common Paths |
| --- | --- |
| Apache / Nginx | `/var/www/html/` `/var/www/html/uploads/` `/usr/share/nginx/html/` |
| IIS / Exchange | `C:\inetpub\wwwroot\` `FrontEnd\HttpProxy\owa\auth\` `FrontEnd\HttpProxy\ecp\auth\` App Pool dirs |
| Tomcat | `webapps/ROOT/` `webapps/[app]/` |
| WordPress | `wp-content/uploads/` theme & plugin dirs |

---

## Server-Specific Notes

### Nginx

**Log Paths:**
- `/var/log/nginx/access.log`
- `/var/log/nginx/error.log`

**Suspicious Dirs:**
- `/usr/share/nginx/html/uploads/`
- `/var/www/html/`

> **Key check:** .php execution in upload paths should never occur

**Suspicious Extensions:** `.php` `.phtml`

---

### Apache

**Logs (Linux):**
- Debian/Ubuntu: `/var/log/apache2/access.log`
- RHEL/CentOS: `/var/log/httpd/access_log`

**Logs (Windows):**
- `C:\*\apache\logs\access.log`
- `C:\Program Files\Apache Group\Apache2\logs\`

**Dirs:**
- `/var/www/html/`
- `C:\*\cgi-bin\` `C:\*\apache\htdocs\`

**Suspicious Extensions:** `.php` `.phtml` `.phar` `.php5`

---

### IIS / Exchange

**Config:**
- `C:\Windows\System32\inetsrv\config\applicationHost.config` — App Pools to dirs mapping

**Logs:**
- `C:\inetpub\logs\LogFiles\W3SVC*` — sort by modified

**Dirs:**
- `C:\inetpub\wwwroot\`
- `FrontEnd\HttpProxy\owa\auth\`
- `FrontEnd\HttpProxy\ecp\auth\`

> **App Pool Perms:** Shells inherit the service account of their App Pool. Check applicationHost.config to scope lateral movement risk.

**Suspicious Extensions:** `.asp` `.aspx` `.ashx` `.asa` `.config` `.cshtml`

---

### Tomcat / Java

**Config:**
- `$CATALINA_HOME/conf/server.xml`

**Logs:**
- `$CATALINA_HOME/logs/`
- `localhost_access_log.*.txt`
- `catalina.out`

**Dirs:**
- `$CATALINA_HOME/webapps/ROOT/`
- `$CATALINA_HOME/webapps/*/`

> **WAR Deploy:** Malicious .war dropped to webapps/ auto-deploys a shell. Monitor for unexpected .war/.jar additions.

**Suspicious Extensions:** `.jsp` `.jspx` `.war` `.jar`

---

### WordPress (PHP CMS)

**Suspicious Dirs:**
- `wp-content/uploads/` — media only, no .php files should exist here
- `wp-content/themes/[theme]/`
- `wp-content/plugins/[plugin]/`
- `wp-includes/`
- `wp-admin/`

**File & Log Indicators:**
- .php files in uploads/ (should be media only)
- Modified core: `index.php`, `wp-config.php`, `functions.php`
- POST to media paths
- Suspicious query params

**Suspicious Extensions:** `.php` `.phtml` `.phar`

---

## IIS Investigation Walkthrough

### Step 1: Identify the WebApp Running

Figure out what's actually running on IIS — Exchange, SharePoint, or custom WebApps.

```powershell
# Exchange
Test-Path "C:\Program Files\Microsoft\Exchange Server"

# SharePoint
Test-Path "C:\Program Files\Common Files\microsoft shared\Web Server Extensions"

# Generic IIS WebApps - check applicationHost.config
Get-Content C:\Windows\System32\inetsrv\config\applicationHost.config | Select-String "physicalPath"
```

---

### Step 2: Find the Exchange Install Path

```powershell
# Option A: env var
$env:ExchangeInstallPath

# Option B: registry
$exchPath = (Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\ExchangeServer\v15\Setup" -ErrorAction SilentlyContinue).MsiInstallPath
$exchPath
```

---

### Step 3: Identify the Webroot Directories

Parse `applicationHost.config` for all website physical paths:

```powershell
[xml]$config = Get-Content C:\Windows\System32\inetsrv\config\applicationHost.config
$config.configuration.'system.applicationHost'.sites.site | ForEach-Object {
    $siteName = $_.name
    $_.application.virtualDirectory | ForEach-Object {
        [PSCustomObject]@{
            Site = $siteName
            Path = $_.path
            PhysicalPath = $_.physicalPath
        }
    }
} | Format-Table -AutoSize
```

---

### Step 4: Search Webroots for Suspicious Extensions

Enumerate web-accessible file extensions across all identified webroots:

```powershell
$webroots = @(
    "C:\inetpub\wwwroot",
    "$exchPath\FrontEnd\HttpProxy\owa\auth",
    "$exchPath\FrontEnd\HttpProxy\ecp\auth"
)

$suspiciousExts = @(".aspx", ".asp", ".ashx", ".asmx", ".cshtml", ".config", ".ps1", ".php", ".jsp")

foreach ($root in $webroots) {
    if (Test-Path $root) {
        Get-ChildItem -Path $root -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $suspiciousExts -contains $_.Extension.ToLower() } |
        Select-Object FullName, LastWriteTime, Length |
        Sort-Object LastWriteTime -Descending
    }
}
```

---

### Step 5: Identify Recently Modified Files

Look for files modified in a suspicious window (e.g., the past 7 days):

```powershell
$days = 7
$cutoff = (Get-Date).AddDays(-$days)

foreach ($root in $webroots) {
    if (Test-Path $root) {
        Get-ChildItem -Path $root -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.LastWriteTime -ge $cutoff } |
        Select-Object FullName, LastWriteTime, Length |
        Sort-Object LastWriteTime -Descending
    }
}
```

---

### Step 6: Search for Known Indicators

Scan files for common malicious patterns - look for functions that execute code dynamically, process spawning, or request parameter handling in server-side scripts.

```powershell
$patterns = @(
    "FromBase64String",
    "System\.Diagnostics\.Process",
    "Request\[",
    "Request\.Form",
    "Request\.QueryString",
    "Server\.Execute",
    "ProcessStartInfo"
)

$regex = ($patterns -join "|")

foreach ($root in $webroots) {
    if (Test-Path $root) {
        Get-ChildItem -Path $root -Recurse -File -Include *.aspx,*.asp,*.ashx,*.asmx,*.cshtml,*.config -ErrorAction SilentlyContinue |
        ForEach-Object {
            $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
            if ($content -match $regex) {
                [PSCustomObject]@{
                    File = $_.FullName
                    LastModified = $_.LastWriteTime
                    SizeBytes = $_.Length
                    MatchedPattern = ($patterns | Where-Object { $content -match $_ }) -join ", "
                }
            }
        }
    }
}
```

---

## Additional Resources

- [Nezha China-Nexus Threat Actor Tool Analysis](https://www.huntress.com/blog/nezha-china-nexus-threat-actor-tool) — Real-world webshell investigation example
- [OWASP Webshell Detection](https://owasp.org/www-community/attacks/Web_Shell)
- [CISA Webshell Detection](https://www.cisa.gov/news-events/cybersecurity-advisories/aa20-259a)

---
