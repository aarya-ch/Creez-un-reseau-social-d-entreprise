//deconnexion
const disconnectBtn = document.querySelector('#disconnect');

disconnectBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.replace('/index.html');
});
