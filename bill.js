const fmt = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const BILL_STORAGE_KEY = "latestBill";
const billDate = document.getElementById("bill-date");
const billLines = document.getElementById("bill-lines");
const billTotal = document.getElementById("bill-total");
const btnPrint = document.getElementById("btn-print");
const btnBack = document.getElementById("btn-back");

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function loadBill() {
  const raw = sessionStorage.getItem(BILL_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function renderBill() {
  const bill = loadBill();
  if (!bill || !Array.isArray(bill.items) || !bill.items.length) {
    billLines.innerHTML =
      '<tr><td colspan="4" class="bill-empty">No bill found. Add quantities on the items page first.</td></tr>';
    billDate.textContent = "-";
    billTotal.textContent = fmt(0);
    btnPrint.disabled = true;
    return;
  }

  billDate.textContent = new Date(bill.date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  billLines.innerHTML = "";
  for (const item of bill.items) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(item.name)}</td><td>${item.qty}</td><td>${fmt(item.price)}</td><td>${fmt(item.amount)}</td>`;
    billLines.appendChild(tr);
  }
  billTotal.textContent = fmt(bill.total || 0);
  btnPrint.disabled = false;
}

btnPrint.addEventListener("click", () => window.print());
btnBack.addEventListener("click", () => {
  window.location.href = "/";
});

renderBill();
