const reportList = document.getElementById("reportList");
const reportForm = document.getElementById("reportForm");

function loadReports() {
  const savedReports = JSON.parse(localStorage.getItem('reports')) || [];
  reportList.innerHTML = "";

  savedReports.forEach((r, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <div class="report-item">
        <p>✅ <strong>${r.action}</strong> (${r.points} poin)</p>
        <p><strong>Deskripsi:</strong> ${r.desc}</p>
        <p><strong>Bukti:</strong> ${r.proof}</p>
        ${r.image ? `<img src="${r.image}" class="report-img">` : ""}
        <button class="btn btn-small btn-delete" data-index="${index}">Hapus</button>
      </div>
      <hr>
    `;

    reportList.appendChild(div);
  });

  reportList.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", () => deleteReport(parseInt(btn.dataset.index)));
  });
}

function saveReport(action, desc, proof, image, points) {
  const savedReports = JSON.parse(localStorage.getItem('reports')) || [];
  savedReports.push({ action, desc, proof, image, points });
  localStorage.setItem('reports', JSON.stringify(savedReports));
}

function deleteReport(index) {
  const savedReports = JSON.parse(localStorage.getItem('reports')) || [];
  if (index >= 0 && index < savedReports.length) {
    actionPoints -= savedReports[index].points;
    savedReports.splice(index, 1);
    localStorage.setItem('reports', JSON.stringify(savedReports));
    localStorage.setItem('actionPoints', actionPoints);
    loadReports();
    updatePointsDisplay("action");
  }
}

reportForm.addEventListener("submit", e => {
  e.preventDefault();

  const action = document.getElementById("actionType").value;
  const desc = document.getElementById("actionDesc").value.trim();
  const proof = document.getElementById("actionProof").value.trim();
  const imageFile = document.getElementById("actionImage").files[0];

  // VALIDASI WAJIB
  if (!desc) {
    alert("Deskripsi wajib diisi.");
    return;
  }
  if (!proof) {
    alert("Bukti wajib diisi.");
    return;
  }

  // Konversi foto menjadi URL sementara
  let imageURL = "";
  if (imageFile) {
    imageURL = URL.createObjectURL(imageFile);
  }

  const pointsMap = { tanam: 50, bersih: 20, tumbler: 5, hemat: 10 };
  const points = pointsMap[action] || 0;

  actionPoints += points;
  localStorage.setItem('actionPoints', actionPoints);

  saveReport(action, desc, proof, imageURL, points);

  loadReports();
  updatePointsDisplay("action");

  reportForm.reset();
});

loadReports();
