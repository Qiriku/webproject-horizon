document.addEventListener('DOMContentLoaded', () => {
    // 25% chance to trigger the glitch
    if (Math.random() < 0.25) {
        const deanImg = document.getElementById('dean-vale-img');
        
        if (deanImg) {
            deanImg.classList.add('glitch-active');
            
            const title = deanImg.querySelector('.placeholder-title');
            const desc = deanImg.querySelector('.placeholder-desc');
            if (title) title.innerText = "D E A N _ C O R R U P T E D";
            if (desc) desc.innerText = "vale_error_unstable.bin";
        }
    }
});