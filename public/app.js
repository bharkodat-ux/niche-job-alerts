const resultsEl = document.getElementById('results');
const qEl = document.getElementById('q');
const locationEl = document.getElementById('location');
const searchBtn = document.getElementById('search');
const resetBtn = document.getElementById('reset');

async function fetchJobs() {
  const q = encodeURIComponent(qEl.value.trim());
  const location = encodeURIComponent(locationEl.value.trim());
  const params = [];
  if (q) params.push(`q=${q}`);
  if (location) params.push(`location=${location}`);
  const res = await fetch('/api/jobs' + (params.length ? ('?' + params.join('&')) : ''));
  return res.json();
}

function render(list) {
  if (!list.length) {
    resultsEl.innerHTML = '<p class="empty">No jobs found.</p>';
    return;
  }
  resultsEl.innerHTML = list.map(j=>`<div class="job"><h3>${j.title}</h3><p class="company">${j.company} — ${j.location}${j.remote? ' (Remote)':''}</p><p>${j.description}</p><p class="tags">Tags: ${j.tags.join(', ')}</p><p class="apply"><a href="${j.apply}" target="_blank">Apply</a></p></div>`).join('\n');
}

searchBtn.addEventListener('click', async ()=>{
  resultsEl.innerText = 'Searching...';
  const list = await fetchJobs();
  render(list);
});

resetBtn.addEventListener('click', async ()=>{
  qEl.value = '';
  locationEl.value = '';
  resultsEl.innerText = 'Loading jobs…';
  const list = await fetch('/api/jobs').then(r=>r.json());
  render(list);
});

// initial load
fetch('/api/jobs').then(r=>r.json()).then(render).catch(()=>{resultsEl.innerText='Failed to load jobs.'});
