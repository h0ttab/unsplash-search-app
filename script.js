const content = document.querySelector('.content')

const searchButton = document.querySelector('#searchBar-button')

const searchBar = document.querySelector('.searchBar-inputField')

const noResultsMessage = document.createElement('p')
noResultsMessage.textContent = 'Nothing was found for your request...';
noResultsMessage.className = 'content-noResultsMessage'

const controls = document.querySelector(".controls");

const prevPageButton = document.querySelector(".previousPage");
const nextPageButton = document.querySelector(".nextPage");
const currentPageCounter = document.querySelector(".currentPage")
const totalPagesCounter = document.querySelector(".totalPages");

const loader = document.querySelector('.loader');

let currentQuery;

function createImage (url){
    const pictureBlock = document.createElement('div');
    pictureBlock.className = 'content-pictureBlock';
    const image = document.createElement('img');
    image.src = url;
    image.className = 'content-pictureBlock__image'
    pictureBlock.appendChild(image);
    return pictureBlock;
}

async function getImages(query, page){
    currentQuery = query;
    if (page === undefined){
        currentPageCounter.value = 1;
    }
    content.innerHTML = '';
    loader.style.display = "flex";
    if (!page) {
        controls.id = 'controlsHide'
    } else {
        loader.style.top = '50px'
        controls.style.marginTop = '120px'
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
    loader.style.top = '35vh';
    loader.style.display = "none";
    controls.style.marginTop = '0px'
    controls.id = 'controlsShow';
    const totalPages = data.total_pages > 200 ? 200 : data.total_pages
    totalPagesCounter.textContent = `/ ${totalPages}`
    currentPageCounter.setAttribute('max', totalPages)
    if (data.total === 0 && data.total_pages === 0) {
        content.appendChild(noResultsMessage);
        controls.id = 'controlsHide'
    } else {
        controls.id = 'controlsShow'
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
    if (event.keyCode === 13){
        getImages(searchBar.value);
        searchBar.blur()
    }
})

currentPageCounter.addEventListener('keydown', (event)=>{
    if (event.keyCode === 13){
        if (currentPageCounter.value == '' || +currentPageCounter.value == NaN){
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
    if (currentPageCounter.value > +(totalPagesCounter.textContent.slice(2))) {
        currentPageCounter.value = +(totalPagesCounter.textContent.slice(2))
    } else if (currentPageCounter.value < 1 && currentPageCounter.value !== ''){
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
    getImages(currentQuery, targetPage)
}