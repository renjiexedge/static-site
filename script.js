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
    event.preventDefault();
    
    const { error } = await supabase.from('TaskManager').delete().eq('id', id);
    if (error) {
        console.error('Error deleting task:', error.message);
        alert('Error deleting task.');
    } else {
        alert('Task deleted successfully!');
        await loadTasks(); // Refresh the task list after deleting a task.
    }
}

// Add click listener on the task list (delegation)
document.getElementById('task-list').addEventListener('click', (event) => {
  const btn = event.target;

  // If user clicked a delete button
  if (btn.classList.contains('delete-btn')) {
    const id = btn.getAttribute('data-id');
    if (id) {
      deleteTask(id);
    }
  }
});

//edit functionality needs to be implemented.