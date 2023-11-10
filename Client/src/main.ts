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
    init(game.board)
}
const socket = new SockJS('http://localhost:8888/ws'); 
const stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
    login: 'your_username',
    password: 'your_password',
    },
    debug: (msg) => console.log(msg),
    // reconnectDelay: 5000,
    // heartbeatIncoming: 4000,
    // heartbeatOutgoing: 4000,
});

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    // Thực hiện các xử lý khác tùy ý khi kết nối thất bại
};
stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

// Bắt sự kiện khi kết nối thành công
stompClient.onConnect = (frame) => {

};
// Kết nối tới server
stompClient.activate();
// Bắt sự kiện khi mất kết nối
stompClient.onDisconnect = (frame) => {
    // console.log('Disconnected from WebSocket server');
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

};
function send(name: string, pass: string): Promise<string> {
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/login',
            headers: {},
            body: JSON.stringify({ username: name, password: pass }),
        });

        const subscription: StompSubscription = stompClient.subscribe('/user/queue/loginStatus', (message) => {
            const body = JSON.parse(message.body);
            console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);
            if (body.message === "Đăng nhập thành công") {
                localStorage.setItem('userID', body.userID);
                resolve('success');
            } else {
                reject('failure');
            }
        });
    });
}
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
    // console.log(r + c)
    // connect()
    if(selected){
        // console.log("secleted")
        if(game.playerMove(p1,startX,startY,r,c)){
            init(game.board)
            // game.setFullCoordinates(startX,startY,r,c)
            // console.log("canmove"+ startX +startY +r + c)
            // send()
        }else{
            // console.log("cantmove"+ startX +startY + +r + c)
        }
        selected = false
        startX = -1
        startY = -1
        endX = -1
        endY = -1
    }else{
        // console.log("!secleted")
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
        // send(formValues[0],formValues[1]);
        send(formValues[0], formValues[1])
          .then((result) => {
            if (result === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                }).then(() => {
                });
            }
            })
          .catch((error) => {
              Swal.fire({
                  icon: "error",
                  text: "Đăng nhập thất bại",
              }).then(() => {
              });
          });
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
            '      <input type="radio" id="img1" name="image" value="img1" style="display: none;">' +
            '      <label class="ava" for="img1"><img src="./assets/ava01.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img2" name="image" value="img2" style="display: none;">' +
            '      <label class="ava" for="img2"><img src="./assets/ava02.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img3" name="image" value="img3" style="display: none;">' +
            '      <label class="ava" for="img3"><img src="./assets/ava03.png" style="width: 90%;"></label>' +
            '    </div>' +
            '  </div>' +
            '  <div class="row">' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img4" name="image" value="img4" style="display: none;">' +
            '      <label class="ava" for="img4"><img src="./assets/ava04.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img5" name="image" value="img5" style="display: none;">' +
            '      <label class="ava" for="img5"><img src="./assets/ava05.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input type="radio" id="img6" name="image" value="img6" style="display: none;">' +
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
        // console.log("username: " + formValues[0] + ", password: " + formValues[1] + ", avatar: " + formValues[2])          // Swal.fire(`Tên người dùng: ${formValues[0]}<br>Mật khẩu: ${formValues[1]}`)
    }
})