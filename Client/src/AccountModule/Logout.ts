import { GameStatus } from "../Enum"; 
import Swal from "sweetalert2";
import { EndGame } from "../EndGame";
import { setEndGame } from "../PlayModule/ExtendOpt";
import { stompClient } from "../Connect";

document.getElementById("logoutButton")?.addEventListener("click",async () => {
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
        title: "Đăng xuất thành công"
    }); 
    setEndGame(GameStatus.QUIT)
    stompClient.publish({
        destination: '/app/logout', 
        headers: {},  
        // body: localStorage.getItem('userID')!.toString()
    });
    localStorage.clear();
    window.location.reload();
})
document.getElementById("ccPrintPricipal")?.addEventListener("click",async () => { 
    stompClient.publish({
        destination: '/app/ccPrint', 
        headers: {},  
        // body: "cc"
    }); 
})