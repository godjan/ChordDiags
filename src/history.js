/* History.js 
undo / redo manager 
*/
const MAX_ELEMENTS = 20;

class HistoryService {

    constructor() {

        this.history = [];
        this.cursor = 0;
    }
    

    add(action, diagId, note) {

        if(this.cursor > MAX_ELEMENTS-1) {

            this.history.splice(0, 1);
            this.cursor == MAX_ELEMENTS - 1;
        }
        this.history.push({ action : action, diagId: diagId, note: note });
        this.cursor++;
    }

    pop() {

       return this.history.splice(-1,1)
    }

    next() {

        this.cursor++;

        if(this.cursor >  MAX_ELEMENTS -1)
           return null;
        
        return this.history[this.cursor];
    }

    back() {

        //let cursor = this.cursor -1;
       
       
        // if(cursor < 0)
        //    return null;
        debugger
        if(this.cursor < 0) return null;

        let action =  this.history[this.cursor];
        this.cursor--;

        return action;
    }


    log() {

        this.history.forEach(e => { console.log(e)});
    }
}

export default new HistoryService()