const API_KEY = '9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg';

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

const fullSize = document.querySelector('.modal')

const closeModalButton = document.querySelector('.modal__close')

document.body.addEventListener('keydown', (e)=>{
    if (e.key == 'Escape' && fullSize.classList.contains('open')){
        document.body.classList.remove('noScroll')
        fullSize.classList.remove('open')
    }
})

closeModalButton.addEventListener('click', ()=>{
    document.body.classList.remove('noScroll')
    fullSize.classList.remove('open')
})

fullSize.addEventListener('click', (event)=>{
    if(event.target === fullSize){
        document.body.classList.remove('noScroll')
        fullSize.classList.remove('open')
    }
})

let currentQuery;
let currentPage;

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
        loading_another_page: "50px",
        deafult: "35vh",
    }
}

const CONTROLS = {
    hide: "controlsHide",
    show: "controlsShow",
    position : {
        loading_another_page: "120px",
        default: "0px",
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
    image.addEventListener('click', ()=>{
        fullSize.classList.add('open');
        document.body.classList.add('noScroll')
        fullSize.querySelector('.modal__fullSizePicture').src = url;
    })

    pictureBlock.appendChild(image);
    return pictureBlock;
}

async function getImages(query, page){
    currentQuery = query;
    currentPage = page;
    content.innerHTML = CONTENT.clear;
    loader.style.display = LOADER.show;
    noResultsMessage.style.display = NO_RESULT_MESSAGE.hide;
    if (!page) {
        currentPageCounter.value = 1;
        currentPage = 1;
        controls.id = CONTROLS.hide;
    } else {
        loader.style.top = LOADER.position.loading_another_page
        controls.style.marginTop = CONTROLS.position.loading_another_page
    }

    const {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
        params : {
            query: `${query}`,
            page: page ?? 1,
            per_page: 12,
        },
        headers : {
            "Authorization": `Client-ID ${API_KEY}`,
        }
    })

    loader.style.top = LOADER.position.deafult;
    loader.style.display = LOADER.hide;
    controls.style.marginTop = CONTROLS.position.default
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
        currentPageCounter.blur();
    }
})

currentPageCounter.addEventListener('input',() => {
    let value = currentPageCounter.value;
    if (isNaN( Number(value) ) || Number(value) === 0){
        value = value.replace(/[^1-9]/g, "");
    }
    value = value > getTotalPages() ? getTotalPages() : value;
    currentPageCounter.value = value;
})

currentPageCounter.addEventListener('blur', ()=>{
    if (currentPageCounter.value == '') {
        currentPageCounter.value = 1;
    }
})

function changePage(value){
    searchBar.value = currentQuery;
    let targetPage = Number(currentPage) + value;
    if (targetPage < 1 || targetPage == NaN || targetPage == 0){
        targetPage = 1;
        currentPage = 1;
    }
    currentPageCounter.value = targetPage;
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
    setTimeout(()=>{getImages(currentQuery, targetPage)}, 750)
}