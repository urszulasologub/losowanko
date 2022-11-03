function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var w1 = [];
var w2 = [];
var ryjce = ["Artur", "Wojtek", "Bartek", "Ula", "Gustaw", "Kacper", "Jedrzej", "Mikolaj", "Yarek"];
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
var losowania = 0;
var specjalne = 0;
var volume = 1;

var a1 = document.getElementById("a1");
var a2 = document.getElementById("a2");
var a3 = document.getElementById("a3");
var a4 = document.getElementById("a4");
var p1 = document.getElementById("p1");
var p2 = document.getElementById("p2");
var p3 = document.getElementById("p3");
var ryjceDiv = document.getElementById("ryjce");
var progress = document.getElementById("progress");

if (localStorage.volume) {
    volume = Number(localStorage.volume);
    document.getElementById("volume").value = volume;
    setVolume(volume);
}
if (localStorage.losowania) {
    losowania = Number(localStorage.losowania);
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

function generateImage() {
    losu_start();
    document.getElementById("img01").innerHTML = "";
    html2canvas(document.getElementById("machine")).then(canvas => {
        canvas.toBlob(function (blob) {
            saveAs(blob, "losowanko_" + losowania + ".png");
        });
    });
}

function pickRyjec() {
    let ryjceIndex = Math.floor(getRandomArbitrary(0, ryjce.length));
    return ryjec = ryjce[ryjceIndex];
}

function setRyjecLabel(ryjec) {
    ryjceDiv.innerHTML = "daily prowadzi: <img height='100px' class='shadowed' src='img/" + ryjec.toLowerCase() + ".png'/>";
}

function setRyjecNameLabel(ryjec) {
    ryjceDiv.innerHTML += `<div class="row"><p>${ryjec}</p></div>`;
}

function generateRyjecMetaImage() {
    console.log('test');
    let ryjec = pickRyjec();
    setRyjecLabel(ryjec);
    setRyjecNameLabel(ryjec);
}

function losowanko() {
    a2.play();

    if (los1) {
        p1.style.width = (time / 80) * 100 + "%";
    }
    if (los2) {
        p2.style.width = ((time - 80) / 20) * 100 + "%";
    }
    if (los3) {
        p3.style.width = ((time - 100) / 20) * 100 + "%";
    }
    setRyjecLabel(pickRyjec());
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
    }
    else {
        setRyjecNameLabel(ryjec);
        progress.innerHTML = "losowanko zakonczone, jeszcze raz?";
        a3.play();
        a2.pause();
        a2.currentTime = 0;
        started = false;
        losowania += 1;
        localStorage.losowania = losowania;
        localStorage.specjalne = specjalne;
    }
}
modal_close.onclick = function () {
    modal.style.display = "none";
}

