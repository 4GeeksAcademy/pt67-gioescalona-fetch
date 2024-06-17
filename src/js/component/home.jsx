import React, { useEffect, useState } from "react";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [name, setName] = useState("EduardoLoreto");
    const [label, setLabel] = useState("");
    const [isDone, setIsDone] = useState(false);
    const [newUserName, setNewUserName] = useState("");

    const getAllData = async () => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${name}`);
            if (response.ok) {
                const dataJson = await response.json();
                setTasks(Array.isArray(dataJson.todos) ? dataJson.todos : []);
                console.log("Datos obtenidos:", dataJson.todos);
            } else {
                console.error("Error al recuperar datos:", response.statusText);
            }
        } catch (error) {
            console.error("Error al recuperar datos:", error);
        }
    };

    const createNewElement = async (event) => {
        event.preventDefault();
        const newTask = { label, done: isDone };
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${name}`, {
                method: 'POST',
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                const dataJson = await response.json();
                setTasks([...tasks, dataJson]);
                console.log("Task creada:", dataJson);
            } else {
                console.error("Error al crear Task:", response.statusText);
            }
        } catch (error) {
            console.error("Error al crear Task:", error);
        }
    };

    const deleteElement = async (taskId) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setTasks(tasks.filter((item) => item.id !== taskId));
                console.log("Task eliminada:", taskId);
            } else {
                console.error("Error al eliminar Task:", response.statusText);
            }
        } catch (error) {
            console.error("Error al eliminar Task:", error);
        }
    };

    const deleteAllElements = async () => {
        try {
            const deletePromises = tasks.map((item) =>
                fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, { method: 'DELETE' })
            );
            await Promise.all(deletePromises);
            setTasks([]);
            console.log("Todas las tasks han sido eliminadas");
        } catch (error) {
            console.error("Error al eliminar todas las tasks:", error);
        }
    };
    const createUser = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${newUserName}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                setName(newUserName);
                setNewUserName("");
                setTasks([]);
                console.log("Usuario creado:", newUserName);
                getAllData(); // Obtener las tareas del nuevo usuario
            } else {
                console.error("Error al crear usuario:", response.statusText);
            }
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    };
    useEffect(() => {
        getAllData();
    }, [name]);
    useEffect(() => {
        setLabel("");
    }, [tasks]);

    return (
        <div class="container d-flex justify-content-center p-4 w-50">
  <div class="col-sm-6 mb-3 mb-sm-0">
    <div class="card border border-success border-3">
        <div className="row py-2">
            <div className="container-fluid row-flex justify-content-center w-75 mb-5 mt-5">
                <form onSubmit={createUser} className="mb-4">
                    <div className="mb-3">
                        <label className="form-label"><strong>Crear Usuario</strong></label>

                        <input
                            placeholder="Nombre de usuario"
                            value={newUserName}
                            className="form-control"
                            onChange={(event) => setNewUserName(event.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success mb-3">Crear Usuario</button>
                </form>
                <form onSubmit={createNewElement}>
                    <div className="mb-3">
                        <label className="form-label"><strong>Listado de Tareas</strong></label>

                        <input
                            placeholder="Añade nueva tarea"
                            value={label}
                            className="form-control"
                            aria-describedby="emailHelp"
                            onChange={(event) => setLabel(event.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success mb-3"><strong>Añadir Tareas
                    </strong></button>
                </form>
                <div className="w-100 m-auto">
                    <ol>
                        {tasks.map((item, index) => (
                            <li key={index}>
                                {item.label}
                                <button
                                    className="btn btn-success btn-sm ms-2"
                                    onClick={() => deleteElement(item.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                                </button>
                            </li>
                        ))}
                    </ol>

                    <button
                        className="btn btn-danger d-flex text-white text-center my-3"
                        onClick={deleteAllElements}
                    >
                        <strong>¡Eliminar Tareas!</strong>
                    </button>
                </div>
            </div>
        </div>
        </div>
        </div>
        </div>
    );
};
export default Home;