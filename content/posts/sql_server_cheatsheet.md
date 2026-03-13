---
author:
  name: "Darkrym"
date: 2025-12-21
linktitle: MSSQL
type:
- post
- posts
title: MSSQL Cheat Sheet
weight: 10
tags:
  - cheatsheet
  - mssql
  - dfir
  - threat-hunting
series:
- Cheatsheets
series_order: 10
summary: Microsoft SQL Server forensics and threat hunting guide covering registry paths, log locations, attack indicators, and configuration analysis for compromised SQL Server instances.
---

This Microsoft SQL Server cheat sheet is designed for digital forensics, incident response, and threat hunting. It covers registry paths, log file locations, attack indicators, and configuration analysis for Microsoft SQL Server. Perfect for SOC analysts, incident responders, and security investigators hunting for compromised SQL Server instances.

---

## Quick Reference

### Common attack pattern from compromised SQL Server:

```
sqlservr.exe → cmd.exe → powershell.exe
```

**What to look for:**

- `cmd.exe` or `powershell.exe` spawned by `sqlservr.exe`
- Parent process is SQL Server service process
- PowerShell with encoded commands (`-enc`, `-encodedcommand`)
- Download cradles (`IEX`, `Invoke-WebRequest`, `wget`)
- Unusual child processes from SQL Server

**Detection:**

```powershell
# Find suspicious child processes of sqlservr.exe
Get-WmiObject Win32_Process | Where-Object {$_.ParentProcessId -eq (Get-Process sqlservr).Id}
```
---

### Key Registry Paths

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL{XX}.{INSTANCENAME}\MSSQLServer\
```

### Key File Paths

```
C:\Program Files\Microsoft SQL Server\MSSQL{XX}.{INSTANCENAME}\MSSQL\Log\ERRORLOG
C:\Program Files\Microsoft SQL Server\MSSQL{XX}.{INSTANCENAME}\MSSQL\Data\
C:\Program Files\Microsoft SQL Server\MSSQL{XX}.{INSTANCENAME}\MSSQL\Backup\
```

### Key Processes

```
sqlservr.exe      # Main SQL Server engine
sqlagent.exe      # SQL Server Agent (job execution)
sqlbrowser.exe    # Instance enumeration service
launchpad.exe     # R/Python external script execution
```

### Database File Extensions

| Extension | Description                  |
| --------- | ---------------------------- |
| .mdf      | Primary data file            |
| .ndf      | Secondary data file          |
| .ldf      | Transaction log file         |
| .bak      | Backup file                  |
| .trn      | Transaction log backup       |

---

## Instance Investigation

### Identifying Exploited Instances

For the suspicious child process the parent process command line reveals instance:

```powershell
# Process: sqlservr.exe
# Command line includes: -s {INSTANCENAME}

Get-WmiObject Win32_Process -Filter "name='sqlservr.exe'" | Select-Object CommandLine
```

### Instance Names & Mapping

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL
```

- Maps instance names to their internal version identifiers
- Example: `PRODUCTION` → `MSSQL15.PRODUCTION`
- Use this to translate between friendly names and registry paths

---

## Registry Key Locations

### Main Instance Configuration

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQLServer\
```

**Key Subkeys:**

| Subkey              | Description                                      |
| ------------------- | ------------------------------------------------ |
| Parameters          | Startup parameters, master database locations    |
| SuperSocketNetLib   | Network configuration, protocols, ports          |
| CurrentVersion      | Installed version (may be spoofed/outdated)      |
| Audit               | Audit settings                                   |
| CPE                 | Customer feedback settings                       |
| ExtendedProcedures  | Extended stored procedures (xp_cmdshell)         |

### Startup Parameters

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQLServer\Parameters
```

**What to look for:**

```
-d    # Master database file location (check for unusual paths)
-e    # Error log location (redirected logs)
-l    # Master log file location
-T    # Trace flags (persistence mechanism)
```

