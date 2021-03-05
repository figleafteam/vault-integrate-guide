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
const email = 'gera+am1sdlkmalskdm@figleaf.com';
const password = 'Qwerty12345';
const defaultToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRlZmF1bHQifQ.eyJpYXQiOjE2MTQ2MDMzNzMsIm5iZiI6MTYxNDYwMzM3MywiZXhwIjoxNjE0Njg5NzczLCJzdWIiOiIzMWI1ZDZmMC0wZTYyLTRjMGQtYjFlZC00Y2Q2NGU4YTgxMmMiLCJqdGkiOiIxNjgzODIxOS05ZjJiLTQ4NmUtYTc1NS1kZWJjNzJjZWJmMjIiLCJhbGlhcyI6ImdlcmErYW0xc2Rsa21hbHNrZG1AZmlnbGVhZi5jb20iLCJhdWQiOlsiZmlnbGVhZjpiYWNrZW5kIl0sImF1cmFzdmM6c2Vzc2lvbl9pZCI6IjIxMDI0ZDRlLWFiMzItNDE3NC1hNjg4LTVhMjc4YTA1NGQ1MyIsImF1cmFzdmM6ZGlyZWN0b3J5X2tleSI6ImZpZ2xlYWYiLCJhdXJhc3ZjOmVudGl0bGVtZW50cyI6e30sImF1cmFzdmM6cm9sZSI6ImZpZ2xlYWY6c2Vzc2lvbiJ9.N8dWkRprXmMQ1xue5ODLLEVmtrQXif5O5cJoZSSeeSsqv6QV0k8Vnvi1UKQ0gmpPW4ed6MbtZQME-FAwe_X0hhdcEuqO73NiRFJAq_P1sbqS-ZfWtLKyY5S_cFNwO3YCfvzSl0uuaUhfgihv2rhy_rlNBQw6fwWMLSY97Iusl2m-CL2eqrNIj6swASaHhPyG7RYzJHrdgTHz9p1OOs3rbRfuiH8rxuRHcTn5C6qlOw_TNm4-LBQo72MyoKOV0daNBQ8hWVc9kHEz7_1nWIUmRObi6XmjUmU9p1FzZ6LNgPZ7vrCCRdbQHi6NpDbS1ERN7SjMQAPWTwStM4XdNXa-nA';

function App() {
    const [showVault, setShowVault] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        figleafSdk.start();
        figleafSdk.onLogout(() => console.log('We have to refresh token'));

        return () => figleafSdk.clearListeners()
    }, [])

    const login = () => {
        figleafSdk.login(email, password)
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
