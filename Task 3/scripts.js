const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');
const sidebarStyleBtn = document.getElementById('sidebar-style');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
let sidebarStyle = 'full';

sidebarStyleBtn.addEventListener('click', () => {
  if (sidebarStyle === 'full') {
    sidebar.classList.add('compact');
    content.classList.add('compact');
    sidebarStyle = 'compact';
    sidebarStyleBtn.textContent = 'Icon Only';
  } else if (sidebarStyle === 'compact') {
    sidebar.classList.remove('compact');
    sidebar.classList.add('icon-only');
    content.classList.remove('compact');
    content.classList.add('icon-only');
    sidebarStyle = 'icon-only';
    sidebarStyleBtn.textContent = 'Full';
  } else {
    sidebar.classList.remove('icon-only');
    content.classList.remove('icon-only');
    sidebarStyle = 'full';
    sidebarStyleBtn.textContent = 'Compact';
  }
});

toggleSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Drag-and-Drop Sidebar Menu
$("#sidebar-menu").sortable({
  placeholder: "ui-state-highlight",
  update: function(event, ui) {
    console.log("New sidebar order:", $(this).sortable("toArray"));
  }
}).disableSelection();

// Drag-and-Drop Dashboard Widgets
if ($("#dashboard-widgets").length) {
  $("#dashboard-widgets").sortable({
    placeholder: "ui-state-highlight",
    update: function(event, ui) {
      console.log("New widget order:", $(this).sortable("toArray"));
    }
  }).disableSelection();
}

// Theme Switcher
function setTheme(theme) {
  if (theme === 'dark') {
    document.body.style.backgroundColor = '#212529';
    document.querySelectorAll('.widget').forEach(w => w.style.backgroundColor = 'rgba(52, 58, 64, 0.95)');
  } else if (theme === 'kns') {
    document.body.style.backgroundColor = '#e6f0ff';
    document.querySelectorAll('.widget').forEach(w => w.style.backgroundColor = 'rgba(255, 255, 255, 0.95)');
    document.documentElement.style.setProperty('--kns-primary', '#004aad');
  } else {
    document.body.style.backgroundColor = '#f8f9fa';
    document.querySelectorAll('.widget').forEach(w => w.style.backgroundColor = 'rgba(255, 255, 255, 0.95)');
  }
}

// Animate Progress Bars
document.querySelectorAll('.animate-progress').forEach(bar => {
  setTimeout(() => {
    bar.style.width = bar.getAttribute('data-width');
  }, 100);
});

// Initialize Tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Dashboard Chart (only for index.html)
if (document.querySelector("#sales-chart")) {
  var options = {
    chart: { type: 'line', height: 250, animations: { enabled: true, easing: 'easeinout', speed: 800 } },
    series: [{ name: 'Sales', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
    colors: ['#007bff'],
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false }
  };
  var chart = new ApexCharts(document.querySelector("#sales-chart"), options);
  chart.render();
}