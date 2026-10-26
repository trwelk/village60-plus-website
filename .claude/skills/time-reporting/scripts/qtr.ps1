param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]] $CliArgs
)

$ErrorActionPreference = "Stop"
$cli = $env:QTR_CLI
if ([string]::IsNullOrWhiteSpace($cli)) {
    $cli = 'C:\Users\trwelk\Downloads\QuickTimeReporter-cli-win-x64\win-x64\Cli\QuickTimeReporter.Cli.exe'
}

& $cli @CliArgs
exit $LASTEXITCODE
