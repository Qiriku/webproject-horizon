document.addEventListener('DOMContentLoaded', () => {
    const lectureList = document.getElementById('lecture-list');
    const scheduleTitle = document.getElementById('schedule-title');
    const form = document.getElementById('addLectureForm');

    async function loadTimetable() {
        try {
            const response = await axios.get('/api/timetable');
            scheduleTitle.innerText = response.data.name;
            lectureList.innerHTML = response.data.lectures.map(l => 
                `<li style="border-bottom: 1px dashed #ccc; padding: 0.5rem 0;">
                    <strong>${l.title}</strong><br>
                    <span style="font-size: 0.8rem; color: var(--secondary-color);">${new Date(l.datetime).toLocaleString()}</span>
                </li>`
            ).join('');
        } catch (error) {
            lectureList.innerHTML = '<li style="color:red;">Error loading timetable.</li>';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('lectureTitle').value;
        const datetime = document.getElementById('lectureDate').value;

        try {
            await axios.post('/api/timetable', { title, datetime });
            form.reset();
            loadTimetable(); 
        } catch (error) {
            alert('Failed to add lecture.');
        }
    });

    loadTimetable();
});