export function formatDate(date) {
  let mois = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  //  2020-12-21T00:00:00.000Z
  let dateElements = date.split("-");
  let day = dateElements[2][0] + dateElements[2][1];
  let month = parseInt(dateElements[1]);
  let year = dateElements[0];
  let monthString = mois[month - 1];
  return `${day} ${monthString} ${year}`;
}

export function formatDateForInput(date) {
  return date.substring(0, 10);
}
