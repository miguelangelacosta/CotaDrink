function iniciarRepartidor() {
  if (!navigator.geolocation) {
    alert("Geolocalización no soportada");
    return;
  }

  setInterval(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const ubicacion = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: Date.now()
      };

      localStorage.setItem("ubicacionRepartidor", JSON.stringify(ubicacion));
    });
  }, 5000); // cada 5 segundos
}
