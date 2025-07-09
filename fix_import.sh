#!/bin/bash

# Find all TypeScript and TSX files in client/src directory and subdirectories
find client/src -name "*.ts" -o -name "*.tsx" | while read filename; do
  # Replace useDemoMode import path
  sed -i "s|from '@/hooks/use-demo-mode'|from '@/contexts/DemoModeContext'|g" "$filename"
  sed -i 's|from "@/hooks/use-demo-mode"|from "@/contexts/DemoModeContext"|g' "$filename"
done

echo "Import fixes applied."