// console.log("Hello, world!");
// import data from './data.json';
// import modulo from './modules/modulo.js';
// import {HELLO} from './modules/modulo.js';


// console.log(HELLO());
// console.log(modulo());
// console.log(data.users.filter((user) => user.age >= 29));

// const userList = document.querySelector('#users');

// data.users.forEach((user) => {

//     console.log(user.name)
//     userList.insertAdjacentHTML('beforeend', `<li>${user.name}</li>`);

// });


import data from "./data.json";
import mifuncion, { HELLO } from "./modules/modulo.js";

console.log(HELLO);
console.log(mifuncion());

const nuevoArreglo = data.users.filter((user) => user.age > 25);


const usersList = document.querySelector("#users");
const taskInput = document.querySelector(".taskInput");
const taskButton = document.querySelector(".taskButton");

taskButton.addEventListener("click", (e) => {
    console.log(taskInput.value);

    // Agregar un nuevo usuario al arreglo de usuarios
    data.users.push({
        name: taskInput.value,
        age: 30
    });

// Mostrar los usuarios actualizados
   mostrarUsuarios();
   // Limpiar el campo de entrada después de agregar el usuario
   taskInput.value = "";
});

mostrarUsuarios();

function mostrarUsuarios(){
    
    // Limpiar la lista antes de mostrar los usuarios
    usersList.innerHTML = "";

    // Mostrar los usuarios en la lista
    data.users.forEach((user) =>{
    
        console.log(user.name);
        usersList.insertAdjacentHTML("beforeend", `<li>${user.name}</li>`); //mejorar esto
    
    });

}
