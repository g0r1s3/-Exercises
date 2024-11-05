"use strict";

const footerText = document.getElementById("footer-text");
const currentYear = new Date().getFullYear();
footerText.textContent = `© ${currentYear} ConsciousQuest`;
