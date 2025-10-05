const phoneInput = document.getElementById('phone');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const saveBtn = document.getElementById('saveAppointment');
const calendar = document.getElementById('calendar');
const prevWeekBtn = document.getElementById('prevWeek');
const nextWeekBtn = document.getElementById('nextWeek');

let currentWeekStart = new Date();

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

// Randevu ekleme veya düzenleme
let editingIndex = null;
saveBtn.addEventListener('click', () => {
    const phone = phoneInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!validatePhoneNumber(phone)) {
        alert('Geçerli bir telefon numarası girin (05XXXXXXXXX).');
        return;
    }
    if (!date || !time) {
        alert('Tarih ve saat seçin!');
        return;
    }

    const appointments = getAppointments();

    if (editingIndex !== null) {
        appointments[editingIndex] = { phone, date, time };
        editingIndex = null;
    } else {
        appointments.push({ phone, date, time });
    }

    saveAppointments(appointments);

    phoneInput.value = '';
    dateInput.value = '';
    timeInput.value = '';

    renderCalendar();
});

// Randevuları takvimde göster
function renderCalendar() {
    calendar.innerHTML = '';
    const appointments = getAppointments();

    const daysOfWeek = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
    const weekDates = getWeekDates(currentWeekStart);

    weekDates.forEach(date => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay()-1];
        const dayHeader = document.createElement('h3');
        dayHeader.textContent = `${dayName} (${date.toISOString().split('T')[0]})`;
        dayDiv.appendChild(dayHeader);

        const dayAppointments = appointments
            .filter(a => a.date === date.toISOString().split('T')[0])
            .sort((a,b) => a.time.localeCompare(b.time));

        dayAppointments.forEach((a,index) => {
            const appItem = document.createElement('div');
            appItem.classList.add('appointment-item');
            appItem.textContent = `${a.time} - ${a.phone}`;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Düzenle';
            editBtn.classList.add('edit');
            editBtn.onclick = () => editAppointment(a, index);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Sil';
            deleteBtn.onclick = () => deleteAppointment(index);

            appItem.appendChild(editBtn);
            appItem.appendChild(deleteBtn);
            dayDiv.appendChild(appItem);
        });

        calendar.appendChild(dayDiv);
    });
}

// Randevu sil
function deleteAppointment(index) {
    const appointments = getAppointments();
    appointments.splice(index,1);
    saveAppointments(appointments);
    renderCalendar();
}

// Randevu düzenle
function editAppointment(appointment, index) {
    phoneInput.value = appointment.phone;
    dateInput.value = appointment.date;
    timeInput.value = appointment.time;
    editingIndex = index;
}

// Haftanın tarihlerini al
function getWeekDates(startDate) {
    const week = [];
    const dayOfWeek = startDate.getDay() === 0 ? 6 : startDate.getDay() - 1;
    const monday = new Date(startDate);
    monday.setDate(startDate.getDate() - dayOfWeek);
    for(let i=0;i<7;i++){
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        week.push(d);
    }
    return week;
}

// Hafta değiştirme
prevWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    renderCalendar();
});

nextWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    renderCalendar();
});

// Başlangıçta takvimi yükle
renderCalendar();
