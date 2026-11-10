# workaround.ps1 - Perry 0.5.1665 / Windows: perry/ui 启动 AV
# 做法：从 perry_ui_windows.lib 的私有副本里删掉自带的 16 个 perry_runtime CGU，
#       让 exe 里只存在一份 perry_runtime，然后用 perry 正常编译。
param(
    [string]$Project = "D:\Projects\perry-demo",
    [string]$Entry   = "main.ts",
    [string]$Out     = "main_pruned.exe",
    [string]$Stage   = "D:\Projects\perry-demo\perry-ui-pruned-rt"
)
$ErrorActionPreference = "Stop"
$llvm = "D:\Apps\scoop\apps\llvm\current\bin"
$src  = "D:\Apps\scoop\apps\perry\current"

if (Test-Path $Stage) { Remove-Item -Recurse -Force $Stage }
New-Item -ItemType Directory $Stage -Force | Out-Null

# 只读的 lib 用硬链接；UI archive 必须实体复制——llvm-ar 会就地改写，硬链接会毁掉安装目录里的那份
foreach ($f in "perry_runtime.lib", "perry_stdlib.lib") {
    New-Item -ItemType HardLink -Path "$Stage\$f" -Target "$src\$f" | Out-Null
}
Copy-Item "$src\perry_ui_windows.lib" "$Stage\perry_ui_windows.lib"

$drop = & "$llvm\llvm-ar.exe" t "$Stage\perry_ui_windows.lib" | Where-Object { $_ -match '^perry_runtime-' }
foreach ($m in $drop) { & "$llvm\llvm-ar.exe" -d "$Stage\perry_ui_windows.lib" $m 2>$null }
Write-Host "dropped $($drop.Count) bundled-runtime members"

Push-Location $Project
$env:PATH = "$src;$env:PATH"
$env:PERRY_RUNTIME_DIR     = ($Stage -replace '\\', '/')
$env:PERRY_EXTRA_LINK_ARGS = "/FORCE:UNRESOLVED"   # 7 个泛型实例只在被删成员里
try   { perry compile $Entry -o $Out }
finally {
    Remove-Item Env:PERRY_RUNTIME_DIR, Env:PERRY_EXTRA_LINK_ARGS -ErrorAction SilentlyContinue
    Pop-Location
}

Write-Host "installed archive: $((& "$llvm\llvm-ar.exe" t "$src\perry_ui_windows.lib" | Measure-Object).Count) members (应为 11417)"
Write-Host "run: $Project\$Out"
