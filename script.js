// Объявляем переменные, которые задействованы в подгрузке новых данных при скролле

    // Переменная позволяет избежать лишних запросов API при скролле до конца страницы
    let API_timeout = 0;

    // Хранит в себе текущий поисковый запрос, используется для подгрузки данных при скролее
    let currentQuery;

    // Хранит в себе текущую страницу (API выдаёт данные постранично)
    let currentPage;

// Сохраняем API ключ
    let API_KEY = '9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg';

// Сохраняем HTML-элементы в переменные, для дальнейших манипуляций с ними
    const content = document.querySelector('.content');

    const navbar = document.querySelector('.navBar');

    const searchButton = document.querySelector('#searchBar__button');

    const searchBar = document.querySelector('.searchBar__inputField');

    const noResultsMessage = document.querySelector('.noResultsMessage');

    const loader = document.querySelector('.loader');

    const fullSize = document.querySelector('.modal');

    const closeModalButton = document.querySelector('.modal__close');

// Добавляем слушатели событий

    // "Бесконечный скролл". Подгрузка следующих картинок, при скролле до конца страницы
    // После каждой дозагрузки устанавливает таймаут 1 сек. на запросы к API, чтобы не было спама запросами при лишних скроллах
    function scrollListener() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && API_timeout == 0) {
            changePage(1);
            API_timeout = 1;
            setTimeout(()=>{API_timeout = 0}, 1000)
        }
    };

    // Поиск по нажатию Enter в строке поиска
    searchBar.addEventListener('keydown', (event)=>{
        if (event.keyCode === KEYBOARD.enter){
            content.innerHTML = CONTENT.clear;
            getImages(searchBar.value);
            searchBar.blur();
        }
    });

    // Поиск по клику на кнопку поиска
    searchButton.addEventListener('click', ()=>{
        content.innerHTML = CONTENT.clear
        getImages(searchBar.value);
        searchBar.blur()
    });

    // Закрытие модального окна с полноразмерной фотографией по нажатию Escape, кнопке закрыть, или по клику за пределами модального окна
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

// Объявляем переменные с состояниями элементов: позиционирование, открыть/закрыть, показать/скрыть и т.д.
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
            default: "35vh",
            scroll_loading : "0"
        }
    }

    const NO_RESULT_MESSAGE = {
        hide: "none",
        show: "flex",
    }

// Функция для создания блока с картинкой, из которых потом генерируется вся плитка. Принимает аргумент url - адрес, откуда будет взята картинка. Возвращает HTML-элемент блока с картинкой
function createImage (url){

    const pictureBlock = document.createElement('div');
    pictureBlock.className = 'content-pictureBlock';

    const image = document.createElement('img');
    image.src = url;
    image.className = 'content__pictureBlock__image';

    // Добавляем слушатель событий для клика по картинке
    image.addEventListener('click', ()=>{
        // Открыть модальное окно с картинкой в полный размер
        fullSize.classList.add('open');

        // Отключить скролл страницы
        document.body.classList.add('noScroll');

        // Загрузка картинки в модальное окно
        fullSize.querySelector('.modal__fullSizePicture').src = url;
    })

    pictureBlock.appendChild(image);

    return pictureBlock;
}

// Функция для отрисовки плитки с фотографиями
function renderImages(data){
    // Скрываем анимацию загрузки (т.к. данные уже загружены)
    loader.style.display = LOADER.hide;

    
    if (data.total !== 0) {
        // Если ответ API содержит хотя бы сколько-то фотографий - включаем бесконечный скролл и скрываем сообщение "ничего не найдено" (если осталось с предыдущего запроса)
        window.addEventListener("scroll", scrollListener);
        noResultsMessage.style.display = NO_RESULT_MESSAGE.hide;
        // Циклом for...of генерируем плитку с картинками, которые получаем из URL`ов из ответа API
        for (const iterator of data.results) {
            content.appendChild(createImage(iterator.urls.regular))
        }
    } else {
        // Если в ответе API нет изображений - выводим сообщение о том, что ничего не нашлось, и отключаем бесконечный скролл
        noResultsMessage.style.display = NO_RESULT_MESSAGE.show;
        window.removeEventListener("scroll", scrollListener);
    }
}

// Функция для получения изображений от API. Принимает аргументы query - поисковый запрос, page - номер запрашиваемой страницы
async function getImages(query, page){

    // Сохраняем запрос и страницу, чтобы бесконечный скролл грузил данные по тому же запросу, и странице +1
        currentQuery = query;
        currentPage = page;

    // Убираем строку поиска из центра экрана
        navbar.classList.remove('navBarDefault');

    // Показываем анимацию загрузки в центре экрана и скрываем сообщение "ничего не найдено" (если оно осталось от предыдущего запроса)
        loader.style.display = LOADER.show;
        noResultsMessage.style.display = NO_RESULT_MESSAGE.hide;

    // Если при вызове функции не указана страница (новый поисковый запрос) - ставим значение по-умолчанию, т.е. страница 1, и ставим анимацию загрузки в центр экрана.
    if (!page) {
        loader.style.top = LOADER.position.default;
        currentPage = 1;
    } else {
        // Если идёт подгрузка данных для бесконечного скролла - анимация загрузки переместится под последний ряд картинок
        loader.style.top = LOADER.position.scroll_loading;
    }

    // Отправляем запрос для получения JSON-данных со ссылками на фотографиями по заданным критериям (запрос + страница)
    // Используем try/catch для возможности задействовать резервный API-ключ на тот случай, если на основном исчерпался лимит
    // Ответы 401 (невалидный ключ API) или 403 (превышен лимит запросов в час) определяются как ошибки, поэтому обрабатываем их в catch
    try {

        let {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
            params : {
                query: `${query}`,
                page: page ?? 1,
                per_page: 25,
            },
            headers : {
                "Authorization": `Client-ID ${API_KEY}`,
            }
        });

        renderImages(data);
        
        } catch (error) {

            if (error.message === 'Request failed with status code 403' || error.message === 'Request failed with status code 401'){

                // Используем резервный ключ API
                API_KEY = 'bw68bOFNOa-XYI71LGEIh1zM69U-2rnxUOHaJTtq1L4';

                let {data} = await axios.get(`https://api.unsplash.com/search/photos/`, {
                    params : {
                        query: `${query}`,
                        page: page ?? 1,
                        per_page: 25,
                    },
                    headers : {
                        "Authorization": `Client-ID ${API_KEY}`,
                    }
                })

                // Возвращаем основной ключ обратно
                API_KEY = '9gjvoXWa0NBklahjBs3QbNGnDsn7NnAUg6bqWktidPg';

                renderImages(data);
            }

        }
}

// Функция загрузки следующей страницы (следующие X картинок) в бесконечном скролле
function changePage(){
    let targetPage = Number(currentPage) + 1;
    // Тот же поисковый запрос, но запрашиваемая страница равна "текущая + 1" 
    getImages(currentQuery, targetPage);
}