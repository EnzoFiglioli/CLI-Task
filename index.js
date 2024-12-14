import readline from 'readline';
import fs from 'fs';
import {Chalk} from 'chalk';
import { Task } from './models/Task.js';
import {display} from './GIU/display.js';

const rl = readline.createInterface({ input:process.stdin, output:process.stdout });
const chalk = new Chalk();

function app(){
    console.log(chalk.yellow("Administrador de tareas:"));
    console.log();
    display();
    chooseOption();    
}

function chooseOption() {
    rl.question(chalk.magenta('Elije una opción: '), (answer) => {
        switch (parseInt(answer)) {
            case 1:
                showTasks();
                break;
            case 2:
                createTask();
                break;
            case 3:
                deleteTask();
                break;
            case 4:
                updateTask();
                break;
            case 0:
                rl.close();
                break;
            default:
                console.log("Opción no válida");
                chooseOption();
                break;
        }
    });
}

function showTasks() {
    allTareas(() => {
        rl.question(chalk.magenta("Presione 0 para salir al menu principal: "), (answer) => {
            if (answer == "0") {
                console.clear();
                display();
                chooseOption();
            } else {
                showTasks();
            }
        });
    });
}

function actuallyTasks(){
    const data = JSON.parse(fs.readFileSync("./data/tasks.json", "utf-8"));

    if (data.length > 0) {
        console.log(chalk.bgCyan("Tareas actuales:"));
        data.forEach((task, index) => {
            console.log(chalk.yellow(`${chalk.greenBright(index + 1)}. ${task.concepto} - ${task.fecha} - Estado: ${chalk.blue(task.estado)}`));
        });
    } else {
        console.log("No hay tareas...");
        chooseOption();
        return;
    }
}

function allTareas(callback) {
    fs.readFile("./data/tasks.json", "utf-8", (err, data) => {
        if (err) {
            console.log("Error al leer las tareas:", err);
            callback();
            return;
        }
        const tareas = JSON.parse(data);
        console.clear();

        if (tareas.length > 0) {
            console.log(chalk.bgCyan("Tareas actuales:"));
            tareas.forEach((task, index) => {
                console.log(chalk.yellow(`${chalk.greenBright(index + 1)}. ${task.concepto} - ${task.fecha} - Estado: ${chalk.blue(task.estado)}`));
            });
        } else {
            console.log("No hay tareas...");
        }
        callback();
    });
}

function createTask() {
    console.clear();
    const tarea = new Task();
    console.log();
    rl.question(chalk.yellow("Escribe la tarea (o presiona 0 para volver atras): "), (concepto) => {
        if(parseInt(concepto) == 0){
            console.clear();
            display();
            chooseOption();
        }
        tarea.concepto = concepto;
        rl.question(chalk.yellow("¿Para cuando es? : "), (fecha) => {
            tarea.fecha = fecha;
            tarea.estado = "pendiente";
            
            try {
                const data = fs.readFileSync("./data/tasks.json", "utf-8");
                let tareas = JSON.parse(data);
                tarea.idTask = tareas.length + 1;
                tareas.push(tarea);
                fs.writeFileSync("./data/tasks.json", JSON.stringify(tareas, null, 2), "utf-8");
                console.log(chalk.greenBright("Tarea creada exitosamente!"));
            } catch (err) {
                console.log("Error al leer o escribir el archivo:", err);
            }
            rl.question(chalk.magenta("Quieres crear otra tarea? (o presiona '0' para salir): "),(answer)=>{
                if(parseInt(answer) == 0){
                    display();
                    chooseOption();
                }else{
                    createTask();
                }
            })
        });
    });
}

function deleteTask() {
    console.clear();
    const data = JSON.parse(fs.readFileSync("./data/tasks.json", "utf-8"));
    actuallyTasks();
    rl.question(chalk.magentaBright("¿Qué tarea deseas borrar? (o presione 0 para salir): "), (answer) => {
        if (parseInt(answer) === 0) {
            console.clear();
            display();
            chooseOption();
            return;
        }
        const taskIndex = parseInt(answer) - 1;
        if (taskIndex >= 0 && taskIndex < data.length) {
            data.splice(taskIndex, 1);

            fs.writeFileSync("./data/tasks.json", JSON.stringify(data, null, 2), "utf8");
            console.log(chalk.greenBright("Tarea eliminada correctamente!"));
        } else {
            console.log(chalk.red("Tarea no encontrada. Por favor, ingrese un número válido."));
        }
        console.clear();
        display();
        chooseOption();
    });
}

function updateTask() {
    console.clear(); 
    try {
        actuallyTasks();
        fs.readFile("./data/tasks.json", "utf-8", (err, data) => {
            if (err) {
                console.error(chalk.red("Error al leer el archivo de tareas: " + err));
                return;
            }
            let tareas = JSON.parse(data);
            rl.question(chalk.magenta("¿Qué tarea deseas actualizar? (presiona 0 para salir): "), (answer) => {
                const res = parseInt(answer);
                if (res === 0) {
                    console.clear();
                    display();
                    chooseOption();
                    return;
                }
                if (res > 0 && res <= tareas.length) {
                    const tarea = tareas[res - 1];
                    console.log(chalk.bgCyan(`Tarea seleccionada: ${tarea.concepto} - ${tarea.fecha} - Estado: ${tarea.estado}`));
                    rl.question("Nuevo concepto de la tarea: ", (concepto) => {
                        rl.question("Nueva fecha para la tarea: ", (fecha) => {
                            tarea.concepto = concepto;
                            tarea.fecha = fecha;
                            fs.writeFileSync("./data/tasks.json", JSON.stringify(tareas, null, 2), "utf8");

                            console.log(chalk.greenBright("Tarea actualizada correctamente!"));
                            console.clear();
                            display();
                            chooseOption();
                        });
                    });
                } else {
                    console.log(chalk.red("Tarea no encontrada. Por favor, ingrese un número válido."));
                    updateTask();
                }
            });
        });
    } catch (err) {
        console.error(chalk.red("Error inesperado: " + err));
    }
}

app();