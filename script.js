
"use strict";

/*
 * HPL Season 5
 * Frontend interactions and API connection.
 * Never place API secrets or admin passwords in this file.
 */

const HPL_API_ENDPOINT = "/api/hpl";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupSectionMessages();
  console.log("HPL Season 5 website initialized.");
});

function setupNavigation() {
  document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

function setupSectionMessages() {
  const sections = [
    ["#teams", "Team information will be connected to the tournament database."],
    ["#matches", "Match schedules and results will be connected to the tournament database."],
    ["#points", "Points table data will be connected to the tournament database."]
  ];

  sections.forEach(([selector, message]) => {
    const section = document.querySelector(selector);
    if (section) section.dataset.status = message;
  });
}

/*
 * Shared API helper.
 * The Google Apps Script backend and hosting proxy will be connected
 * in a later step. This function is not yet called by registration forms.
 */
async function hplApi(action, args = {}) {
  const response = await fetch(HPL_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store",
    body: JSON.stringify({ action, args })
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("The HPL server returned an invalid response.");
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.error || "The HPL request failed.");
  }

  return result.data;
}
