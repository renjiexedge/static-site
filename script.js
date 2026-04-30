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

const tasks = document.querySelector('.task-manager');
if (tasks) {
    tasks.addEventListener('submit', submitTask);
}

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
    }
}
