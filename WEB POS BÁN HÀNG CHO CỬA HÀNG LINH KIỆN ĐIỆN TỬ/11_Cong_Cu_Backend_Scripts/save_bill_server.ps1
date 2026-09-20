$port = 9999
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$port/")
try {
    $listener.Start()
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host " TECHNO POWER-SHELL AUTO-SAVE SERVER RUNNING ON PORT $port" -ForegroundColor Green
    Write-Host " Thu muc luu hoa don mac dinh: D:\Lich su giao dich\" -ForegroundColor Green
    Write-Host " Vui long KHONG dong cua so nay khi thuc hien xuat anh" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
} catch {
    Write-Host "Khong the khoi dong server. Vui long kiem tra quyen Admin hoac cong $port da bi chiem: $_" -ForegroundColor Red
    exit
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    # CORS Headers
    $response.Headers.Add("Access-Control-Allow-Origin", "*")
    $response.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS")
    $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

    if ($request.HttpMethod -eq "OPTIONS") {
        $response.StatusCode = 200
        $response.Close()
        continue
    }

    if ($request.HttpMethod -eq "POST" -and $request.RawUrl -eq "/save-bill") {
        try {
            $reader = New-Object System.IO.StreamReader($request.InputStream)
            $body = $reader.ReadToEnd()
            
            # Parse JSON
            $data = $body | ConvertFrom-Json
            $imageBase64 = $data.image
            $filename = $data.filename

            # Sanitize paths
            $filename = $filename -replace '\.\./', '' -replace '\.\.\\', ''

            $targetDir = "D:\Lịch sử giao dịch"
            $fullPath = Join-Path $targetDir $filename
            
            # Tao thu muc neu chua ton tai
            $parentDir = [System.IO.Path]::GetDirectoryName($fullPath)
            if (!(Test-Path $parentDir)) {
                New-Item -ItemType Directory -Force -Path $parentDir | Out-Null
            }

            # Parse base64
            if ($imageBase64 -match ",") {
                $parts = $imageBase64 -split ","
                $imageBase64 = $parts[1]
            }

            $bytes = [System.Convert]::FromBase64String($imageBase64)
            [System.IO.File]::WriteAllBytes($fullPath, $bytes)

            Write-Host "[SUCCESS] Hoa don da duoc tu dong luu tai: $fullPath" -ForegroundColor Green

            # Response Success
            $responseJson = @{ status = "success"; path = $fullPath } | ConvertTo-Json
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($responseJson)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.StatusCode = 200
        } catch {
            Write-Host "[ERROR] Loi xu ly luu file: $_" -ForegroundColor Red
            $errJson = @{ status = "error"; message = $_.Exception.Message } | ConvertTo-Json
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errJson)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.StatusCode = 500
        }
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
