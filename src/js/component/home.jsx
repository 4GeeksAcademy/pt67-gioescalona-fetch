import React, { useEffect, useState } from "react";

const Home = () => {
    const [tarea, setTarea] = useState("");
    const [tareas, setTareas] = useState([]);
    const [name, setName] = useState("");

    const obtenerTodasLasTareas = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`);
            if (response.ok) {
                const dataJson = await response.json();
                setTareas(Array.isArray(dataJson.todos) ? dataJson.todos : []);
                if (dataJson.todos.length === 0) {
                    alert("El usuario introducido ya existe, añade las tareas.");
                } else {
                    alert("El usuario introducido ya existe, añade o borra tareas.");
                }
            } else {
                console.error("Error al obtener tareas:", response.statusText);
            }
        } catch (error) {
            console.error("Error al obtener tareas:", error);
        }
    };

    const crearNuevoUsuario = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                alert("Usuario creado correctamente, añade las tareas.");
                obtenerTodasLasTareas();
            } else {
                alert("Error al crear usuario, vuelva a intentarlo.");
                console.error("Error al crear usuario:", response.statusText);
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };

    const verificarYCrearUsuario = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`);
            if (response.ok) {
                const dataJson = await response.json();
                if (dataJson.todos.length === 0) {
                    alert("El usuario introducido ya existe, añade las tareas.");
                } else {
                    alert("El usuario introducido ya existe, añade o borra tareas.");
                }
                setTareas(Array.isArray(dataJson.todos) ? dataJson.todos : []);
            } else if (response.status === 404) {
                await crearNuevoUsuario();
            } else {
                console.error("Error al verificar usuario:", response.statusText);
            }
        } catch (error) {
            console.error("Error al verificar usuario:", error);
        }
    };

    const crearNuevaTarea = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${name}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: tarea, done: false })
            });
            if (response.ok) {
                obtenerTodasLasTareas();
            } else {
                console.error("Error al crear tarea:", response.statusText);
            }
        } catch (error) {
            console.error("Error al crear tarea:", error);
        }
    };

    const eliminarTarea = async (todoId) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                obtenerTodasLasTareas();
            } else {
                console.error("Error al eliminar tarea:", response.statusText);
            }
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    const eliminarTodasLasTareas = async () => {
        try {
            const eliminarTareas = tareas.map((item) =>
                fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, { method: 'DELETE' })
            );
            await Promise.all(eliminarTareas);
            setTareas([]);
        } catch (error) {
            console.error("Error al eliminar todas las tareas:", error);
        }
    };

    const manejarEnvioTarea = (event) => {
        event.preventDefault();
        crearNuevaTarea(event);
    };

    const manejarCambioTarea = (event) => {
        setTarea(event.target.value);
    };

    const manejarTeclaEnter = (event) => {
        if (event.key === "Enter") {
            manejarEnvioTarea(event);
        }
    };

    const manejarCambioUsuario = (event) => {
        setName(event.target.value);
    };

    const manejarEnvioUsuario = async (event) => {
        event.preventDefault();
        verificarYCrearUsuario(event);
    };

    const contarTareas = () => {
        return tareas.length === 0 ? "No pending task" : `Pending tasks: ${tareas.length}`;
    };

    useEffect(() => {
        setTarea("");
    }, [tareas]);

    return (
        <div className="container w-50 border border-5 p-3 mt-4 bg-secondary">
            <h1 className="text-center text-white mt-5">Task Manager</h1>
            <form onSubmit={manejarEnvioUsuario}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control mt-4"
                        id="usuarioInput"
                        value={name}
                        onChange={manejarCambioUsuario}
                        placeholder="Add user"
                    />
                    <button type="submit" className="btn btn-primary mt-3">
                        Create user
                    </button>
                </div>
            </form>
            <form onSubmit={manejarEnvioTarea}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control mt-5"
                        id="tareaInput"
                        value={tarea}
                        onChange={manejarCambioTarea}
                        onKeyDown={manejarTeclaEnter}
                        placeholder="Write tasks"
                    />
                    <button type="submit" className="btn btn-success mt-3">
                        Add task
                    </button>
                </div>
            </form>
            <ul className="list-group">
                {tareas.map((tarea, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{tarea.label}</span>
                        <span className="delete-icon" onClick={() => eliminarTarea(tarea.id)}>x</span>
                    </li>
                ))}
            </ul>
            <div className="text-center mt-3">
                <button className="btn btn-danger" onClick={eliminarTodasLasTareas}>
                    Delete all tasks
                </button>
            </div>
            <div className="text-white text-center mt-3">
                <p>{contarTareas()}</p>
            </div>
        </div>
    );
};

export default Home;