### Network Configuration

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQLServer\SuperSocketNetLib\Tcp
```

**Check for:**

```
TcpPort    # Port number (default: 1433)
Enabled    # Whether TCP/IP is enabled
ListenOnAllIPs    # 0 = specific IPs, 1 = all IPs
```

### Authentication Mode

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQLServer -> LoginMode
```

| Value | Mode                                    | Risk                                             |
| ----- | --------------------------------------- | ------------------------------------------------ |
| 1     | Windows Authentication only             | More secure                                      |
| 2     | Mixed Mode (Windows + SQL)              | Allows SQL authentication, often targeted        |

---

## Version Verification

### Version Number Breakdown

Format: `XX.X.XXXX.X`

| Version     | Product              |
| ----------- | -------------------- |
| 16.0.xxxx.x | SQL Server 2022      |
| 15.0.xxxx.x | SQL Server 2019      |
| 14.0.xxxx.x | SQL Server 2017      |
| 13.0.xxxx.x | SQL Server 2016      |
| 12.0.xxxx.x | SQL Server 2014      |
| 11.0.xxxx.x | SQL Server 2012      |
| 10.50.xxxx.x| SQL Server 2008 R2   |
| 10.0.xxxx.x | SQL Server 2008      |

### Version Location

```
C:\Program Files\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQL\Log\ERRORLOG
```

First lines show: `Microsoft SQL Server YYYY - XX.X.XXXX.X (X64)`

**Cross-reference locations:**

- `sqlservr.exe` file version in `MSSQL\Binn\` (check last modified date)
- Check across all archived `ERRORLOG.X` files for recent updates
- Build number in ERRORLOG is authoritative

---

## Log File Analysis

### Error Logs

**Location:**

```
C:\Program Files\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQL\Log\
```

**Files:**

```
ERRORLOG        # Current error log
ERRORLOG.1      # Most recent archived log
ERRORLOG.2      # Second most recent
...
ERRORLOG.6      # Oldest archived log
```

**What to look for:**

```
Failed login attempts              # Multiple rapid attempts = brute force
New logins created                 # Unauthorized account creation
Configuration changes              # sp_configure calls
xp_cmdshell enable/disable events  # Command execution capability
Database attach/detach operations  # Suspicious database operations
Backup/restore operations          # Unusual locations or timing
Startup parameters changes         # Persistence mechanisms
Service restarts                   # Potential crash or forced restart
```

### SQL Agent Logs

```
C:\Program Files\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQL\Log\SQLAGENT.OUT
```

**What to look for:**

- Job execution history
- Suspicious scheduled tasks
- Failed job executions
- Jobs running PowerShell/cmd commands

### Audit Logs (if enabled)

```
C:\Program Files\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQL\Log\*.sqlaudit
```

**Note:** Requires SQL Server Audit to be configured

### Windows Event Logs (SQL Server Audit)

**When SQL Server Audit is configured to write to Windows Security/Application logs:**

```
# Windows Application Event Log
Event ID: 33205    # SQL Audit events (Application log)

# Windows Security Event Log (requires special configuration)
Event ID: 33205    # SQL Audit events (Security log - tamper-proof)
Event ID: 24000    # SQL audit event
Event ID: 24001    # Login succeeded
Event ID: 24298    # Database login succeeded (action_id DBAS)
```

**Configuration Requirements:**

1. Audit object access policy must be configured using `auditpol.exe`
2. SQL Server service account needs "generate security audits" permission
3. Audit destination configured to write to Security or Application log

**Benefits:** Security log entries are tamper-proof, ideal for compliance

---

## Common Attack Indicators

### xp_cmdshell Abuse

**Registry evidence:**

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\MSSQLServer\ExtendedProcedures
```

**In ERRORLOG:**

```
Configuration option 'show advanced options' changed from 0 to 1
Configuration option 'xp_cmdshell' changed from 0 to 1
```

**Common attack pattern:**

