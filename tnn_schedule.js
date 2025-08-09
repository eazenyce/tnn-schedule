document.addEventListener("DOMContentLoaded", async () => {
    // ✅ Set your real logo URL here
    const logoUrl = "https://i.imgur.com/iEBHPPC.png";

    // ✅ URL to your schedule JSON
    const scheduleUrl = "https://eazenyce.github.io/tnn-schedule/schedule.json";

    // ✅ Make sure the container exists
    const container = document.getElementById("tnn-schedule");
    if (!container) {
        console.error("❌ No #tnn-schedule container found in HTML. Add: <div id='tnn-schedule'></div>");
        return;
    }

    try {
        // Fetch schedule JSON
        const response = await fetch(scheduleUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const scheduleData = await response.json();

        // Create header with logo
        const header = document.createElement("div");
        header.classList.add("tnn-schedule-box");
        header.innerHTML = `<img src="${logoUrl}" alt="TNN Logo" style="max-width:150px;">`;
        container.appendChild(header);

        // Group shows by day
        const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const showsByDay = {};
        daysOrder.forEach(day => showsByDay[day] = []);

        scheduleData.forEach(show => {
            const day = show["Day "]?.trim();
            if (showsByDay[day]) showsByDay[day].push(show);
        });

        // Get current day/time
        const now = new Date();
        const currentDay = daysOrder[now.getDay()];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Create schedule grid
        const grid = document.createElement("div");
        grid.classList.add("schedule-grid");

        daysOrder.forEach(day => {
            if (showsByDay[day].length === 0) return;

            // Day title
            const dayTitle = document.createElement("h3");
            dayTitle.textContent = day;
            dayTitle.style.textAlign = "center";
            grid.appendChild(dayTitle);

            showsByDay[day].forEach(show => {
                const timeParts = show.Time.toLowerCase().includes("p") || show.Time.toLowerCase().includes("a")
                    ? parseTime12(show.Time)
                    : parseTime24(show.Time);

                const startMinutes = timeParts.hours * 60 + timeParts.minutes;
                const endMinutes = startMinutes + (parseInt(show["Duration (min)"]) || 60);

                // Create block
                const block = document.createElement("div");
                block.classList.add("show-block");

                // Highlight if "Now Playing"
                if (day === currentDay && currentTime >= startMinutes && currentTime < endMinutes) {
                    block.classList.add("now-playing");
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
