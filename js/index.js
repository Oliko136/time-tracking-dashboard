const tablist = document.getElementById('tablist');
const panel = document.getElementById('panel');
const cards = document.querySelector('.cards');

async function switchTabs(e) {
    if (!e.target.hasAttribute('data-tab')) {
        return;
    }

    cards.innerHTML = '';

    const tabs = Array.from(tablist.children);
    tabs.forEach(tab =>
        tab === e.target
            ? tab.setAttribute('aria-selected', true)
            : tab.setAttribute('aria-selected', false));
        
    panel.setAttribute('aria-labelledby', e.target.id);

    loadContent(e.target.id);
}

async function fetchData() {
    try {
        const res = await fetch('./data.json');
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

function renderCard(type, timeframeData, timeframeName) {
    const li = document.createElement('li');
    li.classList.add('card');
            
    li.classList.add(formatTypeName(type));
            
    li.innerHTML = `
        <img src="./images/icon-${formatTypeName(type)}.svg" alt="" class="icon">
        <div class="card__content">
            <div class="card__header">
                <h2 class="title">${type}</h2>
                <img alt="" src="./images/icon-ellipsis.svg"/>
            </div>
            <div class="card__data">
                <p class="current">${timeframeData.current}hrs</p>
                <p class="previous">${choosePreviousText(timeframeName)} - ${timeframeData.previous}hrs</p>
            </div>
        </div>`

    cards.appendChild(li);
}

function formatTypeName(typeName) {
    let newTypeName;

    const typeNameArr = typeName.split(' ');

    if (typeNameArr.length > 1) {
        newTypeName = typeNameArr.map(word => word.toLowerCase()).join('-');
        
    } else if (typeNameArr.length === 1) {
        newTypeName = typeNameArr[0].toLowerCase();
    } else {
        return;
    }

    return newTypeName;
}

function choosePreviousText(timeframeName) {
    let previousText;

    switch (timeframeName) {
        case 'daily':
            previousText = 'Yesterday';
            break;
        case 'weekly':
            previousText = 'Last Week';
            break;
        case 'monthly':
            previousText = 'Last Month';
            break;
        default:
            previousText = 'Previous';
            break;
    }

    return previousText;
}

async function loadContent(timeframe) {
    const data = await fetchData();

    data.forEach(item => {
        if (item.timeframes && item.timeframes[timeframe]) {
            renderCard(item.title, item.timeframes[timeframe], timeframe);
        } else {
            console.warn(`Missing timeframe "${timeframe}" for item "${item.title}"`);
        }
    })
}

loadContent('daily');

// Event listeners
tablist.addEventListener('click', switchTabs);