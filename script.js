const ctx = document.getElementById('airQualityChart').getContext('2d');

const dataSets = {
  'PM2.5': [12, 15, 10, 20, 18, 25, 22],
  'Ozone': [30, 35, 28, 40, 38, 45, 42]
};

const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'PM2.5',
      data: dataSets['PM2.5'],
      backgroundColor: 'rgba(0, 255, 225, 0.2)',
      borderColor: '#00ffe1',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff' } }
    },
    scales: {
      y: { ticks: { color: '#fff' } },
      x: { ticks: { color: '#fff' } }
    }
  }
});

function updateChart(type) {
  chart.data.datasets[0].data = dataSets[type];
  chart.data.datasets[0].label = type;
  chart.update();
}
