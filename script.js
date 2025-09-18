document.addEventListener('DOMContentLoaded', () => {
    const futbolBtn = document.getElementById('futbol-btn');
    const padelBtn = document.getElementById('padel-btn');
    const datePicker = document.getElementById('date-picker');
    const availableTimesList = document.getElementById('available-times');
    const noTimesMessage = document.getElementById('no-times-message');
    const bookingModal = document.getElementById('booking-modal');
    const closeButton = document.querySelector('.close-button');
    const bookingForm = document.getElementById('booking-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    let currentSport = 'futbol';
    let availableSlots = {};
    let selectedTimeSlot = ''; 
    let selectedDate = '';

    // Función para generar horarios simulados
    const generateTimes = (sport) => {
        availableSlots = {};
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateKey = date.toISOString().slice(0, 10);
            availableSlots[dateKey] = [];
            const startHour = sport === 'futbol' ? 9 : 10;
            const endHour = 22;
            for (let hour = startHour; hour < endHour; hour++) {
                availableSlots[dateKey].push(`${hour}:00 - ${hour + 1}:00`);
            }
        }
    };

    const displayTimesForDate = (date) => {
        availableTimesList.innerHTML = '';
        const times = availableSlots[date];
        if (times && times.length > 0) {
            noTimesMessage.classList.add('hidden');
            times.forEach(time => {
                const li = document.createElement('li');
                li.className = 'time-item';
                li.innerHTML = `
                    <span class="time-slot">${time}</span>
                    <button class="reserve-button ${currentSport === 'padel' ? 'padel' : ''}" data-time="${time}">Reservar</button>
                `;
                availableTimesList.appendChild(li);
            });
        } else {
            noTimesMessage.classList.remove('hidden');
        }
    };

    futbolBtn.addEventListener('click', () => {
        futbolBtn.classList.add('active');
        padelBtn.classList.remove('active');
        currentSport = 'futbol';
        generateTimes(currentSport);
        displayTimesForDate(datePicker.value);
    });

    padelBtn.addEventListener('click', () => {
        padelBtn.classList.add('active');
        futbolBtn.classList.remove('active');
        currentSport = 'padel';
        generateTimes(currentSport);
        displayTimesForDate(datePicker.value);
    });

    datePicker.addEventListener('change', (e) => {
        // La corrección está aquí:
        selectedDate = e.target.value;
        displayTimesForDate(selectedDate);
    });

    availableTimesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('reserve-button')) {
            selectedTimeSlot = e.target.dataset.time;
            bookingModal.classList.remove('hidden');
        }
    });

    closeButton.addEventListener('click', () => {
        bookingModal.classList.add('hidden');
        confirmationMessage.classList.add('hidden');
        bookingForm.reset();
        bookingForm.classList.remove('hidden');
    });

    // Envía los datos a Google Sheets
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        // ¡Asegúrate de pegar tu URL aquí!
        const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyCLXor6Sa5mxnwRx0buqbBdYSei9b2OVM0C4bwYvhdo1l9em7p43rcql2Qzy7gaqmOBg/exec'; 

        const data = {
            fecha: selectedDate,
            hora: selectedTimeSlot,
            deporte: currentSport,
            nombre: name,
            email: email,
            telefono: phone
        };

        fetch(SHEETS_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => {
            if (result.result === 'success') {
                confirmationMessage.classList.remove('hidden');
                bookingForm.classList.add('hidden');
            } else {
                alert('Error al guardar datos. Por favor, inténtelo de nuevo.');
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            alert('Error al conectar con el servidor. Por favor, inténtelo de nuevo.');
        });
        
        // Cierra el modal después de un breve retraso si la conexión fue exitosa
        setTimeout(() => {
            bookingModal.classList.add('hidden');
            confirmationMessage.classList.add('hidden');
            bookingForm.classList.remove('hidden');
            bookingForm.reset();
        }, 2000);
    });

    // Inicializar la página
    generateTimes(currentSport);
    datePicker.value = new Date().toISOString().slice(0, 10);
    displayTimesForDate(datePicker.value);

});
