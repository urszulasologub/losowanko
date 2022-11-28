let ryjce = ["Artur", "Wojtek", "Bartek", "Ula", "Gustaw", "Kacper", "Jedrzej", "Mikolaj", "Yarek"];
let b1_array = ['Godzina', '30 minut', '25 minut', '15 minut', '90 minut', '45 minut', '20 minut', '35 minut', '40 minut'];
let b2_array = ['Po angielsku', 'Bez angielskich slow', 'Z kolorami daltonistow', 'Z francuskim akcentem'];
let b3_array = [
    'Kontrybucja do maszyny losujacej',
    'Stawia kucaka nastepnej wylosowanej osobie',
    '10zl do budzetu polskiego wtorku',
    '+1 shot śliwowicy na nastepnej integracji',
    'Musisz rzucić zalosny tekst na podryw do partnera/partnerki kogoś z teamu przy najblizszej mozliwej okazji'
];
let time_limitations = [];
let difficulty_modifiers = [];
let penalties = [];
let result_1, result_2, result_3;

function pushManyToArray(hash_array, amount, value, special_symbol) {
    for (let i = 0; i < amount; i++) {
        hash_array.push({
            value: value,
            special: special_symbol
        });
    }
}

function pushNormalQuestions(array, hash_array) {
    for (let i = 0; i < array.length; i++) {
        pushManyToArray(hash_array, 1, array[i], null);
    }
}

function populateArrays() {
    pushNormalQuestions(b1_array, time_limitations);
    pushManyToArray(time_limitations, 3, 'Bez limitu czasu', '3w3');
    pushNormalQuestions(b2_array, difficulty_modifiers);
    pushManyToArray(difficulty_modifiers, 3, 'Bez utrudnien', '3w3');
    for (let i = 0; i < 5; i++) {
        pushNormalQuestions(b3_array, penalties);       // Because we want to make an option without a penalty much rarer
    }
    pushManyToArray(penalties, 1, 'Bez kary', '3w3');
};

populateArrays();

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function pickRyjec() {
    let ryjceIndex = Math.floor(getRandomArbitrary(0, ryjce.length));
    return ryjce[ryjceIndex];
}

function generateRandomRyjecMeta() {
    let ryjec = pickRyjec();
    let ryjecPath = `./img/${ryjec.toLowerCase()}.png`;
    setMetaTag('og:image', ryjecPath);
    setMetaTag('og:title', `dzisiaj daily prowadzi ${ryjec}`);
}

function setMetaTag(itemName, content) {
    let allMetaElements = document.getElementsByTagName('meta');
    for (let i = 0; i < allMetaElements.length; i++) { 
        if (allMetaElements[i].getAttribute('property') == itemName) { 
            allMetaElements[i].setAttribute('content', content); 
            break;
        } 
    }
}

function getRyjecPath(ryjec) {
    return `img/${ryjec.toLowerCase()}.png`;
};

var w1 = [];
var w2 = [];
$.ajaxSetup({
    async: false
});
$.getJSON("database.json", function (json) {
    w1 = json.w1;
    w2 = json.w2;
});
var lottSpeed = 50;
var lottTime = 600;
var los1 = true;
var los2 = true;
var los3 = true;
var time = 0;
var modal = document.getElementById('myModal');
var modal_close = document.getElementsByClassName("close")[0];
var draws_count = 1;
var specjalne = 0;
var volume = 1;

var a1 = document.getElementById("a1");
var a2 = document.getElementById("a2");
var a3 = document.getElementById("a3");
var a4 = document.getElementById("a4");
var b1 = document.getElementById("b1");	
var b2 = document.getElementById("b2");	
var b3 = document.getElementById("b3");
var p1 = document.getElementById("p1");
var p2 = document.getElementById("p2");
var p3 = document.getElementById("p3");
var ryjceDiv = document.getElementById("ryjce");
var ryjceListDiv = document.getElementById("ryjceList");
var progress = document.getElementById("progress");

