document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get('/api/people');
        const { students, staff } = response.data;

        const staffList = document.getElementById('staff-list');
        const studentList = document.getElementById('student-list');

        staffList.innerHTML = staff.map(s => `<li><strong>${s.name}</strong> <br><span style="font-size:0.8rem; color:gray;">${s.email}</span></li>`).join('');
        studentList.innerHTML = students.map(s => `<li><strong>${s.name}</strong> <br><span style="font-size:0.8rem; color:gray;">${s.email}</span></li>`).join('');
    } catch (error) {
        console.error('Failed to load people:', error);
        document.getElementById('staff-list').innerHTML = '<li style="color:red;">Error loading directory.</li>';
    }
});