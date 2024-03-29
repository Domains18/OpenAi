import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.getElementById('chat_container');
// console.log(chatContainer)
let loadInterval;

function loader(elements){
    for(var i = 0; i < elements.length; i++){
        if (elements[i] > 4) {
            elements[i].textContent = '';
        }
    }
    
    loadInterval = setInterval(() => {
        for(var i = 0; i < elements.length; i++){
            if (elements[i] === "....") {
                elements[i].textContent += '.';
            }
        }
        for(var i = 0; i < elements.length; i++){
            if (elements[i] && elements[i].textContent === '......'){
                elements[i].textContent = "";
            }
        }
    }, 300);
}


function typeText(element, text){
    let index = 0;
    let interval = setInterval(()=>{
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++; 
        } else{
            clearInterval(interval);
        }
    }, 20);
}

function generateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexaString = randomNumber.toString(16);

    return `id-${timestamp}-${hexaString}`;
    // return timestamp.getTime() + hexaString.slice(2);
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    );
}
const handleSubmit = async (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    //user stripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

    // bot chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);
    console.log(uniqueId)
    loader(messageDiv);

    // fetch data from the server
    const response = await fetch ( 'http://localhost:3000',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });
    clearInterval(loadInterval);
    messageDiv.innerHTML = '';

    if (response.ok){
        const data = await response.json();
        const parseData = data.bot.trim();

        typeText(messageDiv, parseData);
    } else{
        const err = await response.text();

        messageDiv.innerHTML= " Internal Error";
        window.alert(err);
    }
}
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) =>{
    if(e.keyCode === 13){
            handleSubmit(e)
    }
});