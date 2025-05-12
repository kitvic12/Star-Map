let date = new Date()
month = date.getMonth() +1

function get_date(){function get_date(){
    let date = new Date()
    month = date.getMonth() +1
    return month
}
    let date = new Date()
    month = date.getMonth() +1
    return month
}



async function getISSPass() {
    try {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544/passes?lat=55.7558&lon=37.6176&n=1');
        const data = await response.json();
        
        if (data.passes && data.passes.length > 0) {
            const pass = data.passes[0];
            const riseTime = new Date(pass.rise_time * 1000);
            const duration = Math.floor(pass.duration / 60);
            
            document.getElementById('iss-pass').innerHTML = `
                <p><strong>Дата:</strong> ${riseTime.toLocaleDateString('ru-RU')}</p>
                <p><strong>Время:</strong> ${riseTime.toLocaleTimeString('ru-RU')}</p>
                <p><strong>Длительность:</strong> ${duration} минут</p>
                <p><strong>Максимальная высота:</strong> ${pass.max_elevation}° над горизонтом</p>
            `;
        } else {
            document.getElementById('iss-pass').innerHTML = 
                "<p>Нет данных о ближайших пролетах МКС</p>";
        }
    } catch (error) {
        document.getElementById('iss-pass').innerHTML = 
            "<p>Ошибка при загрузке данных о МКС</p>";
        console.error("Ошибка:", error);
    }
}


async function getMoonPhase() {
    try {
        const response = await fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/moscow/today?unitGroup=metric&include=days&key=YOUR_API_KEY&elements=moonphase');
        const data = await response.json();
        
        if (data.days && data.days.length > 0) {
            const moonPhase = data.days[0].moonphase;
            const illumination = Math.round(moonPhase * 100);
            
            let phaseName;
            if (moonPhase === 0 || moonPhase === 1) phaseName = "Новолуние";
            else if (moonPhase < 0.25) phaseName = "Растущий серп";
            else if (moonPhase === 0.25) phaseName = "Первая четверть";
            else if (moonPhase < 0.5) phaseName = "Растущая луна";
            else if (moonPhase === 0.5) phaseName = "Полнолуние";
            else if (moonPhase < 0.75) phaseName = "Убывающая луна";
            else if (moonPhase === 0.75) phaseName = "Последняя четверть";
            else phaseName = "Стареющий серп";
            

            const moonShade = document.getElementById('moon-shade');
            if (moonPhase <= 0.5) {
                moonShade.style.clipPath = `inset(0 ${100 - (moonPhase * 200)}% 0 0)`;
            } else {
                moonShade.style.clipPath = `inset(0 0 0 ${100 - ((1 - moonPhase) * 200)}%)`;
            }
            
            document.getElementById('moon-info').innerHTML = `
                <p><strong>Фаза:</strong> ${phaseName}</p>
                <p><strong>Освещено:</strong> ${illumination}%</p>
                <p><strong>Дата:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
            `;
        }
    } catch (error) {
        document.getElementById('moon-phase').innerHTML = 
            "<p>Ошибка при загрузке данных о Луне</p>";
        console.error("Ошибка:", error);
    }
}


window.onload = function() {
    getISSPass();
    getMoonPhase();
};