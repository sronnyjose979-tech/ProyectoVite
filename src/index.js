// import data from "./data.json";
// import mifuncion, { HELLO } from "./modules/modulo.js";
// import { agregarUsuario, mostrarUsuarios } from "./modules/task.js";

// console.log(HELLO);
// console.log(mifuncion());

// const nuevoArreglo = data.users.filter((user) => user.age > 25);

// const usersList = document.querySelector("#users");
// const taskInput = document.querySelector(".taskInput");
// const taskButton = document.querySelector(".taskButton");

// taskButton.addEventListener("click", (e) => {
//     agregarUsuario(taskInput, usersList);
// });

// mostrarUsuarios(usersList);


// Imagen de respaldo cuando la API no tiene una portada.
const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

// Obtiene una serie de dos maneras:
// - Solo dígitos (ej. "1"): busca el ID exacto en /shows/1.
// - Texto (ej. "Breaking Bad"): busca una coincidencia por nombre.
// Un título formado solo por números también se interpretará como un ID.
const getShowData = async (query) => {
  const isId = /^\d+$/.test(query);
  // encodeURIComponent prepara espacios y caracteres especiales para la URL.
  const URL = isId
    ? `https://api.tvmaze.com/shows/${query}`
    : `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(query)}`;
  const data = await fetch(URL).then(res => {
    if (res.status === 404) throw new Error("No se encontró una serie con ese ID o nombre.");
    if (!res.ok) throw new Error("No se pudo cargar la serie.");
    return res.json();
  });

  // Conservamos los datos necesarios para mostrar la serie y buscar sus episodios.
  return {
    id: data.id,
    name: data.name,
    rating: data.rating,
    // ?. permite que falte image; ?? usa el respaldo si el valor es null o undefined.
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  }

}
// Los episodios siempre se consultan con el ID devuelto por la API.
const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await fetch(URL).then(res => {
    if (!res.ok) throw new Error("No se pudieron cargar los episodios.");
    return res.json();
  });

  // map crea un arreglo con número, temporada y calificación de cada episodio.
  const episodeList = episodes.map(episode => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average
  }));

  // Agrupa por temporada: { 1: [episodios...], 2: [episodios...] }.
  const episodesBySeason = Object.groupBy(episodeList, (episode) => episode.season);
  return episodesBySeason;
}


// Renderizar DOM
const $header = document.querySelector(".content > header");
const $episodes = document.querySelector(".episodes");

// Cada episodio: redondeamos la calificación para elegir una clase del CSS.
// Si no tiene calificación, usamos rating-0 y lo indicamos en el título.
const createEpisodeHTML = (episode) => /* html */ `
  <div class="episode episode-${episode.number} rating-${Math.round(episode.rating ?? 0)}"
       title="Episodio ${episode.number}: ${episode.rating ?? 'Sin calificación'}">
    ${episode.number}
  </div>
`;

// Cada temporada (data = array de episodios, number = temporada).
// map genera el HTML de los episodios y join lo une en un solo texto.
const createSeasonHTML = (data, number) => /* html */ `
  <article class="season">
    <header class="season-header">T${number}</header>
    ${data.map(createEpisodeHTML).join("")}
  </article>
`;

// Campo y botón, siguiendo el ejemplo comentado de usuarios
const searchForm = document.querySelector(".searchForm");
const taskInput = document.querySelector(".taskInput");
const taskButton = document.querySelector(".taskButton");
const searchMessage = document.querySelector(".searchMessage");

// submit funciona tanto con el botón como al presionar Enter.
searchForm.addEventListener("submit", async (e) => {
  // Evita recargar la página; trim elimina espacios al principio y al final.
  e.preventDefault();
  const query = taskInput.value.trim();
  if (!query) {
    searchMessage.textContent = "Escribe el ID o el nombre de una serie.";
    return;
  }

  // Evita búsquedas simultáneas, incluso si se vuelve a presionar Enter.
  if (taskButton.disabled) return;
  taskButton.disabled = true;
  searchMessage.textContent = "Buscando serie...";
  $header.replaceChildren();
  $episodes.replaceChildren();

  try {
    // await espera la respuesta antes de usar el ID para pedir los episodios.
    const show = await getShowData(query);
    const seasons = await getEpisodeList(show.id);

    // Creamos la portada, el nombre y la calificación para el encabezado.
    const poster = document.createElement("img");
    poster.className = "poster";
    poster.src = show.image;
    poster.alt = show.name;

    const title = document.createElement("h1");
    title.textContent = show.name;

    const rating = document.createElement("p");
    rating.textContent = `Calificación: ${show.rating.average ?? 'Sin calificación'}`;
    $header.replaceChildren(poster, title, rating);

    // entries entrega [número de temporada, episodios], conservando su número real.
    const list = Object.entries(seasons).map(([number, season]) => createSeasonHTML(season, number));
    $episodes.innerHTML = list.join("");
    searchMessage.textContent = list.length ? "" : "Esta serie todavía no tiene episodios.";
  } catch (error) {
    // Aquí llegan los errores de conexión y los mensajes lanzados con throw.
    searchMessage.textContent = error.message;
    console.error(error);
  } finally {
    // Habilita el botón tanto si funcionó la búsqueda como si falló.
    taskButton.disabled = false;
  }
});
