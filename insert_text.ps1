$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$word.Selection.TypeText("Hello,trae solo!")
$doc.SaveAs("D:\Trae\father\test.docx", 16)
$doc.Close()
$word.Quit()
