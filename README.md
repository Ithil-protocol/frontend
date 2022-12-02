# Frontend

Ithil official frontend

# How to start the project

1. copy `.env.example` to either `.env.development` or `.env.local`
2. populate required variables
3. do `yarn`
4. can now execute any package.json `scripts`

## Endpoints

- [testnet.ithil.fi](https://testnet.ithil.fi)
- [app.ithil.fi](https://app.ithil.fi)
- IPFS coming soon...

## Recommended VSCode extensions

From most important to least important

- [editorconfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [gitlens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

### Suggested configuration for VSCode

Enable document auto-formatting on save

add `"editor.formatOnSave": true` on VSCode -> Open User Settings (JSON)  
Then on `.ts` and `.tsx` files you can do F1 -> Format Document With... -> Configure Default Formatter -> Eslint
