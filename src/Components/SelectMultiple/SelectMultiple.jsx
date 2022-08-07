import React, { useState, useEffect, useContext } from "react";
import Context from "../../Context/Context";
import { getAllItems } from "../../Utilities/CrudFunctions";

export default function SelectMultiple(props) {
  const { selectedItems, setSelectedItems, itemsType } = props;
  let [items, setItems] = useState([]);
  const { token } = useContext(Context);

  const handleChange = (event) => {
    // récupérer un tableau des id à partir de la HTML collection
    let newValues = [];
    for (let index = 0; index < event.target.selectedOptions.length; index++) {
      newValues.push(event.target.selectedOptions[index].value);
    }
    // Attribuer ces id à selectedItems
    setSelectedItems(newValues);
  };

  // Récupération de la liste des items

  useEffect(() => {
    if (token) {
      let abortController;
      abortController = new AbortController();
      let signal = abortController.signal;
      const fetchDatas = async () => {
        let itemsDatas = await getAllItems(
          process.env.REACT_APP_API_LINK + itemsType,
          token,
          signal
        );
        itemsDatas && setItems(itemsDatas);
      };
      fetchDatas();
      return () => abortController.abort();
    } else {
      setItems([]);
    }
  }, [token, itemsType]);

  return (
    <select
      multiple
      onChange={(event) => {
        handleChange(event);
      }}
      value={selectedItems}
      className="inputClass"
    >
      {items.map((item) => {
        return (
          <option
            key={item._id + "select"}
            value={item._id}
            //selected={selectedItems.includes(item._id)}
          >
            {(itemsType === "topic" || itemsType === "newspaper") && item.name}
            {itemsType === "journalist" && item.lastname + " " + item.firstname}
            {itemsType === "client" && item.nom}
          </option>
        );
      })}
    </select>
  );
}
