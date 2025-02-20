document.getElementById("generate-keys").addEventListener("click", async () => {
    const { privateKey, publicKey } = await generateRSAKeys();
    
    document.getElementById("generated-keys").textContent =
        `Klucz publiczny:\n${publicKey}\n\nKlucz prywatny:\n${privateKey}`;
});

document.getElementById("rsa-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const text = document.getElementById("text").value;
    const publicKey = document.getElementById("publicKey").value;
    const privateKey = document.getElementById("privateKey").value;
    const mode = document.getElementById("mode").value;
    
    let result = "";
    if (mode === "encrypt") {
        result = await encryptRSA(text, publicKey);
    } else {
        result = await decryptRSA(text, privateKey);
    }
    
    document.getElementById("result").textContent = result;
});

async function generateRSAKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );
    
    const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    
    return {
        publicKey: arrayBufferToPem(publicKey, "PUBLIC KEY"),
        privateKey: arrayBufferToPem(privateKey, "PRIVATE KEY")
    };
}

async function encryptRSA(plaintext, publicKeyPem) {
    const publicKey = await importKey(publicKeyPem, "public");
    const encoded = new TextEncoder().encode(plaintext);
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encoded
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

async function decryptRSA(ciphertext, privateKeyPem) {
    const privateKey = await importKey(privateKeyPem, "private");
    const decoded = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        decoded
    );
    return new TextDecoder().decode(decrypted);
}

async function importKey(pem, type) {
    const binaryDer = pemToArrayBuffer(pem);
    return window.crypto.subtle.importKey(
        type === "public" ? "spki" : "pkcs8",
        binaryDer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        type === "public" ? ["encrypt"] : ["decrypt"]
    );
}

function arrayBufferToPem(buffer, type) {
    const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    return `-----BEGIN ${type}-----\n${base64String.match(/.{1,64}/g).join("\n")}\n-----END ${type}-----`;
}

function pemToArrayBuffer(pem) {
    const base64String = pem.replace(/-----[^-]+-----/g, "").replace(/\n/g, "");
    const binaryString = atob(base64String);
    return new Uint8Array([...binaryString].map(c => c.charCodeAt(0))).buffer;
}