```sql
-- Enable xp_cmdshell
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;

-- Execute commands
EXEC xp_cmdshell 'whoami';
EXEC xp_cmdshell 'powershell -enc <base64>';

-- Disable xp_cmdshell (cover tracks)
EXEC sp_configure 'xp_cmdshell', 0; RECONFIGURE;
```

### Failed Login Tracking

**In ERRORLOG:**

```
Login failed for user 'sa'. Reason: Password did not match
Login failed for user 'admin'. Reason: Could not find login
Login succeeded for user 'NT AUTHORITY\SYSTEM'
```

**Windows Security Event Log:**

```
4625    # Failed logon (filter by process: sqlservr.exe)
4624    # Successful logon (filter by process: sqlservr.exe)
```

### Suspicious Configuration Changes

**Look for in ERRORLOG:**

```
sp_configure 'show advanced options'    # Often precedes malicious config
sp_configure 'Ole Automation Procedures' # Can be used for code execution
sp_configure 'Agent XPs'                # SQL Agent extended procedures
sp_configure 'clr enabled'              # CLR assemblies for code execution
```

---

## Identifying Services Using SQL Server

### Network Connections Analysis

Look for established connections to the SQL Server port:

```powershell
# Find SQL Server process and connections
Get-NetTCPConnection | Where-Object {$_.LocalPort -eq 1433} | Format-Table

# Check actual configured port
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\*\MSSQLServer\SuperSocketNetLib\Tcp" -Name TcpPort
```

**Default ports:**

- TCP 1433 (default instance)
- TCP 1434 (SQL Browser service - UDP)
- Dynamic ports (named instances)

### Service Dependencies

**Registry:**

```
HKLM\SYSTEM\CurrentControlSet\Services\{ServiceName}\DependOnService
```

Look for `MSSQL${INSTANCENAME}` or `SQLServerAgent` in dependencies

**Common services that depend on SQL Server:**

- System Center Configuration Manager (SCCM/MECM)
- SharePoint
- Veeam Backup & Replication
- Windows Server Update Services (WSUS)
- Microsoft Dynamics

### Application Config Files

**IIS Application Pools:**

```
C:\Windows\System32\inetsrv\config\applicationHost.config
```

Search for connection strings: `Data Source=`, `Server=`, `Initial Catalog=`

**Application configuration files:**

```
C:\Program Files\{ApplicationName}\*.config
C:\inetpub\wwwroot\{WebApp}\web.config
```

**File types to check:**

| File                | Application Type          |
| ------------------- | ------------------------- |
| web.config          | ASP.NET applications      |
| app.config          | .NET applications         |
| appsettings.json    | .NET Core applications    |

Search for SQL Server connection strings

### Linked Servers (Server-to-Server)

**Registry:**

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQLXX.{INSTANCENAME}\Providers\
```

- Shows configured OLE DB providers for linked servers
- Indicates if this SQL Server connects to other databases
- Can be abused for lateral movement

---

## File System Locations

### Default Installation Paths

```
C:\Program Files\Microsoft SQL Server\MSSQL15.{INSTANCENAME}\
  ├─ MSSQL\
  │   ├─ Bin\           (executables: sqlservr.exe, sqlcmd.exe)
  │   ├─ Data\           (database files: .mdf, .ldf, .ndf)
  │   ├─ Log\            (ERRORLOG, SQLAGENT logs)
  │   ├─ Backup\         (default backup location)
  │   ├─ Jobs\           (SQL Agent job scripts - rare)
  │   └─ Bin\Resources\ (system resources)
