const fmt = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const itemsBody = document.getElementById("items-body");
const loadStatus = document.getElementById("load-status");
const grandTotalEl = document.getElementById("grand-total");
const btnViewBill = document.getElementById("btn-view-bill");
const btnPrint = document.getElementById("btn-print");
const btnClear = document.getElementById("btn-clear");
const billDate = document.getElementById("bill-date");
const billLines = document.getElementById("bill-lines");
const billTotal = document.getElementById("bill-total");

/** @type {{ id: number; name: string; price: number; unit: string }[]} */
let products = [];
const BILL_STORAGE_KEY = "latestBill";

function getSelectedRows() {
  const rows = [];
  for (const p of products) {
    const input = document.querySelector(`input[data-id="${p.id}"]`);
    const qty = input ? Math.max(0, Number(input.value) || 0) : 0;
    if (qty > 0) rows.push({ p, qty, amount: qty * p.price });
  }
  return rows;
}

function saveBill(rows, total) {
  const bill = {
    date: new Date().toISOString(),
    items: rows.map(({ p, qty, amount }) => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      price: p.price,
      qty,
      amount,
    })),
    total,
  };
  sessionStorage.setItem(BILL_STORAGE_KEY, JSON.stringify(bill));
}

function recalc() {
  let sum = 0;
  for (const p of products) {
    const input = document.querySelector(`input[data-id="${p.id}"]`);
    const qty = input ? Math.max(0, Number(input.value) || 0) : 0;
    const line = qty * p.price;
    sum += line;
    const lineEl = document.querySelector(`[data-line-total="${p.id}"]`);
    if (lineEl) lineEl.textContent = fmt(line);
  }
  const rows = getSelectedRows();
  grandTotalEl.textContent = fmt(sum);
  billLines.innerHTML = rows.length
    ? ""
    : `<tr><td colspan="4" class="bill-empty">Add quantities in the list — your bill appears here.</td></tr>`;
  for (const { p, qty, amount } of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(p.name)}</td><td>${qty}</td><td>${fmt(p.price)}</td><td>${fmt(amount)}</td>`;
    billLines.appendChild(tr);
  }
  billTotal.textContent = fmt(sum);
  billDate.textContent = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  saveBill(rows, sum);
  btnViewBill.disabled = rows.length === 0;
  btnPrint.disabled = rows.length === 0;
}

function renderRows() {
  itemsBody.innerHTML = "";
  for (const p of products) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <span class="item-name">${escapeHtml(p.name)}</span>
        <span class="item-unit">per ${escapeHtml(p.unit)}</span>
      </td>
      <td class="price-cell">${fmt(p.price)}</td>
      <td>
        <input
          class="qty-input"
          type="number"
          min="0"
          step="1"
          value="0"
          data-id="${p.id}"
          aria-label="Quantity for ${escapeHtml(p.name)}"
        />
      </td>
      <td class="line-total" data-line-total="${p.id}">${fmt(0)}</td>
    `;
    itemsBody.appendChild(tr);
  }

  itemsBody.querySelectorAll(".qty-input").forEach((el) => {
    el.addEventListener("input", recalc);
    el.addEventListener("change", recalc);
  });
  recalc();
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

btnPrint.addEventListener("click", () => {
  if (btnPrint.disabled) return;
  window.print();
});

btnViewBill.addEventListener("click", () => {
  if (btnViewBill.disabled) return;
  window.location.href = "/bill.html";
});

btnClear.addEventListener("click", () => {
  document.querySelectorAll(".qty-input").forEach((el) => {
    el.value = "0";
  });
  recalc();
});

async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("bad response");
    products = await res.json();
    loadStatus.textContent =
      products.length + " products loaded from database.";
    renderRows();
  } catch {
    loadStatus.textContent =
      "Could not load products. Start the app with npm start, then open http://localhost:8080 (or your PORT).";
    loadStatus.style.color = "var(--danger)";
  }
}

loadProducts();
