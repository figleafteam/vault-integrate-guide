import React, {useEffect, useState} from 'react';
import {VaultElectronWrapper} from '@figleafteam/vault-electron';
import './App.css';
import {FigleafSDK} from '@figleafteam/figleaf-web-sdk';
import {ButtonComponent} from '@figleafteam/components';

const figleafSdk = new FigleafSDK();
const email = 'gera+am1sdlkmalskdm@figleaf.com';
const password = 'Qwerty12345';

function App() {
    const [showVault, setShowVault] = useState(false);

    useEffect(() => {
        figleafSdk.start({
            partner: 'figleaf',
        });
    }, [])

    const login = () => {
        figleafSdk.login(email, password);
        setShowVault(true)
    }

    return (
        <div className="vault">
            <h3 className="vault__title">Vault integration example</h3>
            {!showVault &&
            <div className="vault__button"><ButtonComponent onClick={login} text='Login' type='primary'/></div>}
            {showVault && <div className="vault__wrapper"><VaultElectronWrapper
                baseName="vault"
                messenger={figleafSdk.getMessenger()}
                openUrl={(url: string) => console.log(url)}
            /></div>}
        </div>
    );
}

export default App;
