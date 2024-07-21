
        const events = [
    { event: "Invention of the Wheel", date: 200, image: "img1.png", description: "The invention of the wheel, a key technological advancement." },
    { event: "Discovery of Fire", date: 200, image: "img1.png", description: "The discovery and control of fire." },
    { event: "First Manned Moon Landing", date: 200, image: "img1.png", description: "Neil Armstrong and Buzz Aldrin land on the moon." },
    { event: "Fall of the Berlin Wall", date: 200, image: "img1.png", description: "The fall of the Berlin Wall marking the end of the Cold War." },
    { event: "Start of World War I", date: 200, image: "img1.png", description: "The beginning of World War I." },
    { event: "Printing Press Invented", date:200, image: "img1.png", description: "Johannes Gutenberg invents the printing press." },
    { event: "Signing of the Declaration of Independence", date: 200, image: "img1.png", description: "The United States Declaration of Independence is signed." },
    { event: "French Revolution Begins", date:200, image: "img1.png", description: "The French Revolution starts." },
    { event: "First Flight by the Wright Brothers", date: 200, image: "img1.png", description: "The Wright brothers make their first successful flight." },
    { event: "Introduction of the Internet", date: 200, image: "img1.png", description: "The ARPANET adopts TCP/IP protocol, marking the beginning of the internet." },

    { event: "Invention of the Wheel", date: 200, image: "img1.png", description: "The invention of the wheel, a key technological advancement." },
    { event: "Discovery of Fire", date: 200, image: "img1.png", description: "The discovery and control of fire." },
    { event: "First Manned Moon Landing", date: 200, image: "img1.png", description: "Neil Armstrong and Buzz Aldrin land on the moon." },
    { event: "Fall of the Berlin Wall", date: 200, image: "img1.png", description: "The fall of the Berlin Wall marking the end of the Cold War." },
    { event: "Start of World War I", date: 200, image: "img1.png", description: "The beginning of World War I." },
    { event: "Printing Press Invented", date:200, image: "img1.png", description: "Johannes Gutenberg invents the printing press." },
    { event: "Signing of the Declaration of Independence", date: 200, image: "img1.png", description: "The United States Declaration of Independence is signed." },
    { event: "French Revolution Begins", date:200, image: "img1.png", description: "The French Revolution starts." },
    { event: "First Flight by the Wright Brothers", date: 200, image: "img1.png", description: "The Wright brothers make their first successful flight." },
    { event: "Introduction of the Internet", date: 200, image: "img1.png", description: "The ARPANET adopts TCP/IP protocol, marking the beginning of the internet." },

];

let mistakes = 0;
let currentStreak = 0;
let longestStreak = 0;
let usedIndices = new Set();

const timeline = document.getElementById('timeline');
const currentCardContainer = document.getElementById('current-card-container');
const nextCardButton = document.getElementById('next-card-button');
const message = document.getElementById('message');

nextCardButton.addEventListener('click', loadNextCard);

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initializeGame() {
    mistakes = 0;
    currentStreak = 0;
    longestStreak = 0;
    usedIndices.clear();
    message.textContent = '';

    timeline.innerHTML = '';
    currentCardContainer.innerHTML = '';
    nextCardButton.disabled = true;

    shuffle(events);

    const baseEvent = events[0];
    usedIndices.add(0);
    const baseCard = createCard(baseEvent);
    baseCard.querySelector('.date').style.display = 'block';
    baseCard.classList.add('correct');
    baseCard.draggable = false;
    timeline.appendChild(baseCard);

    loadNextCard();
}

function createCard(event) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.innerHTML = `
        <div class="name">${event.event}</div>
        <img src="${event.image}" alt="${event.event}" style="width: 100px;">
        <div class="description">${event.description}</div>
        <div class="date">${event.date}</div>
    `;
    card.dataset.date = event.date;
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
    return card;
}

function loadNextCard() {
    if (currentCardContainer.children.length === 0) {
        currentCardContainer.innerHTML = '';

        let nextEventIndex;
        do {
            nextEventIndex = Math.floor(Math.random() * events.length);
        } while (usedIndices.has(nextEventIndex) && usedIndices.size < events.length);

        if (usedIndices.size < events.length) {
            usedIndices.add(nextEventIndex);
            const nextEvent = events[nextEventIndex];
            const nextCard = createCard(nextEvent);
            currentCardContainer.appendChild(nextCard);
            nextCardButton.disabled = false;
        } else {
            nextCardButton.disabled = true;
        }
    }
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.date);
    e.target.classList.add('dragging');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

timeline.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(timeline, e.clientX);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        timeline.appendChild(draggable);
    } else {
        timeline.insertBefore(draggable, afterElement);
    }
});

timeline.addEventListener('drop', e => {
    const date = e.dataTransfer.getData('text/plain');
    const card = document.querySelector(`.card[data-date='${date}']`);
    card.querySelector('.date').style.display = 'block';
    card.draggable = false;

     if (currentCardContainer.children.length === 0 && timeline.children.length === events.length) {
            message.textContent = `Congratulations! You've placed all cards correctly.`;
            nextCardButton.disabled = true;
        } else {
            if (currentCardContainer.children.length === 0) {
                nextCardButton.disabled = false;
            }
        }
      if (checkOrder()) {
        card.classList.add('correct');
        currentCardContainer.removeChild(card);
    } else {
        card.classList.add('incorrect');
        gameOver();
    }
});

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkOrder() {
    const timelineCards = Array.from(timeline.children);
    for (let i = 0; i < timelineCards.length - 1; i++) {
        const date1 = parseInt(timelineCards[i].dataset.date);
        const date2 = parseInt(timelineCards[i + 1].dataset.date);
        if (date1 > date2) {
            return false;
        }
    }
    currentStreak++;
    if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
    }
    return true;
}


function gameOver() {
        document.getElementById("current-card-container").style.display="none";
        document.getElementById("next-card-button").style.display="none";
        document.getElementById("timeline").style.display="none";
    if (timeline.children.length === events.length && checkOrder()) {
        message.textContent = `Congratulations! You've placed all cards correctly.`;

    } else {
        message.textContent = `Game Over! Longest streak: ${longestStreak}`;
        
    }
    timeline.innerHTML = '';
    currentCardContainer.innerHTML = '';
    nextCardButton.disabled = true;
}

initializeGame();
