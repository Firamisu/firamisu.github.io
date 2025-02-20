function replaceAccents(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function cleanText(text) {
    text = text.replace(/\s/g, '').toLowerCase()
    return text.replace(/[^a-zA-Z]/g, "").toLowerCase()
}

function genAlphabet() {
    let alphabet = []
    for (let i = 97; i < 123; i++)
        alphabet.push(String.fromCharCode(i))

    return alphabet
}

function encryptCeasar (text, key) {
    let alphabet = genAlphabet()
    let encrypted = ""
    text = replaceAccents(text)
    text = cleanText(text)

    for (let i = 0; i < text.length; i++) {
        let index = alphabet.indexOf(text[i])
        let newIndex = (index + key) % 26
        encrypted += alphabet[newIndex]
    }

    return encrypted
}

function decryptCeasar (text, key) {
    let alphabet = genAlphabet()
    let decrypted = ""
    text = cleanText(text)

    for (let i = 0; i < text.length; i++) {
        let index = alphabet.indexOf(text[i])
        let newIndex = (index - key) % 26
        if (newIndex < 0) newIndex += 26
        decrypted += alphabet[newIndex]
    }

    return decrypted
}

document.getElementById('ceasar-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const text = document.getElementById('text').value;
  const key = parseInt(document.getElementById('key').value, 10);
  const mode = document.getElementById('mode').value;

  if (!text || isNaN(key)) {
    alert('Proszę wypełnić wszystkie pola!');
    return;
  }

  let result;
  if (mode === 'encrypt') {
    result = encryptCeasar(text, key);
  } else {
    result = decryptCeasar(text, key);
  }

  document.getElementById('result').textContent = result;
});