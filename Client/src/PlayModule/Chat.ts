import { currentGame, drawBoard, setCurrentGame, stompClient } from "../Connect";
import Swal from "sweetalert2";

const chatModeAll: HTMLInputElement = document.getElementById('chatModeAll') as HTMLInputElement;
const chatModePrivate: HTMLInputElement = document.getElementById('chatModePrivate') as HTMLInputElement;
const chatAllContent: HTMLElement = document.getElementById('chatAllContent') as HTMLElement;
const chatPrivateContent: HTMLElement = document.getElementById('chatPrivateContent') as HTMLElement;

// Thêm sự kiện onchange cho từng radiobutton
chatModeAll.addEventListener('change', function (this: HTMLInputElement) {
    if (this.checked) {
        chatAllContent.style.display = 'block';
        chatPrivateContent.style.display = 'none';
        // Gửi yêu cầu lấy tin nhắn cho chế độ "Chat Tổng" từ server (nếu cần)
    }
});

chatModePrivate.addEventListener('change', function (this: HTMLInputElement) {
    if (this.checked) {
        chatAllContent.style.display = 'none';
        chatPrivateContent.style.display = 'block';
        // Gửi yêu cầu lấy tin nhắn cho chế độ "Chat Riêng" từ server (nếu cần)
    }
});
document.getElementById("btnSendMessage")?.addEventListener('click', () => {
    console.log("btnSendMessage")
    if(localStorage.getItem('userID') == null){
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "error",
            title: "Đăng nhập để có thể chat!"
        }); 
    }else{
        sendChatToServer();
    }
    
})
function sendChatToServer(): Promise<string> {
    let messageInput: HTMLInputElement | null = document.getElementById("messageInput") as HTMLInputElement;
  
    if(messageInput != null){
        let inputValue = messageInput.value;
        const avaString: string | null = localStorage.getItem('ava');
        var avaNumber: number;
        if (avaString !== null) {
            // Chuyển đổi từ chuỗi sang số
            avaNumber = parseInt(avaString);
        }else{avaNumber = 0}
        if(chatModeAll.checked){
            return new Promise((resolve, reject) => {
                stompClient.publish({
                    destination: '/app/publicChat',
                    headers: {},
                    body: JSON.stringify({ idDUserSend: localStorage.getItem('userID'), chat: inputValue, ava: null }),
                });
                resolve("chatAll Success");
                MyChatContent(inputValue,avaNumber,true);
                if (messageInput) {
                    messageInput.value = ''; 
                }
            });
        }else{
            if(localStorage.getItem('iDUserReceive') == null){
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "error",
                    title: "Bạn chưa tham gia trận đấu. Không thể chat Riêng!"
                }); 
                return new Promise((resolve, reject) => {reject("fail");})
            }else{
                return new Promise((resolve, reject) => {
                    let idUserSend: string | null = localStorage.getItem('iDUserSend');
                    let idUserReceive: string | null = localStorage.getItem('iDUserReceive');
                    let idRoom: string | null = localStorage.getItem('iDRoom');
                    let idRoomUser: string | null = localStorage.getItem('idRoomUser');
                    const chat = inputValue;
                    let userSendTempPort: string | null = localStorage.getItem('userSendTempPort');
                    let userReceiveTempPort: string | null = localStorage.getItem('userReceiveTempPort');
                    stompClient.publish({
                        destination: '/app/chatRoom',
                        headers: {},
                        body: JSON.stringify({ idUserSend: idUserSend, idUserReceive: idUserReceive, idRoom: idRoom, idRoomUser: idRoomUser, chat: chat, userSendTempPort: userSendTempPort, userReceiveTempPort: userReceiveTempPort }),
                    });
                    resolve("chatAll Success");
                    MyChatContent(inputValue,avaNumber,false);
                    if (messageInput) {
                        messageInput.value = ''; 
                    }
                });
            }
        }
    }else{
        return new Promise((resolve, reject) => {reject("fail");})
    }
    
}
export function ChatContentFrom(idUserSend: string, senderName: string, senderAvatar: number, messageContent: string, chatMode: boolean) {
    if(idUserSend != localStorage.getItem('userID') || localStorage.getItem('userID') == null){
        const newMessageDiv = document.createElement('div');
        newMessageDiv.classList.add('d-flex', 'justify-content-between');

        // Tạo phần tử img cho avatar
        const avatarImg = document.createElement('img');
        if(senderAvatar == 1) avatarImg.src = './assets/ava01.png';
        else if(senderAvatar == 2) avatarImg.src = './assets/ava02.png';
        else if(senderAvatar == 3) avatarImg.src = './assets/ava03.png';
        else if(senderAvatar == 4) avatarImg.src = './assets/ava04.png';
        else if(senderAvatar == 5) avatarImg.src = './assets/ava05.png';
        else avatarImg.src = './assets/ava06.png';
        avatarImg.style.width = '35px';
        avatarImg.style.height = '35px';

        // Tạo phần tử div cho nội dung tin nhắn
        const messageContentDiv = document.createElement('div');
        messageContentDiv.classList.add('d-flex', 'flex-row', 'justify-content-start');

        // Tạo phần tử p cho tên người gửi
        const senderNameP = document.createElement('p');
        senderNameP.classList.add('small', 'mb-1');
        senderNameP.textContent = senderName;

        // Tạo phần tử p cho nội dung tin nhắn
        const messageP = document.createElement('p');
        messageP.classList.add('small', 'p-2', 'ms-3', 'mb-2', 'rounded-3');
        messageP.style.backgroundColor = '#f5f6f7';
        messageP.textContent = messageContent;

        // Gắn các phần tử con vào newMessageDiv và messageContentDiv
        newMessageDiv.appendChild(senderNameP);
        messageContentDiv.appendChild(avatarImg);
        messageContentDiv.appendChild(messageP);

        // Lấy đối tượng có id là "chatPrivateContent"
        // const chatPrivateContent = document.getElementById('chatPrivateContent');

        // Kiểm tra xem đối tượng có tồn tại không trước khi thêm vào
        if(chatMode){
            if (chatAllContent) {
                chatAllContent.appendChild(newMessageDiv);
                chatAllContent.appendChild(messageContentDiv);
            }
        }
        else{
            if (chatPrivateContent) {
                chatPrivateContent.appendChild(newMessageDiv);
                chatPrivateContent.appendChild(messageContentDiv);
            }
        }
    }
}
function MyChatContent(messageContent: string, senderAvatar: number, chatMode: boolean) {
    // Tạo một phần tử div mới
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('d-flex', 'flex-row', 'justify-content-end', 'pt-1');

    // Tạo phần tử p cho nội dung tin nhắn
    const messageP = document.createElement('p');
    messageP.classList.add('small', 'p-2', 'me-3', 'mb-2', 'text-white', 'rounded-3', 'bg-warning');
    messageP.textContent = messageContent;

    // Tạo phần tử img cho avatar
    const avatarImg = document.createElement('img');
    if(senderAvatar == 1) avatarImg.src = './assets/ava01.png';
    else if(senderAvatar == 2) avatarImg.src = './assets/ava02.png';
    else if(senderAvatar == 3) avatarImg.src = './assets/ava03.png';
    else if(senderAvatar == 4) avatarImg.src = './assets/ava04.png';
    else if(senderAvatar == 5) avatarImg.src = './assets/ava05.png';
    else avatarImg.src = './assets/ava06.png';
    avatarImg.style.width = '35px';
    avatarImg.style.height = '35px';

    newMessageDiv.appendChild(messageP);
    newMessageDiv.appendChild(avatarImg);

    if(chatMode){
        if (chatAllContent) {
            chatAllContent.appendChild(newMessageDiv);
        }
    }else{
        if (chatPrivateContent) {
            chatPrivateContent.appendChild(newMessageDiv);
        }
    }
    
}