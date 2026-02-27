#!/usr/bin/env bash

mkdir -p ./ui/.vscode
cp ~/Development/avakarev/go-vue-coreui-starter/ui/.vscode/settings.json ./ui/.vscode
cp ~/Development/avakarev/go-vue-coreui-starter/ui/.vscode/extensions.json ./ui/.vscode
cp ~/Development/avakarev/go-vue-coreui-starter/ui/.gitignore ./ui
cp ~/Development/avakarev/go-vue-coreui-starter/ui/.oxfmtrc.json ./ui
cp ~/Development/avakarev/go-vue-coreui-starter/ui/.oxlintrc.json ./ui
rm -f ./ui/.prettierrc.json

cp ~/Development/avakarev/go-vue-coreui-starter/Procfile .
echo "@TODO: modify Makefile with:"
echo "  vimdiff Makefile ~/Development/avakarev/go-vue-coreui-starter/Makefile"
echo "@TODO: modify ui/package.json with:"
echo "  vimdiff ui/package.json ~/Development/avakarev/go-vue-coreui-starter/ui/package.json"
echo "@TODO: modify ui/eslint.config.ts with:"
echo "  vimdiff ui/eslint.config.ts ~/Development/avakarev/go-vue-coreui-starter/ui/eslint.config.ts"
echo "@TODO: modify ui/src/router/index.ts with:"
echo "  vimdiff ui/src/router/index.ts ~/Development/avakarev/go-vue-coreui-starter/ui/src/router/index.ts"
