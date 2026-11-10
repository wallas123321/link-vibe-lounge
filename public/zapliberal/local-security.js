// Local screen lock for the PWA. The Android client uses the OS biometric prompt.
const enc=new TextEncoder();
const to64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
const from64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function derive(pin,salt){const key=await crypto.subtle.importKey('raw',enc.encode(pin),'PBKDF2',false,['deriveBits']);return to64(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:210000,hash:'SHA-256'},key,256));}
export async function createPin(pin){if(!/^\d{6,12}$/.test(pin))throw Error('Use um PIN de 6 a 12 números.');const salt=crypto.getRandomValues(new Uint8Array(16));return {salt:to64(salt),hash:await derive(pin,salt),delay:0,attempts:0,retryAt:0};}
export async function verifyPin(pin,lock,now=Date.now()){if((lock.retryAt||0)>now)throw Error('Aguarde 30 segundos antes de tentar novamente.');const value=await derive(String(pin),from64(lock.salt));let diff=value.length^lock.hash.length;for(let i=0;i<value.length;i++)diff|=value.charCodeAt(i)^(lock.hash.charCodeAt(i)||0);if(diff){lock.attempts=(lock.attempts||0)+1;if(lock.attempts>=5){lock.retryAt=now+30000;lock.attempts=0;}return false;}lock.attempts=0;lock.retryAt=0;return true;}
