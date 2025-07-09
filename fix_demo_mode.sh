#!/bin/bash

# Find all TypeScript and TSX files in client/src directory and subdirectories
find client/src -name "*.ts" -o -name "*.tsx" | while read filename; do
  # Replace isDemoMode with demoMode, preserving whitespace
  sed -i 's/isDemoMode/demoMode/g' "$filename"
  
  # Replace useDemoMode import from DemoModeToggle with the import from hooks
  sed -i 's/import { useDemoMode } from "@\/components\/DemoModeToggle"/import { useDemoMode } from "@\/hooks\/use-demo-mode"/g' "$filename"
  sed -i "s/import { useDemoMode } from '@\/components\/DemoModeToggle'/import { useDemoMode } from '@\/hooks\/use-demo-mode'/g" "$filename"
done

echo "Demo mode fixes applied."
