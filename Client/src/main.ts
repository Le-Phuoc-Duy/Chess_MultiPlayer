import Swal from "sweetalert2";	
import type { Board } from "./Board";	
import { Color } from "./Enum";	
import { Game } from "./Game";	
import { Self, Opponent } from "./Player";	
import { Client, StompSubscription } from '@stomp/stompjs';	
import { RoomJoinedResponse } from './RoomJoinedResponse';
import { drawBoard, } from "./PlayChess";

// window.onload = function(){
//     game.initialize(p1,p2)
//     init(game.board)
// }

// export var p1: any
// export var p2: any

const socket = new SockJS('http://localhost:8888/ws'); 	
const stompClient = new Client({	
    webSocketFactory: () => socket,	
    connectHeaders: {	
    tempPort: window.location.port,	
    },	
    debug: (msg) => console.log(msg),	
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
            body: JSON.stringify({ username: name, password: pass , tempPort: window.location.port}),	
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
function createRoom(mode: Int32Array): Promise<string> {	
    return new Promise((resolve, reject) => {	
        stompClient.publish({	
            destination: '/app/createRoom',	
            headers: {},	
            body: JSON.stringify({userCreateId: localStorage.getItem('userID'), mode: mode ,tempPort: window.location.port}),	
        });	

        const subscription: StompSubscription = stompClient.subscribe('/user/queue/roomCreated', (message) => {	
            const body = JSON.parse(message.body);	
            // console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);	
            console.log('waitingRoomId: '+ body.waitingRoomId +'\nuserCreateId: '+ body.userCreateId+ '\nsessionUserCreateId: '+body.sessionUserCreateId +'\nmode: '+body.mode );
            resolve(body.waitingRoomId);	
        });	

    });	
}	
function joinRoom(idRoom: String): Promise<RoomJoinedResponse> {	
    var userID = localStorage.getItem('userID');	
    return new Promise((resolve, reject) => {	
        stompClient.publish({	
            destination: '/app/joinRoom',	
            body: JSON.stringify({ waitingRoomId: idRoom , idUserJoin: userID, tempPort: window.location.port}),	
        });	

        const subscription: StompSubscription = stompClient.subscribe('/user/queue/roomJoined', (message) => {	
            const body = JSON.parse(message.body);	
            // console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);	
            console.log('iDUserSend: '+ body.iDUserSend +'\niDUserReceive: '+ body.iDUserReceive+ '\niDRoom: '+body.iDRoom +'\nidRoomUser: '+body.idRoomUser+ '\nchessMove: '+body.chessMove +'\nboard: '+body.board );	
            resolve(body);	
        });	
    });	
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
                    toggleDisplay();	
                });	
            }	
            })	
          .catch((error) => {	
            console.log(error)	
              Swal.fire({	
                  icon: "error",	
                  text: "Đăng nhập thất bại",	
              })	
              .then(() => {	
              });	
          });	
    }	
})	
document.getElementById("createRoomButton")?.addEventListener("click",async () => {	
    const { value: formValues } = await Swal.fire({	
        title: 'Tạo phòng chơi',	
        html:	
            '<input id="swal-input1" class="swal2-input" placeholder="Chọn chế độ">',	
        focusConfirm: false,	
        preConfirm: () => {	
            //   let inputUsername = document.getElementById('swal-input1')! as HTMLInputElement;	
            let mode = (document.getElementById('swal-input1')! as HTMLInputElement).value	

            return [mode];	
        }	
    })	
    if (formValues) {	
        // send(formValues[0],formValues[1]);	
        createRoom(formValues[0])	
          .then((result) => {	
            if (result) {	
                Swal.fire({	
                    icon: 'success',	
                    title: 'Tạo phòng thành công!',	
                    text: `ID phòng của bạn là: ${result.toString()}`,	
                    timer: 3000,	
                })	
                const subscription2: StompSubscription = stompClient.subscribe('/user/queue/roomJoined', (message) => {	
                    const body = JSON.parse(message.body);	
                    // console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);	
                    console.log('iDUserSend: '+ body.iDUserSend +'\niDUserReceive: '+ body.iDUserReceive+ '\niDRoom: '+body.iDRoom +'\nidRoomUser: '+body.idRoomUser+ '\nchessMove: '+body.chessMove +'\nboard: '+body.board +'\ncolor: '+body.color );	
                    Swal.fire({	
                        icon: 'success',	
                        title: 'Đã có người chơi khác tham gia, Bắt đầu trận đấu',	
                        timer: 5000,	
                    })  
                    if(body.color){
                        console.log("self la white, opp la black")
                        var p1ByCreate: Self = new Self(Color.WHITE) 
                        var p2ByCreate: Opponent = new Opponent(Color.BLACK) 
                    }else{
                        console.log("self la black, opp la white")
                        var p1ByCreate: Self = new Self(Color.BLACK) 
                        var p2ByCreate: Opponent = new Opponent(Color.WHITE) 
                    }
                    var gameByCreate: Game = new Game()
                    gameByCreate.initialize(p1ByCreate,p2ByCreate)
                    gameByCreate.setFullCoordinates(body.board); 
                    drawBoard(gameByCreate);
                });	
            }	
            })	
          .catch((error) => {	
              Swal.fire({	
                  icon: "error",	
                  text: "Tạo phòng thất bại",	
              }).then(() => {	
              });	
          });	
    }	

})	
document.getElementById("joinRoomButton")?.addEventListener("click",async () => {	
    const { value: formValues } = await Swal.fire({	
        title: 'Vào phòng chơi',	
        html:	
            '<input id="swal-input1" class="swal2-input" placeholder="Nhập ID phòng">',	
        focusConfirm: false,	
        preConfirm: () => {	
            //   let inputUsername = document.getElementById('swal-input1')! as HTMLInputElement;	
            let idRoom = (document.getElementById('swal-input1')! as HTMLInputElement).value	

            return [idRoom];	
        }	
    })	
    if (formValues) {	
        // send(formValues[0],formValues[1]);	
        joinRoom(formValues[0])	
          .then((result) => {	
            if (result) {
                console.log('iDUserSend: '+ result.iDUserSend +'\niDUserReceive: '+ result.iDUserReceive+ '\niDRoom: '+result.iDRoom +'\nidRoomUser: '+result.idRoomUser+ '\nchessMove: '+result.chessMove +'\nboard: '+result.board +'\ncolor: '+result.color );	
                if(result.color){
                    console.log("self la white, opp la black")
                    var p1ByJoin: Self = new Self(Color.WHITE) 
                    var p2ByJoin: Opponent = new Opponent(Color.BLACK) 
                }else{
                    console.log("self la black, opp la white")
                    var p1ByJoin: Self = new Self(Color.BLACK) 
                    var p2ByJoin: Opponent = new Opponent(Color.WHITE) 
                }
                var gameByJoin: Game = new Game()
                gameByJoin.initialize(p1ByJoin,p2ByJoin)
                gameByJoin.setFullCoordinates(result.board); 
                drawBoard(gameByJoin); 
                Swal.fire({	
                    icon: 'success',	
                    title: 'Vào phòng thành công!',	
                    text: `${result.toString()}`,	
                    timer: 3000,	
                }).then(() => {	
                    // toggleDisplay();	
                });	
            }	
            })	
          .catch((error) => {	
              Swal.fire({	
                  icon: "error",	
                  text: "Vào phòng thất bại",	
              }).then(() => {	
              });	
          });	
    }	

})	
// Lấy các element từ DOM	
const loginButton = document.getElementById('loginButton');	
const registerButton = document.getElementById('registerButton');	
const createRoomButton = document.getElementById('createRoomButton');	
const joinRoomButton = document.getElementById('joinRoomButton');	

// Hàm chuyển đổi display	
function toggleDisplay() {	

    if(loginButton.style.display == 'block'){	
        loginButton.style.display = 'none';	
        registerButton.style.display = 'none';	
        createRoomButton.style.display = 'block';	
        joinRoomButton.style.display = 'block';	

    }else{	
        loginButton.style.display = 'block';	
        registerButton.style.display = 'block';	
        createRoomButton.style.display = 'none';	
        joinRoomButton.style.display = 'none';	
    }	
}	
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

const hostname = window.location.hostname;	
const port = window.location.port;	
console.log("port: " + port);	
console.log("hostname: " + hostname);

