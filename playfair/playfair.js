function replaceAccents(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function removeDuplicates(str) {
    let result = Array.from(str).reduce((output, letter) => {
        let re = new RegExp(letter, "i");
        return re.test(output)
            ? output
            : output + letter
    }, "");

    return result;
}

function genAlphabetWithoutJ() {
    let alphabet = []
    for (let i = 97; i < 123; i++)
        String.fromCharCode(i) != 'j' &&
            alphabet.push(String.fromCharCode(i))

    return alphabet
}

function generateTb(pwd) {
    pwd = removeDuplicates(pwd)
    pwd = pwd.replace(/[^a-zA-Z]/g, "")
    pwd = pwd.replace(/j/g, "i")

    let c = 0
    let alphabet = genAlphabetWithoutJ()
    alphabet = alphabet.filter(function (el) {
        return !pwd.includes(el);
    });

    let tbl = []

    for (let i = 0; i < 5; i++) {
        tbl[i] = []
        for (let j = 0; j < 5; j++) {
            if (c < pwd.length) {
                tbl[i][j] = pwd[c]
            } else {
                tbl[i][j] = alphabet.shift()
            }
            c++;
        }
    }

    return tbl

}


function getPairs(str) {
    let pairs = []
    let c = 0
    for (let i = 0; i < str.length; i += 2) {
        pairs[c] = str[i] + (str[i + 1] || 'x')
        c++
    }
    return pairs
}

function getPos(tbl, letter) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (tbl[i][j] == letter)
                return [i, j]
        }
    }
}

function cleanText(text) {
    text = text.replace(/j/g, "i")
    return text.replace(/[^a-zA-Z]/g, "").toLowerCase()
}

function encrypt(str, encryptTbl) {
    str = replaceAccents(str)
    str = cleanText(str)
    let encrypted = ""
    for (const pair of getPairs(str)) {
        let pos1 = getPos(encryptTbl, pair[0]);
        let pos2 = getPos(encryptTbl, pair[1]);

        let i1 = pos1[0]
        let j1 = pos1[1]

        let i2 = pos2[0]
        let j2 = pos2[1]


        if (j1 == j2) {
            i1 = nextNumber(i1)
            i2 = nextNumber(i2)
        }
        else if (i1 == i2) {
            j1 = nextNumber(j1)
            j2 = nextNumber(j2)
        }
        else {
            let tmp = j1
            j1 = j2

            j2 = tmp
        }

        encrypted += encryptTbl[i1][j1] + encryptTbl[i2][j2]
    }

    return encrypted
}


function decrypt(str, decryptTbl) {
    str = cleanText(str)
    let decrypted = ""

    let pairs = getPairs(str)
    for (const pair of pairs) {
        

        let pos1 = getPos(decryptTbl, pair[0]);
        let pos2 = getPos(decryptTbl, pair[1]);

        let i1 = pos1[0]
        let j1 = pos1[1]

        let i2 = pos2[0]
        let j2 = pos2[1]


        if (j1 == j2) {
            i1 = prevNumber(i1)
            i2 = prevNumber(i2)
        }
        else if (i1 == i2) {
            j1 = prevNumber(j1)
            j2 = prevNumber(j2)
        }
        else {
            let tmp = j1
            j1 = j2

            j2 = tmp
        }

        decrypted += decryptTbl[i1][j1] + decryptTbl[i2][j2]
    }

    return decrypted

}





function nextNumber(number) {
    if (number == 4) return 0
    return number + 1;
}

function prevNumber(number) {
    if (number == 0) return 4
    return number - 1;
}


let cipherTable = generateTb("")
showCipherTableHtml()

const input = () => document.querySelector("#input-text").value
const mode = () => document.querySelector("#mode").value
const insertResult = (result) => document.querySelector("#cipher-result").innerText = result

document.querySelector("#password").addEventListener("input", function (e) {
    cipherTable = generateTb(e.target.value.toLowerCase())
    document.querySelector("#cipher-table tbody").innerHTML = ""
    showCipherTableHtml()
});


document.querySelector(".card-body form").addEventListener("submit", function (e) {
   e.preventDefault();
   
    if (mode() === "encrypt" ) {
        insertResult(encrypt(input().toLowerCase(), cipherTable))
    }
    else {
        insertResult(decrypt(input().toLowerCase(), cipherTable))
    }

   
});



function showCipherTableHtml() {
    for (let i = 0; i < 5; i++) {
        let row = document.createElement("tr")
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement("td")
            cell.innerHTML = cipherTable[i][j]
            row.appendChild(cell)
        }
        document.querySelector("#cipher-table tbody").appendChild(row)
    }
}