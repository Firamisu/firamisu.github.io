let registers = {}

class Register {

    name;
    _value;


    constructor(name, value) {


        if (!value.startsWith("0x")) {
            throw new Error("Invalid value");
        }

        if (name.length < 1) {
            throw new Error("Invalid register name");
        }
        this.name = name;
        this._value = value;

        this.addToDom();
    }

    get name() {
        return this.name;
    }


    get value() {
        return this._value;
    }


    set value(value) {

        if (value.length == 3) {
            value = `0x0${Number(value).toString(16)}`
        }

        this._value = value;
        let el = document.querySelector("#" + this.name + " input")

        el.value = value;

        el.style.backgroundColor = "red";

        setTimeout(() => {
            el.style.backgroundColor = "white";
        }, 700)

        console.log(`Register ${this.name} changed to ${value}`);
    }


    addToDom() {

        let div = document.createElement("div");
        div.classList.add("register");

        div.setAttribute("id", this.name);

        let p = document.createElement("p");
        p.innerText = this.name;

        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.readOnly = true;
        input.value = this._value;


        div.appendChild(p);
        div.appendChild(input);

        document.querySelector("#registers").appendChild(div);


    }
}


function mov(from, to) {
    let fromRegister = registers[from];
    let toRegister = registers[to];

    if (fromRegister == undefined || toRegister == undefined) {
        throw new Error("Invalid register");
    }

    toRegister.value = fromRegister.value;
}

function xchg(r1Name, r2Name) {
    let firstRegisterVal = registers[r1Name].value;
    let secondRegisterVal = registers[r2Name].value;

    registers[r1Name].value = secondRegisterVal;
    registers[r2Name].value = firstRegisterVal;
}

function inc(rName) {
    let registerValue = registers[rName].value;
    let decVal = parseInt(registerValue, 16);

    decVal++;

    if (decVal > 255) {
        decVal = 0;
    }

    registers[rName].value = "0x" + decVal.toString(16);
}

function dec(rName) {
    let registerValue = registers[rName].value;
    let decVal = parseInt(registerValue, 16);

    decVal--;

    if (decVal < 0) {
        decVal = 255;
    }

    registers[rName].value = "0x" + decVal.toString(16);
}



function not(rName) {
    let decimalValue = parseInt(registers[rName].value, 16);

    decimalValue = decimalValue % 256;

    let res = (255 - decimalValue) % 256;

    registers[rName].value = "0x" + res.toString(16).padStart(2, '0');
}

function neg(rName) {
    let decimalValue = parseInt(registers[rName].value, 16);

    decimalValue = decimalValue % 256;

    let res = (255 - decimalValue) % 256;

    res++;

    if (res > 255) {
        res = 0;
    }

    registers[rName].value = "0x" + res.toString(16).padStart(2, '0');
}


function add(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);

    let res = (firstRegisterVal + secondRegisterVal) % 256;

    registers[r1Name].value = "0x" + res.toString(16).padStart(2, '0');

}

function sub(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);

    let res = (firstRegisterVal - secondRegisterVal) % 256;

    registers[r1Name].value = "0x" + res.toString(16).padStart(2, '0');
}

function and(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);

    let res = (firstRegisterVal & secondRegisterVal) % 256;

    registers[r1Name].value = "0x" + res.toString(16).padStart(2, '0');
}

function or(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);


    let res = (firstRegisterVal | secondRegisterVal) % 256;

    registers[r1Name].value = "0x" + res.toString(16).padStart(2, '0');
}

function xor(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);

    let res = (firstRegisterVal ^ secondRegisterVal) % 256;

    registers[r1Name].value = "0x" + res.toString(16).padStart(2, '0');
}

function mul(rName) {
    let regVal = parseInt(registers[rName].value, 16);
    let ALValue = parseInt(registers["AL"].value, 16);


    let res = (ALValue * regVal) % 65536;

    res = res.toString(16).padStart(4, '0');

    registers["AH"].value = "0x" + res.slice(0, 2)
    registers["AL"].value = "0x" + res.slice(2, 4)



}

function imul(rName) {
    let regVal = parseInt(registers[rName].value, 16);
    let AXValue = parseInt("0x" + registers["AH"].value.slice(2) + registers["AL"].value.slice(2), 16);

    let res = (AXValue * regVal) % 65536;


    let AHVal = Math.floor(res / 256);
    let ALVal = res % 256;

    registers["AH"].value = "0x" + AHVal.toString(16).padStart(2, '0');
    registers["AL"].value = "0x" + ALVal.toString(16).padStart(2, '0');
}

function div(rName) {
    let regVal = parseInt(registers[rName].value, 16);
    let AXValue = parseInt("0x" + registers["AH"].value.slice(2) + registers["AL"].value.slice(2), 16);

    if (regVal === 0) {
        alert("Nie można dzielić przez 0")
        return
    }

    let rest = (AXValue % regVal) % 256
    AXValue = AXValue - rest;

    let res = (AXValue / regVal) % 256;

    res = res.toString(16).padStart(2, '0');
    rest = rest.toString(16).padStart(2, '0');

    registers["AH"].value = "0x" + rest
    registers["AL"].value = "0x" + res

}

