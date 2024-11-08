const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
let editingTask = null;
let taskToDelete = null;

function removeTaskFromLocalStorage(task) {
  taskToDelete = task;
  document.getElementById("modal").style.display = "block";
}

document.getElementById("confirm-delete").onclick = function() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => t !== taskToDelete);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  closeModal();
};

document.getElementById("cancel-delete").onclick = function() {
  closeModal();
};

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTasks(tasks);
}

function renderTasks(tasks) {
  listContainer.innerHTML = "";
  const template = tasks.map((task) => {
    return `
      <li>
      <img onclick="toggleTaskCheck(this)" class="ajib" src="pngtree-black-ring-png-image_2319165.png" alt="">
        <textarea disabled cols="35" rows="2">${task}</textarea>
        <div class="btn">
          <img onclick="removeTaskFromLocalStorage('${task}')" src="delete-512.png" alt="">
          <img onclick="editTask(this)" src="edit-icon-png-3583.png" alt="">
        </div>
      </li>
    `;
  }).join("");
  listContainer.innerHTML = template;
}
function toggleTaskCheck(element) {
    const li = element.closest('li');
    const textarea = li.querySelector('textarea');
    
    if (textarea.style.textDecoration === "line-through") {
        textarea.style.textDecoration = "none";
        textarea.style.color = "";
        element.src = "pngtree-black-ring-png-image_2319165.png";
    } else {
        textarea.style.textDecoration = "line-through";
        textarea.style.color = "#f14f4a";
        element.src = "./tik.png"; 
    }
}

inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); 
      addTask();
    }
  });
function addTask() {
  if (inputBox.value === "") {
  } else {
    const task = inputBox.value;
    if (editingTask) {
      const oldTaskText = editingTask.value; 
      editingTask.value = task; 
      updateTaskInLocalStorage(oldTaskText, task); 
      editingTask = null; 
    } else {
      addTaskToDOM(task);
      saveTaskToLocalStorage(task);
    }
    inputBox.value = ""; 
  }
  loadTasks();
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.innerHTML = `
    <textarea cols="35" rows="2">${task}</textarea>
    <div>
      <img onclick="removeTaskFromLocalStorage('${task}')" src="delete-512.png" alt="">
      <img onclick="editTask(this)" src="edit-icon-png-3583.png" alt="">
    </div>
  `;
  listContainer.appendChild(li);
}

function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInLocalStorage(oldTask, newTask) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) => (task === oldTask ? newTask : task));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function editTask(element) {
    const li = element.closest('li');
    const textarea = li.querySelector('textarea');
    textarea.removeAttribute('disabled');
    if (editingTask) {

        const newTask = editingTask.value; 
        const oldTaskText = editingTask.getAttribute('data-old-task');
        if (newTask !== '') {
            textarea.value = newTask;
            updateTaskInLocalStorage(oldTaskText, newTask);
            editingTask = null;
        }
    }

    if (!editingTask) {
        editingTask = textarea;
        textarea.setAttribute('data-old-task', textarea.value); 
        textarea.focus();
        element.src = './tik.png';
        element.onclick = () => {
            const newTask = textarea.value;
            if (newTask !== '') {
                const oldTaskText = textarea.getAttribute('data-old-task');
                textarea.value = newTask; 
                updateTaskInLocalStorage(oldTaskText, newTask); 
                editingTask = null; 
                element.src = 'edit-icon-png-3583.png';
                loadTasks();
            }
        };
    }
}


window.onload = loadTasks;
