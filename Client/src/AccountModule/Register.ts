import { checkIsloggedIn, stompClient } from "../Connect";
import Swal from "sweetalert2";

function sendRegister(name: string, pass: string,ava: number): Promise<string> {
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/register',
            headers: {},
            body: JSON.stringify({ username: name, password: pass , ava:ava}),
        });

        stompClient.subscribe('/user/queue/registerStatus', (message) => {
            const body = JSON.parse(message.body);
            if (body.message === "Đăng ký thành công") {
                localStorage.clear();
                localStorage.setItem('userID', body.userID);
                localStorage.setItem('userName', body.userName);
                localStorage.setItem('ava', body.ava);
                resolve('success');
            } else {
                reject('failure');
            }
        });
    });
}
document.getElementById("registerButton")?.addEventListener("click",async () => {
    const { value: formValues } = await Swal.fire({
        title: 'ĐĂNG KÝ',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Tên người dùng">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Mật khẩu" type="password">' +
            '<input id="swal-input3" class="swal2-input" placeholder="Xác nhận Mật khẩu" type="password">' +
            '<div class="container">' +
            '  <div class="row">' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img1" name="image" value="1" style="display: none;">' +
            '      <label class="ava" for="img1"><img src="./assets/ava01.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img2" name="image" value="2" style="display: none;">' +
            '      <label class="ava" for="img2"><img src="./assets/ava02.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img3" name="image" value="3" style="display: none;">' +
            '      <label class="ava" for="img3"><img src="./assets/ava03.png" style="width: 90%;"></label>' +
            '    </div>' +
            '  </div>' +
            '  <div class="row">' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img4" name="image" value="4" style="display: none;">' +
            '      <label class="ava" for="img4"><img src="./assets/ava04.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img5" name="image" value="5" style="display: none;">' +
            '      <label class="ava" for="img5"><img src="./assets/ava05.png" style="width: 90%;"></label>' +
            '    </div>' +
            '    <div class="col-md-4">' +
            '      <input class="avaInput" type="radio" id="img6" name="image" value="6" style="display: none;">' +
            '      <label class="ava" for="img6"><img src="./assets/ava06.png" style="width: 90%;"></label>' +
            '    </div>' +
            '  </div>' +
            '</div>',

        focusConfirm: false,
        preConfirm: () => {
            let username = (document.getElementById('swal-input1')! as HTMLInputElement).value
            let password = (document.getElementById('swal-input2')! as HTMLInputElement).value
            let confirmPassword = (document.getElementById('swal-input2')! as HTMLInputElement).value
            let avatar = (document.querySelector('input.avaInput[name="image"]:checked') as HTMLInputElement).value;
            let ava: number = parseInt(avatar); 
            if (!username && !password) {
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng và mật khẩu');
            } else if (!password){
                Swal.showValidationMessage('Vui lòng không để trống mật khẩu');
            } else if (!username){
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng');
            } else if (password.length < 5) {
                Swal.showValidationMessage('Mật khẩu phải có ít nhất 5 ký tự.');
            }else if (confirmPassword != password) {
                Swal.showValidationMessage('Xác nhận mật khẩu không hợp lệ');
            } else {
                sendRegister(username, password,ava)
                    .then((result) => {
                        checkIsloggedIn();
                    }).then(()=>{
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 200,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                            }
                        });
                        Toast.fire({
                            icon: "success",
                            title: "Đăng ký thành công"
                        }).then(()=>{
                            location.reload()
                        });
                        
                    })
                    .catch((error) => { 
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                            }
                        });
                        Toast.fire({
                            icon: "error",
                            title: "Đăng ký thất bại! Tên người dùng đã tồn tại"
                        }); 
                    });
            }
        }
        }
    )
})