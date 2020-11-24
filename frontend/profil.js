const form = document.querySelector('#profile-form');
const userName = document.querySelector('#user-name');
import { getToken, getUser } from '/js/auth.js';

// changer le userName en fonction de l'utilisateur
userName.innerHTML = "Nom d'utilistateur : " + getUser().username;

// requête pour la supression du compte de user
async function delAccount() {
  const user = getUser();
  try {
    const response = await fetch(
      `http://localhost:3000/api/auth/${user.id_user}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: getToken(),
        },
      }
    );
    if (response.status !== 200) {
      return null;
    }
    const res = await response.json();
    return res;
  } catch (err) {
    console.error(err.message);
    return [];
  }
}

// ajouter un event lisnter pour l'evenement submit dans le formulaire
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const r = await delAccount();
  if ((r.message = 'Account deleted')) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.replace('/index.html');
  }
});
