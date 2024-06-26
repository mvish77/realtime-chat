const socket = io('http://localhost:8000')
const sendBtn = document.getElementById('sendBtn')
const msgContainer = document.querySelector('.msgBox')

let joinAudio = new Audio('join.mp3')
let msgAudio = new Audio('msg.mp3')
let leaveAudio = new Audio('left.mp3')


document.getElementById('submitName').addEventListener('click', ()=>{
    let userName = document.getElementById('userName').value
    if(userName != '' && userName.length <=30){
        document.getElementById('popupBox').style.display = 'none'
        document.getElementById('nameTag').innerText = `${userName} ~Online`
        socket.emit('new-user-joined',userName)
        socket.on('user-joined',(name)=>{
            appendUserJoin(name)
        })
        socket.on('all-users',(users)=>{
            showAllUsers(users)
        })

        ActionEnter()
    }else{
        alert("Enter a valid name")
    }
})

function showAllUsers(users){
    let user = '';
    for (i in users){
        user+= (users[i]+', ')
    }
    document.getElementById('allmembers').innerText =user
}


const appendUserJoin = (msg)=>{
    const html = document.createElement('div')
    html.classList.add('message')
    html.classList.add('center')
    html.innerText = msg +" Joined"
    msgContainer.append(html)
    joinAudio.play()
    scrollToBottom()
}

const appendUserLeave = (msg)=>{
    const html = document.createElement('div')
    html.classList.add('message')
    html.classList.add('center')
    html.innerText = msg +" Left"
    msgContainer.append(html)
    leaveAudio.play()
    scrollToBottom()
}


const appendLeftMsg =(name,msg)=>{
    let html = `
    <div class="message left">
        <div class="textbox">
            ${msg}
        </div>
        <div class="username">~ ${name}</div>
    </div>
    `
    msgContainer.innerHTML += html
    msgAudio.play()
    scrollToBottom()
}

const appendRightMsg = (msg)=>{
    let html = `
    <div class="message right">
        <div class="textbox">
            ${msg}
        </div>
        <div class="username">~ You</div>
    </div>
    `
    msgContainer.innerHTML += html;
    scrollToBottom()

}

document.getElementById('sendBtn').addEventListener('click',(e)=>{
    const inputText = document.getElementById('inputText').value
    if(inputText != ''){
        socket.emit('send',inputText)
        appendRightMsg(inputText)
        document.getElementById('inputText').value = ''
    }
})


function submitInput(){
    const inputText = document.getElementById('inputText').value
    if(inputText != ''){
        socket.emit('send',inputText)
        appendRightMsg(inputText)
        document.getElementById('inputText').value = ''
    }
    
}

socket.on('receive', data=>{
    appendLeftMsg(data.name,data.message)
})

socket.on('leave', name=>{
    appendUserLeave(name)
})


function ActionEnter(){
    document.addEventListener('keypress',(e)=>{
        if(e.keyCode == 13){
            submitInput()
        }
    })
}

function scrollToBottom() {
    var msgBox = document.getElementsByClassName("msgBox")[0];
    msgBox.scrollTop = msgBox.scrollHeight;
}