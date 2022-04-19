import './App.css';

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/forecast"
const WEATHER_PROPS = {
  lang: "es",
  units: "metric",
  appid: process.env.REACT_APP_OPEN_WEATHER_APP_ID,
}

const ANIMATED_ICONS = {
  Clouds: 'cloudy-day-1.svg',
  Clear: 'day.svg',
  Atmosphere: 'weather.svg',
  Snow: 'snowy-6.svg',
  Rain: 'rainy-7.svg',
  Drizzle: 'rainy-2.svg',
  Thunderstorm: 'thunder.svg',
}

const DAYS = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];

const actualizarClima = (dato, units) => {
  const TempCharacter = units === 'metric' ? 'C' : 'F';
  document.getElementById("Temp-Actual").textContent = `${Math.round(dato.list[0].main.temp)} °${TempCharacter}`
  document.getElementById("Ubi-Actual").textContent = dato.city.name
  document.getElementById("Clima-Actual").textContent = dato.list[0].weather[0].description.toUpperCase()
  document.getElementById("Temp-Rango").textContent = `${Math.round(dato.list[0].main.temp_min)} °${TempCharacter} / ${Math.round(dato.list[0].main.temp_max)} °${TempCharacter}`
  document.getElementById("Clima-Humedad").textContent = `Humedad: ${dato.list[0].main.humidity} %`
  document.getElementById(`IconoAnimado`).src = `static/icons/${ANIMATED_ICONS[dato.list[0].weather[0].main] || 'cloudy-day-1.svg'}`;
  for (let i = 1; i < 4; i++) {
    document.getElementById(`Clima-Humedad${i}`).textContent = `Humedad: ${dato.list[i].main.humidity} %`
    document.getElementById(`Temp-dia${i}`).textContent = `${Math.round(dato.list[i].main.temp_min)} °${TempCharacter} / ${Math.round(dato.list[i].main.temp_max)} °${TempCharacter}`
    document.getElementById(`Clima-dia${i}`).textContent = dato.list[i].weather[0].description.toUpperCase()
    document.getElementById(`IconoAnimado${i}`).src = `static/icons/${ANIMATED_ICONS[dato.list[i].weather[0].main] || 'cloudy-day-1.svg'}`;
  }
};


const getNombreDelDia = fecha => DAYS[new Date(fecha).getDay()];

const agregarFechayAnimacion = () => {
  const dia = new Date();
  const diasiguiente =  new Date(dia)

  document.getElementById('Contenedor-Datos').classList.add('fadeIn');
  document.getElementById("Fecha").textContent = getNombreDelDia(dia.setDate(dia.getDate()));
  for (let i = 1; i < 4; i++) {
    document.getElementById(`Fecha${i}`).textContent = getNombreDelDia(dia.setDate(diasiguiente.getDate() + i));
    document.getElementById(`Caja${i}`).classList.add('fadeIn');
  }
}


window.addEventListener('load', () => {
  agregarFechayAnimacion();

  if (navigator.geolocation) {
    try {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        const query = {
          ...WEATHER_PROPS,
          lat: latitude,
          lon: longitude
      };
        const Url = `${WEATHER_URL}?${new URLSearchParams(query).toString()}`
        console.log(Url)
        fetch(Url)
            .then(response => {return response.json()})
            .then(clima => {
              actualizarClima(clima, query.units);
        })
          .catch( error => {
          console.log(error)
        })
      })
    }catch (error) {
      console.log(error);
  }}
});


const ActualizarPronostico = async () => {{
  const query = {
    ...WEATHER_PROPS,
    q: document.getElementById("Buscar").value,
    cnt: 4,
    units: document.getElementById("Unidad").value || "metric"
  }
  const UrlActualizar = `${WEATHER_URL}?${new URLSearchParams(query).toString()}`

  console.log(UrlActualizar)

  fetch(UrlActualizar)
      .then(response => {return response.json()})
      .then(pronostico => {
        actualizarClima(pronostico, query.units);
  })
  .catch( error => {
      console.log(error)
  })
}};


const ejecutarAccion = (event) => {
  if (event.code === 'Enter') {
    ActualizarPronostico();
  }
}


function App() {
  return (
    <div id='Container' className='Flex w-100'>

    <div className="Info Flex w-100">

        <div id="Buscador" className="Flex jc-se h-30">

          <input placeholder="Buscar ciudad..." id="Buscar" onKeyUp={ejecutarAccion} className="p-1"/>

          <select id="Unidad" className="p-1">
            <option value="metric">Celcius</option>
            <option value="">Fahrenheit</option>
          </select>

          <button id="BotonPronostico" onClick={ActualizarPronostico} >Ver Pronóstico</button>

        </div>

        <div id="Contenedor" className="Flex h-90">

          <div id="Contenedor-Datos" className="Flex h-90">

            <h2 className="Titulo Flex w-100 p-1 h-10">Pronóstico de Hoy</h2>

            <div id="Datos-Hoy" className="Flex w-100 p-1 h-90">

              <div id="Datos-Locales" className="h-90">

                <h3 id="Clima-Actual" className="Flex w-100 h-30"></h3>

                <img id="IconoAnimado" className="Flex w-100 h-50" src="" alt=""/>

                <h3 id="Ubi-Actual" className="Flex w-100 h-10"></h3>

                <h3 id="Fecha" className="w-100 h-10"></h3>

              </div>

              <div id="Datos-Clima" className="h-90">

                <h3 className="Clima-Titulo Flex w-100 h-30">TEMPERATURA ACTUAL</h3>

                <h1 id="Temp-Actual" className="Flex h-50"></h1>

                <h3 id="Temp-Rango" className="Flex w-100 h-10"></h3>

                <h3 id="Clima-Humedad" className="Flex w-100 h-10"></h3>

              </div>

            </div>

          </div>
        </div>

      </div>

      <div id="Registros" className="Flex w-100 jc-se">

        <div id='Caja1' className="Caja Flex p-1">

          <h2 id="Fecha1"></h2>

          <h3 id="Clima-dia1" className="Flex h-30"></h3>

          <img id="IconoAnimado1" className="Flex w-100 h-50" src="" alt=""/>

          <h3 id="Temp-dia1" className="Flex w-100 h-10"></h3>

          <h3 id="Clima-Humedad1" className="Flex w-100 h-10"></h3>

        </div>

        <div id='Caja2' className="Caja Flex p-1">

          <h2 id="Fecha2"></h2>

          <h3 id="Clima-dia2" className="Flex h-30"></h3>

          <img id="IconoAnimado2" className="Flex w-100 h-50" src="" alt=""/>

          <h3 id="Temp-dia2" className="Flex w-100 h-10"></h3>

          <h3 id="Clima-Humedad2" className="Flex w-100 h-10"></h3>

        </div>

        <div id='Caja3' className="Caja Flex p-1">

          <h2 id="Fecha3"></h2>

          <h3 id="Clima-dia3" className="Flex h-30"></h3>

          <img id="IconoAnimado3" className="Flex w-100 h-50" src="" alt=""/>

          <h3 id="Temp-dia3" className="Flex w-100 h-10"></h3>

          <h3 id="Clima-Humedad3" className="Flex w-100 h-10"></h3>

        </div>

      </div>

    </div>

  );
}

export default App;
