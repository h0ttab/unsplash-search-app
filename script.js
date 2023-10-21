const content = document.querySelector('.content')

const searchButton = document.querySelector('#searchBar-button')

const searchBar = document.querySelector('.searchBar-inputField')

const noResultsMessage = document.querySelector('.noResultsMessage')

const controls = document.querySelector(".controls");

const prevPageButton = document.querySelector(".previousPage");
const nextPageButton = document.querySelector(".nextPage");
const currentPageCounter = document.querySelector(".currentPage")
const totalPagesCounter = document.querySelector(".totalPages");

const loader = document.querySelector('.loader');

let currentQuery;

const KEYBOARD = {
    enter: 13,
}

const CONTENT = {
    clear: "",
}

const LOADER = {
    show: "flex",
    hide: "none",
    position : {
        top_loading: "50px",
        top_onload: "35vh",
    }
}

const CONTROLS = {
    hide: "controlsHide",
    show: "controlsShow",
    position : {
        margin_top_loading: "120px",
        margin_top_onload: "0px",
    }
}

const NO_RESULT_MESSAGE = {
    hide: "none",
    show: "flex",
}

function getTotalPages(){
    return +(totalPagesCounter.textContent.slice(2))
}

function createImage (url){
    const pictureBlock = document.createElement('div');
    pictureBlock.className = 'content-pictureBlock';

    const image = document.createElement('img');
    image.src = url;
    image.className = 'content-pictureBlock__image';

    pictureBlock.appendChild(image);
    return pictureBlock;
}

async function getImages(query, page){
    currentQuery = query;
    content.innerHTML = CONTENT.clear;
    loader.style.display = LOADER.show;
    if (!page) {
        currentPageCounter.value = 1;
        controls.id = CONTROLS.hide
    } else {
        loader.style.top = LOADER.position.top_loading
        controls.style.marginTop = CONTROLS.position.margin_top_loading
    }
    const {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
        params : {
            query: `${query}`,
            page: page ?? 1,
            per_page: 12,
        },
        headers : {
            "Authorization": "Client-ID 9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg"
        }
    })
    loader.style.top = LOADER.position.top_onload;
    loader.style.display = LOADER.hide;
    controls.style.marginTop = CONTROLS.position.margin_top_onload
    controls.id = CONTROLS.show;
    const totalPages = data.total_pages > 200 ? 200 : data.total_pages
    totalPagesCounter.textContent = `/ ${totalPages}`
    currentPageCounter.setAttribute('max', totalPages)
    if (data.total === 0 && data.total_pages === 0) {
        noResultsMessage.style.display = NO_RESULT_MESSAGE.show;
        controls.id = CONTROLS.hide;
    } else {
        noResultsMessage.style.display = NO_RESULT_MESSAGE.hide;
        controls.id = CONTROLS.show
        for (const iterator of data.results) {
            content.appendChild(createImage(iterator.urls.regular))
        }
    }
}

searchButton.addEventListener('click', ()=>{
    getImages(searchBar.value);
    searchBar.blur()
});

searchBar.addEventListener('keydown', (event)=>{
    if (event.keyCode === KEYBOARD.enter){
        getImages(searchBar.value);
        searchBar.blur()
    }
})

currentPageCounter.addEventListener('keydown', (event)=>{
    if (event.keyCode === KEYBOARD.enter){
        currentPageCounter.value = Number(currentPageCounter.value);
        if (!currentPageCounter.value){
            currentPageCounter.value = 1;
        }
        const targetPage = +currentPageCounter.value;
        window.scroll({
            top: 0, 
            left: 0, 
            behavior: 'smooth'
          });
        getImages(searchBar.value, targetPage);
    }
})

currentPageCounter.addEventListener('input',() => {
    currentPageCounter.value = Number(currentPageCounter.value);
    console.log(currentPageCounter.value);
    if (currentPageCounter.value > getTotalPages()) {
        currentPageCounter.value = getTotalPages();
    } else if ( currentPageCounter.value == '' || Number(currentPageCounter.value) == NaN ){
        currentPageCounter.value = 1;
    }
})

function changePage(value){
    searchBar.value = currentQuery;
    let targetPage = +currentPageCounter.value + value;
    if (targetPage < 1){
        targetPage = 1;
        currentPageCounter.value = 1;
    }
    if (targetPage == NaN || targetPage == 0){
        targetPage = 1;
        currentPageCounter.value = 1;
    }
    currentPageCounter.value = Number(currentPageCounter.value) + value;
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
    setTimeout(()=>{getImages(currentQuery, targetPage)}, 750)
}