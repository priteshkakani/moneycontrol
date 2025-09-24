export function setupNifty(targetElement) {
  if (!targetElement) return;
  const container = document.createElement('div');
  container.className = 'nifty-container';
  const title = document.createElement('h2');
  title.textContent = 'Nifty';
  const value = document.createElement('div');
  value.className = 'nifty-value';
  value.textContent = '25000';
  container.appendChild(title);
  container.appendChild(value);
  targetElement.appendChild(container);
}