```

**If folders are missing, check:**

```
HKLM\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL15.{INSTANCENAME}\MSSQLServer\Parameters
```

- `-e` tells you where the logs are being sent
- `-d` tells you where the master database is located

---

## Investigation Checklist

### Initial Triage

- [ ] Identify all SQL Server instances on the system
- [ ] Check authentication mode (Windows vs Mixed)
- [ ] Review network configuration and exposed ports
- [ ] Verify SQL Server version and patch level
- [ ] Check for recent service restarts

### Log Analysis

- [ ] Review ERRORLOG for failed login attempts
- [ ] Search for xp_cmdshell enable/disable events
- [ ] Check for suspicious configuration changes
- [ ] Review SQL Agent job history
- [ ] Correlate with Windows Event Logs (4624, 4625, 33205, 24001)

### Configuration Review

- [ ] Check startup parameters for unusual paths
- [ ] Review extended stored procedures configuration
- [ ] Verify linked server configurations
- [ ] Check for suspicious database attach operations
- [ ] Review backup/restore operations
- [ ] Inspect database names for SQL injection patterns
- [ ] Check for malicious CLR assemblies

### Network & Dependencies

- [ ] Identify applications using this SQL Server
- [ ] Review connection strings in application configs
- [ ] Check for linked servers (lateral movement risk)
- [ ] Analyze network connections to/from SQL Server
- [ ] Review service dependencies

---

## Useful Commands

### PowerShell - Instance Enumeration

```powershell
# Find all SQL Server instances
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL'

# Get SQL Server process details
Get-WmiObject Win32_Process -Filter "name='sqlservr.exe'" | Select-Object ProcessId,CommandLine

# Check SQL Server services
Get-Service | Where-Object {$_.DisplayName -like "*SQL*"}
```

### PowerShell - Configuration Review

```powershell
# Get authentication mode
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL*\MSSQLServer' -Name LoginMode

# Get network configuration
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL*\MSSQLServer\SuperSocketNetLib\Tcp'

# Get startup parameters
Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL*\MSSQLServer\Parameters'
```

### Grep/Search Commands

```bash
# Search ERRORLOG for xp_cmdshell
grep -i "xp_cmdshell" ERRORLOG*

# Search for failed logins
grep -i "login failed" ERRORLOG* | sort | uniq -c

# Search for configuration changes
grep -i "sp_configure" ERRORLOG*

# Find potential command execution
grep -iE "xp_cmdshell|sp_configure|Ole Automation" ERRORLOG*
```

### SQL Queries - Threat Hunting

```sql
-- Check for xp_cmdshell enabled
EXEC sp_configure 'xp_cmdshell';

-- List all logins and their roles
SELECT name, type_desc, create_date, modify_date FROM sys.server_principals;

-- Check for suspicious databases
SELECT name, create_date, compatibility_level FROM sys.databases
ORDER BY create_date DESC;

-- List SQL Agent jobs
SELECT job_id, name, enabled, date_created, date_modified
FROM msdb.dbo.sysjobs;

-- Check linked servers
SELECT name, data_source, provider FROM sys.servers WHERE is_linked = 1;

-- Review recent backups (unusual locations)
SELECT database_name, backup_start_date, backup_finish_date,
       physical_device_name, user_name
FROM msdb.dbo.backupset
ORDER BY backup_start_date DESC;

-- Find databases with suspicious names
SELECT name FROM sys.databases
WHERE name LIKE '%[;'']%' OR name LIKE '%---%' OR name LIKE '%xp_%';

-- Check for CLR assemblies (code execution)
SELECT name, permission_set_desc, create_date FROM sys.assemblies;
```

---

## Useful Tools

| Tool                             | Use                                      |
| -------------------------------- | ---------------------------------------- |
| **sqlcmd**                       | Command-line query tool                  |
| **PowerUpSQL**                   | PowerShell toolkit for SQL Server attacks|
| **SQL Server Audit Tool**        | Security auditing and compliance         |
| **Process Monitor**              | Monitor SQL Server process activity      |
| **Wireshark**                    | Network traffic analysis                 |

---

## References

- [Microsoft: Write SQL Server Audit events to Security log](https://learn.microsoft.com/en-us/sql/relational-databases/security/auditing/write-sql-server-audit-events-to-the-security-log)
- [Ultimate Windows Security: SQL Server Event IDs](https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/event.aspx?eventid=24298)

---
