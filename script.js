// This file contains the JavaScript code for the static site.
// You can add functions to manipulate the DOM, handle events, or perform other client-side operations.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://loqujxhskaiqlwurcrdl.supabase.co';
const supabaseKey = 'sb_publishable_PvUfGDzNIwSwF21GeRVhPw_FxAxy2fC';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized:', supabase);

const VALID_EMAIL = 'rhsnake@gmail.com';
const VALID_PASSWORD = 'abc123';

// Function to validate login credentials.(Needs to be replaced with Supabase authentication in production)
function validateLogin(email, password) {
    return email === VALID_EMAIL && password === VALID_PASSWORD;
}

// Handle form submission for login.
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email')?.value.trim() || '';
    const password = document.getElementById('password')?.value || '';

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    if (!validateLogin(email, password)) {
        alert('Invalid email or password.');
        return;
    }

    window.location.href = 'homecare_crm.html';
}
// Attach event listener to the FIRST class with the 'login' selector.
const form = document.querySelector('.login');
if (form) {
    form.addEventListener('submit', handleLogin);
}
// Handle form submission for task manager.
const tasks = document.querySelector('.task-manager');
if (tasks) {
    tasks.addEventListener('submit', submitTask);
}
// Function to submit a new task to the Supabase database.
async function submitTask(event) {
    event.preventDefault();
    const taskTitle = document.getElementById('task-title')?.value.trim() || '';
    const taskDesc = document.getElementById('task-desc')?.value.trim() || '';
    
    const { error } = await supabase.from('TaskManager').insert([{ Task_Title: taskTitle, Task_Description: taskDesc }]);
    if (error) {
        console.error('Error submitting task:', error.message);
        alert('Error submitting task.');
    } else {
        alert('Task submitted successfully!');
        await loadTasks(); // Refresh the task list after adding a new task.
    }
}

async function loadTasks() {
  const { data:tasks, error } = await supabase
    .from('TaskManager')
    .select('id, Task_Title, Task_Description');

  if (error) {
    console.error('Error loading tasks:', error.message);
    document.getElementById('task-list').innerHTML = '<p>Failed to load tasks.</p>';
    return;
  }

  const container = document.getElementById('task-list');
  if (!tasks || tasks.length === 0) {
    container.innerHTML = '<p>No tasks yet.</p>';
    return;
  }

  container.innerHTML = tasks
    .map(
      (task) => `
        <div class="task-item" data-id="${task.id}">
          <h4>${task.Task_Title}</h4>
          <p>${task.Task_Description}</p>
          <button type="button" class="edit-btn" data-id="${task.id}">Edit</button>
          <button type="button" class="delete-btn" data-id="${task.id}">Delete</button>
        </div>
      `
    )
    .join('');
}
// Load tasks when the page is loaded.
document.addEventListener('DOMContentLoaded', loadTasks);

async function deleteTask(id) {
    const { error } = await supabase.from('TaskManager').delete().eq('id', id);
    if (error) {
        console.error('Error deleting task:', error.message);
        alert('Error deleting task.');
    } else {
        alert('Task deleted successfully!');
        await loadTasks(); // Refresh the task list after deleting a task.
    }
}

//lines 108-180 needs to be reviewed and tested for edit functionality. The edit form is created dynamically and attached to the task item when the edit button is clicked. The form allows users to update the task title and description, and then saves the changes to the Supabase database when the save button is clicked. The cancel button allows users to close the edit form without making any changes.
let activeEditForm = null;

//closes any open edit form before opening a new one to ensure only one edit form is open at a time. It removes the form from the DOM and resets the activeEditForm variable. This function is called when the user clicks the cancel button or when they click the edit button on another task while an edit form is already open.
function closeEditForm() {
  if (activeEditForm) {
    activeEditForm.remove();
    activeEditForm = null;
  }
}

// This function creates and opens an edit form for a specific task item.
function openEditForm(taskItem, id, currentTitle, currentDesc) {
  closeEditForm();
//The form is created dynamically and includes input fields for the title and description, as well as save and cancel buttons.
  const form = document.createElement('form');
  form.className = 'edit-form';
  form.innerHTML = `
    <div class="edit-form-row">
      <label>Task title</label>
      <input type="text" data-edit="title" placeholder="${currentTitle}" />
    </div>
    <div class="edit-form-row">
      <label>Task description</label>
      <input type="text" data-edit="desc" placeholder="${currentDesc}" />
    </div>
    <div class="edit-form-actions">
      <button type="button" class="confirm-edit-btn">Save</button>
      <button type="button" class="cancel-edit-btn">Cancel</button>
    </div>
  `;

  // It takes the task item element, the task ID, and the current title and description as parameters. 
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  const titleInput = form.querySelector('[data-edit="title"]');
  const descInput = form.querySelector('[data-edit="desc"]');
  const confirmBtn = form.querySelector('.confirm-edit-btn');
  const cancelBtn = form.querySelector('.cancel-edit-btn');

  confirmBtn.addEventListener('click', async () => {
    const newTitle = titleInput.value.trim() || currentTitle;
    const newDesc = descInput.value.trim() || currentDesc;
    if (!newTitle && !newDesc) {
      alert('Please provide a task title or description to update.');
      return;
    }
    await editTask(id, newTitle, newDesc);
    closeEditForm();
  });

  cancelBtn.addEventListener('click', (event) => {
    event.preventDefault();
    closeEditForm();
  });

  taskItem.appendChild(form);
  activeEditForm = form;
}

// Add edit click listener on the task list. Opens the edit form if valid.
document.getElementById('task-list').addEventListener('click', (event) => {
  const btn = event.target;

  if (btn.classList.contains('edit-btn')) {
    const id = btn.getAttribute('data-id');
    const taskItem = btn.closest('.task-item');
    if (id && taskItem) {
      const currentTitle = taskItem.querySelector('h4')?.textContent.trim() || '';
      const currentDesc = taskItem.querySelector('p')?.textContent.trim() || '';
      openEditForm(taskItem, id, currentTitle, currentDesc);
    }
    return;
  }

  // If user clicked a delete button
  if (btn.classList.contains('delete-btn')) {
    const id = btn.getAttribute('data-id');
    if (id) {
      deleteTask(id);
    }
  }
});

async function editTask(id, newTitle, newDesc) {
    const { error } = await supabase.from('TaskManager').update({ Task_Title: newTitle, Task_Description: newDesc }).eq('id', id);
    if (error) {
        console.error('Error editing task:', error.message);
        alert('Error editing task.');
    } else {
        alert('Task edited successfully!');
        await loadTasks(); // Refresh the task list after editing a task.
    }
}


