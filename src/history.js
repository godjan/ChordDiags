/* History.js 
undo / redo manager 
*/
const MAX_ELEMENTS = 20;

class HistoryService {

    constructor() {

        this.history = [];
        this.cursor = 0;
    }
    
    reset() {

        this.history = [];
        this.cursor = 0;
    }

    add(diagrams) {

        //deep copy
        let diag = JSON.parse(JSON.stringify(diagrams));
        
        if(this.history.length > 1) {
            this.history.splice(this.cursor + 1);
        }
        this.history.push(diag);
        this.cursor = this.history.length-1;
    }

    // add(action, diagId, note) {

    //     if(this.cursor > MAX_ELEMENTS-1) {

    //         this.history.splice(0, 1);
    //         this.cursor == MAX_ELEMENTS - 1;
    //     }
    //     this.history.push({ action : action, diagId: diagId, note: note });
    //     this.cursor = this.history.length-1;
    //     console.log('added at ' + this.cursor)
    // }

    pop() {

       return this.history.splice(-1,1)
    }

    redo() {

        if(this.cursor + 1 ==  this.history.length )
           return null;

        this.cursor++;
        if(this.history.length == 1)
            this.cursor = 0;

        console.log('cursor =' + this.cursor)

        return this.history[this.cursor];
    }

    undo() {

        if(this.cursor-1 < 0) return null;

        this.cursor--;

       console.log('cursor =' + this.cursor)
       
        let action =  this.history[this.cursor];
        
        return action;
    }


    log() {

        this.history.forEach(e => { console.log(e)});
    }
}

export default new HistoryService()