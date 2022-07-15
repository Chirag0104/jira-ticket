let addbtn = document.querySelector(".add-button");
let removeBtn = document.querySelector(".remove-button");
let modalCont = document.querySelector(".modal-container");
let addFlag = false;
let mainCont = document.querySelector(".main-container");
let colors = ["lightpink","lightblue","lightgreen","black"];
let modalPriorityColor = colors[colors.length-1]; 
let allPriorityColors = document.querySelectorAll(".priority-color");
let textareaCont = document.querySelector(".textarea-container");
let lockElem = document.querySelector(".ticket-lock");
let removeFlag = false;
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let toolboxColors = document.querySelectorAll(".color");
let ticketArr = [];

//all toolbox colors

if(localStorage.getItem("jira_tickets")){
    //retrieve and display tickets

    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
    })
}

for(let i=0;i<toolboxColors.length;i++){
    toolboxColors[i].addEventListener("click" , (e)=> {
        let currentToolboxColor = toolboxColors[i].classList[0];
        let filteredTickets = ticketArr.filter((ticketObj,idx) => {
            return currentToolboxColor === ticketObj.ticketColor;
        })

        //remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-container");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        //display new filtered tickets
        filteredTickets.forEach((ticketObj,idx) => {
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
        })
    })

    toolboxColors[i].addEventListener("dblclick", (e) => {
        let allTicketsCont = document.querySelectorAll(".ticket-container");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        ticketArr.forEach((ticketObj,idx) => {
            createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketID);
        })
    })
}

//Listener for modal priority color

allPriorityColors.forEach((colorElem,idx) => {
    colorElem.addEventListener("click",(e) => {
        allPriorityColors.forEach((priorityColorElem,idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");

        modalPriorityColor = colorElem.classList[0];
    })
}) 

addbtn.addEventListener("click" , (e) => {
    // Display Modal
    // Generate Ticket

    //addFlag = true display modal
    //addFlag = false hide modal

    addFlag = !addFlag;
    if(addFlag==true){
        modalCont.style.display="flex";
    }
    else{
        modalCont.style.display="none";
    }
})

removeBtn.addEventListener("click", (e) => {
    removeFlag=!removeFlag;
})

modalCont.addEventListener("keydown",(e) => {
    let key = e.key;
    if(key === "Shift"){
        createTicket(modalPriorityColor,textareaCont.value);
        modalCont.style.display="none";
        textareaCont.value ="";
        addFlag=false;
    }
})

function createTicket(ticketColor , ticketTask , ticketID) {
    let id = ticketID||shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("Class","ticket-container")
    ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor} "></div>
    <div class="ticket-id"> #${id}</div>
    <div class="task-area">
        ${ticketTask}
    </div>    
    <div class="ticket-lock">
                    <i class="fa-solid fa-lock"></i>
                </div> 
    
    `;

    mainCont.appendChild(ticketCont);

    // create object of ticket and add to array
    if(!ticketID){

        ticketArr.push({ticketColor,ticketTask,ticketID:id});
        localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    }

    handleRemoval(ticketCont,id);
    handleLock(ticketCont,id);
    handleColor(ticketCont,id);
}

function handleRemoval(ticket,id){
    //removeFlag = true -> remove
    ticket.addEventListener("click", (e) => {
        if(!removeFlag)return;
        
        let idx = getTicketIdx(id);
        ticketArr.splice(idx,1);
        let strTicketsArr = JSON.stringify(ticketArr);
        localStorage.setItem("jira_tickets",strTicketsArr);
        ticket.remove();
        

    })
    
}

function handleLock(ticket,id){
    let ticketlockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketlockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click" , (e) => {
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");

        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }
        // modify data in local storage (ticekt task)
        ticketArr[ticketIdx].ticketTask=ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    })



}


function handleColor(ticket,id){
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
    // Get ticket color index
    let index = colors.findIndex((color) => {
        return currentTicketColor === color;
    })

    index++;
    
    let newindex = index%colors.length;
    let newTicketColor = colors[newindex];
    ticketColor.classList.remove(currentTicketColor);
    ticketColor.classList.add(newTicketColor);

    ticketArr[ticketIdx].ticketColor=newTicketColor;
    localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));

    })
    

}

function getTicketIdx(id){
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketID===id;
    })
    return ticketIdx;
}

function setModalToDefault(){
    modalCont.style.display="none";
    textareaCont.value ="";
    allPriorityColors.forEach((priorityColorElem,idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
}