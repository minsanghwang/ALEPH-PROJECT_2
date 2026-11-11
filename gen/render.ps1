param([string]$Dir, [string[]]$Names)
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
foreach ($n in $Names) {
  $svg = Join-Path $Dir "$n.svg"; $png = Join-Path $Dir "$n.png"
  $m = [regex]::Match((Get-Content -Raw $svg), 'viewBox="0 0 (\d+) (\d+)"')
  $w = $m.Groups[1].Value; $h = $m.Groups[2].Value
  if (Test-Path $png) { Remove-Item $png }
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 "--window-size=$w,$h" "--screenshot=$png" ("file:///" + ($svg -replace '\\','/')) 2>&1 | Out-Null
  "{0}: {1}" -f $n, (Test-Path $png)
}
