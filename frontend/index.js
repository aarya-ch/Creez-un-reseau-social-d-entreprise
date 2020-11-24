import { getToken } from './js/auth.js';
const connectedNavBar = document.getElementById('connected');
const disconnectNavBar = document.getElementById('disconnect');

//  changer le navBar en fonction de l'etat du user
if (getToken()) {
  disconnectNavBar.style.display = 'none';
} else {
  connectedNavBar.style.display = 'none';
}
