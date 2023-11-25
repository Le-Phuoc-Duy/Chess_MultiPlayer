import { PromotionOverlay, checkIsloggedIn, currentGame, stompClient } from "../Connect";
import Swal from "sweetalert2";

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
    localStorage.clear();
    window.location.reload();
})