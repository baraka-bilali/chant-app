# Generates the French voice-over clips (public/voice/*.wav) with a Windows text-to-speech voice.
# Usage (PowerShell):  powershell -ExecutionPolicy Bypass -File voice/make-voice.ps1 [-Voice "Microsoft Julie"] [-Rate 1.0]
param(
  [string]$Voice = 'Microsoft Julie',
  [double]$Rate = 1.0
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public\voice'
New-Item -ItemType Directory -Force $outDir | Out-Null

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
  $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
})[0]
function Await-WinRt($operation, [Type]$resultType) {
  $task = $asTaskGeneric.MakeGenericMethod($resultType).Invoke($null, @($operation))
  $task.Wait(-1) | Out-Null
  return $task.Result
}

[Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime] | Out-Null

$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$selected = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -eq $Voice }
if (-not $selected) { throw "Voice not found: $Voice" }
$synth.Voice = $selected
$synth.Options.SpeakingRate = $Rate

$lines = Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'lines.json') | ConvertFrom-Json
foreach ($line in $lines) {
  $ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='fr-FR'>" + $line.text + "</speak>"
  $stream = Await-WinRt ($synth.SynthesizeSsmlToStreamAsync($ssml)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $size = [uint32]$stream.Size
  $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
  Await-WinRt ($reader.LoadAsync($size)) ([uint32]) | Out-Null
  $bytes = New-Object byte[] $size
  $reader.ReadBytes($bytes)
  $file = Join-Path $outDir ($line.id + '.wav')
  [System.IO.File]::WriteAllBytes($file, $bytes)
  Write-Output ("{0}  {1} bytes" -f $line.id, $size)
}
