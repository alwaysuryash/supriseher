/**
 * Surprise Her — GSAP Animation Controller
 * Song: "Dandelions" by Ruth B.
 *
 * EXACT vocal anchor points in the MP3:
 *   66.9 s  → "I'm in a field of dandelions"
 *   72.0 s  → "Wishing on every one"
 *   75.5 s  → "that you'd be mine"
 *   83.4 s  → "I see forever in your eyes"
 *   87.0 s  → "I feel okay when I see you smile"
 *   90.5 s  → music fades out
 *
 * We seek to AUDIO_START = 66.5 s.
 * All animation times (t) are seconds after the seek point:
 *   audio_time = 66.5 + t
 *
 * Scene anchors (mapped to exact vocals):
 *   t = 0.4  → "I'm in a field…"          (lyric visible)
 *   t = 5.5  → "Wishing on every one…"     (typewriter starts)
 *   t = 9.0  → "…that you'd be mine"       (heart completes)
 *   t = 16.9 → "I see forever in your eyes"(lyric + iris start)
 *   t = 20.5 → "I see you smile"           (Smile :) appears)
 *   t = 24   → Song fades, Scene 5 opens
 */
window.onload = function() {
    // Replace with your actual Vercel API endpoint (Step 2)
    fetch('/api/track-open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'Site Opened', timestamp: new Date() })
    })
    .then(() => console.log('Notification sent!'))
    .catch(err => console.error('Tracking error:', err));
};

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(TextPlugin);

    const AUDIO_START = 66.5;   // seek point in the MP3
    const AUDIO_DUR   = 24.5;   // seconds of audio to play

    const music    = document.getElementById('background-music');
    const overlay  = document.getElementById('start-overlay');
    const startBtn = document.getElementById('start-button');

    function $$(sel){ return document.querySelector(sel); }
    function id(x)  { return document.getElementById(x); }

    /* ── refs ── */
    const bg1=id('bg1'),bg2=id('bg2'),bg3=id('bg3'),bg4=id('bg4'),bg5=id('bg5');
    const s1=id('scene1'),s2=id('scene2'),s3=id('scene3'),s4=id('scene4'),s5=id('scene5');

    startBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        music.currentTime = AUDIO_START;
        music.volume = 1;
        music.play().catch(()=>{});

        // Auto-fade out music
        setTimeout(() => {
            gsap.to(music, { volume:0, duration:2.2,
                onComplete:()=>{ music.pause(); music.volume=1; } });
        }, (AUDIO_DUR - 2.2) * 1000);

        buildTL();
    });

    /* ══════════════════════════════════════════════════
       MASTER TIMELINE
       All timestamps are relative to the seek point.
       ══════════════════════════════════════════════════ */
    function buildTL() {
        const tl = gsap.timeline();

        /* ═══════════════════════════════════════════════
           SCENE 1  |  t = 0 – 2.8 s
           "I'm in a field of dandelions"
           Three Polaroids spring-slide in.
           Lyric text fires at t=0.4 (exact vocal onset).
           ═══════════════════════════════════════════════ */
        tl.to([bg1,s1], { opacity:1, duration:0.5 }, 0);

        // Centre polaroid drops from top
        tl.from('#p-center', {
            y:'-115vh', rotation:5, scale:0.72,
            duration:0.9, ease:'back.out(1.5)'
        }, 0.0);

        // Side polaroids elastic-slide
        tl.from('#p-left',  { x:'-115vw', rotation:-22, duration:0.85, ease:'elastic.out(1,.6)' }, 0.3);
        tl.from('#p-right', { x:'115vw',  rotation:22,  duration:0.85, ease:'elastic.out(1,.6)' }, 0.5);

        // Lyric: "I'm in a field of…" — exact vocal at t=0.4
        tl.to('#lyric-s1', { opacity:1, y:-16, duration:0.9, ease:'power2.out' }, 0.4);
        tl.to('#lyric-s1', { opacity:0, duration:0.6 }, 2.4);

        // Fade out Scene 1 by t=2.8
        tl.to([s1,bg1], { opacity:0, duration:0.5 }, 2.6);


        /* ═══════════════════════════════════════════════
           SCENE 2  |  t = 2.8 – 5.2 s
           Sketchbook: "Dandelions" circled, quick page flip.
           Must EXIT by t=5.2 so Scene 3 is ready at t=5.5.
           ═══════════════════════════════════════════════ */
        tl.call(spawnLeaves, null, 2.7);
        tl.to([bg2,s2], { opacity:1, duration:0.5 }, 2.8);

        // Sketchbook rises up fast
        tl.from('#sketchbook', {
            y:'65vh', scale:0.8, opacity:0,
            duration:0.9, ease:'back.out(1.5)'
        }, 3.0);

        // "Dandelions" pops in
        tl.fromTo('#lyric-dandelions',
            { opacity:0, scale:0.7 },
            { opacity:1, scale:1, duration:0.6, ease:'back.out(2.2)' },
            3.6
        );

        // Red circle draws (0.85 s) → done by ~t=4.5
        tl.to('#circle-path', { strokeDashoffset:0, duration:0.85, ease:'power1.inOut' }, 3.75);

        // Page flip at t=4.5 (on the "beat")
        tl.call(()=>{ id('flip-page').style.display='block'; }, null, 4.5);
        tl.fromTo('#flip-page',
            { rotationY:0, transformOrigin:'left center' },
            { rotationY:-180, duration:0.6, ease:'power2.inOut' },
            4.5
        );
        tl.call(()=>{
            id('page-photo1').style.display='none';
            id('page-photo2').style.display='block';
        }, null, 4.8);

        // Fade out Scene 2 by t=5.2
        tl.to([s2,bg2], { opacity:0, duration:0.5 }, 5.0);


        /* ═══════════════════════════════════════════════
           SCENE 3  |  t = 5.2 – 16.5 s
           Vinyl record, stacked polaroids, notepad.
           TYPEWRITER starts at t=5.5 = "Wishing on every one…"
           HEART completes at t=9.0 = "…that you'd be mine"
           ═══════════════════════════════════════════════ */
        tl.to([bg3,s3], { opacity:1, duration:0.6 }, 5.2);

        // Vinyl sweeps in
        tl.fromTo('#vinyl-wrap',
            { x:'-68vw', rotation:-180, opacity:0 },
            { x:0,        rotation:0,   opacity:0.7, duration:1.3, ease:'power3.out' },
            5.2
        );

        // Scattered polaroids thrown down
        tl.from('#sc1', { y:'-115vh', rotation:-55, scale:0.55, duration:0.75, ease:'bounce.out' }, 5.6);
        tl.from('#sc2', { y:'115vh',  x:'55vw', rotation:65, scale:0.55, duration:0.75, ease:'bounce.out' }, 5.85);

        // Notepad stack pops up — must be visible BEFORE typewriter
        tl.from('#notepad-stack', { scale:0.4, opacity:0, y:70, duration:0.8, ease:'back.out(1.7)' }, 5.4);

        /* TYPEWRITER — "Wishing on every one that you'd be mine…"
           Vocal starts at audio=72s → t=5.5
           Vocal "mine" lands at audio=75.5s → t=9.0
           Duration = 9.0 - 5.5 = 3.5 s                          */
        tl.to('#type-line', {
            text:{ value:"Wishing on every one\nthat you'd be fmine…" },
            duration:3.5, ease:'none'
        }, 5.5);

        // Quill appears just as typewriter ends (~t=8.8)
        tl.to('#quill', { opacity:1, duration:0.3 }, 8.8);

        /* HEART draws — starts at t=8.9, completes at t=9.0+1.6=10.6
           "Mine" lands at t=9.0 so the draw starts just before,
           giving a satisfying completion right ON the word.        */
        tl.to('#heart-path', { strokeDashoffset:0, duration:1.6, ease:'power1.inOut' }, 8.8);
        tl.fromTo('#quill',
            { x:-35, y:-25, rotation:-28 },
            { x:28,  y:48,  rotation:20, duration:1.6, ease:'power1.inOut' },
            8.8
        );
        tl.to('#quill', { opacity:0, duration:0.3 }, 10.5);

        // Fade out Scene 3 by t=16
        tl.to([s3,bg3], { opacity:0, duration:0.7 }, 16.0);


        /* ═══════════════════════════════════════════════
           SCENE 4  |  t = 16.5 – 24 s
           "I see forever in your eyes" → t=16.9
           Iris / eye zoom
           "I feel okay when I see you smile" → t=20.5
           "Smile :)" at t=20.5
           ═══════════════════════════════════════════════ */
        tl.to([bg4,s4], { opacity:1, duration:0.9 }, 16.5);

        // Pen deco
        tl.to('#pen-stick', { opacity:1, duration:0.6 }, 16.7);

        // Final polaroid floats up
        tl.from('#final-pol', {
            y:90, opacity:0, scale:0.78,
            duration:1.3, ease:'back.out(1.5)'
        }, 16.8);

        // Lyric: "I see forever in your…" — exact vocal t=16.9
        tl.to('#lyric-forever', {
            opacity:1, y:-16, duration:0.9, ease:'power2.out'
        }, 16.9);

        // Iris zoom — pinch in on eyes (~t=17.5 → 19.5)
        tl.to('#iris-crop', { clipPath:'circle(23% at 50% 34%)', duration:2.0, ease:'power2.inOut' }, 17.5);
        tl.to('#final-img', { scale:2.5, duration:2.0, ease:'power2.inOut' }, 17.5);

        // Release iris
        tl.to('#iris-crop', { clipPath:'circle(100% at 50% 50%)', duration:1.4, ease:'power2.inOut' }, 19.8);
        tl.to('#final-img', { scale:1, duration:1.4, ease:'power2.inOut' }, 19.8);

        // Lyric out before smile
        tl.to('#lyric-forever', { opacity:0, duration:0.7 }, 19.8);

        // Butterfly
        tl.to('#bfly-wrap', { opacity:1, duration:0.6 }, 20.0);
        tl.to('#bfly-wrap', { scaleX:0.2, yoyo:true, repeat:20, duration:0.1, ease:'power1.inOut' }, 20.2);

        // "Smile :)" — exact vocal t=20.5 ("I see you smile")
        tl.to('#lyric-smile', { opacity:1, duration:1.1, ease:'back.out(2)' }, 20.5);

        // Heartbeat on polaroid
        tl.to('#final-pol', { scale:1.04, yoyo:true, repeat:5, duration:0.45, ease:'sine.inOut' }, 21.0);

        // Gentle fade out Scene 4 → letter
        tl.to([s4,bg4], { opacity:0, duration:1.2 }, 23.5);


        /* ═══════════════════════════════════════════════
           SCENE 5  |  t = 24.5 → end
           The letter — staggered paragraph reveal
           ═══════════════════════════════════════════════ */
        tl.to([bg5,s5], { opacity:1, duration:1.0 }, 24.5);
        tl.to('#letter-paper', { opacity:1, duration:1.1, ease:'power2.out' }, 24.8);
        tl.to('.letter-greeting', { opacity:1, duration:0.8 }, 25.5);
        tl.to('.letter-body', {
            opacity:1, duration:0.75, stagger:0.45, ease:'power1.out'
        }, 26.0);
        tl.to('.letter-sign', { opacity:1, duration:0.9, ease:'back.out(1.5)' }, 30.0);
        tl.to('.letter-from', { opacity:1, duration:0.8 }, 30.8);
    }

    /* ─── helpers ─── */
    function spawnLeaves() {
        const ctr = id('leaves-ctr');
        if (!ctr || ctr.children.length > 0) return;
        for (let i = 0; i < 22; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            const sz = 24 + Math.random() * 34;
            leaf.style.cssText = `width:${sz}px;height:${sz}px;
                left:${Math.random()*112-6}vw;top:-70px;
                opacity:${0.5 + Math.random()*0.5}`;
            ctr.appendChild(leaf);
            gsap.to(leaf, {
                y:'132vh',
                x:`+=${(Math.random()-0.5)*350}px`,
                rotation: Math.random()*460-230,
                duration: 3.5 + Math.random()*4,
                ease:'none', delay:Math.random()*3, repeat:-1
            });
        }
    }
});
