// ==================== SCROLLER 1: INTRO DIALOGUE ==================== //
const scrollerDialogue = scrollama();

function handleDialogueStep(response) {
    const stepIndex = response.element.dataset.stepDialogue;

    d3.selectAll(".intro-character").classed("is-active", false);
    d3.selectAll(".intro-speech").classed("is-speaking", false);
    d3.selectAll(".intro-bubble-track").classed("is-speaking", false);

    if (stepIndex < 8) {
        const speech = d3.select(`.intro-speech[data-dialogue='${stepIndex}']`);
        const character = d3.select(speech.node().parentNode);

        if (!character.empty()) character.classed("is-active", true);
        if (!speech.empty()) speech.classed("is-speaking", true);

        const bubbles = character.select(".intro-bubble-track");
        if (!bubbles.empty()) bubbles.classed("is-speaking", true);
    }
}

// ==================== SCROLLER SETUP ==================== //

const scrollerPersonas = scrollama();
const scrollerUnemployment = scrollama();
const scrollerOccupations = scrollama();
const scrollerAiJobs = scrollama();
const scrollerSkills = scrollama();
const scrollerConclusion = scrollama();

let occupationsAnimated = false;

// ==================== HANDLERS ==================== //

function handlePersonasEnter(response) {
    d3.selectAll("#scrolly-personas .step").classed("is-active", false);
    d3.select(response.element).classed("is-active", true);
    showPersonas(response.index);
}

function handleUnemploymentEnter(response) {
    d3.selectAll("#scrolly-unemployment .step").classed("is-active", false);
    d3.select(response.element).classed("is-active", true);
    drawUnemploymentChart(response.index);
}

function handleOccupationsEnter(response) {
    d3.selectAll("#scrolly-occupations .step").classed("is-active", false);
    d3.select(response.element).classed("is-active", true);

    if (!occupationsAnimated) {
        drawOccupationsChart(0);
        occupationsAnimated = true;
    }
}

function handleOccupationsExit(response) {
    if (response.direction === "up" && response.index === 0) {
        d3.select("#viz-occupations").html("");
        occupationsAnimated = false;
    }
}

function runConclusionSequence() {
    // 1. Frases
    setTimeout(() => { d3.select(".conc-step.step-1").classed("is-active", true); }, 300);
    setTimeout(() => { d3.select(".conc-step.step-2").classed("is-active", true); }, 1800);
    setTimeout(() => { d3.select(".conc-step.step-3").classed("is-active", true); }, 2200); // Container
    
    // 2. Cards (Cascata)
    setTimeout(() => { d3.select(".t-card:nth-child(1)").classed("is-visible", true); }, 2300);
    setTimeout(() => { d3.select(".t-card:nth-child(2)").classed("is-visible", true); }, 2800);
    setTimeout(() => { d3.select(".t-card:nth-child(3)").classed("is-visible", true); }, 3300);
    
    // 3. Botão
    setTimeout(() => { d3.select(".conc-step.step-4").classed("is-active", true); }, 4000);
}

function resetConclusionSequence() {
    d3.selectAll(".conc-step").classed("is-active", false);
    d3.selectAll(".t-card").classed("is-visible", false);
}

// ==================== INIT FUNCTION ==================== //

function init() {
    console.log("Initializing all Scrollama instances...");

    // 1. Intro
    scrollerDialogue
        .setup({
            step: ".step-intro",
            offset: 0.5,
            once: false
        })
        .onStepEnter(handleDialogueStep);

    // 2. Personas
    scrollerPersonas
        .setup({
            step: "#scrolly-personas .step",
            offset: 0.6,
            debug: false
        })
        .onStepEnter(handlePersonasEnter);

    // 3. Unemployment (VOLTA AO SETUP ORIGINAL)
    scrollerUnemployment
        .setup({
            step: "#scrolly-unemployment .step",
            offset: 0.6,
            debug: false
        })
        .onStepEnter(handleUnemploymentEnter);

    // 4. Occupations
    scrollerOccupations
        .setup({
            step: "#scrolly-occupations .step",
            offset: 0.6,
            debug: false
        })
        .onStepEnter(handleOccupationsEnter)
        .onStepExit(handleOccupationsExit);

    // 5. AI Jobs (Bubble - Lucas)
    scrollerAiJobs
        .setup({
            step: "#ai-opportunities-viz",
            offset: 0.5,
            once: false,
            debug: false
        })
        .onStepEnter((response) => {
            if (d3.select("#viz-ai-jobs svg").empty()) {
                if (typeof drawAiJobsChart === "function") {
                    drawAiJobsChart();
                }
            }
        })
        .onStepExit((response) => {
            if (response.direction === "up") {
                d3.select("#viz-ai-jobs").html("");
            }
        });

    // 6. Skills (Bubble Clusters - Priya)
    scrollerSkills
        .setup({
            step: "#priya-advice-scene",
            offset: 0.5,
            once: false
        })
        .onStepEnter(() => {
            if (d3.select("#viz-skills-cluster svg").empty()) {
                if (typeof drawSkillsChart === "function") {
                    drawSkillsChart();
                }
            }
        })
        .onStepExit((response) => {
            d3.select("#viz-skills-cluster").html("");
        });

    // 7. Conclusion (SETUP NOVO: AUTO-PLAY)
    scrollerConclusion
        .setup({
            step: "#conclusion-scene", 
            offset: 0.4,
            once: false
        })
        .onStepEnter(() => {
            if (!d3.select(".conc-step.step-1").classed("is-active")) {
                runConclusionSequence();
            }
        })
        .onStepExit((response) => {
            if (response.direction === "up") {
                resetConclusionSequence();
            }
        });

    console.log("Scrollama initialized!");
}



// ==================== RESIZE & LOAD ==================== //

function handleResize() {
    scrollerDialogue.resize();
    scrollerPersonas.resize();
    scrollerUnemployment.resize();
    scrollerOccupations.resize();
    scrollerAiJobs.resize();
    scrollerSkills.resize();
    scrollerConclusion.resize();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

window.addEventListener("resize", handleResize);
