// Labels and example datasets
const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const exampleDataSets = {
  'PM2.5':[12,15,10,20,18,25,22],
  'Ozone':[30,35,28,40,38,45,42],
  'Wildflowers':[5,7,9,12,10,8,6]
};

const latitude = '23.8103';
const longitude = '90.4125';

// Main chart
const ctx = document.getElementById('airQualityChart').getContext('2d');
let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'PM2.5',
      data: exampleDataSets['PM2.5'],
      backgroundColor: 'rgba(0,255,225,0.2)',
      borderColor: '#00ffe1',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: { y: { ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } }
  }
});

// Update main chart
function updateChart(type){
  chart.data.datasets[0].data = exampleDataSets[type];
  chart.data.datasets[0].label = type;
  chart.update();
}

// Modal chart
const modal = document.getElementById('dataModal');
const modalTitle = document.getElementById('modalTitle');
const modalChartCtx = document.getElementById('modalChart').getContext('2d');
const spanClose = document.getElementsByClassName("close")[0];

let modalChart = new Chart(modalChartCtx, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'Wildflowers',
      data: exampleDataSets['Wildflowers'],
      backgroundColor: 'rgba(0,255,225,0.2)',
      borderColor: '#00ffe1',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive:true,
    plugins:{legend:{labels:{color:'#fff'}}},
    scales:{y:{ticks:{color:'#fff'}}, x:{ticks:{color:'#fff'}}}
  }
});

spanClose.onclick = ()=>{ modal.style.display="none"; }
window.onclick = e=>{ if(e.target==modal){modal.style.display="none";} }

// Show modal with dataset
async function showData(type, title){
  modal.style.display = "block";
  modalTitle.textContent = title;

  if(type==='Wildflowers'){
    const globeURL = `https://api.globe.gov/observations?protocol=LandCover&phenomenon=Wildflower&startdate=2025-03-01&enddate=2025-06-01&latitude=${latitude}&longitude=${longitude}&geojson=true`;
    try{
      const response = await fetch(globeURL);
      const data = await response.json();
      const counts = data.features.slice(-7).map(f => 1);
      modalChart.data.datasets[0].data = counts;
      modalChart.data.datasets[0].label = 'Wildflower Blooms';
      modalChart.update();
    }catch(err){
      console.error(err);
      alert("Could not fetch GLOBE wildflower data. Showing example data instead.");
      modalChart.data.datasets[0].data = exampleDataSets['Wildflowers'];
      modalChart.data.datasets[0].label = 'Wildflower Blooms';
      modalChart.update();
    }
    return;
  }

  modalChart.data.datasets[0].data = exampleDataSets[type];
  modalChart.data.datasets[0].label = type;
  modalChart.update();
}

// Leaflet map with wildflower heatmap
const map = L.map('map').setView([23.8103,90.4125],6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{}).addTo(map);

async function loadWildflowers(){
  const globeURL = `https://api.globe.gov/observations?protocol=LandCover&phenomenon=Wildflower&startdate=2025-03-01&enddate=2025-06-01&latitude=${latitude}&longitude=${longitude}&geojson=true`;
  try{
    const response = await fetch(globeURL);
    const data = await response.json();
    const heatData = data.features.map(f=>[f.geometry.coordinates[1], f.geometry.coordinates[0]]);
    L.heatLayer(heatData,{radius:25}).addTo(map);

    data.features.forEach(f=>{
      const [lon,lat] = f.geometry.coordinates;
      L.circle([lat,lon],{color:'#00ffe1', fillColor:'#50e3c2', fillOpacity:0.5, radius:1000})
        .addTo(map)
        .bindPopup(`<b>Wildflower Bloom</b><br>Date: ${f.properties.date}`);
    });
  }catch(err){
    console.error(err);
    alert("Could not fetch GLOBE wildflower data. Map will show placeholder.");
    for(let i=0;i<7;i++){
      L.circle([23.8+Math.random()*0.1,90.4+Math.random()*0.1],{color:'#00ffe1',fillColor:'#50e3c2',fillOpacity:0.5,radius:1000})
        .addTo(map).bindPopup("Example Wildflower Point");
    }
  }
}

loadWildflowers();
