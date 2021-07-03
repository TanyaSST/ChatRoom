const chatForm = document.querySelector('#chat');
const wrapperMessage = document.querySelector('.wrapper-message');
const roomName = document.querySelector('#room-name');
const usersList = document.querySelector('#username');

// Username und Room von URL nehmen

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io.connect();
// Hinzufügen username und room
socket.emit('joinRoom', { username, room });

socket.on('message', message => {
    outputMesage(message);

    //Fokus behalten
    wrapperMessage.scrollTop = wrapperMessage.scrollHeight;
})

socket.on('roomUser', ({ room, users }) => {
    outputRooms(room);
    outputUsers(users);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Selektieren input-field und nehmen das Value
    let msg = e.target.elements[0].value;
    if (!msg) {
        return false;
    }
    //Senden msg an dem Server
    socket.emit('chatMessage', msg.trim());

    e.target.elements[0].value = '';
    e.target.elements[0].focus();
})


//DOM-Manipulation und erzeugen vom Objekt mit der Nachricht
function formatMonth(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let [day, month, year] = date.split('-');
    ;
    let result = monthNames[Number(month) - 1];
    let dateAsstring = `${day}. ${result} ${year}`;
    return dateAsstring;
}

function outputMesage(message) {
    let div = document.createElement('div');
    div.classList.add('message');

    let [date, time] = String(message.time).split(' ');

    let pDate = document.createElement('p');
    pDate.classList.add('date');
    pDate.textContent = `${formatMonth(date)} `;

    let span = document.createElement('span');
    span.textContent = `- ${time} Uhr`;
    pDate.appendChild(span);

    let userText = document.createElement('div');
    userText.classList.add('user-text');
    let pName = document.createElement('p');
    pName.classList.add('text-name')
    pName.textContent = message.username;

    let pMsg = document.createElement('p');
    pMsg.classList.add('text');
    pMsg.textContent = message.textMessage;

    div.appendChild(pDate);
    userText.appendChild(pName);
    userText.appendChild(pMsg);
    div.appendChild(userText);
    wrapperMessage.appendChild(div)
}

function outputRooms(room) {
    roomName.textContent = room;
}
function outputUsers(users) {
    usersList.innerHTML='';
    Array.from(users).forEach(user => {
            let currUser = document.createElement('li');
                    currUser.textContent = user.username;
                    usersList.appendChild(currUser);
   
    });
}
