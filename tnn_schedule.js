document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("tnn-schedule");
  const scheduleBox = document.createElement("div");
  scheduleBox.className = "tnn-schedule-box";

  const logo = document.createElement("img");
  logo.src = "https://i.imgur.com/Z8ef2of.png"; // Replace if you host your own logo
  logo.alt = "TNN Logo";
  logo.style.maxWidth = "200px";
  logo.style.display = "block";
  logo.style.margin = "0 auto 1.5rem";
  scheduleBox.appendChild(logo);

  try {
    const res = await fetch("https://raw.githubusercontent.com/eazenyce/tnn-schedule/main/tnn_schedule.json");
    const data = await res.json();

    const schedule = document.createElement("div");
    schedule.className = "schedule-grid";

    data.forEach((show) => {
      const showDiv = document.createElement("div");
      showDiv.className = "show-block";

      showDiv.innerHTML = `
        <div class="show-time">${show.Time}</div>
        <div class="show-title">${show["Show Title"]}</div>
        <div class="show-host">${show.Host}</div>
        <div class="show-genre">${show.Genre}</div>
      `;

      schedule.appendChild(showDiv);
    });

    scheduleBox.appendChild(schedule);
    container.appendChild(scheduleBox);
  } catch (error) {
    console.error("Error loading schedule:", error);
    container.innerHTML = "<p>Error loading schedule.</p>";
  }
});
