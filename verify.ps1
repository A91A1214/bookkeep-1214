$baseUrl = "http://localhost:3000"

function Invoke-Api {
    param($Method, $Path, $Body = @{})
    $uri = "$baseUrl$Path"
    try {
        if ($Method -eq "GET") {
            return Invoke-RestMethod -Uri $uri -Method $Method
        }
        else {
            $json = $Body | ConvertTo-Json
            return Invoke-RestMethod -Uri $uri -Method $Method -Body $json -ContentType "application/json"
        }
    }
    catch {
        Write-Host "Error calling $Path : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "1. Initializing Accounts..." -ForegroundColor Cyan
$acc1 = Invoke-Api -Method "POST" -Path "/accounts" -Body @{user_id = "alice"; type = "checking"; currency = "USD" }
$id1 = $acc1.id
Write-Host "Alice's Account: $id1"

$acc2 = Invoke-Api -Method "POST" -Path "/accounts" -Body @{user_id = "bob"; type = "savings"; currency = "USD" }
$id2 = $acc2.id
Write-Host "Bob's Account: $id2"

Write-Host "`n2. Depositing 1000 into Alice's account..." -ForegroundColor Cyan
Invoke-Api -Method "POST" -Path "/deposits" -Body @{accountId = $id1; amount = "1000"; description = "Bonus" }

Write-Host "`n3. Checking Alice's Balance (Expected: 1000)..." -ForegroundColor Cyan
$alice = Invoke-Api -Method "GET" -Path "/accounts/$id1"
Write-Host "Balance: $($alice.balance)"

Write-Host "`n4. Transferring 400 from Alice to Bob..." -ForegroundColor Cyan
Invoke-Api -Method "POST" -Path "/transfers" -Body @{sourceId = $id1; destId = $id2; amount = "400"; description = "Payment" }

Write-Host "`n5. Checking Balances (Alice: 600, Bob: 400)..." -ForegroundColor Cyan
$a_bal = (Invoke-Api -Method "GET" -Path "/accounts/$id1").balance
$b_bal = (Invoke-Api -Method "GET" -Path "/accounts/$id2").balance
Write-Host "Alice: $a_bal, Bob: $b_bal"

Write-Host "`n6. Attempting Overdraft (Alice tries to send 1000 to Bob)..." -ForegroundColor Cyan
$overdraft = Invoke-Api -Method "POST" -Path "/transfers" -Body @{sourceId = $id1; destId = $id2; amount = "1000"; description = "Steal" }
if ($null -eq $overdraft) {
    Write-Host "Rejected as expected (Insufficient Funds)." -ForegroundColor Green
}
else {
    Write-Host "ERROR: Overdraft succeeded!" -ForegroundColor Red
}

Write-Host "`n7. Checking Ledger for Bob..." -ForegroundColor Cyan
$ledger = Invoke-Api -Method "GET" -Path "/accounts/$id2/ledger"
$ledger | Format-Table -Property amount, direction, created_at
