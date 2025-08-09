document.addEventListener("DOMContentLoaded", async () => {
    const logoUrl = "https://i.imgur.com/iEBHPPC.png";
    const scheduleUrl = "https://eazenyce.github.io/tnn-schedule/schedule.json";

    const container = document.getElementById("tnn-schedule");
    if (!container) return console.error("No #tnn-schedule container found on page.");

    try {
        const response = await fetch(scheduleUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const scheduleData = await response.json();

        // Header
        const header = document.createElement("div");
        header.classList.add("tnn-schedule-box");
        header.innerHTML = `<img src="${logoUrl}" alt="TNN Logo" style="max-width:150px;">`;
        container.appendChild(header);

        // Now Playing Panel
        const nowPlayingPanel = document.createElement("div");
        nowPlayingPanel.classList.add("now-playing-panel");
        nowPlayingPanel.style.display = "none"; 
        container.appendChild(nowPlayingPanel);

        // Group shows by day
        const daysOrder = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const showsByDay = {};
        daysOrder.forEach(day => showsByDay[day] = []);
        scheduleData.forEach(show => {
            const day = show["Day "].trim();
            if (showsByDay[day]) showsByDay[day].push(show);
        });

        const now = new Date();
        const currentDay = daysOrder[now.getDay()];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Build schedule
        const grid = document.createElement("div");
        grid.classList.add("schedule-grid");

        let todayElement = null;

        daysOrder.forEach(day => {
            if (!showsByDay[day].length) return;

            const dayTitle = document.createElement("h3");
            dayTitle.textContent = day;
            grid.appendChild(dayTitle);
            if (day === currentDay) todayElement = dayTitle;

            showsByDay[day].forEach(show => {
               // Inside the showsByDay[day].forEach(show => { ... }) loop
const block = document.createElement("div");
block.classList.add("show-block");

// Remove title attribute & use custom tooltip
const tooltipText = show.Description || "No description available.";
block.innerHTML = `
    <div class="show-time">${show.Time}</div>
    <div class="show-title">${show["Show Title"]}</div>
    <div class="show-host">Host: ${show.Host}</div>
    <div class="show-genre">Genre: ${show.Genre}</div>
    <div class="tooltip">${tooltipText}</div>
`;


                // Highlight Now Playing
                if (day === currentDay && currentTime >= startMinutes && currentTime < endMinutes) {
                    block.classList.add("now-playing");
                    nowPlayingPanel.innerHTML = `Now Playing: ${show["Show Title"]} — ${show.Host}`;
                    nowPlayingPanel.style.display = "block";
                }

                block.innerHTML = `
                    <div class="show-time">${show.Time}</div>
                    <div class="show-title">${show["Show Title"]}</div>
                    <div class="show-host">Host: ${show.Host}</div>
                    <div class="show-genre">Genre: ${show.Genre}</div>
                `;

                grid.appendChild(block);
            });
        });

        container.appendChild(grid);

        // Auto-scroll to today
        if (todayElement) {
            setTimeout(() => {
                todayElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        }

    } catch (error) {
        console.error("Error loading schedule:", error);
    }
});

// Helper functions
function parseTime12(timeStr) {
    const match = timeStr.match(/(\d+):?(\d*)\s*(a|p)/i);
    if (!match) return { hours: 0, minutes: 0 };
    let hours = parseInt(match[1]);
    let minutes = parseInt(match[2] || "0");
    const ampm = match[3].toLowerCase();
    if (ampm === "p" && hours !== 12) hours += 12;
    if (ampm === "a" && hours === 12) hours = 0;
    return { hours, minutes };
}

function parseTime24(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours: hours || 0, minutes: minutes || 0 };
}
