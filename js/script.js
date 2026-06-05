
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date-input');
const searchInput = document.getElementById('search-input');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

//initialize state from local storage
let todos = JSON.parse(localStorage.getItem('my_task')) || [];
let currentFilter='all';
let searchTerm = '';
// save to LocalStorage
const syncStorage = () =>{
    localStorage.setItem('my_task',JSON.stringify(todos));
}
// main function
const render = () =>{
    todoList.innerHTML='';
    
    // Filter by search term first
    let filteredTasks = todos.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;
        
        // Then apply status filter
        if(currentFilter === "active") return !task.completed;
        if(currentFilter === "completed") return task.completed;
        return true;
    });
    
    // Sort by priority (high > medium > low) and due date
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filteredTasks.sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
    });
    
    // Update task count
    const remainingTasks = todos.filter(t => !t.completed).length;
    taskCount.textContent = `${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} remaining`;
    
    filteredTasks.forEach(task=>{
        const li = document.createElement("li");
        li.classList.add(`priority-${task.priority || 'medium'}`);
        if(task.completed) li.classList.add('completed');
        
        // Check if overdue
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        if(isOverdue) li.classList.add('overdue');
        
        const dueDateDisplay = task.dueDate ? `<span class="due-date ${isOverdue ? 'overdue-text' : ''}">📅 ${task.dueDate}</span>` : '';
        const priorityBadge = `<span class="priority-badge priority-${task.priority || 'medium'}">${task.priority || 'medium'}</span>`;
        
        li.innerHTML=`
        <div class="task-content" onclick="toggleTask(${task.id})">
            <span>${task.text}</span>
            ${priorityBadge}
            ${dueDateDisplay}
        </div>
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
            completed:false,
            priority: prioritySelect.value,
            dueDate: dueDateInput.value || null
        };
        todos.push(newTask);
        todoInput.value='';
        dueDateInput.value='';
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

const clearCompleted = () => {
    todos = todos.filter(task => !task.completed);
    syncStorage();
    render();
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

// Search functionality
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    render();
});

// Clear completed button
clearCompletedBtn.addEventListener('click', clearCompleted);

addBtn.addEventListener("click",addTask);
todoInput.addEventListener('keypress',(e) =>{
    if(e.key === 'Enter') addTask();
});
render();