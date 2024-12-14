
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
module.exports = {chooseOption}