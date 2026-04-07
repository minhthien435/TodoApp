
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
//initialize state from local storage
let todos = JSON.parse(localStorage.getItem('my_task')) || [];
let currentFilter='all';
// save to LocalStorage
const syncStorage = () =>{
    localStorage.setItem('my_task',JSON.stringify(todos));
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
    const text = todoInput.value.trim();
    if(text){
        const newTask = {
            id: Date.now(),
            text:text,
            completed:false
        };
        todos.push(newTask);
        todoInput.value='';
        syncStorage();
        render();
    }
};

const toggleTask = (id) =>{
    todos=todos.map(task=>
        task.id=== id ?{...task,completed:!task.completed}:task
    );
    syncStorage();
    render();
};

const editTask = (id)  =>{
    const task = todos.find(t => t.id === id);
    const updatedText = prompt("Edit your task: ", task.text);
    if(updatedText !==null && updatedText.trim()!==""){
        task.text = updatedText.trim();
        syncStorage();
        render();
    }
};

const deleteTask = (id) =>{
    if(confirm("Are you sure u want to delete this task?")){
        todos= todos.filter(task =>task.id !==id);
        syncStorage();
        render();
    }
};

filterBtns.forEach(btn =>{
    btn.addEventListener("click",() =>{
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentFilter= btn.dataset.filter;
        render();
    });
});

addBtn.addEventListener("click",addTask);
todoInput.addEventListener('keypress',(e) =>{
    if(e.key === 'Enter') addTask();
});
render();