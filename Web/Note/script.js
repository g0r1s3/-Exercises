"use strict"

function getCurrentFormattedTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const year = String(now.getFullYear()).slice(-2); // Letzten 2 Stellen des Jahres
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // z.B. "29.10.24 | 07:57"
    return `${day}.${month}.${year} | ${hours}:${minutes}`;
}

