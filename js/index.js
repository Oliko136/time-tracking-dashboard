const tablist = document.getElementById('tablist');
const panelContainer = document.getElementById('panel-container');

async function switchTabs(e) {
    if (!e.target.hasAttribute('data-tab')) {
        return;
    }

    const targetPanel = document.getElementById(`panel-${e.target.id}`);
    const tabs = Array.from(tablist.children);
    tabs.forEach(tab =>
         tab === e.target
             ? tab.setAttribute('aria-selected', true)
             : tab.setAttribute('aria-selected', false));
    
    const panels = Array.from(panelContainer.children);
    panels.forEach(panel =>
        panel === targetPanel
            ? panel.removeAttribute('hidden')
            : panel.setAttribute('hidden', true));
    
    await loadContent(e.target.id);
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
                <p class="current">${timeframeData.current}${formatHrs(timeframeData.current)}</p>
                <p class="previous">${choosePreviousText(timeframeName)} - ${timeframeData.previous}${formatHrs(timeframeData.previous)}</p>
            </div>
        </div>`
    
    return li;
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

function formatHrs(number) {
    return number === 1 ? 'hr' : 'hrs';
}

async function loadContent(timeframe) {
    const targetPanel = document.getElementById(`panel-${timeframe}`);
    
    if (targetPanel.innerHTML !== '') {
        return;
    }

    const cardList = document.createElement('ul');
    cardList.classList.add('cards');
    targetPanel.appendChild(cardList);

    try {
        const data = await fetchData();

        if (!data || data === null) {
            console.error('Data is missing');
            return;
        }

        data.forEach(item => {
            if (item.timeframes && item.timeframes[timeframe]) {
                const cardItem = renderCard(item.title, item.timeframes[timeframe], timeframe);
                cardList.appendChild(cardItem);
        } else {
            console.warn(`Missing timeframe "${timeframe}" for item "${item.title}"`);
            }
        })
    } catch (error) {
        console.error('Failed to fetch data: ', error);
    }
}

loadContent('daily');

// Event listeners
tablist.addEventListener('click', switchTabs);