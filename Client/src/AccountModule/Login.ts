import { checkIsloggedIn, stompClient } from "../Connect";
import Swal from "sweetalert2";

function sendLogin(name: string, pass: string): Promise<string> {
    return new Promise((resolve, reject) => {
        stompClient.publish({
            destination: '/app/login',
            headers: {},
            body: JSON.stringify({ username: name, password: pass}),
        });

        stompClient.subscribe('/user/queue/loginStatus', (message) => {
            const body = JSON.parse(message.body);
            if (body.message === "Đăng nhập thành công") {
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

document.getElementById("loginButton")?.addEventListener("click",async () => {
    const { value: formValues } = await Swal.fire({
        title: 'ĐĂNG NHẬP',
        html:
            '<input id="swal-input1" class="swal2-input" placeholder="Tên người dùng">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Mật khẩu" type="password">',
        focusConfirm: false, 
        preConfirm: () => {
            let username = (document.getElementById('swal-input1')! as HTMLInputElement).value
            let password = (document.getElementById('swal-input2')! as HTMLInputElement).value //document.getElementById('swal-input2')!.value;
            if (!username && !password) {
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng và mật khẩu');
            } else if (!password){
                Swal.showValidationMessage('Vui lòng không để trống mật khẩu');
            } else if (!username){
                Swal.showValidationMessage('Vui lòng không để trống tên người dùng');
            // } else if (password.length < 5) {
            //     Swal.showValidationMessage('Mật khẩu phải có ít nhất 5 ký tự.');
            } else { 
                sendLogin(username, password)
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
                            title: "Đăng nhập thành công"
                        }).then(()=>{
                            location.reload()
                        });
                        
                    })
                    .catch((error) => { 
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 300,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                            }
                        });
                        Toast.fire({
                            icon: "error",
                            title: "Đăng nhập thất bại! Sai mật khẩu hoặc tên người dùng"
                        }); 
                    });
                    }
        }
    })  
})


 