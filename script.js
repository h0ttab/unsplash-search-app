const API_KEY = 'bw68bOFNOa-XYI71LGEIh1zM69U-2rnxUOHaJTtq1L4';

const content = document.querySelector('.content')

const navbar = document.querySelector('.navBar');

const searchButton = document.querySelector('#searchBar-button')

const searchBar = document.querySelector('.searchBar-inputField')

const noResultsMessage = document.querySelector('.noResultsMessage')

const loader = document.querySelector('.loader');

const fullSize = document.querySelector('.modal')

const closeModalButton = document.querySelector('.modal__close')

let scrollListener = function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        changePage(1);
    }
};
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
        deafult: "35vh"
    }
}

const NO_RESULT_MESSAGE = {
    hide: "none",
    show: "flex",
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
    navbar.classList.remove('navBarDefault');
    loader.style.display = LOADER.show;
    noResultsMessage.style.display = NO_RESULT_MESSAGE.hide;
    if (!page) {
        currentPage = 1;
    } else {
        loader.style.top = LOADER.position.deafult
    }

    const {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
        params : {
            query: `${query}`,
            page: page ?? 1,
            per_page: 25,
        },
        headers : {
            "Authorization": `Client-ID ${API_KEY}`,
        }
    })

    loader.style.top = LOADER.position.deafult;
    loader.style.display = LOADER.hide;

    if (data.total === 0) {
        noResultsMessage.style.display = NO_RESULT_MESSAGE.show;
        window.removeEventListener("scroll", scrollListener);
    } else {
        window.addEventListener("scroll", scrollListener);
        noResultsMessage.style.display = NO_RESULT_MESSAGE.hide;
        for (const iterator of data.results) {
            content.appendChild(createImage(iterator.urls.regular))
        }
    }
}

searchButton.addEventListener('click', ()=>{
    content.innerHTML = CONTENT.clear
    getImages(searchBar.value);
    searchBar.blur()
});

searchBar.addEventListener('keydown', (event)=>{
    if (event.keyCode === KEYBOARD.enter){
        content.innerHTML = CONTENT.clear
        getImages(searchBar.value);
        searchBar.blur()
    }
})

function changePage(value){
    searchBar.value = currentQuery;
    let targetPage = Number(currentPage) + value;
    if (targetPage < 1 || targetPage == NaN || targetPage == 0){
        targetPage = 1;
        currentPage = 1;
    }
    getImages(currentQuery, targetPage);
}