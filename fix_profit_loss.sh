#!/bin/bash
# Make a backup
cp client/src/pages/ProfitLoss.tsx client/src/pages/ProfitLoss.backup.tsx

# Extract line 588
sed -n '588p' client/src/pages/ProfitLoss.tsx > line588.txt

# Replace line 588 with clean version
sed -i '588s/.*/<              <div className="overflow-x-auto">/' client/src/pages/ProfitLoss.tsx

# Check if replacement worked
grep -A1 'CardContent className="px-1 sm:px-3"' client/src/pages/ProfitLoss.tsx
