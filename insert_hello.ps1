$ErrorActionPreference = "Continue"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Add()
    $word.Selection.TypeText("Hello,trae solo!")
    
    $fullPath = Join-Path $env:USERPROFILE "Desktop\test_hello.docx"
    $doc.SaveAs([ref]$fullPath, [ref]16)
    
    Write-Host "SUCCESS: File saved to $fullPath"
} catch {
    Write-Host "ERROR: $_"
} finally {
    if ($doc) { $doc.Close(0) }
    if ($word) { $word.Quit() }
}
