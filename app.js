(() => {
  "use strict";
  const KEY = "campus-gpa-v1";
  const defaultState = { scale: 10, semesters: [], goals: { target: "", credits: "", milestone: "" }, dark: false };
  const grades = { 10: [{ value: "10", label: "A+", points: 10 }, { value: "9", label: "A", points: 9 }, { value: "8", label: "B+", points: 8 }, { value: "7", label: "B", points: 7 }, { value: "6", label: "C", points: 6 }, { value: "5", label: "D", points: 5 }, { value: "0", label: "F", points: 0 }], 4: [{ value: "4", label: "A", points: 4 }, { value: "3", label: "B", points: 3 }, { value: "2", label: "C", points: 2 }, { value: "1", label: "D", points: 1 }, { value: "0", label: "F", points: 0 }] };
  let state = loadState(), editingId = null;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!saved || !Array.isArray(saved.semesters)) return JSON.parse(JSON.stringify(defaultState));
      return { ...defaultState, ...saved, scale: saved.scale === 4 ? 4 : 10, goals: { ...defaultState.goals, ...(saved.goals || {}) } };
    } catch { return JSON.parse(JSON.stringify(defaultState)); }
  }
  function saveState() { localStorage.setItem(KEY, JSON.stringify(state)); $("storage-status").textContent = "Saved locally"; }
  function pointsFor(value) { const found = grades[state.scale].find(g => g.value === String(value)); return found ? found.points : 0; }
  function calculate(semester) { const credits = semester.subjects.reduce((sum, s) => sum + Number(s.credits || 0), 0); const weighted = semester.subjects.reduce((sum, s) => sum + Number(s.credits || 0) * pointsFor(s.grade), 0); return { credits, gpa: credits ? weighted / credits : 0 }; }
  function overall() { const totals = state.semesters.reduce((a, s) => { const result = calculate(s); a.credits += result.credits; a.weighted += result.credits * result.gpa; return a; }, { credits: 0, weighted: 0 }); return { credits: totals.credits, cgpa: totals.credits ? totals.weighted / totals.credits : 0 }; }
  function format(value) { return Number(value).toFixed(2); }
  function render() {
    document.body.classList.toggle("dark", state.dark);
    $("scale-select").value = state.scale;
    const total = overall(), best = state.semesters.reduce((winner, semester) => !winner || calculate(semester).gpa > calculate(winner).gpa ? semester : winner, null);
    $("cgpa-value").textContent = format(total.cgpa); $("cgpa-scale-label").textContent = `out of ${state.scale}.0`;
    $("credits-value").textContent = total.credits; $("semester-count").textContent = `${state.semesters.length} semester${state.semesters.length === 1 ? "" : "s"} recorded`;
    $("best-semester-value").textContent = best ? format(calculate(best).gpa) : "—"; $("best-semester-sub").textContent = best ? best.name : "Add a semester to begin";
    renderGoals(total); renderChart(); renderHistory(); calculatePlan();
  }
  function renderGoals(total) {
    const target = Number(state.goals.target) || 0, creditGoal = Number(state.goals.credits) || 0;
    const progress = target ? Math.min(100, Math.round(total.cgpa / target * 100)) : 0;
    $("goal-progress-value").textContent = `${progress}%`; $("goal-progress-sub").textContent = target ? `${format(total.cgpa)} of ${format(target)} target` : "Set an academic goal below";
    $("target-cgpa-display").textContent = target ? `${format(target)} / ${state.scale}.0` : "Not set";
    $("credit-goal-display").textContent = creditGoal ? `${total.credits} of ${creditGoal} credits` : "Not set";
    $("milestone-display").textContent = state.goals.milestone || "Keep showing up";
    $("target-ring").style.background = `conic-gradient(var(--brand) ${progress * 3.6}deg, #e9edf4 ${progress * 3.6}deg)`;
    $("target-ring span").textContent = `${progress}%`; $("credit-progress-bar").style.width = `${creditGoal ? Math.min(100, total.credits / creditGoal * 100) : 0}%`;
  }
  function renderChart() {
    const chart = $("performance-chart"), empty = $("chart-empty"); chart.innerHTML = "";
    if (!state.semesters.length) { chart.style.display = "none"; empty.style.display = "block"; return; }
    chart.style.display = "flex"; empty.style.display = "none";
    state.semesters.forEach((semester, index) => { const result = calculate(semester), bar = document.createElement("div"); bar.className = "chart-bar"; bar.innerHTML = `<span class="bar-value">${format(result.gpa)}</span><span class="bar-fill" style="--bar-height:${Math.max(3, result.gpa / state.scale * 100)}%"></span><span class="bar-label">${esc(semester.name.length > 12 ? `${semester.name.slice(0, 11)}…` : semester.name)}</span>`; chart.appendChild(bar); });
  }
  function renderHistory() {
    const list = $("semester-list"), empty = $("history-empty"); list.innerHTML = "";
    empty.style.display = state.semesters.length ? "none" : "block";
    state.semesters.forEach((semester, index) => {
      const result = calculate(semester), item = document.createElement("article"); item.className = "history-item";
      item.innerHTML = `<div class="semester-head"><div class="semester-title"><span class="semester-avatar">${index + 1}</span><div><h3>${esc(semester.name)}</h3><p>${semester.subjects.length} subject${semester.subjects.length === 1 ? "" : "s"} · ${result.credits} credits</p></div></div><div class="semester-score"><strong>${format(result.gpa)}</strong><span>semester GPA</span></div></div><div class="subject-list" id="subjects-${semester.id}">${semester.subjects.map(s => `<div class="subject-line"><span>${esc(s.name)}</span><span>${s.credits} cr</span><span>${esc(gradeLabel(s.grade))}</span></div>`).join("")}</div><div class="semester-actions"><button class="text-button toggle-subjects" data-id="${semester.id}" type="button">View subjects</button><button class="text-button edit-semester" data-id="${semester.id}" type="button">Edit</button><button class="text-button delete-semester" data-id="${semester.id}" type="button">Delete</button></div>`;
      list.appendChild(item);
    });
    list.querySelectorAll(".toggle-subjects").forEach(button => button.onclick = () => { const target = $(`subjects-${button.dataset.id}`); target.classList.toggle("open"); button.textContent = target.classList.contains("open") ? "Hide subjects" : "View subjects"; });
    list.querySelectorAll(".edit-semester").forEach(button => button.onclick = () => openSemester(button.dataset.id));
    list.querySelectorAll(".delete-semester").forEach(button => button.onclick = () => deleteSemester(button.dataset.id));
  }
  function gradeLabel(value) { const item = grades[state.scale].find(g => g.value === String(value)); return item ? `${item.label} (${item.points})` : "Unknown"; }
  function addSubjectRow(subject = { name: "", credits: "", grade: String(state.scale) }) {
    const row = document.createElement("div"); row.className = "subject-row";
    row.innerHTML = `<input class="subject-name" type="text" maxlength="70" placeholder="Subject name" value="${esc(subject.name)}" required><input class="subject-credits" type="number" min="0.5" max="30" step="0.5" placeholder="3" value="${esc(subject.credits)}" required><select class="subject-grade" aria-label="Grade">${grades[state.scale].map(g => `<option value="${g.value}" ${String(subject.grade) === g.value ? "selected" : ""}>${g.label}</option>`).join("")}</select><button class="remove-subject" type="button" aria-label="Remove subject">×</button>`;
    row.querySelector(".remove-subject").onclick = () => { if ($("subject-rows").children.length > 1) row.remove(); else showError("Keep at least one subject."); }; $("subject-rows").appendChild(row);
  }
  function openSemester(id = null) {
    editingId = id; const semester = state.semesters.find(s => s.id === id); $("dialog-title").textContent = semester ? "Edit semester" : "Add semester"; $("semester-name").value = semester ? semester.name : `Semester ${state.semesters.length + 1}`; $("subject-rows").innerHTML = ""; (semester ? semester.subjects : [{ name: "", credits: "", grade: String(state.scale) }]).forEach(addSubjectRow); $("semester-error").textContent = ""; $("semester-dialog").showModal(); setTimeout(() => $("semester-name").focus(), 0);
  }
  function showError(message) { $("semester-error").textContent = message; }
  function saveSemester(event) {
    event.preventDefault(); const name = $("semester-name").value.trim(), rows = [...document.querySelectorAll(".subject-row")]; const subjects = rows.map(row => ({ name: row.querySelector(".subject-name").value.trim(), credits: Number(row.querySelector(".subject-credits").value), grade: row.querySelector(".subject-grade").value }));
    if (!name || subjects.some(s => !s.name || !s.credits || s.credits <= 0)) { showError("Add a name and valid credits for every subject."); return; }
    const semester = { id: editingId || `semester-${Date.now()}-${Math.random().toString(36).slice(2)}`, name, subjects, updatedAt: new Date().toISOString() }; const existing = state.semesters.findIndex(s => s.id === editingId); if (existing >= 0) state.semesters[existing] = semester; else state.semesters.push(semester); saveState(); render(); $("semester-dialog").close(); toast(existing >= 0 ? "Semester updated" : "Semester added");
  }
  function deleteSemester(id) { const semester = state.semesters.find(s => s.id === id); if (!semester || !confirm(`Delete ${semester.name}? This cannot be undone.`)) return; state.semesters = state.semesters.filter(s => s.id !== id); saveState(); render(); toast("Semester deleted"); }
  function calculatePlan() {
    const total = overall(), target = Number($("planner-target").value), remaining = Number($("planner-credits").value), required = remaining ? (target * (total.credits + remaining) - total.cgpa * total.credits) / remaining : 0;
    $("required-average").textContent = total.credits && remaining ? (required <= state.scale ? required > 0 ? format(required) : "Already there" : "Not possible") : "—";
    $("planner-note").textContent = !total.credits ? "Add your semesters to calculate a projection." : !remaining ? "Enter remaining credits for a projection." : required <= state.scale && required > 0 ? `Average across your next ${remaining} credits.` : required <= 0 ? "You have already reached this target." : `This target exceeds the ${state.scale}-point scale.`;
  }
  function toast(message) { const el = $("toast"); el.textContent = message; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2400); }
  function exportData() { const blob = new Blob([JSON.stringify({ ...state, exportedAt: new Date().toISOString(), app: "Campus GPA" }, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "campus-gpa-backup.json"; link.click(); URL.revokeObjectURL(link.href); toast("Backup exported"); }
  function importData(file) {
    const reader = new FileReader(); reader.onload = () => { try { const incoming = JSON.parse(reader.result); if (!incoming || !Array.isArray(incoming.semesters) || incoming.semesters.some(s => !s.name || !Array.isArray(s.subjects) || s.subjects.some(x => !x.name || Number(x.credits) <= 0 || !grades[state.scale].some(g => g.value === String(x.grade))))) throw new Error("invalid"); state = { ...defaultState, ...incoming, scale: incoming.scale === 4 ? 4 : 10, goals: { ...defaultState.goals, ...(incoming.goals || {}) } }; saveState(); render(); toast("Backup imported"); } catch { toast("Import failed: invalid backup file"); } }; reader.readAsText(file);
  }
  $("add-semester").onclick = $("add-semester-top").onclick = $("add-first-semester").onclick = () => openSemester();
  $("add-subject").onclick = () => addSubjectRow(); $("semester-form").onsubmit = saveSemester; $("scale-select").onchange = e => { state.scale = Number(e.target.value); saveState(); render(); };
  $("planner-target").oninput = $("planner-credits").oninput = calculatePlan; $("edit-goals").onclick = () => { $("goals-view").classList.add("hidden"); $("goals-form").classList.remove("hidden"); $("target-cgpa-input").value = state.goals.target; $("credit-goal-input").value = state.goals.credits; $("milestone-input").value = state.goals.milestone; $("target-cgpa-input").focus(); };
  $("cancel-goals").onclick = () => { $("goals-form").classList.add("hidden"); $("goals-view").classList.remove("hidden"); };
  $("goals-form").onsubmit = e => { e.preventDefault(); state.goals = { target: $("target-cgpa-input").value, credits: $("credit-goal-input").value, milestone: $("milestone-input").value.trim() }; saveState(); render(); $("goals-form").classList.add("hidden"); $("goals-view").classList.remove("hidden"); toast("Goals updated"); };
  $("export-data").onclick = exportData; $("import-data").onclick = () => $("import-file").click(); $("import-file").onchange = e => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ""; };
  $("theme-toggle").onclick = () => { state.dark = !state.dark; saveState(); render(); }; $("print-results").onclick = () => window.print(); $("scale-info").onclick = () => toast("10-point: A+ to F · 4-point: A to F");
  render();
})();
