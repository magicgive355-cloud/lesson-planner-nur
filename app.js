const studentInput = document.getElementById('student');
const phoneInput = document.getElementById('phone');
const lessonInput = document.getElementById('lesson');
const notesInput = document.getElementById('notes');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const saveBtn = document.getElementById('saveLesson');
const lessonsContainer = document.getElementById('lessonsContainer');

let editingIndex = null;

// Telefon doğrulama
function validatePhone(phone) {
    return /^05\d{9}$/.test(phone);
}

function getLessons() {
    return JSON.parse(localStorage.getItem('lessons') || '[]');
}

function saveLessons(lessons) {
    localStorage.setItem('lessons', JSON.stringify(lessons));
}

function renderLessons() {
    lessonsContainer.innerHTML = '';
    const lessons = getLessons();

    lessons.forEach((l, index) => {
        const card = document.createElement('div');
        card.classList.add('lesson-card');
        card.style.borderLeftColor = getColorByLesson(l.lesson);

        card.innerHTML = `
            <h3>${l.student}</h3>
            <p><strong>Ders:</strong> ${l.lesson}</p>
            <p><strong>Tarih:</strong> ${l.date} ${l.time}</p>
            <p><strong>Telefon:</strong> ${l.phone}</p>
            <p><strong>Notlar:</strong> ${l.notes}</p>
            <div class="buttons">
                <button class="edit">Düzenle</button>
                <button class="delete">Sil</button>
            </div>
        `;

        card.querySelector('.edit').onclick = () => editLesson(index);
        card.querySelector('.delete').onclick = () => deleteLesson(index);

        lessonsContainer.appendChild(card);
    });
}

function getColorByLesson(lesson) {
    const colors = {
        'Matematik': '#3498db',
        'İngilizce': '#2ecc71',
        'Fen': '#e67e22',
        'Tarih': '#9b59b6'
    };
    return colors[lesson] || '#1800ad';
}

function editLesson(index) {
    const lessons = getLessons();
    const l = lessons[index];

    studentInput.value = l.student;
    phoneInput.value = l.phone;
    lessonInput.value = l.lesson;
    notesInput.value = l.notes;
    dateInput.value = l.date;
    timeInput.value = l.time;

    editingIndex = index;
}

function deleteLesson(index) {
    const lessons = getLessons();
    lessons.splice(index, 1);
    saveLessons(lessons);
    renderLessons();
}

saveBtn.addEventListener('click', () => {
    const student = studentInput.value.trim();
    const phone = phoneInput.value.trim();
    const lesson = lessonInput.value.trim();
    const notes = notesInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!student || !lesson || !date || !time) {
        alert('Öğrenci adı, ders, tarih ve saat zorunludur!');
        return;
    }

    if (phone && !validatePhone(phone)) {
        alert('Geçerli bir telefon numarası girin (05XXXXXXXXX).');
        return;
    }

    const lessons = getLessons();
    if (editingIndex !== null) {
        lessons[editingIndex] = { student, phone, lesson, notes, date, time };
        editingIndex = null;
    } else {
        lessons.push({ student, phone, lesson, notes, date, time });
    }

    saveLessons(lessons);

    studentInput.value = '';
    phoneInput.value = '';
    lessonInput.value = '';
    notesInput.value = '';
    dateInput.value = '';
    timeInput.value = '';

    renderLessons();
});

renderLessons();
