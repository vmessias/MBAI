document.addEventListener('DOMContentLoaded', () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    
    const scrolly = document.getElementById('scrolly');
    if (!scrolly || typeof scrollama !== 'function') {
        console.error('Scrollama not loaded or #scrolly missing');
        return;
    }
    const applyStep = (index) => {
        scrolly.classList.remove('step-1','step-2','step-3','step-4','step-5','step-6','step-7');
        scrolly.classList.add(`step-${index+1}`);
    };
    
    const steps = Array.from(document.querySelectorAll('#scrolly .step'));
    const videoIdx = steps.findIndex(el => el.id === 'step-video');
    const videoIdx2 = steps.findIndex(el => el.id === 'step-video-2');
    const statsIdx = steps.findIndex(el => el.id === 'step-stats');
    const conclusionIdx = steps.findIndex(el => el.id === 'step-conclusion');
    
    const video1 = document.getElementById('cholera-video');
    const video2 = document.getElementById('cholera-video-2');
    const replayBtn = document.getElementById('replay-btn');
    const replayBtn2 = document.getElementById('replay-pumps');
    const startVideo = (video, replayBtnEl) => {
        if (!video) return;
        try { video.pause(); } catch(e) {}
        try { video.currentTime = 0; } catch(e) {}
        try {
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
        } catch(e) {}
        if (replayBtnEl) replayBtnEl.classList.add('hidden');
        setTimeout(() => {
            video.muted = false;
            const p = video.play();
            if (p && typeof p.then === 'function') {
                p.catch(() => {
                    video.muted = true;
                    video.play().catch(()=>{});
                });
            }
        }, 200);
    };
    const resetAllVideos = () => {
        if (video1) { 
            try { video1.pause(); video1.currentTime = 0; } catch(e) {} 
            if (replayBtn) replayBtn.classList.add('hidden');
        }
        if (video2) { 
            try { video2.pause(); video2.currentTime = 0; } catch(e) {} 
            if (replayBtn2) replayBtn2.classList.add('hidden');
        }
    };
    if (video1 && replayBtn) {
        video1.addEventListener('ended', () => replayBtn.classList.remove('hidden'));
        replayBtn.addEventListener('click', () => startVideo(video1, replayBtn));
    }
    
    if (video2 && replayBtn2) {
        video2.addEventListener('ended', () => replayBtn2.classList.remove('hidden'));
        replayBtn2.addEventListener('click', () => startVideo(video2, replayBtn2));
    }
    const conclusionOverlay = document.querySelector('.overlay-conclusion');
    
    if (conclusionOverlay) {
        const observer = new MutationObserver(() => {
            if (scrolly.classList.contains('step-7')) {
                conclusionOverlay.scrollTop = 0;
                setTimeout(() => {
                    conclusionOverlay.scrollTop = 0;
                }, 50);
            }
        });
        
        observer.observe(scrolly, { attributes: true, attributeFilter: ['class'] });
    }
    
    const scroller = scrollama();
    
    scroller
    .setup({ 
        step: '#scrolly .step', 
        offset: 0.5,
        debug: false 
    })
    .onStepEnter(({ index }) => {
        applyStep(index);
        
        if (index === videoIdx) {
            if (video2) {
                try { video2.pause(); video2.currentTime = 0; } catch(e) {} 
                if (replayBtn2) replayBtn2.classList.add('hidden'); 
            }
            startVideo(video1, replayBtn);
        } else if (index === videoIdx2) {
            if (video1) {
                try { video1.pause(); video1.currentTime = 0; } catch(e) {} 
                if (replayBtn) replayBtn.classList.add('hidden'); 
            }
            startVideo(video2, replayBtn2);
        } else if (index === statsIdx || index === conclusionIdx) {
            resetAllVideos();
        } else {
            resetAllVideos();
        }
    })
    .onStepExit(({ index, direction }) => {
        if (index === videoIdx && direction === 'up' && video1) {
            try { video1.pause(); video1.currentTime = 0; } catch(e) {} 
            if (replayBtn) replayBtn.classList.add('hidden');
        }
        if (index === videoIdx2 && direction === 'up' && video2) { 
            try { video2.pause(); video2.currentTime = 0; } catch(e) {} 
            if (replayBtn2) replayBtn2.classList.add('hidden');
        }
        if ((index === statsIdx || index === conclusionIdx) && direction === 'up') {
            resetAllVideos();
        }
    });
    setTimeout(() => scroller.resize(), 100);
    window.addEventListener('resize', () => scroller.resize());
});
