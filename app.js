const phoneInput = document.getElementById('phone');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const saveBtn = document.getElementById('saveAppointment');
const calendar = document.getElementById('calendar');

function validatePhoneNumber(phone) {
    return /^05\d{9}$/.test(phone);
}

// LocalStorage’dan randevuları çek
function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
}

// Randevuları kaydet
function saveAppointments(appointments) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// Randevu oluştur
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
    appointments.push({ phone, date, time });
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

    // Haftalık takvim başlıkları
    const daysOfWeek = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
    const currentWeek = getWeekDates(new Date());

    currentWeek.forEach(date => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay()-1]; // Pazar = 0
        const dayHeader = document.createElement('h3');
        dayHeader.textContent = `${dayName} (${date.toISOString().split('T')[0]})`;
        dayDiv.appendChild(dayHeader);

        // O günün randevularını ekle
        const dayAppointments = appointments.filter(a => a.date === date.toISOString().split('T')[0]);
        dayAppointments.sort((a,b) => a.time.localeCompare(b.time));

        dayAppointments.forEach((a,index) => {
            const appItem = document.createElement('div');
            appItem.classList.add('appointment-item');
            appItem.textContent = `${a.time} - ${a.phone}`;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Sil';
            deleteBtn.onclick = () => deleteAppointment(a.date, a.time, a.phone);

            appItem.appendChild(deleteBtn);
            dayDiv.appendChild(appItem);
        });

        calendar.appendChild(dayDiv);
    });
}

// Randevu silme
function deleteAppointment(date, time, phone) {
    let appointments = getAppointments();
    appointments = appointments.filter(a => !(a.date === date && a.time === time && a.phone === phone));
    saveAppointments(appointments);
    renderCalendar();
}

// Haftanın tarihlerini al
function getWeekDates(currentDate) {
    const week = [];
    const first = currentDate.getDate() - currentDate.getDay() + 1; // Pazartesi
    for(let i=0;i<7;i++){
        const d = new Date(currentDate.setDate(first + i));
        week.push(new Date(d));
    }
    return week;
}

// Sayfa yüklendiğinde takvimi oluştur
renderCalendar();
