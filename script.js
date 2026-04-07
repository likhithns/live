const API = "http://localhost:8080/api/transactions";

window.onload = () => {
  loadTransactions();
  loadTotals();
};

// ADD
function addTransaction() {
  const titleEl = document.getElementById("title");
  const amountEl = document.getElementById("amount");
  const typeEl = document.getElementById("type");
  const categoryEl = document.getElementById("category");

  const data = {
    title: titleEl.value,
    amount: Number(amountEl.value),
    type: typeEl.value,
    category: categoryEl.value,
    date: "2026-04-01"
  };

  console.log("Sending:", data);

  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {

    // ✅ CLEAR INPUTS
    titleEl.value = "";
    amountEl.value = "";
    typeEl.selectedIndex = 0;
    categoryEl.selectedIndex = 0;

    // reload data
    loadTransactions();
    loadTotals();

    console.log("Cleared inputs ✅");
  })
  .catch(err => console.error("Error:", err));
}
// LOAD LIST
function loadTransactions() {
  fetch(API)
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach(t => {
      list.innerHTML += `
        <div class="item">
          ${t.title} - ₹${t.amount} (${t.category})
        </div>
      `;
    });
  });
}

// TOTALS + CHART
let pieChart, barChart, lineChart;

function loadTotals() {
  fetch(API + "/totals")
  .then(res => res.json())
  .then(data => {
    document.getElementById("income").innerText = data.income;
    document.getElementById("expense").innerText = data.expense;
    document.getElementById("savings").innerText = data.savings;

    drawChart(data);
  });
}

// CHART
function drawChart(data) {

  const pieCtx = document.getElementById("chart");
  const barCtx = document.getElementById("barChart");
  const lineCtx = document.getElementById("lineChart");

  // Destroy old charts
  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();
  if (lineChart) lineChart.destroy();

  // PIE CHART
  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [data.income, data.expense],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    }
  });

  // BAR CHART
  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        label: "Amount",
        data: [data.income, data.expense],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    }
  });

  // LINE CHART
  lineChart = new Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        label: "Trend",
        data: [data.income, data.expense],
        borderColor: "#22c55e",
        fill: false
      }]
    }
  });
}