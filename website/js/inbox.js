document.addEventListener('DOMContentLoaded', async () => {
    const userName = localStorage.getItem('hz_userName'); // This might be the full name or email
    // We need the email for the API. If localStorage only has the display name, 
    // we should store the email during login. 
    // Assuming 'hz_userEmail' is stored or we can deduce it.
    
    // Let's check what's in localStorage. If hz_userName is "Noah Renn", 
    // and we know the email pattern, we can use it. 
    // Actually, it's better to store the email explicitly during login.
    // For now, I'll try to use the email stored in a hypothetical 'hz_userEmail' key, 
    // or fallback to a logic that matches the name to the email.
    
    const userEmail = localStorage.getItem('hz_userEmail') || 'noah.renn@horizon.ac.at'; 

    const mailList = document.getElementById('mailList');
    const mailReaderSubject = document.querySelector('.mail-reader-subject');
    const mailReaderMeta = document.querySelector('.mail-reader-meta');
    const mailReaderBody = document.querySelector('.mail-reader-body');
    
    const btnCompose = document.getElementById('btnCompose');
    const composeModal = document.getElementById('composeModal');
    const closeCompose = document.getElementById('closeCompose');
    const btnSend = document.getElementById('btnSend');

    async function fetchMails() {
        try {
            const response = await axios.get(`/api/get-mail?username=${userEmail}`);
            const mails = response.data;
            renderMailList(mails);
        } catch (err) {
            console.error('Error fetching mails:', err);
            mailList.innerHTML += `<div class="mail-item" style="color: red;">Failed to load messages.</div>`;
        }
    }

    function renderMailList(mails) {
        // Remove existing items except the header
        const header = mailList.querySelector('.mail-list-header');
        mailList.innerHTML = '';
        mailList.appendChild(header);

        if (mails.length === 0) {
            mailList.innerHTML += `<div class="mail-item">No messages found.</div>`;
            return;
        }

        mails.forEach(mail => {
            const item = document.createElement('div');
            item.className = 'mail-item';
            item.innerHTML = `
                <div class="mail-item-info">
                    <span class="mail-item-subject">${mail.subject}</span>
                    <span class="mail-item-sender">${mail.from}</span>
                </div>
                <div class="mail-item-date">${mail.date}</div>
            `;
            item.onclick = () => {
                document.querySelectorAll('.mail-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                displayMail(mail);
            };
            mailList.appendChild(item);
        });
    }

    function displayMail(mail) {
        mailReaderSubject.textContent = mail.subject;
        mailReaderMeta.innerHTML = `<span>From: ${mail.from}</span><span>Date: ${mail.date}</span>`;
        mailReaderBody.textContent = mail.content;
    }

    // Compose Modal Logic
    btnCompose.onclick = () => composeModal.classList.add('active');
    closeCompose.onclick = () => composeModal.classList.remove('active');

    btnSend.onclick = async () => {
        const email = document.getElementById('mailTo').value;
        const content = document.getElementById('mailContent').value;

        if (!email || !content) {
            alert('Please fill in both the recipient and the message.');
            return;
        }

        try {
            const response = await axios.post('/api/send-mail', { email, content });
            alert(response.data.message);
            composeModal.classList.remove('active');
            document.getElementById('mailTo').value = '';
            document.getElementById('mailContent').value = '';
        } catch (err) {
            alert('Failed to send email. Please try again.');
        }
    };

    fetchMails();
});
