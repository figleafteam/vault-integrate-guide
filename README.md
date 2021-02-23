# Hello friend! It's an instruction how integrate Figleaf Vault to React

> This project includes live example. Follow next steps:
> 1. `npm i`
> 2. `npm start`
> 3. Open `localhost:4200`

## Steps to integrate

1. `npm install --save @figleafteam/vault-electron && npm install --save @figleafteam/api-communication && npm install --save @figleafteam/web-assembly-connector`

2. You have to add _framework folder from @figleafteam/web-assembly-connector/dist/assets to root in your app. \
   We should have access to fetch this folder from http://{YOUR_DOMAIN}/_framework/. For example http://localhost:4200/_framework/. \
   In this example we added the next code to the plugins section in the webpack:
   `fs.copySync(path.resolve('node_modules/@figleafteam/web-assembly-connector/dist/assets'), paths.appPublic)`
   
3. Create an instance of Figleaf SDK: `const figleafSdk = new FigleafSDK();`

4. Start Figleaf SDK: `figleafSdk.start({ partner: 'figleaf' });`

5. Login to figleaf: `figleafSdk.login(email, password);`

6. Added VaultElectronWrapper components to your app:
```js
<App>
    // ...code
    <VaultElectronWrapper
        baseName="vault"
        messenger={figleafSdk.getMessenger()}
        openUrl={(url: string) => openUrl(url)}
    />
    // ...code
</App>
```

## Api

### `VaultElectronWrapper(props: InitVaultElectronProps)` takes the following:
- `baseName: string;` - the base URL for our locations. A properly formatted basename should have a leading slash, but no trailing slash. (ex. `/vault`).
- `messenger: Messenger;` - instance for API communication. You can get it from `figleafSdk.getMessenger()`
- `(optional) notificationService?: NotificationService;` - toastify with different messages (errors, etc)
- `openUrl?: OpenUrl;` - custom function for open link

### `figleafSdk.start({ partner: 'figleaf' })` takes the following:
- `partner` - partner name
