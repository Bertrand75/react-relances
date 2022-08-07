import React, { useState, useEffect } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import styles from "./StarRating.module.css";

export default function StarRating({ rating, setRating }) {
  // Tableau des index des étoiles
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={styles.starContainer}>
      {stars.map((starIndex) => {
        return (
          <div
            key={"star" + starIndex}
            className={styles.star}
            id={starIndex}
            onMouseEnter={() => setRating(starIndex)}
          >
            {rating < starIndex ? <FaRegStar /> : <FaStar />}
          </div>
        );
      })}
    </div>
  );
}
