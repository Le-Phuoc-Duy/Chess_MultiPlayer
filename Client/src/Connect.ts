import { Client, Stomp } from '@stomp/stompjs';  

export var stompClient: any = null;
var token: string | null = localStorage.getItem("token");

if (token) { 
    // Tạo một factory WebSocket
    const socketFactory = function () {
        return new SockJS('http://localhost:8888/ws');
    };

    // Sử dụng factory khi kết nối Stomp
    stompClient = Stomp.over(socketFactory);
    //Login
    stompClient.connect({ username: token }, function() { 
        stompClient.subscribe('/queue/loginStatus', receiveLogin);
    });
    //CreateRoom
    stompClient.connect({ username: token }, function() { 
        stompClient.subscribe('/queue/roomCreated', receiveLogin);
    });
    //JoinRoom
    stompClient.connect({ username: token }, function() { 
        stompClient.subscribe('/queue/joinRoom', receiveLogin);
    });
} else {   
    console.log("khong token") 
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event: any) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        }) 
    const loginSection = document.getElementById('login-section') as HTMLDivElement;
    const registerSection = document.getElementById('register-section') as HTMLDivElement;
    if (loginSection && registerSection) loginSection.style.display = 'block';
    document.getElementById("toRegister")?.addEventListener('click', () => { 
        if (loginSection && registerSection) {
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        }
    });
    document.getElementById("toLogin")?.addEventListener('click', () => { 
        if (loginSection && registerSection) {
            loginSection.style.display = 'block';
            registerSection.style.display = 'none';
        }
    }); 
    
} 

function receiveLogin(message: any){

}