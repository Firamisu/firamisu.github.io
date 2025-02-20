function genAlphabetWithoutJ() {
    let alphabet = []
    for (let i = 97; i < 123; i++)
        String.fromCharCode(i) != 'j' &&
            alphabet.push(String.fromCharCode(i))

    return alphabet
}

function replaceAccents(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function cleanText(text) {
    text = text.replace(/\s/g, '').toLowerCase()
    text = text.replace(/j/g, "i")
    return text.replace(/[^a-zA-Z]/g, "").toLowerCase()
}

function generateTb() {
    let alphabet = genAlphabetWithoutJ()
    let c = 0
    let tbl = []

    for (let i = 0; i < 5; i++) {
        tbl[i] = []
        for (let j = 0; j < 5; j++) {
            tbl[i][j] = alphabet[c]
            c++;
        }
    }

    return tbl
}


const polibiuszTb = generateTb()

function encryptPolibiusz(text) {
    text = replaceAccents(text)
    text = cleanText(text)
    
    encrypted = "";

    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < 5; j++) {
            for (let k = 0; k < 5; k++) {
                if (text[i] == polibiuszTb[j][k]) {
                    encrypted += (j + 1).toString() + (k + 1).toString()
                }
            }
        }
    }

    return encrypted
}



function decryptPolibiusz(text) {
    decrypted = ""
 
    let numbers = text.replace(/^\D+/g, '')

    for (let i = 0; i < numbers.length; i += 2) {
        let j = parseInt(numbers[i]) - 1
        let k = parseInt(numbers[i + 1]) - 1
        decrypted += polibiuszTb[j][k]
    }

    return decrypted
    
}
 

document.getElementById('polibiusz-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const text = document.getElementById('text').value;
  const mode = document.getElementById('mode').value;

  if (!text) {
    alert('Proszę wypełnić wszystkie pola!');
    return;
  }

  let result;
  if (mode === 'encrypt') {
    result = encryptPolibiusz(text);
  } else {
    result = decryptPolibiusz(text);
  }

  document.getElementById('result').textContent = result;
});


