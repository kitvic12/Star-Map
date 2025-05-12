let date = new Date()
month = date.getMonth()


const LUNAR_CYCLE = 29.530588853; 
const KNOWN_NEW_MOON = new Date('2024-05-08T03:22Z'); 

function get_day(){
    if (month = 0){document.getElementById('month').textContent = "Январь"};
    if (month = 1){document.getElementById('month').textContent = "Февраль"};
    if (month = 2){document.getElementById('month').textContent = "Март"};
    if (month = 3){document.getElementById('month').textContent = "Апрель"};
    if (month = 4){document.getElementById('month').textContent = "Май"};
    if (month = 5){document.getElementById('month').textContent = "Июнь"};
    if (month = 6){document.getElementById('month').textContent = "Июль"};
    if (month = 7){document.getElementById('month').textContent = "Август"};
    if (month = 8){document.getElementById('month').textContent = "Сентябрь"};
    if (month = 9){document.getElementById('month').textContent = "Октябрь"};
    if (month = 10){document.getElementById('month').textContent = "Ноябрь"};
    if (month = 11){document.getElementById('month').textContent = "Декабрь"};
}


function calculateMoonPhase(date) {
    const daysSinceKnown = (date - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
    const currentPhase = (daysSinceKnown % LUNAR_CYCLE) / LUNAR_CYCLE;
    let illumination;
    if (currentPhase < 0.5) {
        illumination = currentPhase * 2 * 100; 
    } else {
        illumination = (1 - (currentPhase - 0.5) * 2) * 100; 
    }
    
    return {
        phase: currentPhase,
        illumination: Math.round(illumination),
        age: daysSinceKnown % LUNAR_CYCLE
    };
}

function getMoonPhaseName(phase, illumination) {
    if (phase < 0.03 || phase > 0.97) return "Новолуние";
    if (illumination > 98) return "Полнолуние";
    if (phase < 0.25) return "Растущий серп";
    if (phase < 0.28) return "Первая четверть";
    if (phase < 0.5) return "Растущая луна";
    if (phase < 0.72) return "Убывающая луна";
    if (phase < 0.78) return "Последняя четверть";
    return "Стареющий серп";
}


function getNextMoonPhases(currentDate) {
    const phases = [
        { name: "Новолуние", target: 0 },
        { name: "Первая четверть", target: 0.25 },
        { name: "Полнолуние", target: 0.5 },
        { name: "Последняя четверть", target: 0.75 }
    ];
    
    const currentPhase = (currentDate - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24) / LUNAR_CYCLE % 1;
    
    return phases.map(p => {
        let daysToPhase = (p.target - currentPhase) * LUNAR_CYCLE;
        if (daysToPhase < 0) daysToPhase += LUNAR_CYCLE;
        
        const phaseDate = new Date(currentDate.getTime() + daysToPhase * 24 * 60 * 60 * 1000);
        return {
            name: p.name,
            date: phaseDate,
            daysTo: Math.round(daysToPhase * 10) / 10
        };
    }).sort((a, b) => a.daysTo - b.daysTo);
}

function updateMoonVisualization(illumination, phase) {
    const moonLight = document.getElementById('moon-light');
    
    if (phase < 0.5) {
        const lightWidth = illumination;
        moonLight.style.clipPath = `inset(0 0 0 ${100 - lightWidth}%)`;
    } else {
        const lightWidth = illumination;
        moonLight.style.clipPath = `inset(0 ${100 - lightWidth}% 0 0)`;
    }
}

function updateMoonInfo() {
    const now = new Date();
    const moonData = calculateMoonPhase(now);
    const phaseName = getMoonPhaseName(moonData.phase, moonData.illumination);
    const nextPhases = getNextMoonPhases(now);
    document.getElementById('current-date').textContent = 
        now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('moon-phase-name').textContent = phaseName;
    document.getElementById('moon-illumination').textContent = moonData.illumination;
    updateMoonVisualization(moonData.illumination, moonData.phase)}


window.onload = function() {
    updateMoonInfo();
    // getISSPasses();
    get_day()
}