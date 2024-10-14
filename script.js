let url = `https://api.dictionaryapi.dev/api/v2/entries/en/keyboard`;
let meanings;
let globalXhr;
let currentAudio

function makeHttpRequest() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "json"
    xhr.open("GET", url)
    xhr.send()

    xhr.addEventListener("load", () => {
        update(xhr)
    })
    globalXhr = xhr
}
makeHttpRequest()

function update(xhr) {

    if (xhr.status === 200) {
        document.querySelector(".error").style.display = "none"
        document.querySelector(".word-info").style.display = "flex"
        const wordArr = xhr.response[0].word.split("")
        wordArr[0] = wordArr[0].toUpperCase()

        document.querySelector(".word").innerText = `${wordArr.join("")}`
        document.querySelector(".phonetic").innerText = `${xhr.response[0].phonetic}`
        chooseAudio(xhr)
        meanings = xhr.response[0].meanings
        getSection()
    }

    else{
        document.querySelectorAll("section").forEach((el)=>{el.style.display = "none"})
        document.querySelector(".word-info").style.display = "none"
        document.querySelector("footer").style.display = "none"

        document.querySelector(".error").style.display = "flex"
    }

}

function chooseAudio(xhr) {
    console.log("currentAudio", );
    if (currentAudio) {
        currentAudio.removeEventListener("click", audio)
    }

    let flag = true
    xhr.response[0].phonetics.forEach((el) => {
        if (el.audio && flag) {
            flag = false
            currentAudio = new Audio(el.audio);
            document.querySelector(".play-icon").addEventListener("click", audio)
            currentAudio.currentTime = 0;
        }
    })
}

function audio() {
    currentAudio.play()
}

function getSection() {

    const existingSections = document.querySelectorAll("section");
    existingSections.forEach(section => section.remove());

    for (const a of globalXhr.response[0].meanings) {
        const section = document.createElement("section")
        section.classList.add(`section`)
        section.innerHTML = `
            <div class="part-of-speech">
                <h3 class="pos"></h3>
                <div class="line"></div>
            </div>
            <p class="meaning">Meaning: </p>
            <ul class="definitions"></ul>
        `

        var defi = ''
        var syno = ''
        var anto = ''

        a.definitions.forEach((el, i) => {
            defi += `<li class="def"><div class="bullet"></div> <span>${JSON.stringify(el.definition)}</span></li>`
            if (el.example) {
                defi += `<p class="example">"${el.example}"</p>`
            }
        })

        a.synonyms.forEach((el) => {
            syno += el
            syno += ', '
        })

        a.antonyms.forEach((el) => {
            anto += el
            anto += ', '
        })
        document.body.append(section)

        section.querySelector(".pos").innerText = a.partOfSpeech
        section.querySelector(".definitions").innerHTML = defi

        if (syno) {
            section.innerHTML += `<h3 class="synonym related">Synonym: <span>${syno}</span></h3>`
        }

        if (anto) {
            section.innerHTML += `<h3 class="antonym related">Antonym: <span>${anto}</span></h3>`
        }
    }
    appendFooter()
}

function getInput(xhr) {
    document.querySelector(".input-container").addEventListener("submit", (e) => {
        e.preventDefault()
        url = `https://api.dictionaryapi.dev/api/v2/entries/en/${document.querySelector(".search-word").value}`

        currentAudio.removeEventListener("click", audio)
        xhr.removeEventListener("load", update)
        makeHttpRequest()
        xhr.addEventListener("load", update)
    })
}
getInput(globalXhr)

function appendFooter() {

    if (document.querySelector("footer")) {
        document.querySelector("footer").remove()
    }

    const footer = document.createElement("footer")
    footer.innerHTML = `
            <p>Source</p>
            <a id="link" href="${url}" target="_blank">${url}</a>
            <a id="link" href="${url}" target="_blank"><img src="ASSETS/images/icon-new-window.svg" alt="" id="new-window"></a>
        `
    document.body.append(footer)
    // document.querySelector("#link").innerText = `${url}`
}

function changeFont() {
    if (document.querySelector("select").value === "monospace") {
        document.body.style.fontFamily = "monospace"
    }

    else if (document.querySelector("select").value === "cursive") {
        document.body.style.fontFamily = "cursive"
    }

    else if (document.querySelector("select").value === "sans serif") {
        document.body.style.fontFamily = "sans serif"
    }
}
changeFont()
document.querySelector("select").addEventListener("change", changeFont);

// dark mode
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});