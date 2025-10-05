// Inputlar
const studentInput = document.getElementById('student');
const phoneInput = document.getElementById('phone');
const lessonInput = document.getElementById('lesson');
const notesInput = document.getElementById('notes');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const saveBtn = document.getElementById('saveAppointment');

let calendar;
let editingIndex = null;

// Telefon doğrulama
function validatePhoneNumber(phone) {
    return /^05\d{9}$/.test(phone);
}

// LocalStorage işlemleri
function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
}

function saveAppointments(appointments) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// FullCalendar başlat
function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        editable: true,
        selectable: true,
        eventClick: info => {
            editAppointment(info.event.extendedProps.index);
        },
        eventDrop: info => {
            const index = info.event.extendedProps.index;
            const appointments = getAppointments();
            appointments[index].date = info.event.startStr.split('T')[0];
            appointments[index].time = info.event.startStr.split('T')[1].substring(0,5);
            saveAppointments(appointments);
        },
        eventDidMount: info => {
            // Mouse üzerine gelince detay göster
            info.el.title = `Telefon: ${info.event.extendedProps.phone}\nNotlar: ${info.event.extendedProps.notes}`;
        }
    });
    calendar.render();
    renderCalendar();
}

// Randevu ekleme / düzenleme
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

    if (phone && !validatePhoneNumber(phone)) {
        alert('Geçerli bir telefon numarası girin (05XXXXXXXXX).');
        return;
    }

    const appointments = getAppointments();
    if (editingIndex !== null) {
        appointments[editingIndex] = { student, phone, lesson, notes, date, time };
        editingIndex = null;
    } else {
        appointments.push({ student, phone, lesson, notes, date, time });
    }

    saveAppointments(appointments);

    studentInput.value = '';
    phoneInput.value = '';
    lessonInput.value = '';
    notesInput.value = '';
    dateInput.value = '';
    timeInput.value = '';

    renderCalendar();
});

// Takvimi render et
function renderCalendar() {
    calendar.removeAllEvents();
    const appointments = getAppointments();

    appointments.forEach((a,index) => {
        calendar.addEvent({
            title: `${a.student} - ${a.lesson}`,
            start: `${a.date}T${a.time}`,
            extendedProps: { index, phone: a.phone, notes: a.notes },
            backgroundColor: '#1800ad',
            borderColor: '#0f007f'
        });
    });
}

// Düzenleme
function editAppointment(index) {
    const appointments = getAppointments();
    const a = appointments[index];
    studentInput.value = a.student;
    phoneInput.value = a.phone;
    lessonInput.value = a.lesson;
    notesInput.value = a.notes;
    dateInput.value = a.date;
    timeInput.value = a.time;
    editingIndex = index;
}

// Başlat
initCalendar();
