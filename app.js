const form = document.getElementById("lesson-form");
const lessonList = document.getElementById("lesson-list");

let lessons = JSON.parse(localStorage.getItem("lessons")) || [];

function renderLessons() {
  lessonList.innerHTML = "";
  lessons.forEach((lesson, index) => {
    const div = document.createElement("div");
    div.className = "lesson-card";
    div.innerHTML = `
      <h3>${lesson.name}</h3>
      <p><b>Time:</b> ${lesson.time}</p>
      <p><b>Address:</b> ${lesson.address}</p>
      <p><b>Notes:</b> ${lesson.notes}</p>
      <button onclick="deleteLesson(${index})">🗑 Delete</button>
    `;
    lessonList.appendChild(div);
  });
}

function deleteLesson(index) {
  lessons.splice(index, 1);
  localStorage.setItem("lessons", JSON.stringify(lessons));
  renderLessons();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const time = document.getElementById("time").value.trim();
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();

  if (!name || !time || !address) return;

  lessons.push({ name, time, address, notes });
  localStorage.setItem("lessons", JSON.stringify(lessons));

  form.reset();
  renderLessons();
});

renderLessons();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}