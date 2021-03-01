var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
var ENVIRONMENT_IS_WINDOWS_SHELL = typeof Windows === 'object' && typeof Windows.UI === 'object';

if (ENVIRONMENT_IS_WORKER) {
  window = self;

  document = {
    addEventListener: () => { },

    body: {
      appendChild: (child) => {
        if (child.text) {
          eval(child.text);
        }
        else {
          importScripts(child.src);
        }
      },
    },
    //currentScript: { getAttribute: () => { return false; } },
    querySelector: () => [],
    getElementsByTagName: () => [],
    createElement: () => { return {}; },
    createElementNS: () => { return {}; },
    hasChildNodes: () => false,
  };

    startApp = async function () {
    const skipCache = !/^https?:$/i.test(new URL(document.baseURI).protocol);
    var figleafCache = await caches.open('figleaf-resources');

    Blazor.start({
      loadBootResource: function (type, name, defaultUri, integrity) {
        if (type !== 'dotnetjs') {
          return (async function () {
            var key = `${defaultUri}.${integrity}`;
            var item = await figleafCache.match(key);

            if (item) {
              return item;
            }

            const response = await fetch(defaultUri);
            if (!response.ok) {
              throw new Error(response.statusText);
            }

            if (!skipCache) {
                  await figleafCache.put(key, response.clone());
            }

            return response;
          })();
        }
      }
    });
  }

  onmessage = function (e) {
    if (typeof e.data === 'string') {
      figleafBackgroundService.send(e.data);
    } else {
      document.baseURI = e.data.baseURI;
      document.location = { origin: e.data.location };

      figleafBackgroundService.config = e.data.config;
      figleafBackgroundService.setOutRequestHandler( req => postMessage(req));

      startApp();
    }
  }

  importScripts('blazor.webassembly.js', 'pubnub.js', 'sodium.js');
} else {    
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "/framework/pubnub.js";
    script.async = true;
    document.body.appendChild(script);    

    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "/framework/sodium.js";
    script.async = true;
    document.body.appendChild(script); 
    
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "/framework/blazor.webassembly.js";
    script.async = true;
    document.body.appendChild(script);
}

window.figleafBackgroundService = {
  config: null,

  configuration: function () {
    return this.config;
  },

  crypto_secretbox_KEYBYTES: () => {
    return sodium.crypto_secretbox_KEYBYTES;
  },

  crypto_secretbox_NONCEBYTES: () => {
    return sodium.crypto_secretbox_NONCEBYTES;
  },

  crypto_auth_KEYBYTES: () => {
    return sodium.crypto_auth_KEYBYTES;
  },

  randombytes_buf: (count) => {
    return sodium.randombytes_buf(count);
  },

  crypto_box_keypair: () => {
    return sodium.crypto_box_keypair();
  },

  crypto_box_seal: (message, publickey) => {
    return sodium.crypto_box_seal(from_base64(message), from_base64(publickey));
  },

  crypto_auth: (message, key) => {
    return sodium.crypto_auth(from_base64(message), from_base64(key));
  },

  crypto_secretbox_easy: (message, nonce, key) => {
    return sodium.crypto_secretbox_easy(from_base64(message), from_base64(nonce), from_base64(key));
  },

  crypto_secretbox_open_easy: (chiper, nonce, key) => {
    return sodium.crypto_secretbox_open_easy(from_base64(chiper), from_base64(nonce), from_base64(key));
  },

  crypto_box_seal_open: (chiper, private_key, public_key) => {
    return sodium.crypto_box_seal_open(
      from_base64(chiper),
      from_base64(public_key),
      from_base64(private_key),
    );
  },

  crypto_pwhash_SALTBYTES: () => {
    return sodium.crypto_pwhash_SALTBYTES;
  },

  crypto_generichash: (len, message) => {
    return sodium.crypto_generichash(len, sodium.from_string(message));
  },

  crypto_pwhash: (outLen, password, salt, opsLimit, memLimit) => {
    return sodium.crypto_pwhash(outLen, from_base64(password), from_base64(salt), opsLimit, memLimit, 1);
  },

  crypto_kdf_KEYBYTES: () => {
    return sodium.crypto_kdf_KEYBYTES;
  },

  crypto_kdf_derive_from_key: (subkeyLen, subkeyId, context, key) => {
    return sodium.crypto_kdf_derive_from_key(subkeyLen, subkeyId, context, from_base64(key));
  },

  crypto_auth_verify: (tag, message, key) => {
    return sodium.crypto_auth_verify(from_base64(tag), from_base64(message), from_base64(key));
  },

  crypto_scalarmult_base: (privateKey) => {
    return sodium.crypto_scalarmult_base(from_base64(privateKey));
  },

  setOutRequestHandler: (handler) => {
    this.handler = handler;
  },

  handleOutRequest: req => {
    this.handler(req);
  },

  send: (req) => {
    DotNet.invokeMethodAsync('Figleaf.WebAssembly', 'HandleRequest', req);
  },

  initPubnub: (subscribeKey, deviceId) => {
    this.pubnub = new PubNub({
      subscribeKey: subscribeKey,
      uuid: deviceId,
    });

    this.pubnub.addListener({
      message: function (msg) {
        DotNet.invokeMethodAsync('Figleaf.WebAssembly', 'OnPushNotification', msg.channel, JSON.stringify(msg.message));
      },
    });
  },

  subscribeToPubnubChannel: (channel) => {
    console.log('sub to channel ' + channel);
    this.pubnub.subscribe({
      channels: [channel],
    });
  },

  unsubscribeFromPubnubChannel: (channel) => {
    console.log('unsub from channel ' + channel);
    this.pubnub.unsubscribe({
      channels: [channel],
    });
  },

  credentialManager: {
    isSupported: () => { return ENVIRONMENT_IS_WINDOWS_SHELL; },

    retrieve: function (userName) {
      const vault = new Windows.Security.Credentials.PasswordVault();

      try {
        var cred = vault.retrieve("Figleaf App", userName);
        cred.retrievePassword();
        return cred.password;
      } catch (Error) {
        return null;
      }
    },

    save: function (username, password) {
      const vault = new Windows.Security.Credentials.PasswordVault();

      try {
        var cred = new Windows.Security.Credentials.PasswordCredential("Figleaf App", username, password);
        vault.add(cred);
      } catch (Error) {
        return null;
      }
    },

    remove: function (userName) {
      try {
        var cred = vault.retrieve("Figleaf App", userName);        
        vault.remove(cred);
      } catch (Error) {        
        return null;
      }
    }
  },

  vpnProvider: {
    isSupported: () => { return true; }
  },

  isExtension: function() {
    return chrome || Fr || Edge;
  }
}

from_base64 = (base64) => {
  return sodium.from_base64(base64, sodium.base64_variants.ORIGINAL);
}

