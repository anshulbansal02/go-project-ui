svgsPath=src/assets/icons/svg
iconsOutPath=src/assets/icons/tsx

echo "Transforming SVGs to TSX Components"
npx @svgr/cli --out-dir "$iconsOutPath" --config-file ./scripts/svgr.config.js  -- "$svgsPath"
mv "$iconsOutPath/index.ts" "$iconsOutPath/../index.ts" 