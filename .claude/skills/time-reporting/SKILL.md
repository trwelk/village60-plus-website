---
name: time-reporting
description: Use Quick Time Reporter Multios CLI to inspect Thor time status, submit project hours, and confirm time. Use when the user asks about Thor time reporting, reported or remaining hours, submitting time, or confirming time.
---

# Time Reporting

Use the Quick Time Reporter CLI as the tool interface to Thor time reporting.

## Command

Resolve the CLI command in this order:

1. If `QTR_CLI` is set, use that exact executable path.
2. If `QuickTimeReporter.Cli` / `QuickTimeReporter.Cli.exe` is available on `PATH`, use it.
3. If the skill includes `scripts/qtr.ps1` (user-installed copy), use that wrapper.
4. If running from the source repository, use `./cli.ps1` on Windows or `./cli.sh` on Linux/macOS.

Published builds are self-contained. Do not require `dotnet` for normal status, submit, confirm, or browser install workflows.

Examples:

Windows with `QTR_CLI`:

```powershell
& $env:QTR_CLI help
```

Windows with CLI on `PATH`:

```powershell
QuickTimeReporter.Cli.exe help
```

Linux/macOS with CLI on `PATH`:

```bash
QuickTimeReporter.Cli help
```

Source repository fallback:

```powershell
./cli.ps1 help
```

Installed user skill fallback:

```powershell
& "$env:USERPROFILE\.cursor\skills\time-reporting\scripts\qtr.ps1" help
```

Before first login on a machine, install the Playwright Chromium browser if the CLI reports it is missing:

```powershell
& $env:QTR_CLI install-browsers
```

## Workflows

### Check Status

Default date is today. Use `--date YYYY-MM-DD` for a specific day. Use `--json` when structured output is easier to parse.

```bash
QuickTimeReporter.Cli status
QuickTimeReporter.Cli status --date 2026-06-29
QuickTimeReporter.Cli status --week --date 2026-06-29 --json
```

Use status before submit or confirm so you can see activity codes, reported hours, and remaining hours.

### Submit Time

Interactive submit prompts for each activity code:

```bash
QuickTimeReporter.Cli submit --date 2026-06-29
```

Non-interactive submit is available for agent workflows. Match by time reporting code or keyref:

```bash
QuickTimeReporter.Cli submit --date 2026-06-29 --hours "Manager Work=8"
```

Do not invent hours or activity choices. Ask the user which hours to enter if the request is ambiguous.

### Confirm Time

Confirm selected day by default. Use `--week` to confirm Monday-Friday for the selected work week.

```bash
QuickTimeReporter.Cli confirm --date 2026-06-29
QuickTimeReporter.Cli confirm --week --date 2026-06-29
```

Only confirm when the user explicitly asks to confirm time.

## Authentication

If Thor has no valid session, the CLI opens Playwright-managed Chromium for interactive Thor login. Complete SSO/MFA in the browser. If login fails, times out, or is cancelled, report the CLI error to the user and stop.

After a successful login, the CLI reuses a persisted session for later commands in the same workflow. Do not assume each command needs a fresh login. Only one browser login should be required until Thor rejects the saved session or the user runs `logout`.

Session credentials use envelope encryption: an AES key in the OS secret store (Windows Credential Manager, macOS Keychain, or Linux libsecret) protects an encrypted session file in the shared Quick Time Reporter data directory. The desktop app and CLI share this session when they use the same data directory (`QTR_DATA` overrides the default path).

## Output

Summarize the important lines back to the user:

- Date or week range
- Reported hours and expected total
- Remaining job hours
- Submit success or failure
- Confirm success or failure
