function replaceAccents(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function genAlphabet() {
    let alphabet = []
    for (let i = 97; i < 123; i++)
        alphabet.push(String.fromCharCode(i))

    return alphabet
}

function genVigenereTable() {
    let tb = []
    let alphabet = genAlphabet()

    for (let i = 0; i < 26; i++) {
        let row = []
        for (let j = 0; j < 26; j++) {
            row.push(alphabet[(i + j) % 26])
        }
        tb.push(row)
    }

    return tb
}

let vig = genVigenereTable();


function cleanText(text) {
    text = text.replace(/\s/g, '').toLowerCase()
    return text.replace(/[^a-zA-Z]/g, "").toLowerCase()
}

function encryptVigenere(plainText, key) {
    let cipherText = ''
    let alphabet = genAlphabet()

    plainText = replaceAccents(plainText)
    plainText = cleanText(plainText)

    for (let i = 0; i < plainText.length; i++) {
        let row = alphabet.indexOf(key[i % key.length])
        let col = alphabet.indexOf(plainText[i])
        cipherText += vig[row][col]
    }

    return cipherText
}

function decryptVigenere(cipherText, key) {
    let plainText = ''
    let alphabet = genAlphabet()

    cipherText = cleanText(cipherText)  

    for (let i = 0; i < cipherText.length; i++) {
        let row = alphabet.indexOf(key[i % key.length])
        let col = vig[row].indexOf(cipherText[i])
        plainText += alphabet[col]
    }

    return plainText
}

document.getElementById('vigenere-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const text = document.getElementById('text').value;
    const key = document.getElementById('key').value;
    const mode = document.getElementById('mode').value;

    if (!text || !key) {
      alert('Proszę wypełnić wszystkie pola!');
      return;
    }

    let result;
    if (mode === 'encrypt') {
      result = encryptVigenere(text, key);
    } else {
      result = decryptVigenere(text, key);
    }

    document.getElementById('result').textContent = result;
  });

