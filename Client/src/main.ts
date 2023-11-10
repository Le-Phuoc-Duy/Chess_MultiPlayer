import Swal from "sweetalert2";
import type { Board } from "./Board";
import { Color } from "./Enum";
import { Game } from "./Game";
import { Self, Opponent } from "./Player";
import { Client, StompSubscription } from '@stomp/stompjs';

var selected: Boolean= false
var startX: number = -1
var endX: number = -1
var startY: number = -1
var endY: number = -1
var p1: Self = new Self(Color.WHITE)            //Chua co socket => Tam thoi setting ban than la trang
var p2: Opponent = new Opponent(Color.BLACK)    //Chua co socket => Tam thoi setting ban than la den
var game: Game = new Game()

window.onload = function(){

    game.initialize(p1,p2)
    console.log("tao game thanh cong")
    init(game.board)
}
const socket = new SockJS('http://localhost:8888/ws');   
const stompClient = new Client({
    webSocketFactory: () => socket,
    // connectHeaders: {
    //     login: 'user',
    //     passcode: 'password',
    // },

    debug: (msg) => console.log(msg),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});
socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Thực hiện các xử lý khác tùy ý khi kết nối thất bại
};


// Bắt sự kiện khi kết nối thành công
stompClient.onConnect = (frame) => {
    console.log('Connected to WebSocket server');
    console.log("gui thang nay: " +JSON.stringify({username: "duy le",
    password:"djdj12"}))
    // Đăng ký để nhận tin nhắn từ /queue/connect
    const subscription: StompSubscription = stompClient.subscribe('/user/topic/public', (message) => {
        const body = JSON.parse(message.body);
        console.log('Received message:', body.username);
        console.log('Received message:', body.password);
        console.log("nhan duoc: " + body.username + body.password)
        // console.log(message)
    });  
    const subscription2: StompSubscription = stompClient.subscribe('/user/queue/loginStatus', (message) => {
        // const body = JSON.parse(message.body);
        // console.log('Tuky:', JSON.parse(message.body).content); 
        // console.log(message)
        const body2 = JSON.parse(message.body);
        console.log('Received message:', body2.username);
        console.log('Received message:', body2.password);
        console.log("nhan duoc: " + body2.username + body2.password)
    });  
}; 
function send(name: string, pass: string){
    stompClient.publish({
        destination: '/app/login', // URL of the Message Mapping on the server
        headers: {}, // Any additional headers you want to send
        body: JSON.stringify({ username: name, password: pass }), // Data to be sent, can be customized as needed
    });
}
// Kết nối tới server
stompClient.activate();
// Bắt sự kiện khi mất kết nối
stompClient.onDisconnect = (frame) => {
    console.log('Disconnected from WebSocket server');
};
// Handle lỗi
stompClient.onStompError = (frame) => {
    console.error('WebSocket error:', frame);

    // Hiển thị chi tiết lỗi
    if (frame.headers) {
        console.error('Error message:', frame.headers.message);
        console.error('Error details:', frame.headers['message-details']);
    } else {
        console.error('An error occurred. Please check your connection settings.');
    }

    // Thông báo lỗi đến người dùng hoặc thực hiện các xử lý khác ở đây
    console.error('WebSocket connection failed. Please check your connection settings.');
};
function init(board: Board) {
    //i row, j col
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let coordinate: string = i.toString()+j.toString()
            let divPiece = document.getElementById(coordinate)
            if(divPiece){
                divPiece.addEventListener("click",() => ClickPiece(i,j))
                let imgPiece = document.getElementById("i" + coordinate)  as HTMLImageElement
                if(board.getBox(i,j).piece?.image)
                    imgPiece.src = board.getBox(i,j).piece!.image 
                else if(imgPiece){
                    imgPiece.src = ""
                }  
            }
        }
    }
}
//Chi ap dung cho self, khong ap dung cho opponent
function ClickPiece(r: number, c: number){
    console.log(r + c)
    // connect()
    if(selected){
        console.log("secleted") 
        if(game.playerMove(p1,startX,startY,r,c)){
            init(game.board)
            // game.setFullCoordinates(startX,startY,r,c)
            console.log("canmove"+ startX +startY +r + c)
            // send()
        }else{
            console.log("cantmove"+ startX +startY + +r + c)
        }
        selected = false
        startX = -1
        startY = -1
        endX = -1
        endY = -1
    }else{
        console.log("!secleted")
        selected = true
        startX = r //parseInt(coordinates.charAt(0))
        startY = c //parseInt(coordinates.charAt(1)) 
    }
}  
document.getElementById("loginButton")?.addEventListener("click",async () => {
    const { value: formValues } = await Swal.fire({
        title: 'ĐĂNG NHẬP',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Tên người dùng">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Mật khẩu" type="password">',
        focusConfirm: false,
        preConfirm: () => {
            //   let inputUsername = document.getElementById('swal-input1')! as HTMLInputElement;
            let username = (document.getElementById('swal-input1')! as HTMLInputElement).value
            let password = (document.getElementById('swal-input2')! as HTMLInputElement).value //document.getElementById('swal-input2')!.value;
            if (!username && !password) {
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng và mật khẩu');
            } else if (!password){
                Swal.showValidationMessage('Vui lòng không để trống mật khẩu');
            } else if (!username){
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng');
            } else if (password.length < 5) {
                Swal.showValidationMessage('Mật khẩu phải có ít nhất 5 ký tự.');
            } else {
                return [username, password];
            }
        }
    })
    if (formValues) {
        send(formValues[0],formValues[1])
        console.log("username" + formValues[0] +"password" + formValues[1] )
        // Swal.fire(`Tên người dùng: ${formValues[0]}<br>Mật khẩu: ${formValues[1]}`)
    }
})
document.getElementById("registerButton")?.addEventListener("click",async () => {
    const { value: formValues } = await Swal.fire({
        title: 'ĐĂNG KÝ',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Tên người dùng">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Mật khẩu" type="password">' +
            '<div class="container">' +
            '  <div class="row">' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img1" name="image" value="img1" style="display: none;">' +
            '      <label class="ava" for="img1"><img src="./assets/ava01.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img2" name="image" value="img2" style="display: none;">' +
            '      <label class="ava" for="img2"><img src="./assets/ava02.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img3" name="image" value="img3" style="display: none;">' +
            '      <label class="ava" for="img3"><img src="./assets/ava03.png" style="width: 90%;"></label>' +
            '    </div>' +
            '  </div>' +
            '  <div class="row">' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img4" name="image" value="img4" style="display: none;">' +
            '      <label class="ava" for="img4"><img src="./assets/ava04.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img5" name="image" value="img5" style="display: none;">' +
            '      <label class="ava" for="img5"><img src="./assets/ava05.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img6" name="image" value="img6" style="display: none;">' +
            '      <label class="ava" for="img6"><img src="./assets/ava06.png" style="width: 90%;"></label>' +
            '    </div>' +
            '  </div>' +
            '</div>',

        focusConfirm: false,
        preConfirm: () => {
            //   let inputUsername = document.getElementById('swal-input1')! as HTMLInputElement;
            let username = (document.getElementById('swal-input1')! as HTMLInputElement).value
            let password = (document.getElementById('swal-input2')! as HTMLInputElement).value
            let avatar = (document.querySelector('input[name="image"]:checked') as HTMLInputElement).value;
            if (!username && !password) {
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng và mật khẩu');
            } else if (!password){
                Swal.showValidationMessage('Vui lòng không để trống mật khẩu');
            } else if (!username){
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng');
            } else if (password.length < 5) {
                Swal.showValidationMessage('Mật khẩu phải có ít nhất 5 ký tự.');
            } else {
                return [username, password, avatar];
            }
        }
    })
    if (formValues) {
        console.log("username: " + formValues[0] + ", password: " + formValues[1] + ", avatar: " + formValues[2])          // Swal.fire(`Tên người dùng: ${formValues[0]}<br>Mật khẩu: ${formValues[1]}`)
    }
}) 
document.getElementById("playWithFriend")?.addEventListener("click",async () => {
    const inputOptions = new Promise((resolve) => {
        resolve({
            "joinRoom": "Phòng có sẵn",
            "createRoom": "Tạo phòng"
        }); 
      });
    const { value: option } = await Swal.fire({
        title: "Chơi với bạn",
        input: "radio",
        inputOptions,
        inputValidator: (value) => {
          if (!value) {
            return "Nhập lựa chọn!";
        }
        }
      });
      if (option) {
        if(option === "joinRoom"){
            const { value: idRoom } = await Swal.fire({
                input: "text",
                title: "Mã phòng",
                inputPlaceholder: "Nhập mã phòng",
                inputValidator: (value) => {
                    if (!value) {
                      return "Nhập mã phòng!";
                }
            }
            });
            if (idRoom) {
                Swal.fire(`Entered URL: ${idRoom}`);
            } 
        }
        if(option === "createRoom"){
            Swal.fire({ html: `You selected: option === "createRoom"` });

        }
      }
}) 