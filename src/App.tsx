import React, {useEffect, useState} from 'react';
import {VaultElectronWrapper} from '@figleafteam/vault-electron';
import './App.css';
import {FigleafSDK} from '@figleafteam/figleaf-web-sdk';
import {ButtonComponent} from '@figleafteam/components';

const figleafSdk = new FigleafSDK({
    environment: 'test3',
    deviceId: 'F81F6C61-0DE6-40B7-8AAB-56B11BD57D47',
    distibutionChannel: 'aura',
    isInternal: true,
    productVersion: '1.0',
});

function App() {
    const [showVault, setShowVault] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        figleafSdk.start();
        figleafSdk.onLogout(() => console.log('We have to refresh token'));

        return () => figleafSdk.clearListeners()
    }, [])

    const login = () => {
        figleafSdk.loginWithToken(email, password, token)
            .then(() => setShowVault(true))
            .catch((e) => {
                // handle error
            });
    }

    const logout = () => {
        figleafSdk.logout()
            .then(() => setShowVault(false))
            .catch((e) => {
                // handle error
            });
    }

    return (
        <div className="vault">
            <h3 className="vault__title">Vault integration example</h3>
            {!showVault &&
            <div className="vault__button">
                <input
                    name='email'
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="Email"
                    type="text"
                    value={email}/>
                <input
                    name='password'
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Password"
                    type="password"
                    value={password}/>
                <input
                  name='token'
                  onChange={(ev) => setToken(ev.target.value)}
                  placeholder="Token"
                  type="text"
                  value={token}/>
                <ButtonComponent onClick={login} text='Login' type='primary'/></div>}
            {showVault && <div className="vault__button">
                <ButtonComponent onClick={logout} text='Logout' type='primary'/>
            </div>}
            {showVault && <div className="vault__wrapper">
                <VaultElectronWrapper
                    baseName="vault"
                    messenger={figleafSdk.getMessenger()}
                    openUrl={(url: string) => console.log(url)}
                />
            </div>}
        </div>
    );
}

export default App;
