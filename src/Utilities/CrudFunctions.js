import axios from "axios";

// RECUPERER TOUS LES ELEMENTS
export async function getAllItems(API_LINK, token, signal) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    let items = await axios.get(API_LINK, config, { signal: signal }); // Le signal est interrompu si on change de page (evite les fuites de mémoires)
    return items.data;
  } catch (error) {
    console.log(error);
  }
}

// RECUPERER UN ELEMENT avec son id ou un autre paramètre (défini sous forme de string dans le searchParam; ex: ?name=dupont)

export const getOneItem = (searchParam, API_LINK, token, signal) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let item = axios
    .get(API_LINK + searchParam, config, { signal: signal }) // Le signal est interrompu si on change de page (evite les fuites de mémoires)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error.response);
    });
  return item;
};

// CREER UN ELEMENT
export function createItem(
  API_LINK,
  body,
  token,
  setDatas,
  setVisibleDatas,
  setMessage
) {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  let nomEmptyParamsBody = {};
  for (const property in body) {
    if (body[property]) nomEmptyParamsBody[property] = body[property];
  }

  let value = axios
    .post(API_LINK, nomEmptyParamsBody, config)
    .then((response) => {
      // Mise à jour de l'affichage le cas échéant, setDatas, setVisibleDatas, setMessage étant facultatif
      setDatas && setDatas((datas) => [...datas, response.data.item]);

      setVisibleDatas &&
        setVisibleDatas((datas) => [...datas, response.data.item]);

      setMessage &&
        setMessage({
          content: response.data.message,
          status: response.status,
        });
      return response.data.item;
    })
    .catch((error) => {
      console.log(error);
      setMessage &&
        setMessage({
          content: error.response.data.message,
          status: error.response.status,
        });
    });
  return value;
}

// CREER UN ELEMENT AVEC UNE IMAGE
export const createItemWithPicture = (
  API_LINK_ITEM,
  token,
  body,
  photo,
  setDatas,
  setVisibleDatas,
  setMessage
) => {
  let bodyFormData = new FormData();
  for (const property in body) {
    if (body[property]) bodyFormData.append(property, body[property]);
  }

  photo && bodyFormData.append("photo-server", photo);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  axios
    .post(API_LINK_ITEM, bodyFormData, config)
    .then((response) => {
      // Mise à jour de l'affichage
      // if (typeof setDatas != "undefined") {
      setDatas && setDatas((datas) => [...datas, response.data.item]);
      setVisibleDatas &&
        setVisibleDatas((datas) => [...datas, response.data.item]);
      setMessage({
        content: response.data.message,
        status: response.status,
      });
      //}
    })
    .catch((error) => {
      setMessage({
        content: error.response.data.message,
        status: error.response.status,
      });
    });
};

// METTRE A JOUR UN ELEMENT
export function updateItem(id, API_LINK, body, token, setDatas, setMessage) {
  const config = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  axios
    .patch(API_LINK + id, body, config)
    .then((response) => {
      setDatas && setDatas((datas) => datas.filter((data) => data._id !== id));
      setDatas && setDatas((datas) => [...datas, response.data.item]);
      setMessage &&
        setMessage({
          content: response.data.message,
          status: response.status,
        });
      console.log(`L'élément a bien été mis à jour`);
    })
    .catch((error) => {
      console.log(error);
      setMessage({
        content: error.response.data.message,
        status: error.response.status,
      });
    });
}

// METTRE A JOUR UN ELEMENT AVEC UNE IMAGE
export function updateItemWidthPicture(
  id,
  API_LINK,
  token,
  body,
  photo,
  setDatas,
  setVisibleDatas,
  setMessage
) {
  let bodyFormData = new FormData();
  Object.keys(body).map((param) => {
    body[param].length > 0 && bodyFormData.append(param, body[param]);
  });

  photo && bodyFormData.append("photo-server", photo);

  const config = {
    headers: {
      "content-type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  axios
    .patch(API_LINK + id, bodyFormData, config)
    .then((response) => {
      // Mise à jour de l'affichage
      setDatas((datas) =>
        datas.filter((data) => data._id !== response.data.item._id)
      );
      setDatas((datas) => [response.data.item, ...datas]);
      setVisibleDatas &&
        setVisibleDatas((datas) =>
          datas.filter((data) => data._id !== response.data.item._id)
        );
      setVisibleDatas &&
        setVisibleDatas((datas) => [response.data.item, ...datas]);
      setMessage({
        content: response.data.message,
        status: response.status,
      });
    })
    .catch((error) => {
      console.log(error);
      setMessage({
        content: error.response.data.message,
        status: error.response.status,
      });
    });
}

// SUPPRIMER UN ELEMENT
export function deleteItem(id, API_LINK, token, setDatas, setMessage) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  axios
    .delete(API_LINK + id, config)
    .then((response) => {
      // Mise à jour de l'affichage
      setDatas && setDatas((datas) => datas.filter((item) => item._id !== id));

      setMessage &&
        setMessage({
          content: response.data.message,
          status: response.status,
        });
    })
    .catch((error) => {
      console.log(error);
      setMessage({
        content: error.response.data.message,
        status: error.response.status,
      });
    });
}
