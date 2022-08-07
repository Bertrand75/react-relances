import axios from "axios";

// Vérifier si l'utilisateur est un admin
export async function AdminAccess(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let access = await axios
    .get(process.env.REACT_APP_API_LINK_USER + "authorization", config) // On utilise le get (et non le post) car le token est dans le header
    .then((response) => response.status)
    .catch((error) => {
      console.log(error);
    });

  return access === 200 ? true : false;
}

// Vérifier si le token est celui d'un utilisateur (et non modifié de manière malveillante par exemple)
export async function basicAccess(token) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let access = await axios
    .get(process.env.REACT_APP_API_LINK_USER + "tokencheck", config) // On utilise le get (et non le post) car le token est dans le header
    .then((response) => response.status)
    .catch((error) => {
      console.log(error);
    });

  return access === 200 ? true : false;
}
