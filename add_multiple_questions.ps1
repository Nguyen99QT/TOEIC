# PowerShell script to apply multiple questions SQL

# Clear screen
Clear-Host

Write-Host "======================================================================"
Write-Host "              Multiple Questions Per Exercise Solution"
Write-Host "======================================================================"
Write-Host ""
Write-Host "This solution fixes the issue where some exercises have only one question,"
Write-Host "which causes problems with progress/point calculation."
Write-Host ""

$sqlFile = Join-Path $PSScriptRoot "backend\database\migrations\add_multiple_questions_to_exercises.sql"
Write-Host "The SQL file has been generated at:"
Write-Host "  $sqlFile"
Write-Host ""

# Check if MySQL is installed
$mysqlPath = Get-Command mysql -ErrorAction SilentlyContinue
if ($mysqlPath) {
    Write-Host "MySQL detected. You can run the SQL automatically."
    $runAutomatically = Read-Host "Would you like to run the SQL now? (y/n)"
    
    if ($runAutomatically.ToLower() -eq "y") {
        $username = Read-Host "Enter your MySQL username"
        $password = Read-Host "Enter your MySQL password" -AsSecureString
        $database = Read-Host "Enter your database name"
        
        # Convert secure string to plain text
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
        $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        
        # Run MySQL command
        Write-Host "Running SQL script..."
        mysql -u $username -p"$plainPassword" $database < $sqlFile
        
        Write-Host "SQL script execution complete!"
    }
    else {
        Write-Host "You chose not to run the SQL automatically."
    }
}
else {
    Write-Host "MySQL command line not detected in PATH."
}

Write-Host ""
Write-Host "To apply these changes to your database manually:"
Write-Host ""
Write-Host "Option 1: Using MySQL Command Line"
Write-Host "  1. Ensure MySQL is in your PATH"
Write-Host "  2. Run the following command (replace with your credentials):"
Write-Host "     mysql -u YOUR_USERNAME -p YOUR_PASSWORD YOUR_DATABASE < $sqlFile"
Write-Host ""
Write-Host "Option 2: Using MySQL Workbench or phpMyAdmin"
Write-Host "  1. Open MySQL Workbench or phpMyAdmin"
Write-Host "  2. Connect to your database"
Write-Host "  3. Open the SQL file: $sqlFile"
Write-Host "  4. Execute the SQL script"
Write-Host ""
Write-Host "After applying the changes, all exercises will have at least 6 questions each."
Write-Host "This ensures consistent progress calculation and improves user experience."
Write-Host ""
Write-Host "For more information, see MULTIPLE_QUESTIONS_README.md"
Write-Host "======================================================================"
Write-Host ""

# Wait for user to press any key
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
