//sheets.js
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyCLXor6Sa5mxnwRx0buqbBdYSei9b2OVM0C4bwYvhdo1l9em7p43rcql2Qzy7gaqmOBg/exec'; // <-- ¡IMPORTANTE! Cambia esto para cada cliente

const saveToSheets = (data) => {
  const formData = new FormData();
  formData.append('fecha', data.fecha);
  formData.append('hora', data.hora);
  formData.append('deporte', data.deporte);
  formData.append('nombre', data.nombre);
  formData.append('email', data.email);
  formData.append('telefono', data.telefono);

  fetch(SHEETS_URL, {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(result => {
    console.log('Respuesta de Google Sheets:', result);
    if (result.result === 'success') {
      alert('¡Reserva confirmada con éxito! Los datos han sido guardados.');
    } else {
      alert('Error al guardar datos. Por favor, inténtelo de nuevo.');
    }
  })
  .catch(error => {
    console.error('Error de red:', error);
    alert('Error al conectar con el servidor. Por favor, inténtelo de nuevo.');
  });

};
