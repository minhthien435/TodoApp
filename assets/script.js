const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementByIdf('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
//initialize state from local storage
let todos = JSON.parse(localStorage.getItem('my_task')) || [];
let currentFilter='all';
// save to LocalStorage
const syncStorage = () =>{
    localStorage.setItem('my_tasks',JSON.stringify(todos));
}
// main function
const render = () =>{
    todoList.innerHTML='';
    const filterTasks = todos.filter(task =>{
        if(currentFilter === "active") return !task.completed;
        if(currentFilter === "completed") return task.completed;
        return true;
    });
    filterTasks.forEach(task=>{
        const li = document.createElement("li");
        if(task.completed) li.classList.add('completed');
        li.innerHTML=`
        <span onclick="toggleTask(${task.id})">${task.text}</span>
        <div class="actions">
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
        `;
        todoList.appendChild(li);
    });
};
const addTask = () =>{
    const text = todoInput.val
}