import Swal from "sweetalert2";
import { PromotionOverlay, currentGame, drawBoard, initializeClockOpp, initializeClockSelf, setCurrentGame, stompClient } from "../Connect";
import { Color, Invite } from "../Enum";
import { joinRoom } from "../PlayModule/PlayWithFriend";
import { Game } from "../Game";
import { Board } from "../Board"; 
var chart = null
document.getElementById('profileButton')?.addEventListener('click', function(){
    document.getElementById('profileSection')!.style.display = 'block'  
    document.getElementById('tableBXH')!.style.display = 'block';  
    document.getElementById('paginationBXH')!.style.display = 'flex';
    document.getElementById('tableFriend')!.style.display = 'none';  
    (document.getElementById("inpBXH") as HTMLInputElement).checked = true
    document.getElementById('mainGame')!.style.display = 'none'
    stompClient.publish({
        destination: '/app/profile', 
        headers: {},  
        body: localStorage.getItem('userID')!.toString()
    });
})
document.getElementById('backProfile')?.addEventListener('click', function(){
    document.getElementById('profileSection')!.style.display = 'none'  
    document.getElementById('mainGame')!.style.display = 'block' 
})

export function profileRender(rank: string,elo: string, numberOfWon: string, numberOfDrawn: string, numberOfLost: string, numberOfStanding: number){
    console.log("D" + numberOfDrawn +"W" + numberOfWon + "L" + numberOfLost)
    document.getElementById('h4ProfileName')!.innerHTML = localStorage.getItem('userName')!;
    document.getElementById('h4ProfileElo')!.innerHTML = "Elo: " + elo;
    document.getElementById('h4ProfileRank')!.innerHTML = "#RANK: " + rank;
    (document.getElementById('imgProfile') as HTMLImageElement).src = './assets/ava0' + localStorage.getItem('ava') + '.png'; 
    stompClient.publish({
        destination: '/app/standing', 
        headers: {},  
        body: '1'
    });
    createPagination(Math.ceil(numberOfStanding/4)) 
    if(numberOfDrawn == "0" && numberOfLost == "0" && numberOfWon == "0"){
        document.getElementById('divAchieve')!.classList.add('d-none')
    }else{
        document.getElementById('divAchieve')!.classList.remove('d-none')
        var chartData = {
            labels: ['Thắng', 'Thua', 'Hòa'],
            datasets: [{
                label: 'Số trận',
                data: [numberOfWon, numberOfLost, numberOfDrawn],
                borderWidth: 1 
            }]
        }; 
        var options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }, 
            },
        
        } 
        if (chart) {
            chart.destroy(); // Nếu tồn tại, hủy biểu đồ cũ
        }
        var ctx = document.getElementById('achieve')!.getContext('2d')  
        chart = new Chart(ctx, {
            type: "pie",
            data: chartData, 
            options: options, 
        });  

    }
}
document.getElementById('inpBXH')!.addEventListener('change', function (this: HTMLInputElement) {
    if (this.checked) {
        document.getElementById('tableBXH')!.style.display = 'block';
        document.getElementById('paginationBXH')!.style.display = 'flex';
        document.getElementById('tableFriend')!.style.display = 'none';  
    }
});
document.getElementById('inpFriend')!.addEventListener('change', function (this: HTMLInputElement) {
    if (this.checked) {
        document.getElementById('tableBXH')!.style.display = 'none';
        document.getElementById('paginationBXH')!.style.display = 'none';
        document.getElementById('tableFriend')!.style.display = 'block'; 
        stompClient.publish({
            destination: '/app/myFriend', 
            headers: {},  
            body: localStorage.getItem('userID')!.toString()
        });
    }
});
export function standingRender(content: any){
    const tableBody = document.querySelector("#tableBXH tbody"); 
    tableBody!.innerHTML = "";
    
    content.forEach((standing: any, index: number) => { 
        const row = document.createElement("tr"); 
        const cells = [
            document.createElement("th"),
            document.createElement("td"),
            document.createElement("td"),
            document.createElement("td"),
            document.createElement("td"),
            document.createElement("td"),
        ]; 
        cells[0].textContent = standing.rank;
        cells[1].textContent = standing.username.length > 12 ? standing.username.substring(0, 12) + '...' : standing.username;
        cells[2].textContent = standing.numberOfWin;
        cells[3].textContent = standing.numberOfLose;
        cells[4].textContent = standing.numberOfDraw;
        cells[5].textContent = standing.elo; 
        cells.forEach((cell) => row.appendChild(cell)); 
        tableBody!.appendChild(row);
    });
}
//Page
function createPagination(totalIndices: number) {
    let activeIndex = 1;
    const MAXVISIBLE = 3;

    function renderIndices() {
        let start = Math.max(1, activeIndex - Math.floor(MAXVISIBLE / 2));
        let end = Math.min(totalIndices, start + MAXVISIBLE - 1);

        // Ensure that at least 5 indices are shown
        if (totalIndices > MAXVISIBLE) {
            if (end - start + 1 < MAXVISIBLE) {
                start = end - MAXVISIBLE + 1;
            }
        } else {
            start = 1;
            end = totalIndices;
        }

        let paginationHTML = '';
        for (let i = start; i <= end; i++) {
            const activeClass = i === activeIndex ? 'active' : '';
            paginationHTML += `<li class="page-item ${activeClass}"><a class="page-link" href="#">${i}</a></li>`;
        }

        document.querySelector('.pagination')!.innerHTML = paginationHTML;

        const pageItems = document.querySelectorAll('.page-item');
        pageItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                activeIndex = start + index;
                stompClient.publish({
                    destination: '/app/standing', 
                    headers: {},  
                    body: activeIndex.toString()
                });
                renderIndices();                
            });
        });
    }

    renderIndices();
}
//Friend 
document.getElementById('btnAddFriend')!.addEventListener('click', () => {
    sendInvatationFriend("FRIEND_REQUEST")
});
export function sendInvatationFriend(result: string){
    stompClient.publish({
        destination: '/app/addFriend',
        headers: {},
        body: JSON.stringify({ userInviteID: localStorage.getItem('iDUserSend'), 
                                userInvitedName: localStorage.getItem('userReceiveName'), result: result}),
    });
}
export function listFriendRender(content: any){ 
    const tableBody = document.querySelector("#tableFriend tbody"); 
    tableBody!.innerHTML = "";
    
    content.forEach((friend: any, index: number) => { 
        let tr = document.createElement('tr');

        let tdIndex = document.createElement('td')
        tdIndex.textContent = (index + 1).toString()
        let tdName = document.createElement('td');
        tdName.textContent = friend.name.length > 12 ? friend.name.substring(0, 12) + '...' : friend.name

        let spanStatus = document.createElement('span'); 
        spanStatus.className = "mx-2 mt-2 d-inline-block rounded-circle";
        spanStatus.style.width = "10px";
        spanStatus.style.height = "10px";
        if (friend.status === 'ONLINE') {
            spanStatus.className += " bg-success";
        } 
        if (friend.status === 'OFFLINE') {
            spanStatus.className += " bg-warning";
        }
        if (friend.status === 'INGAME') {
            spanStatus.className += " bg-danger";
        }
        tdName.appendChild(spanStatus)

        let tdElo = document.createElement('td');
        tdElo.textContent = friend.elo 

        let tdPlay = document.createElement('td');
        let buttonPlay = document.createElement('button');
        if(friend.status === "ONLINE"){ 
            buttonPlay.className = "btn btn-sm btn-success btnInvite";
        }else{
            buttonPlay.className = "btn btn-sm btn-secondary btnInvite";
        }
        buttonPlay.value = friend.name;
        buttonPlay.textContent = "Mời";
        buttonPlay.addEventListener('click', function(){
            if(friend.status === "ONLINE"){
                showModal(friend.name);
            }
        })
        tdPlay.appendChild(buttonPlay)
        
        tr.appendChild(tdIndex);
        tr.appendChild(tdName);
        tr.appendChild(tdElo);
        tr.appendChild(tdPlay);
        tableBody!.appendChild(tr); 
    });
}
function showModal(oopName: String) {
    const selectOptions = `
    <style>
      .custom-select {
        position: relative;
        display: inline-block;
        font-family: Arial, sans-serif;
        width: 200px; /* Adjust width as needed */
      }
    
      .select-dropdown {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-color: #fff;
        cursor: pointer;
        text-align: center;
      }
    
      .custom-arrow {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        pointer-events: none;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #555;
      }
    </style>
    <div class="custom-select">
      <select id="options" class="select-dropdown">
        <option value="-1">2|1</option>
        <option value="-2">3|2</option>
        <option value="-3">5</option>
        <option value="-4">10</option>
      </select>
      <span class="custom-arrow"></span>
    </div>
    `;

    // Hiển thị swal với dropdown và button submit
    Swal.fire({
      title: 'Chọn chế độ',
      html: selectOptions,
      showCancelButton: true,
      confirmButtonText: 'Mời',
      cancelButtonText: 'Hủy',
      preConfirm: () => {
        const selectedOption = (document.getElementById('options') as HTMLInputElement).value;
        // Xử lý khi người dùng nhấn submit
        // Ở đây bạn có thể thực hiện các hành động tùy thuộc vào option được chọn
        stompClient.publish({
            destination: '/app/inviteFriend',
            headers: {},
            body: JSON.stringify({ idDUserSend: localStorage.getItem('userID'), userName: localStorage.getItem('userName'), mode: parseInt(selectedOption), userReceiveName: oopName, message: Invite.Request}),
        });
        joinRoom().then((result) => {
            if (result) {
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
                    title: "Đã có người chơi khác tham gia, Bắt đầu trận đấu"
                });
                if (result.color) {
                    var gameByCreate: Game = new Game(Color.WHITE, new Board, true, 0);
                } else {
                    var gameByCreate: Game = new Game(Color.BLACK, new Board, false, 0);
                }
                gameByCreate.setFullCoordinates(result.board);
                setCurrentGame(gameByCreate)
                drawBoard(gameByCreate.board);
                PromotionOverlay(currentGame.playerSide);
                initializeClockSelf(result.userCountdownValue);
                initializeClockOpp(result.userCountdownValue);
            }
        })
        stompClient.subscribe('/user/queue/replyInvite', (message) => {
            const body = JSON.parse(message.body);
            if(body.message == "Deny"){
                Swal.fire("Đối phương từ chối lời mời")
            }    
        });
      }
    });
  }