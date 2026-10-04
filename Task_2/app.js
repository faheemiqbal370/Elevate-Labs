// 
//  STEP 1: GRAB ALL THE DOM ELEMENTS WE NEED
//  We do this ONCE at the top — fast and clean
// 
const taskInput     = document.getElementById('task-input');
const addBtn        = document.getElementById('add-btn');
const taskList      = document.getElementById('task-list');
const errorMsg      = document.getElementById('error-msg');
const emptyState    = document.getElementById('empty-state');
const taskCount     = document.getElementById('task-count');
const completedCount = document.getElementById('completed-count');


// 
//  STEP 2: ADD TASK FUNCTION
//  This is the main function — creates a new task item
// 
function addTask() {

  // Read and clean the input value
  const taskText = taskInput.value.trim(); // .trim() removes extra spaces

  // --- VALIDATION: Don't allow empty tasks ---
  if (taskText === '') {
    showError();    // show error message
    return;         // stop the function here
  }

  // --- Hide error if it was showing ---
  hideError();

  // --- CREATE the <li> element ---
  const li = document.createElement('li');
  li.classList.add('task-item');

  // --- BUILD the inside of the <li> ---
  // Using innerHTML to set structure of each task
  li.innerHTML = `
    <button class="complete-btn" title="Mark Complete">✓</button>
    <span class="task-text">${taskText}</span>
    <button class="delete-btn" title="Delete Task">✕</button>
  `;

  // --- ADD EVENT LISTENERS to the new buttons ---

  // Complete button → toggles "completed" class
  const completeBtn = li.querySelector('.complete-btn');
  completeBtn.addEventListener('click', () => toggleComplete(li));

  // Delete button → removes the task from DOM
  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteTask(li));

  // --- APPEND the new task to the list ---
  taskList.appendChild(li);

  // --- CLEAR the input field ---
  taskInput.value = '';

  // --- REFOCUS on input for quick adding ---
  taskInput.focus();

  // --- UPDATE the counter ---
  updateStats();

  // --- HIDE empty state ---
  updateEmptyState();
}


// 
//  STEP 3: TOGGLE COMPLETE FUNCTION
//  Adds or removes the "completed" class from a task
// 
function toggleComplete(taskItem) {
  taskItem.classList.toggle('completed');
  // .toggle() → adds class if missing, removes if present
  updateStats();
}


// 
//  STEP 4: DELETE TASK FUNCTION
//  Removes the task element from the DOM
// 
function deleteTask(taskItem) {
  // Add a fade-out effect before removing
  taskItem.style.transition = 'opacity 0.3s, transform 0.3s';
  taskItem.style.opacity    = '0';
  taskItem.style.transform  = 'translateX(20px)';

  // Wait for animation to finish, then remove from DOM
  setTimeout(() => {
    taskItem.remove(); // removes the <li> from the page
    updateStats();
    updateEmptyState();
  }, 300); // 300ms matches the CSS transition time
}


// 
//  STEP 5: UPDATE STATS COUNTER
//  Counts total tasks and completed tasks
// 
function updateStats() {
  const allTasks       = taskList.querySelectorAll('.task-item');
  const completedTasks = taskList.querySelectorAll('.task-item.completed');

  const total     = allTasks.length;
  const completed = completedTasks.length;

  // Update the text in the stats bar
  taskCount.textContent     = `${total} task${total !== 1 ? 's' : ''}`;
  completedCount.textContent = `${completed} completed`;
}


// 
//  STEP 6: UPDATE EMPTY STATE
//  Shows a message when there are no tasks
// 
function updateEmptyState() {
  const allTasks = taskList.querySelectorAll('.task-item');

  if (allTasks.length === 0) {
    emptyState.style.display = 'block'; // show "No tasks" message
  } else {
    emptyState.style.display = 'none';  // hide it
  }
}


// 
//  STEP 7: ERROR HELPERS
// 
function showError() {
  errorMsg.classList.add('show');

  // Auto-hide error after 3 seconds
  setTimeout(() => hideError(), 3000);
}

function hideError() {
  errorMsg.classList.remove('show');
}


// 
//  STEP 8: EVENT LISTENERS
//  Two ways to add a task — button click OR pressing Enter
// 

// Click the Add button
addBtn.addEventListener('click', addTask);

// Press Enter key inside the input
taskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask(); // same function, two ways to trigger it
  }
});

// 
//  STEP 9: INITIALIZE APP ON LOAD
//  Show empty state when page first loads
// 
updateEmptyState();
updateStats();