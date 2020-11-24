const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const errorEmail = document.querySelector('#erreuremail');
const errorPassword = document.querySelector('#erreurPassword');
import { login } from './js/auth.js';

// ajouter un listner pour recupere un les information password et email
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  try {

    //recuperer le resutat du login

    const response = await login(email, password);


    //si la clé token n'est pas dans la reponse donc les infos saisies sont erronées

    if(!('token' in response)){

      alert(response.message);

      return ;
    }

    // sinon connecté 
    if ('token' in response) {
      CryptoJS.utf;
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (error) {
    alert(error);
  }
});
