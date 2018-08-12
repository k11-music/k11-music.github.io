/*
© Copyright https://kcak11.com / https://ashishkumarkc.com
*/
(function() {
    selBox = document.querySelector("select[name=playlist]");
    var fetchPlaylistSources = function() {
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                try {
                    updateListComponent(JSON.parse(this.responseText));
                } catch (exjs) {//Do nothing :( error occured
                }
            }
        });

        xhr.open("GET", "https://services-kcak11.firebaseio.com/playlist.json");
        xhr.send(data);
    };

    var updateListComponent = function(response) {
        var opt, data = response.data;
        document.querySelector(".container").classList.remove("visibleNone");
        for (var i = 0; i < data.length; i++) {
            opt = document.createElement("option");
            opt.innerHTML = data[i].name;
            opt.value = data[i].dUrl;
            selBox.appendChild(opt);
        }
        var loopCBox = document.querySelector("input[name=audioLoop]");
        loopCBox.style.marginTop = (-1 * (loopCBox.offsetHeight / 2)) + "px";
    };

    var adjustPlayerSize = function() {
        var dimDiv = document.querySelector("#dimDiv");
        if (!dimDiv) {
            dimDiv = document.createElement("div");
            dimDiv.id = "dimDiv";
            dimDiv.style.display = "block";
            dimDiv.style.position = "absolute";
            dimDiv.style.left = dimDiv.style.right = dimDiv.style.top = dimDiv.style.bottom = "0px";
            dimDiv.style.visibility = "hidden";
            document.querySelector("body").appendChild(dimDiv);
        }
        var diff = 121;
        var w = dimDiv.offsetWidth - diff;
        var h = dimDiv.offsetHeight - diff;
        var diag = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
        var playerW = document.querySelector(".container").offsetWidth;
        var playerH = document.querySelector(".container").offsetHeight;
        var playerDiag = Math.sqrt(Math.pow(playerW, 2) + Math.pow(playerH, 2));

        var zoomFactor = ((0.47 * diag) / playerDiag);
        zoomFactor = Math.max(1, zoomFactor);
        if (w < playerW || h < playerH || h < (playerH * zoomFactor) || w < (playerW * zoomFactor)) {
            zoomFactor = 1;
        }
        if (zoomFactor >= 1) {
            var cssDef = ".container{\n-webkit-transform:scale(#W,#H);\n-moz-transform:scale(#W,#H);\n-ms-transform:scale(#W,#H);\ntransform:scale(#W,#H);\n}";
            cssDef = cssDef.split("#W,#H").join(zoomFactor + "," + zoomFactor);
            var dynSheet = document.querySelector("#_dyn_StyleSheet_kcak11");
            if (dynSheet) {
                dynSheet.parentNode.removeChild(dynSheet);
            }
            var s = document.createElement("style");
            s.type = "text/css";
            s.id = "_dyn_StyleSheet_kcak11";
            if (s.styleSheet) {
                s.styleSheet.cssText = cssDef;
            } else {
                s.appendChild(document.createTextNode(cssDef));
            }
            document.querySelector("head").appendChild(s);
        }
    };
    adjustPlayerSize();
    window.onresize = function() {
        adjustPlayerSize();
    };

    fetchPlaylistSources();

    var doPlay = function(e) {
        var audioElem = document.querySelector("audio"), sourceElem;
        if (audioElem) {
            audioElem.parentNode.removeChild(audioElem);
        }
        audioElem = document.createElement("audio");
        audioElem.setAttribute("controls", "controls");
        sourceElem = document.createElement("source");
        sourceElem.src = selBox[selBox.selectedIndex].value;
        audioElem.appendChild(sourceElem);
        document.querySelector(".container").appendChild(audioElem);
        if (document.querySelector("[name=audioLoop]").checked) {
            audioElem.loop = true;
        }
        audioElem.play();
    };

    document.querySelector("button.play").addEventListener("click", doPlay, false);
}());