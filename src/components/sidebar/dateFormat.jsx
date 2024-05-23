

export default function Dateformat(date) {
    let firstD = date.split("T")[0];
    let secondD = date.split("T")[1].replace("Z", "");
    date = firstD.split("T")[0].replaceAll("-", " ").split(" ");

    return `${date[2]}-${date[1]}-${date[0]} ${secondD}`;
}