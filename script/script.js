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


fetch('https://api.wheretheiss.at/v1/satellites/25544')
  .then(res => res.json())
  .then(data => {
    const issInfo = document.getElementById('iss-info');
    issInfo.innerHTML = `
      <p><strong>Текущие координаты:</strong> ${data.latitude.toFixed(2)}° с.ш., ${data.longitude.toFixed(2)}° в.д.</p>
      <p><strong>Высота:</strong> ${data.altitude.toFixed(2)} км</p>
      <p><strong>Скорость:</strong> ${data.velocity.toFixed(2)} км/ч</p>`;


    const map = L.map('iss-map').setView([data.latitude, data.longitude], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([data.latitude, data.longitude]).addTo(map)
      .bindPopup('МКС прямо здесь!')
      .openPopup();
  });


fetch('https://api.open-notify.org/iss-pass.json?lat=55.7558&lon=37.6176')
  .then(res => res.json())
  .then(data => {
    const nextPass = data.response[0];
    const duration = Math.floor(nextPass.duration / 60);
    const risetime = new Date(nextPass.risetime * 1000).toLocaleTimeString('ru-RU');
    
    document.getElementById('iss-info').innerHTML += `
      <p><strong>Ближайший пролёт над Москвой:</strong> ${risetime}</p>
      <p><strong>Длительность:</strong> ~${duration} минут</p>
    `;
  });


function updateMoonPhase() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

 
  const lunarCycle = 29.53; 
  const knownNewMoon = new Date('2024-01-11'); 
  const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
  const currentPhase = (daysSinceNewMoon % lunarCycle) / lunarCycle;

  let phaseName;
  if (currentPhase < 0.1 || currentPhase > 0.9) phaseName = "Новолуние";
  else if (currentPhase < 0.25) phaseName = "Растущий серп";
  else if (currentPhase < 0.4) phaseName = "Первая четверть";
  else if (currentPhase < 0.6) phaseName = "Растущая луна";
  else if (currentPhase < 0.75) phaseName = "Полнолуние";
  else if (currentPhase < 0.9) phaseName = "Убывающая луна";
  else phaseName = "Последняя четверть";

  const moonVisual = document.getElementById('moon-visual');
  moonVisual.innerHTML = `
    <svg viewBox="0 0 100 100" width="100" height="100">
      <circle cx="50" cy="50" r="45" fill="#F5F5DC" />
      <path d="${getMoonPhasePath(currentPhase)}" fill="#222" />
    </svg>
  `;


  document.getElementById('moon-info').innerHTML = `
    <p><strong>Фаза:</strong> ${phaseName}</p>
    <p><strong>Освещено:</strong> ${Math.round(currentPhase * 100)}%</p>
  `;
}


function getMoonPhasePath(phase) {
  if (phase <= 0.5) {
    const x = 50 + 45 * Math.cos(phase * Math.PI * 2);
    return `M50,5 A45,45 0 1,1 50,95 A45,45 0 0,1 50,5 Z M50,5 A45,45 0 1,0 ${x},50 A45,45 0 0,0 50,5 Z`;
  } else {
    const x = 50 - 45 * Math.cos(phase * Math.PI * 2);
    return `M50,5 A45,45 0 1,1 50,95 A45,45 0 0,1 50,5 Z M50,5 A45,45 0 1,1 ${x},50 A45,45 0 0,1 50,5 Z`;
  }
}

updateMoonPhase();