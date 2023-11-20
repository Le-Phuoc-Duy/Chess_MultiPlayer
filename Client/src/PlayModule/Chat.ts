document.getElementById("btnSendMessage")?.addEventListener('click',() =>{
    console.log("btnSendMessage")
    ChatContentFrom('John Doe', './assets/ava02.png', 'Hello, fuck you bitch?')
    MyChatContent('Hello, fuck you bitch?','./assets/ava02.png')
})

function ChatContentFrom(senderName: string, senderAvatar: string, messageContent: string) {
    // Tạo một phần tử div mới
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('d-flex', 'justify-content-between');

    // Tạo phần tử img cho avatar
    const avatarImg = document.createElement('img');
    avatarImg.src = senderAvatar;
    avatarImg.style.width = '45px';
    avatarImg.style.height = '100%';

    // Tạo phần tử div cho nội dung tin nhắn
    const messageContentDiv = document.createElement('div');
    messageContentDiv.classList.add('d-flex', 'flex-row', 'justify-content-start');

    // Tạo phần tử p cho tên người gửi
    const senderNameP = document.createElement('p');
    senderNameP.classList.add('small', 'mb-1');
    senderNameP.textContent = senderName;

    // Tạo phần tử p cho nội dung tin nhắn
    const messageP = document.createElement('p');
    messageP.classList.add('small', 'p-2', 'ms-3', 'mb-3', 'rounded-3');
    messageP.style.backgroundColor = '#f5f6f7';
    messageP.textContent = messageContent;

    // Gắn các phần tử con vào newMessageDiv và messageContentDiv
    newMessageDiv.appendChild(senderNameP);
    messageContentDiv.appendChild(avatarImg);
    messageContentDiv.appendChild(messageP);

    // Lấy đối tượng có id là "chatPrivateContent"
    const chatPrivateContent = document.getElementById('chatPrivateContent');

    // Kiểm tra xem đối tượng có tồn tại không trước khi thêm vào
    if (chatPrivateContent) {
        chatPrivateContent.appendChild(newMessageDiv);
        chatPrivateContent.appendChild(messageContentDiv);
    }
}
function MyChatContent(messageContent: string, senderAvatar: string) {
    // Tạo một phần tử div mới
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('d-flex', 'flex-row', 'justify-content-end', 'pt-1');

    // Tạo phần tử p cho nội dung tin nhắn
    const messageP = document.createElement('p');
    messageP.classList.add('small', 'p-2', 'me-3', 'mb-3', 'text-white', 'rounded-3', 'bg-warning');
    messageP.textContent = messageContent;

    // Tạo phần tử img cho avatar
    const avatarImg = document.createElement('img');
    avatarImg.src = senderAvatar;
    avatarImg.style.width = '45px';
    avatarImg.style.height = '100%';

    newMessageDiv.appendChild(messageP);
    newMessageDiv.appendChild(avatarImg);

    const chatPrivateContent = document.getElementById('chatPrivateContent');

    if (chatPrivateContent) {
        chatPrivateContent.appendChild(newMessageDiv);
    }
}