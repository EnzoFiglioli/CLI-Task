export class Task {
        constructor(idTask,concepto,estado,fecha){
            this.idTask  = idTask 
            this.concepto = concepto;
            this.estado = estado;
            this.fecha = fecha || Date.now();
        }
    }   