const wrapper = document.querySelector(".wrapper"), // new variable - grab wrapper
searchInput = wrapper.querySelector("input"), //find the input element in the wrapper, which contains everything
synonyms = wrapper.querySelector(".synonyms .list"),
infoText = wrapper.querySelector(".info-text"),
volumeIcon = document.querySelector('.word i');

let audio; //declare audio variable

// event listeners

searchInput.addEventListener("keyup", e => { // on key up, function:
    if(e.key === "Enter" && e.target.value) { // if event listener key event is Enter and it has a value:
        fetchApi(e.target.value); // fetch api function takes input typed value (word)
    }    
});

volumeIcon.addEventListener('click', ()=> {
    audio.play() // function - play audio (defined in new Audio object) on icon click.
});

// fetch API function

function fetchApi(word) {

    infoText.style.color = '#000';
    infoText.innerHTML = `Searching the meaning of <span>${word}</span>...`;

    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(res => res.json()).then(result => data(result, word)); // data response and word arguments for data function
}

function data(result, word) {

        if(result.title) { // if no valid word is found
        
        infoText.innerHTML = `Cannot find the meaning of <span>${word}</span>.`}
    
        else {
        
        console.log(result); // check result in log

        wrapper.classList.add('active'); // if word exists, 'active' class added to wrapper
        
        // loop through each result. and for each result, find div with .meanings, and append result to html. 
        result.forEach(resultItem => {
            
            resultItem.meanings.forEach(meaning => { // notice hierarchy of objects corresponding to API data structure.
                
                meaning.definitions.forEach(definition => {
                    document.querySelector(".meanings").innerHTML += `<span class="meaning">${definition.definition}</span>`;
                });
            });
        });

        phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

        // pass API data to html elements

        infoText.style.display = 'none'; // clear searching method

        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        
        audio = new Audio(result[0].phonetics[0].audio); // new audio obj with audio source
        
            if(result[0].meanings[0].synonyms[0] == undefined) {

                synonyms.innerHTML = `No synonyms found for ${word}! rubbish API!`; // if no synonyms found, create message
            } else {

                synonyms.parentElement.style.display = 'block';
                synonyms.innerHTML = ""; // clear previous search on new entry

                for(let i = 0; i < 5; i++) { // get up to 5 synonyms from API object.
                    let tag = `<span>${result[0].meanings[0].synonyms[i]},</span>` // declare tag variable, which is the element with data (synonym) in spans.
                    synonyms.insertAdjacentHTML("beforeend", tag); // insert new elements containing synonyms data into html
                }
            }
    }
}