if (localStorage.volume) {
    volume = Number(localStorage.volume);
    document.getElementById("volume").value = volume;
    setVolume(volume);
}
if (localStorage.draws_count) {
    specjalne = Number(localStorage.specjalne);
}
var started = false;

function setVolume(value) {
    a1.volume = value;
    a2.volume = value;
    a3.volume = value;
    a4.volume = value;
    localStorage.volume = value;
}

function preview() {
    document.getElementById("img01").innerHTML = "";
    modal.style.display = "block";
    var div = document.getElementById("img01");
    html2canvas(document.getElementById("screen")).then(canvas => {
        div.appendChild(canvas)
    });
    document.getElementById("caption").innerHTML = "Kliknij prawym przyciskiem myszy i wybierz jedną z opcji";
}

function losu_start() {
    if (started == false) {
        started = true;
        a3.pause();
        a4.pause();
        a3.currentTime = 0;
        a4.currentTime = 0;
        a1.play();
        lottSpeed = 50;
        lottTime = 600;
        los1 = true;
        los2 = true;
        los3 = true;
        time = 0;
        p1.style.width = "0%";
        p2.style.width = "0%";
        p3.style.width = "0%";
        setTimeout(losowanko, 3300);
    };
}

function setRyjec(ryjec) {
    let ryjecPath = getRyjecPath(ryjec);
    setMetaTag('og:image', `./${ryjecPath}`);
    setMetaTag('og:title', `dzisiaj daily prowadzi ${ryjec}`);
    ryjceDiv.innerHTML = `daily prowadzi: <img height='100px' class='shadowed' src='${ryjecPath}'/>`;
}

function pushResultToHistory(ryjec) {
    let ryjecPath = getRyjecPath(ryjec);
    let currentDate = new Date();
    ryjceListDiv.innerHTML += `
        <img height="25px" src="${ryjecPath}" />
        ${draws_count}. ${currentDate.toLocaleTimeString()}: ${ryjec} - ${b1.innerHTML} - ${b2.innerHTML} - ${b3.innerHTML}
        </br>
    `;
}

function losowanko() {
    a2.play();

    if (los1) {
        result_1 = time_limitations[Math.floor(getRandomArbitrary(0, time_limitations.length))];
        b1.innerHTML = result_1.value;
        p1.style.width = (time / 80) * 100 + "%";
    }
    if (los2) {
        result_2 = difficulty_modifiers[Math.floor(getRandomArbitrary(0, difficulty_modifiers.length))];
        b2.innerHTML = result_2.value;
        p2.style.width = ((time - 80) / 20) * 100 + "%";
    }
    if (los3) {
        result_3 = penalties[Math.floor(getRandomArbitrary(0, penalties.length))];
        b3.innerHTML = result_3.value;
        p3.style.width = ((time - 100) / 20) * 100 + "%";
    }
    let ryjec = pickRyjec();
    setRyjec(ryjec);
    time += 1;
    if (time == 80) {
        p1.style.width = "100%";
        los1 = false;
    }
    if (time == 100) {
        p2.style.width = "100%";
        los2 = false;
    }
    if (time == 120) {
        p3.style.width = "100%";
        los3 = false;
    }
    if (los3 == true) {
        progress.innerHTML = "trwa losowanko (" + Math.floor((time / 120) * 100) + "%)";
        setTimeout(losowanko, lottSpeed);
    } else {
        pushResultToHistory(ryjec);
        progress.innerHTML = "losowanko zakonczone, jeszcze raz?";
        if (!!result_1 && !!result_1.special && result_1.special == result_2.special && result_2.special == result_3.special) {
            a4.src = `sounds/${result_1.special}.mp3`;
            a4.play();
        } else {
            a3.play();
        }
        a2.pause();
        a2.currentTime = 0;
        started = false;
        draws_count += 1;
        localStorage.draws_count = draws_count;
        localStorage.specjalne = specjalne;
    }
}

modal_close.onclick = function () {
    modal.style.display = "none";
}

