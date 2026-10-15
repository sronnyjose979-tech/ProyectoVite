import data from "../data.json";

export function agregarUsuario(input, lista) {
    console.log(input.value);

    // Agregar un nuevo usuario al arreglo de usuarios
    data.users.push({
        name: input.value,
        age: 30
    });

    // Mostrar los usuarios actualizados
    mostrarUsuarios(lista);
    
    // Limpiar el campo de entrada después de agregar el usuario
    input.value = "";
}

export function mostrarUsuarios(lista) {
    // Limpiar la lista antes de mostrar los usuarios
    lista.innerHTML = "";

    // Mostrar los usuarios en la lista
    data.users.forEach((user) => {
        console.log(user.name);
        lista.insertAdjacentHTML("beforeend", `<li>${user.name}</li>`);
    });
}