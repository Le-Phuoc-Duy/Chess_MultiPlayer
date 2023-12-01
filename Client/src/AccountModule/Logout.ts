import { GameStatus } from "../Enum";
import { PromotionOverlay, checkIsloggedIn, currentGame, sendEndGame, stompClient } from "../Connect";
import Swal from "sweetalert2";
import { EndGame } from "../EndGame";

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
    
    let iDUserSend: string | null = localStorage.getItem('iDUserSend');
    let iDUserReceive: string | null = localStorage.getItem('iDUserReceive');
    let iDRoom: string | null = localStorage.getItem('iDRoom');
    let idRoomUser: string | null = localStorage.getItem('idRoomUser');
    let userSendTempPort: string | null = localStorage.getItem('userSendTempPort');
    let userReceiveTempPort: string | null = localStorage.getItem('userReceiveTempPort');
    let result: GameStatus | null = GameStatus.QUIT
    let endGame: EndGame = new EndGame(
        iDUserSend ?? '', // Sử dụng ?? để kiểm tra null hoặc undefined và gán giá trị mặc định nếu không tồn tại
        iDUserReceive ?? '',
        iDRoom ?? '',
        idRoomUser ?? '',
        userSendTempPort ?? '',
        userReceiveTempPort ?? '',
        result ?? ''
    );
    sendEndGame(endGame);
    localStorage.clear();
    window.location.reload();
})