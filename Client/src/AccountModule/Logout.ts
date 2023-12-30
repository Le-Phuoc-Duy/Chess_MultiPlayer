import { GameStatus } from "../Enum"; 
import Swal from "sweetalert2";
import { setEndGame } from "../PlayModule/ExtendOpt";
import { setLogoutExecuted, stompClient } from "../Connect";

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
    if(localStorage.getItem("board") != null){
        setEndGame(GameStatus.QUIT);
    }
    setLogoutExecuted(true)
    stompClient.publish({
        destination: '/app/logout', 
        headers: {},   
    });
    localStorage.clear();
    window.location.reload();
}) 