const loginForm = document.querySelector('#sign-up-form');
const usernameInput = document.querySelector('#username');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const errorEmail = document.querySelector('#erreuremail');
const errorPassword = document.querySelector('#erreurPassword');

import {login} from './js/auth.js';

// masquer les messages d'erreurs par defaut
errorPassword.style.display="none";
errorEmail.style.display="none";

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  if (validInput(email, password)) {
    const response = await signUp(username, email, password);
    if (response.token) {
      
    localStorage.setItem(
      'user',
      CryptoJS.AES.encrypt(
        JSON.stringify(response.user),
        'disposal grumbly repeated contrite'
      ).toString()
    );

    localStorage.setItem(
      'token',
      CryptoJS.AES.encrypt(
        String(response.token),
        'disposal grumbly repeated contrite'
      ).toString()
    );
      if (!auth) {
        var auth = response.user;
      } else {
        auth = response.user;
      }
      window.location.replace('/forum.html');
    } else {
      // afficher un message d'erreur
    }
  }
});

// test email et password avec expression régulière

const validInput = (email, password) => {
  let test_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
  let test_password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;

  errorEmail.style.display="none";
  errorPassword.style.display="none";
  if (!email.match(test_email)) {
    errorEmail.innerHTML = 'Email invalide';
    errorEmail.style.display="block";

    return false;
  }
  if (!password.match(test_password)) {
    errorPassword.innerHTML =
      'Le mot de passe doit contenir entre 6 et 20 caractères, au minimum une minuscule, une majuscule, un nombre et un caractère spécial !';
      errorPassword.style.display="block";
    return false;
  }
  return true;
};



// requête pour inscrire un utilisateur
async function signUp(username, email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        type: 'user',
      }),
    });
    
    if (response.status === 401) {
      alert('Email déja utilisé');

      return null;
    }

    return await login(email, password);
  } catch (err) {
    return null;
  }
}
