const content = document.querySelector('.content')

const searchButton = document.querySelector('#searchBar-button')

const searchBar = document.querySelector('.searchBar-inputField')

function createImage (url){
    const pictureBlock = document.createElement('div');
    pictureBlock.className = 'content-pictureBlock';
    const image = document.createElement('img');
    image.src = url;
    image.className = 'content-pictureBlock__image'
    pictureBlock.appendChild(image);
    return pictureBlock;
}

async function getImages(query){
    content.innerHTML = '';
    const {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
        params : {
            query: `${query}`,
            per_page: 12,
        },
        headers : {
            "Authorization": "Client-ID 9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg"
        }})
        console.log(data.results);
    for (const iterator of data.results) {
        content.appendChild(createImage(iterator.urls.regular))
    }
}

searchButton.addEventListener('click', ()=>{
    getImages(searchBar.value);
    searchBar.value = '';
});

searchBar.addEventListener('keydown', (event)=>{
    if (event.keyCode === 13){
        getImages(searchBar.value);
        searchBar.value = '';
    }
})

/*
const test = async ()=>{
    const id = 'PxEito_SyZg';
    const {data} = await axios.get(`https://api.unsplash.com/photos/${id}`, {
    headers : {
        "Authorization": "Client-ID 9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg"
    }})
    console.log(data.urls.regular);
};

const test2 = (async ()=>{
    const {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
    params : {
        query: 'tall building'
    },
    headers : {
        "Authorization": "Client-ID 9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg"
    }})
    return data;
})();

console.log(test2);
*/