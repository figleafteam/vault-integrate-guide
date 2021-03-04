# Guide how integrate Figleaf Vault to React

> This project includes live example. Follow next steps:
> 1. add to `.npmrc` access token (do not commit token)
> 2. `npm i`
> 3. `npm start`
> 4. Open `localhost:4200`

## Quickstart

>See [App.tsx](./src/App.tsx) for quick start.

## Steps to integrate

1. `npm install --save @figleafteam/vault-electron && npm install --save @figleafteam/web-assembly-connector && npm install --save @figleafteam/figleaf-web-sdk`

2. You have to add `framework` folder from `@figleafteam/web-assembly-connector/dist/assets` to root in your app. \
   We should have access to fetch this folder from http://{YOUR_DOMAIN}/framework/. For example http://localhost:4200/framework/. \
   In this example we added the next code to the plugins section in the webpack:
   `fs.copySync(path.resolve('node_modules/@figleafteam/web-assembly-connector/dist/assets'), paths.appPublic)`
   
3. Create an instance of Figleaf SDK: `const figleafSdk = new FigleafSDK({options});`

4. Start Figleaf SDK: `figleafSdk.start();`

5. Login to figleaf: `figleafSdk.loginWithToken(email, password, token);`

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

## API

### `VaultElectronWrapper(props: InitVaultElectronProps)` takes the following:
- `baseName: string;` - the base URL for our locations. A properly formatted basename should have a leading slash, but no trailing slash. (ex. `/vault`).
- `messenger: Messenger;` - instance for API communication. You can get it from `figleafSdk.getMessenger()`
- `openUrl: OpenUrl;` - custom function for open link
- `(optional) notificationService?: NotificationService;` - toastify with different messages (errors, etc)

### `new FigleafSDK({options})` takes the following:
- `environment?: 'test' | 'test3' | 'stage' | 'production';` - default is `production`
- `productVersion: string;`
- `deviceId: string;`
- `isInternal?: boolean;` - default is `false`
- `distibutionChannel?: string;` - default is `aura`
- `carrierId?: string;`
- `deviceType?: string;`
- `deviceName?: string;`

### figleafSdk has next methods:
- `figleafSdk.start(): void`
- `figleafSdk.loginWithToken(email: string, password: string, token: string): Promise`
- `figleafSdk.logout(): Promise`
- `figleafSdk.onLogout(() => void): void` - listener for token expiration
- `figleafSdk.clearListeners(): void`
- `figleafSdk.getMessenger(): Messenger`

### Test account
For testing you need create user on backend. When user created need call `figleafSdk.loginWithToken`
