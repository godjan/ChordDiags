class SheetStore
 {
     constructor() {
         this.state = {
             sheet: {
                 diagrams:[]
             },
             edition: false
         }
     }

     setSheet(sheet) {
         this.state.sheet = sheet;
     }

     setDiagrams(diags) {
         this.state.sheet.diagrams = diags;
     }

     getDiagram(id) {

        return this.state.sheet.diagrams.find(d => d.id == id);
     }


     addDiagram(diagram) {
        this.state.sheet.diagrams.push(diagram)
     }

     deleteDiagram(diagram) {

        const index = this.state.sheet.diagrams.indexOf(diagram);
        this.state.sheet.diagrams.splice(index, 1)
     }


     updateNote(diagId, index, note) {

        const diagram = this.getDiagram(diagId);
 
        if(diagram == null)
            return;
        
        if(!diagram.notes || diagram.notes.length == 0) {

            diagram.notes.push(note);

        } else {

            diagram.notes[index] = note;
        }
          
     }

     deleteNote(diagId, noteIndex) {
        
        const diagram = this.getDiagram(diagId);
 
        if(diagram == null)
            return;
        
        diagram.notes.splice(noteIndex, 1);

     }

     deleteNotes(diagId) {

        const diagram = this.getDiagram(diagId);

        diagram.notes = [];
     }

     clearDiagram(diagId) {

        const diagram = this.getDiagram(diagId);

        diagram.notes = [];
        diagram.fretNumbers =  {'1':'', '2':'', '3' : '','4' : '','5':''}
        diagram.chordName = '';
     }

     addNote(diagId, note) {

        const diagram = this.getDiagram(diagId);
 
        if(diagram == null)
            return;

        diagram.notes.push(note)
     }

     updateFretContent(diagId, fretIndex, newVal) {

        const diagram = this.getDiagram(diagId);
 
        if(diagram == null)
            return;

       diagram.fretNumbers[fretIndex] = newVal;
        //console.log('store updates fret content for diag# ' + diagId + ' fret ' )

     }
 }

 export default new SheetStore()

