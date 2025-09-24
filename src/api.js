const API_BASE = 'http://localhost:8001/api';

export async function fetchQuote(symbol) {
  const res = await fetch(`${API_BASE}/quote/${encodeURIComponent(symbol)}`);
  if (!res.ok) throw new Error(`Quote failed: ${res.status}`);
  return res.json();
}

export async function fetchHistory(params) {
  const url = new URL(`${API_BASE}/history`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`History failed: ${res.status}`);
  return res.json();
}

export async function fetchFundamentals(symbol) {
  const res = await fetch(`${API_BASE}/fundamentals/${encodeURIComponent(symbol)}`);
  if (!res.ok) throw new Error(`Fundamentals failed: ${res.status}`);
  return res.json();
}


