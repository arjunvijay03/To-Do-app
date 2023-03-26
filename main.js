const input = document.getElementById("input");
const addBtn = document.getElementById("addbtn");
const tasks = document.getElementById("tasks");
const checkBtn = document.getElementsByClassName("status");
const all = document.getElementById("all");
const active = document.getElementById("active");
const completed = document.getElementById("completed");
const clrCompleted = document.getElementById("clear-completed");
const tasksLeftIndicater = document.getElementById("task-left");
const themeLabel = document.getElementById("theme");
const themeCheckBox = document.getElementById("theme-checkbox");
let tasksLeft;
let idOfEditTask = 0;
let theme = localStorage.getItem("theme");

let data = JSON.parse(localStorage.getItem("data")) || [];

const generateTask = () => {
  tasks.innerHTML = data
    .map((data) => {
      const { id, task } = data;
      return `
        <div class="task" >
        <button onClick="taskCheck(id)" class="status" id="${id}">
        
        </button>
        <p>${task}</p>
        <i onClick="editTask(${id})" class="fa-solid fa-pen-to-square" id="editBtn"></i>

        <i onClick="deleteTask(${id})" class="fa-solid fa-x deletebtn"></i>
        

      </div>
        
        `;
    })
    .join("");
  document.querySelector(".active-sort").classList.remove("active-sort");
  all.classList.add("active-sort");
};
generateTask();

const addTask = () => {
  if (input.value !== "") {
    if (idOfEditTask === 0) {
      let newTask = {
        id: Date.now(),
        task: input.value,
        status: false,
      };
      data.unshift(newTask);
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === idOfEditTask) {
          data[i].task = input.value;
        }
      }
      idOfEditTask = 0;
    }
  } else {
    alert("Task is empty");
    location.reload();
  }
  generateTask();
  input.value = "";
  localStorage.setItem("data", JSON.stringify(data));
  statusSet();
  countRemaining();
};

addBtn.addEventListener("click", addTask);
input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});
const deleteTask = (id) => {
  data = data.filter((todo) => todo.id !== id);

  generateTask();

  localStorage.setItem("data", JSON.stringify(data));
  statusSet();
  countRemaining();
};

const taskCheck = (x) => {
  let searchId = x;

  let search = data.find((y) => y.id == searchId);

  if (search.status === false) {
    search.status = true;
  } else {
    search.status = false;
  }

  localStorage.setItem("data", JSON.stringify(data));

  statusSet();
  countRemaining();
};

let statusSet = () => {
  for (i = 0; i < data.length; i++) {
    if (data[i].status === true) {
      let trueId = data[i].id;

      for (let j = 0; j < checkBtn.length; j++) {
        if (checkBtn[j].id == trueId) {
          checkBtn[j].innerHTML = `<i class="fa-solid fa-check"></i>`;
          checkBtn[j].nextElementSibling.style.textDecoration = "line-through";
          checkBtn[j].style.backgroundImage =
            " linear-gradient(to right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))";
          checkBtn[j].nextElementSibling.style.color = "";
        }
      }
    } else {
      let trueId = data[i].id;

      for (let j = 0; j < checkBtn.length; j++) {
        if (checkBtn[j].id == trueId) {
          checkBtn[j].innerHTML = "";
          checkBtn[j].nextElementSibling.style.textDecoration = "none";
          checkBtn[j].style.backgroundImage = "none";
        }
      }
    }
  }
};

all.addEventListener("click", () => {
  document.querySelector(".active-sort").classList.remove("active-sort");
  all.classList.add("active-sort");
  generateTask();
  statusSet(data);
});
active.addEventListener("click", () => {
  let activeData = data.map((x) => {
    generateTask();
    if (x.status === true) {
      return x.id;
    } else {
      return null;
    }
  });

  for (let i = 0; i < checkBtn.length; i++) {
    for (let j = 0; j < activeData.length; j++) {
      if (checkBtn[i].id == activeData[j]) {
        checkBtn[i].parentElement.remove();
      }
    }
  }

  document.querySelector(".active-sort").classList.remove("active-sort");
  active.classList.add("active-sort");
});

completed.addEventListener("click", () => {
  generateTask();
  cmpltedData = data.map((x) => {
    if (x.status === false) {
      return x.id;
    } else {
      return null;
    }
  });

  for (let i = 0; i < checkBtn.length; i++) {
    for (let j = 0; j < cmpltedData.length; j++) {
      if (checkBtn[i].id == cmpltedData[j]) {
        checkBtn[i].parentElement.remove();
      }
    }
  }

  document.querySelector(".active-sort").classList.remove("active-sort");
  completed.classList.add("active-sort");
  statusSet();
});
clrCompleted.addEventListener("click", () => {
  data = data.filter((x) => x.status === false);
  localStorage.setItem("data", JSON.stringify(data));
  generateTask();
});

const countRemaining = () => {
  remainingTasks = data.filter((x) => x.status === false);
  tasksLeft = remainingTasks.length;

  tasksLeftIndicater.innerHTML = tasksLeft;
};

statusSet();
countRemaining();

themeCheckBox.addEventListener("change", () => {
  themeCheckBoxHandle();
});
const themeCheckBoxHandle = () => {
  if (themeCheckBox.checked == true) {
    theme = "light";
    localStorage.setItem("theme", "light");
  } else {
    theme = "dark";
    localStorage.setItem("theme", "dark");
  }
  themeChangeFun();
};
const themeChangeFun = () => {
  if (theme == "light") {
    document.querySelector("body").classList.add("light-theme");
    themeCheckBox.checked = true;
  } else if (theme == "dark") {
    document.querySelector("body").classList.remove("light-theme");
    themeCheckBox.checked = false;
  }
};

themeChangeFun();

const editTask = (x) => {
  taskToEdit = data.find((y) => y.id === x);
  idOfEditTask = taskToEdit.id;
  input.value = taskToEdit.task;
};
