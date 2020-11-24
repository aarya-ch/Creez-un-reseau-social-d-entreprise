// fonction pour récupérer et déchiffrer les token

export function getToken() {
  if (localStorage.getItem("token"))
    return CryptoJS.AES.decrypt(
      localStorage.getItem("token"),
      "disposal grumbly repeated contrite"
    ).toString(CryptoJS.enc.Utf8);
  else return null;
}
// fonction pour récupérer et dechifre le user
export function getUser() {
  if (localStorage.getItem("user"))
    return JSON.parse(
      CryptoJS.AES.decrypt(
        localStorage.getItem("user"),
        "disposal grumbly repeated contrite"
      ).toString(CryptoJS.enc.Utf8)
    );
  else return null;
}

const token = getToken();

// requête pour se connecter
export async function login(email, password) {
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.status !== 200) {
      return await response.json();
    }
    return await response.json();
  } catch (err) {
    return { ...err };
  }
}

(async () => {
  if (!token) {
    return;
  }
  // requête pour récupérer l'utilisateur
  try {
    const response = await fetch("http://localhost:3000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    });
    const jsonResponse = await response.json();
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
})();
