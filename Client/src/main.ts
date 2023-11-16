import Swal from "sweetalert2";
import type { Board } from "./Board";
import { Color } from "./Enum";
import { Game } from "./Game";
import { Self, Opponent } from "./Player";
import { Client, Stomp } from '@stomp/stompjs';
var selected: Boolean = false
var startX: number = -1
var endX: number = -1
var startY: number = -1
var endY: number = -1
var p1: Self = new Self(Color.WHITE)            //Chua co socket => Tam thoi setting ban than la trang
var p2: Opponent = new Opponent(Color.BLACK)    //Chua co socket => Tam thoi setting ban than la den
var game: Game = new Game()


if (localStorage.getItem("idUser") === null) {
    (document.getElementById("overlay") as HTMLDivElement).style.display = "block"
} else {
    (document.getElementById("overlay") as HTMLDivElement).style.display = "none"
    let stompClient: any = null;
    const token: string | null = localStorage.getItem("token");

    if (token) {
        // Tạo một factory WebSocket
        const socketFactory = function () {
            return new SockJS('http://localhost:8888/ws');
        }; 
        // Sử dụng factory khi kết nối Stomp
        stompClient = Stomp.over(socketFactory);
        stompClient.connect({ username: token }, function () {
            console.log('Web Socket is connected');
            stompClient.subscribe('/user/queue/loginStatus', function (message: any) {
                 
            });
        });
    } else {
        console.error("Token is not defined in localStorage.");
    }


    function send(name: string, pass: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // stompClient.publish({
            //     destination: '/app/login',
            //     headers: { 'acc': 'user1' },
            //     body: JSON.stringify({ username: name, password: pass }),
            // });
            stompClient.send("/app/login", {}, JSON.stringify({ username: name, password: pass }));
            stompClient.connect({ idUser: localStorage.getItem('idUser') }, function () {
                stompClient.subscribe('/user/queue/loginStatus', function (message: any) {
                    const body = JSON.parse(message.body);
                    console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);
                    if (body.message === "Đăng nhập thành công") {
                        localStorage.setItem('userID', body.userID);
                        resolve('success');
                    } else {
                        reject('failure');
                    }
                })
            })

            // const subscription: StompSubscription = stompClient.subscribe('/user/queue/loginStatus', (message) => {
            //     const body = JSON.parse(message.body);
            //     console.log("--authen: " + body);
            //     console.log("--authen: " + message.body);

            //     // console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);
            //     // if (body.message === "Đăng nhập thành công") {
            //     //     localStorage.setItem('userID', body.userID);
            //     //     resolve('success');
            //     // } else {
            //     //     reject('failure');
            //     // }
            // });
        });
    }
    function init(board: Board) {
        //i row, j col
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let coordinate: string = i.toString() + j.toString()
                let divPiece = document.getElementById(coordinate)
                if (divPiece) {
                    divPiece.addEventListener("click", () => ClickPiece(i, j))
                    let imgPiece = document.getElementById("i" + coordinate) as HTMLImageElement
                    if (board.getBox(i, j).piece?.image)
                        imgPiece.src = board.getBox(i, j).piece!.image
                    else if (imgPiece) {
                        imgPiece.src = ""
                    }
                }
            }
        }
    }
    //Chi ap dung cho self, khong ap dung cho opponent
    function ClickPiece(r: number, c: number) {
        // console.log(r + c)
        // connect()
        if (selected) {
            // console.log("secleted")
            if (game.playerMove(p1, startX, startY, r, c)) {
                init(game.board)
                // game.setFullCoordinates(startX,startY,r,c)
                // console.log("canmove"+ startX +startY +r + c)
                // send()
            } else {
                // console.log("cantmove"+ startX +startY + +r + c)
            }
            selected = false
            startX = -1
            startY = -1
            endX = -1
            endY = -1
        } else {
            // console.log("!secleted")
            selected = true
            startX = r //parseInt(coordinates.charAt(0))
            startY = c //parseInt(coordinates.charAt(1)) 
        }
    }
    document.getElementById("loginButton")?.addEventListener("click", async () => {
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
                } else if (!password) {
                    Swal.showValidationMessage('Vui lòng không để trống mật khẩu');
                } else if (!username) {
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
    document.getElementById("registerButton")?.addEventListener("click", async () => {
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
                } else if (!password) {
                    Swal.showValidationMessage('Vui lòng không để trống mật khẩu');
                } else if (!username) {
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
    document.getElementById("playWithFriend")?.addEventListener("click", async () => {
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
            if (option === "joinRoom") {
                let chkJoinRoom
                const { value: roomName } = await Swal.fire({
                    input: "number",
                    title: "Mã phòng",
                    inputPlaceholder: "Nhập mã phòng",
                    inputValidator: async (value) => {
                        if (!value) {
                            return "Nhập mã phòng!";
                        } else {
                            chkJoinRoom = await joinRoom(value)
                            // console.log("gtri: " + chkJoinRoom + value)
                            if (!chkJoinRoom) return "Mã phòng không tồn tại";
                        }
                    }
                });
                if (roomName && chkJoinRoom) {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "success",
                        title: "Vào phòng thành công!"
                    });
                }
            }
            if (option === "createRoom") {
                createRoom()
                cc()
                // let chkCreateRoom = await createRoom() 
                // Swal.fire("SweetAlert2 is working!!! " + chkCreateRoom);
                // createRoom()
                // Swal.fire({ html: `You selected: option === "createRoom"` });
                // createRoom()
                console.log("local storage: " + localStorage.getItem("userID"))
            }
        }
    })
    function createRoom() {
        stompClient.publish({
            destination: '/app/createRoom',
            headers: {},
            body: JSON.stringify({ userID: localStorage.getItem("userID") }),
        });
        const createRoomSub: StompSubscription = stompClient.subscribe('/user/queue/roomCreated', (message) => {
            const roomName = message.body;
            console.log('Roomname:', roomName);
        });
    }
    // function createRoom(): Promise<String>{
    //     return new Promise((resolve, reject) =>{
    //         stompClient.publish({
    //             destination: '/app/createRoom',
    //             headers: {},
    //             body: JSON.stringify({userID: localStorage.getItem("userID")}),
    //         });
    //         const createRoomSub: StompSubscription = stompClient.subscribe('/user/queue/roomCreated', (message) => {
    //             const roomName = message.body;
    //             resolve(message.body)
    //             console.log('Roomname:', roomName); 
    //         });
    //     })

    // } 


    function joinRoom(roomName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            stompClient.publish({
                destination: '/app/joinRoom',
                headers: {},
                body: JSON.stringify({ userID: localStorage.getItem("userID"), roomName: roomName }),
            });
            const joinRoomSub: StompSubscription = stompClient.subscribe('/user/queue/roomJoined', (message) => {
                let status = message.body;
                console.log('joinRoom:', status);
                if (status === "Vào phòng thành công") {
                    console.log('scc:');
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }


    // stompClient.publish({
    //     destination: '/app/createRoom',
    //     headers: {},
    //     body: JSON.stringify({userID: localStorage.getItem("userID")}),
    // });
    function cc() {
        const test: StompSubscription = stompClient.subscribe('/user/queue/test', (message) => {
            const roomName = message.body;
            console.log('Test:', roomName);
        });
    }
    function cc1() {
        stompClient.publish({
            destination: '/app/login',
            // headers: { 'Authorization': 'user1' },
            body: JSON.stringify({ username: "user1_username", password: "user1_password" }),
        });
        // stompClient.send('/app/login', { 'Authorization': 'Bearer ' + "user1" }, JSON.stringify({ username: name, password: pass }));


        const subscription: StompSubscription = stompClient.subscribe('/queue/loginStatus', (message) => {
            const body = JSON.parse(message.body);
            console.log("--authen: " + body);
            console.log("--authen: " + message.body);

            // console.log('UserID: ' + body.userID + '\nMessage: ' + body.message);
            // if (body.message === "Đăng nhập thành công") {
            //     localStorage.setItem('userID', body.userID);
            //     resolve('success');
            // } else {
            //     reject('failure');
            // }
        });
    }
    document.getElementById("cc")?.addEventListener("click", cc1)


}