# install
```
npm i --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin
```

# run
```
## for development
npm run dev

## for production
npm run build
```

# helpers
```
## make a quick zip backup (excluding node_modules folder)
zip -r $(date +%Y-%m-%d--%H-%M-%S).iso.zip iso -x "*node_modules*" -x "*.git*"

## add identity to ssh agent
ssh-add ~/.ssh/id_EXAMPLE
```
