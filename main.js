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

    registers[r1Name].value =  "0x" + res.toString(16).padStart(2, '0');
  
}

function sub(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);

    let res = (firstRegisterVal - secondRegisterVal) % 256;

    registers[r1Name].value =  "0x" + res.toString(16).padStart(2, '0');
}

function and(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);

    let res = (firstRegisterVal & secondRegisterVal) % 256;

    registers[r1Name].value =  "0x" + res.toString(16).padStart(2, '0');
}

function or(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);


    let res = (firstRegisterVal | secondRegisterVal) % 256;

    registers[r1Name].value =  "0x" + res.toString(16).padStart(2, '0');
}

function xor(r1Name, r2Name) {
    let firstRegisterVal = parseInt(registers[r1Name].value, 16);
    let secondRegisterVal = parseInt(registers[r2Name].value, 16);

    let res = (firstRegisterVal ^ secondRegisterVal) % 256;

    registers[r1Name].value =  "0x" + res.toString(16).padStart(2, '0');
}

function mul(rName) {
    let regVal = parseInt(registers[rName].value, 16);
    let ALValue = parseInt(registers["AL"].value, 16);


    let res = (ALValue * regVal) % 65536;

    res = res.toString(16).padStart(4, '0');

    registers["AH"].value = "0x" + res.slice(0,2)
    registers["AL"].value = "0x" + res.slice(2,4) 
   
    

}

function imul(rName) {
    
}

function div(rName) {
    let regVal = parseInt(registers[rName].value, 16);
    let AXValue = parseInt("0x" + registers["AH"].value.slice(2) + registers["AL"].value.slice(2), 16);


    let rest = (AXValue % regVal) % 256
    AXValue = AXValue - rest;

    let res = (AXValue / regVal) % 256;

    res = res.toString(16).padStart(2, '0');
    rest = rest.toString(16).padStart(2, '0');

    registers["AH"].value = "0x" + rest
    registers["AL"].value = "0x" + res

}

function idiv(rName) {
    
}




function loadRegisters() {

    registers.AH = new Register("AH", "0xff");
    registers.AL = new Register("AL", "0xff");
    registers.BH = new Register("BH", "0x50");
    registers.BL = new Register("BL", "0xff");
    registers.CH = new Register("CH", "0xff");
    registers.CL = new Register("CL", "0xff");
    registers.DH = new Register("DH", "0xff");
    registers.DL = new Register("DL", "0xff");





    doIn(1, function () {

        div("BH");


    })





}


function doIn(sec, func) {
    setTimeout(func, sec * 1000);

}

loadRegisters();