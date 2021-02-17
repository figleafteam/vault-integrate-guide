import React, {useState} from 'react';
import './App.css';
import {VaultElectronWrapper} from '@figleafteam/vault-electron';
import {Figleaf} from '@figleafteam/messenger';

const figleaf = new Figleaf();

function App() {
    const [showVault, setShowVault] = useState(false);
    const login = () => {
        figleaf.login('gera+am1sdlkmalskdm@figleaf.com')

        setTimeout(() => setShowVault(true), 5000)
    }
    const unlock = () => {
        (window as any).figleafBackgroundService.unlock()

        setTimeout(() => setShowVault(true), 5000)

    }
    const getVaultItems = () => {
        (window as any).figleafBackgroundService.getVaultItems('gera+am1sdlkmalskdm@figleaf.com')
    }
    return (
        <div>
            <header>
                <button onClick={login}>Login</button>
                <button onClick={unlock}>Unlock</button>
                <button onClick={getVaultItems}>getVaultItems</button>
                {showVault && <div className="vault">
                    <VaultElectronWrapper
                        baseName="vault"
                        messenger={figleaf.getMessenger()}
                        openUrl={(url: string) => console.log(url)}
                    />
                </div>}
            </header>
        </div>
    );
}

export default App;
