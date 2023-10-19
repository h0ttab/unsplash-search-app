const content = document.querySelector('.content')

const searchButton = document.querySelector('#searchBar-button')

const searchBar = document.querySelector('.searchBar-inputField')

const noResultsMessage = document.createElement('p')
noResultsMessage.textContent = 'Nothing was found for your request...';
noResultsMessage.className = 'content-noResultsMessage'

const prevPageButton = document.querySelector(".previousPage");
const nextPageButton = document.querySelector(".nextPage");
const currentPageCounter = document.querySelector(".currentPage")
const totalPagesCounter = document.querySelector(".totalPages");

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
    if (page === undefined){
        currentPageCounter.value = 1;
    }
    content.innerHTML = '';
    const {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
        params : {
            query: `${query}`,
            page: page ?? 1,
            per_page: 12,
        },
        headers : {
            "Authorization": "Client-ID 9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg"
        }})
    totalPagesCounter.textContent = `/${data.total_pages}`
    currentPageCounter.setAttribute('max', data.total_pages)
    if (data.total === 0 && data.total_pages === 0) {
        content.appendChild(noResultsMessage);
    } else {
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

function changePage(value){
    const targetPage = +currentPageCounter.value + value;
    if (targetPage < 1){
        targetPage = 1;
        currentPageCounter.value = 1;
    }
    currentPageCounter.value = Number(currentPageCounter.value) + value;
    getImages(searchBar.value, targetPage)
}