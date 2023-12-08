import { stompClient } from "../Connect";

// import { Chart } from "chart.js";  
document.getElementById('profileButton')?.addEventListener('click', function(){
    document.getElementById('profileSection')!.style.display = 'block'  
    document.getElementById('tableBXH')!.style.display = 'block'  
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
    console.log("nnn" + numberOfDrawn+ numberOfLost + numberOfWon) 
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
            // body: '1'
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
                renderIndices();
                console.log("page " + activeIndex)
                stompClient.publish({
                    destination: '/app/standing', 
                    headers: {},  
                    body: activeIndex.toString()
                });
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
        buttonPlay.className = "btn btn-sm btn-success btnInvite";
        buttonPlay.value = friend.name;
        buttonPlay.textContent = "Mời";
        buttonPlay.addEventListener('click', function(){
            console.log(this.value)
        })
        tdPlay.appendChild(buttonPlay)
        
        tr.appendChild(tdIndex);
        tr.appendChild(tdName);
        tr.appendChild(tdElo);
        tr.appendChild(tdPlay);
        tableBody!.appendChild(tr); 
    });
} 