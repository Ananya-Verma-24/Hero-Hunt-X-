//  -------- banner video --------------
function playVideo(f){
    f.play();
}

function normal(ff){
    ff.pause();
    ff.currentTime = 0;
}

// ------------- fetch elements from DOM -------------------
const homeContainer = document.getElementById('home-container');
let input = document.getElementById("input-box");
let button = document.getElementById("search-btn");
let showContainer = document.getElementById("show-container");
let listContainer = document.querySelector(".list");
let favContainer = document.querySelector('.fav-container');
let favDisplay = document.querySelector('.fav-display');
let homeBtn = document.getElementById('home-btn');
let favBtn = document.getElementById('fav-list');

const [timestamp, apiKey, hashValue] = ["1","c2a8eacc316e6df8df93b8d6b865d053","220be48f50a7b2162338578789db2414"];

function displayWords(value){
    input.value = value;
    removeElements();
}


function removeElements(){
    listContainer.innerHTML = "";
}

//  --------- search suggestions on pressing key ---------
input.addEventListener("keyup", async() =>{
    removeElements();
    if(input.value.length < 3){
        return false;
    }

    const url = `http://gateway.marvel.com/v1/public/characters?&ts=1&apikey=c2a8eacc316e6df8df93b8d6b865d053&hash=220be48f50a7b2162338578789db2414&nameStartsWith=${input.value}` ;

    const response = await fetch(url);
    const jsonData = await response.json();

    jsonData.data["results"].forEach((result) => {
        let name = result.name;
        let div = document.createElement("div");
        div.style.cursor = "pointer";
        div.classList.add("autocomplete-items");
        div.setAttribute("onclick","displayWords('"+ name +"')");
        let word = "<b>"+ name.substr(0,input.value.length) + "</b>";
        word += name.substr(input.value.length);
        div.innerHTML = `<p class= "search-item">${word}</p>`;
        listContainer.appendChild(div);
    });
})


//  ------------- event on pressing search button ----------------
button.addEventListener("click",(getRsult = async ()=>{
    if(input.value.trim().length<1){
        alert("input cannot be empty");
    }
    else{
    

        homeContainer.style.display = 'none';
        favContainer.style.display = 'none';
        showContainer.style.display = 'block';
        
}
    showContainer.innerHTML = "";
    //  fetch marvel api
    const url = `http://gateway.marvel.com/v1/public/characters?&ts=1&apikey=c2a8eacc316e6df8df93b8d6b865d053&hash=220be48f50a7b2162338578789db2414&name=${input.value}` ;

    const response = await fetch(url);
    const jsonData = await response.json();

    jsonData.data["results"].forEach((element) => {
        showContainer.innerHTML = `<div class="card-container">
        <div class="container-character-image">
        <img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}"/>
        </div>
        <div class ="about-char">
        <div class="character-name">${element.name}</div>
        <div class="character-description">${element.description}</div>
        <div class="character-story">
        <div class="comic-no"><i class="bi bi-book"></i> Comics: ${element.comics["available"]}</div>
        <div class="series-no"><i class="bi bi-film"></i> Series: ${element.series["available"]}</div>
        <div class="stories-no"><i class="bi bi-pencil"></i> Stories: ${element.stories["available"]}</div>
        </div>
        <button type="button" data-id="${element.id}" class="fav-btn">
        Add to Fav <i class="fa fa-heart" aria-hidden="true"></i>
        </button>
        </div>
        
        </div>
        <h1 class="heading">Comics</h1>
        <div class="comic-display">
        
        </div>
        <h1 class="heading">Series</h1>
        <div class="series-display"></div>`
        
        const comicDiv = document.querySelector(".comic-display");
        let charId = element.id;
        const apiUrl = `http://gateway.marvel.com/v1/public/characters/${charId}/comics?&ts=1&apikey=c2a8eacc316e6df8df93b8d6b865d053&hash=220be48f50a7b2162338578789db2414` ;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const comics = data.data.results;

                // Loop through comics and extract thumbnail information
                for (let i = 0; i < Math.min(12, comics.length); i++) {
                    const comic = comics[i];
                    const thumbnail = comic.thumbnail;
                    const thumbnailUrl = `${thumbnail.path}.${thumbnail.extension}`;

                    // Use the thumbnail URL for displaying
                  
                    let cdiv = document.createElement("div");
                    cdiv.classList.add("comic-div");
                    cdiv.innerHTML = `<img src = "${thumbnailUrl}"/>
                    <div class="overlay"> <h6>${comic.title}</h6></div>`

                    comicDiv.append(cdiv);

                }
                
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
                

            // fetching series
            const seriesDiv = document.querySelector(".series-display");
        const seriesUrl = `http://gateway.marvel.com/v1/public/characters/${charId}/series?&ts=1&apikey=c2a8eacc316e6df8df93b8d6b865d053&hash=220be48f50a7b2162338578789db2414` ;
        fetch(seriesUrl)
            .then(response => response.json())
            .then(data => {
                const series = data.data.results;
                

                // Loop through comics and extract thumbnail information
                for (let i = 0; i < Math.min(12, series.length); i++) {
                    const show = series[i];
                    const thumbnail = show.thumbnail;
                    const thumbnailUrl = `${thumbnail.path}.${thumbnail.extension}`;

                    // Use the thumbnail URL for your purpose
                   
                    let sdiv = document.createElement("div");
                    sdiv.classList.add("series-div");
                    sdiv.innerHTML = `<img src = "${thumbnailUrl}"/>
                    <div class="overlay"> <h6>${show.title}</h6></div>`

                    seriesDiv.append(sdiv);

                }
                
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    });

}))

//  home button function
homeBtn.addEventListener('click', function(){
    homeContainer.style.display = 'block';
    showContainer.style.display = 'none';
    favContainer.style.display = 'none';
})

favBtn.addEventListener('click', function(){
    homeContainer.style.display = 'none';
    showContainer.style.display = 'none';
    favContainer.style.display = 'block';
})

async function addToFav(data){
    const charUrl = `http://gateway.marvel.com/v1/public/characters/${data}?&ts=1&apikey=c2a8eacc316e6df8df93b8d6b865d053&hash=220be48f50a7b2162338578789db2414` ;
    const response = await fetch(charUrl);
    const jsonData = await response.json();
    
    jsonData.data["results"].forEach((element) => {
        console.log(element.name);
        let favdiv = document.createElement("div");
        favdiv.classList.add("fav-div");
        favdiv.innerHTML = `<img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}"/>
                            <button type="button"  class="remove-btn">
                            <i class="fa fa-trash-o" aria-hidden="true"></i></i>
                            </button>
                            <div class="char-title"> <h3>${element.name}</h3></div>`

        favDisplay.append(favdiv);

    })
}

showContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains('fav-btn')){
       
        if(e.target.classList.contains('is-fav')){
            e.target.classList.remove('is-fav');
            e.target.innerHTML = 'Add to Fav <i class="fa fa-heart" aria-hidden="true"></i>';

        }else{
            e.target.classList.add('is-fav');
            e.target.textContent = 'Remove Fav';
            var dataId = e.target.getAttribute("data-id");
            addToFav(dataId);

        }


    }


})

favContainer.addEventListener("click", deleteFav);

function deleteFav(e){
    const item = e.target;
    if(item.classList.contains('remove-btn')){
        item.parentElement.remove();
    }
}