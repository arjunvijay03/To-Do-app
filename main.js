let input = document.getElementById("input");
let addBtn = document.getElementById("addbtn");
let tasks = document.getElementById("tasks");
let checkBtn = document.getElementsByClassName("status");
let all = document.getElementById("all")
let active = document.getElementById("active");
let completed = document.getElementById("completed")
let clrCompleted = document.getElementById("clear-completed");
let tasksLeftIndicater = document.getElementById("task-left");
let themeChange = document.getElementById("theme")
let tasksLeft; 
let idOfEditTask = 0;

let data = JSON.parse(localStorage.getItem("data")) || [];

let idd = JSON.parse(localStorage.getItem("forId")) || 0;

let generateTask = () =>{
    
    tasks.innerHTML = data.map((x, y) =>{
        return `
        <div class="task" >
        <button onClick="taskCheck(id)" class="status" id="${x.id}">
        
        </button>
        <p>${x.task}</p>
        <i onClick="editTask(${x.id})" class="fa-solid fa-pen-to-square" id="editBtn"></i>

        <i onClick="deleteTask(id)" class="fa-solid fa-x deletebtn" id="${x.id+1}" ></i>

      </div>
        
        `
    }).join("")
    
    all.style.color = "hsl(220, 98%, 61%)";
    completed.style.color = "hsl(234, 11%, 52%)";
    active.style.color = "hsl(234, 11%, 52%)";

}
generateTask();

addBtn.addEventListener("click", () =>{
    if(input.value !== ""){


        if(idOfEditTask === 0){

        let newTask = {
            id : idd,
            task : input.value,
            status : false
        }
        idd++
        
        localStorage.setItem("forId",JSON.stringify(idd) );
        data.unshift(newTask)

        }
        else{
            for( let i=0; i<data.length; i++){
                if(data[i].id === idOfEditTask){
                    data[i].task = input.value;
                }
            }
            idOfEditTask = 0;
        }

    }
    else{
        alert("Task is empty");
        location.reload();
    }
    generateTask();
    input.value = ""
    localStorage.setItem("data", JSON.stringify(data))
    statusSet();
    countRemaining();
});

let deleteTask = (x) =>{
    
    let id = x-1;
    let  index
    for( let i = 0; i<data.length;i++)
       { if(data[i].id == id){
          index = data.indexOf(data[i]);
        }
    }
    
    
    data.splice(index, 1);
    generateTask();
    
    localStorage.setItem("data", JSON.stringify(data))
    statusSet();
    countRemaining();
    
}



let taskCheck = (x) =>{
    
    let searchId = x;
    
    let search = data.find((y) =>y.id == searchId)
    
    if(search.status === false){
        search.status = true;
    }else{
        search.status = false;
    }
    
    localStorage.setItem("data", JSON.stringify(data))
    
    statusSet();
    countRemaining();

};

let statusSet =() =>{
    for(i=0; i<data.length;i++){
    if(data[i].status === true){
        let trueId = data[i].id;
        
        for(let j = 0; j<checkBtn.length; j++){
            if(checkBtn[j].id == trueId){
        checkBtn[j].innerHTML =`<i class="fa-solid fa-check"></i>`;
        checkBtn[j].nextElementSibling.style.textDecoration = "line-through";
        checkBtn[j].style.backgroundImage = " linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))"
        checkBtn[j].nextElementSibling.style.color = ""
    }    
    }
    }
    else{


        let trueId = data[i].id;
        
        for(let j = 0; j<checkBtn.length; j++){
            if(checkBtn[j].id == trueId){
                checkBtn[j].innerHTML ="";
                checkBtn[j].nextElementSibling.style.textDecoration = "none";
                checkBtn[j].style.backgroundImage = "none";
            }    
    }

    }
}
}

all.addEventListener("click", () =>{
    all.style.color = "hsl(220, 98%, 61%)";
    completed.style.color = "hsl(234, 11%, 52%)";
    active.style.color = "hsl(234, 11%, 52%)";
    generateTask();
    statusSet(data);


})
active.addEventListener("click", () =>{
    
    let activeData = data.map((x) =>{
        generateTask();
        if(x.status === true ){
            return x.id
        }
        else{
            return null
        }
    })
    
    for(let i = 0; i<checkBtn.length; i++){
        for(let j = 0; j<activeData.length;j++){
            if(checkBtn[i].id == activeData[j]){
                checkBtn[i].parentElement.remove();
            }
        }
    }
    all.style.color = "hsl(234, 11%, 52%)";
    completed.style.color = "hsl(234, 11%, 52%)";
    active.style.color = "hsl(220, 98%, 61%)";
    
   
   
})

completed.addEventListener("click", () =>{

    generateTask();
    cmpltedData = data.map((x) =>{
        if(x.status === false ){
            return x.id
        }
        else{
            return null
        }
    })
    
    for(let i = 0; i<checkBtn.length; i++){
        for(let j = 0; j<cmpltedData.length;j++){
            
            if(checkBtn[i].id == cmpltedData[j]){
                checkBtn[i].parentElement.remove();
            }
        }
    }

    all.style.color = "hsl(234, 11%, 52%)";
    completed.style.color = "hsl(220, 98%, 61%)";
    active.style.color = "hsl(234, 11%, 52%)";


    statusSet();
})
clrCompleted.addEventListener("click", () =>{


    let completedData = data.filter((x) =>x.status === false)
    data = completedData;
    localStorage.setItem("data", JSON.stringify(data))
    generateTask();
    
})

let countRemaining = ()=> {
    remainingTasks = data.filter((x)=> x.status === false)
    tasksLeft = remainingTasks.length
    
    tasksLeftIndicater.innerHTML = tasksLeft;
}

statusSet();
countRemaining();
themeChange.addEventListener("click", () =>{
   document.querySelector("body").classList.toggle("theme-change")
})



let editTask = (x) =>{
    
    taskToEdit = data.find((y) => y.id === x)
    console.log(taskToEdit)
     idOfEditTask = taskToEdit.id;
    input.value = taskToEdit.task
}