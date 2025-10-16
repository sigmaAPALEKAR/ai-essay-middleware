const generateBtn = document.getElementById('generate');
const outputEl = document.getElementById('output');

generateBtn.addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value.trim();
  if (!prompt) {
    outputEl.textContent = 'please enter a prompt.';
    return;
  }

  outputEl.textContent = '⏳ generating...';

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:'unknown'}));
      outputEl.textContent = 'error: ' + (err.error || res.statusText);
      return;
    }
    const data = await res.json();
    outputEl.textContent = data.text || 'no text returned';
  } catch (e) {
    outputEl.textContent = 'network error: ' + e.message;
  }
});