function idiv(rName) {
    let regVal = parseInt(registers[rName].value, 16);
    let AXValue = parseInt("0x" + registers["AH"].value.slice(2) + registers["AL"].value.slice(2), 16);

    if (regVal === 0) {
        alert("Nie można dzielić przez 0")
        return
    }

    let quotient = Math.floor(AXValue / regVal);
    let remainder = AXValue % regVal;


    registers["AH"].value = "0x" + remainder.toString(16).padStart(2, '0');
    registers["AL"].value = "0x" + quotient.toString(16).padStart(2, '0');
}


function setDecimalVal(registerName, value) {


    if (value < 0) {

        value = Math.abs(value) % 256;

        value = (255 - value) % 256;

        value++;

        if (value > 255) {
            value = 0;
        }
    } else {
        value = value % 256;
    }


    registers[registerName].value = "0x" + value.toString(16).padStart(2, '0');

}



function loadRegisters() {

    registers.AH = new Register("AH", "0x00");
    registers.AL = new Register("AL", "0x00");
    registers.BH = new Register("BH", "0x00");
    registers.BL = new Register("BL", "0x00");
    registers.CH = new Register("CH", "0x00");
    registers.CL = new Register("CL", "0x00");
    registers.DH = new Register("DH", "0x00");
    registers.DL = new Register("DL", "0x00");

}

function loadElements(el) {
    let op = operations.find(o => o.name === el.value)
    const cont = el.parentElement.querySelector(".cont")
    
    cont.innerHTML = "";

    for (let i = 0; i < op.optsCount; i++) {
       cont.appendChild(genInput(i+1));
    }
    cont.appendChild(genButton());
}

function setRandomValues() {
    setDecimalVal("AH", getRandomInt(-128, 127));
    setDecimalVal("AL", getRandomInt(-128, 127));
    setDecimalVal("BH", getRandomInt(-128, 127));
    setDecimalVal("BL", getRandomInt(-128, 127));
    setDecimalVal("CH", getRandomInt(-128, 127));
    setDecimalVal("CL", getRandomInt(-128, 127));
    setDecimalVal("DH", getRandomInt(-128, 127));
    setDecimalVal("DL", getRandomInt(-128, 127));
}


function reset() {
    registers.AH.value = "0x00";
    registers.AL.value = "0x00";
    registers.BH.value = "0x00";
    registers.BL.value = "0x00";
    registers.CH.value = "0x00";
    registers.CL.value = "0x00";
    registers.DH.value = "0x00";
    registers.DL.value = "0x00";
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function genInput(id) {
    const selectEl = document.createElement("select");
    selectEl.classList.add("opt"+id);
    registersNames.forEach(r => {
        const option = document.createElement("option");
        option.value = r;
        option.textContent = r;
        selectEl.appendChild(option);
    })

    return selectEl;
}

function genButton() {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = "Uruchom";
    buttonElement.classList.add("button");

    buttonElement.addEventListener("click", runOperation)

    return buttonElement;
}

function runOperation() {
    const select = document.querySelector("select");
    const op = operations.find(o => o.name === select.value)

    const opt1 = select.parentElement.querySelector(".opt1")?.value;
    const opt2 = select.parentElement.querySelector(".opt2")?.value;


    switch (op.name) {
        case "MOV":
            mov(opt1, opt2);
            break;
        case "XCHG":
            xchg(opt1, opt2);
            break;
        case "INC":
            inc(opt1);
            break;
        case "DEC":
            dec(opt1);
            break;
        case "NOT":
            not(opt1);
            break;
        case "NEG":
            neg(opt1);
            break;
        case "ADD":
            add(opt1, opt2);
            break;
        case "SUB":
            sub(opt1, opt2);
            break;
        case "AND":
            and(opt1, opt2);
            break;
        case "OR":
            or(opt1, opt2);
            break;
        case "XOR":
            xor(opt1, opt2);
            break;
        case "MUL":
            mul(opt1);
            break;
        case "IMUL":
            imul(opt1);
            break;
        case "DIV":
            div(opt1);
            break;
        case "IDIV":
            idiv(opt1);
            break;
        default:
            break;
    }
}



const operations = [
    {
        name: "MOV",
        optsCount: 2
    },
    {
        name: "XCHG",
        optsCount: 2
    },
    {
        name: "INC",
        optsCount: 1
    },
    {
        name: "DEC",
        optsCount: 1
    },
    {
        name: "NOT",
        optsCount: 1
    },
    {
        name: "NEG",
        optsCount: 1
    },
    {
        name: "ADD",
        optsCount: 2
    },
    {
        name: "SUB",
        optsCount: 2
    },
    {
        name: "AND",
        optsCount: 2
    },
    {
        name: "OR",
        optsCount: 2
    },
    {
        name: "XOR",
        optsCount: 2
    },
    {
        name: "MUL",
        optsCount: 1
    },
    {
        name: "IMUL",
        optsCount: 1
    },
    {
        name: "DIV",
        optsCount: 1
    },
    {
        name: "IDIV",
        optsCount: 1
    },
]

const registersNames = [
    "AH",
    "AL",
    "BH",
    "BL",
    "CH",
    "CL",
    "DH",
    "DL",
]

const select = document.querySelector("select")

select.addEventListener("change", (e) => {
    loadElements(e.target);
})


loadElements(select);
loadRegisters();