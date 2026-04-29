// This file contains the JavaScript code for the static site.
// You can add functions to manipulate the DOM, handle events, or perform other client-side operations.

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://loqujxhskaiqlwurcrdl.supabase.co';
const supabaseKey = 'sb_publishable_PvUfGDzNIwSwF21GeRVhPw_FxAxy2fC';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase client initialized:', supabase);

const VALID_EMAIL = 'rhsnake@gmail.com';
const VALID_PASSWORD = 'abc123';

function validateLogin(email, password) {
    return email === VALID_EMAIL && password === VALID_PASSWORD;
}

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

const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', handleLogin);
}

