import Config from './config.js'
import ApiService from './api.js'
import HistoryService from './history.js'

 class SheetStore
 {
   constructor() {

      this.state = {
            sheet: {
               diagrams:[]
            },
            edition: false,

           // historyService: HistoryService
      }

   }

   loadSheets() {
      
      return ApiService.getSheets();
   }

   loadSheet(id) {

      return ApiService.getSheet(id);
   }

   saveSheet() {
      
      if(this.state.sheet._id) {

         return ApiService.updateSheet(this.state.sheet)
      }
      return ApiService.createSheet(this.state.sheet)
   }

   createEmptySheet() {

      this.state.sheet = this.getEmptySheet();
   }

   getEmptySheet() {

      return { id: 0, 
               fretSpan: Config.FRETSPAN_DEFAULT, 
               tuning: Config.TUNING_DEFAULT,  
               version: 1, 
               author:{ name:'', id:''},
               isPrivate:true,
               title: '', 
               subtitle:'',
               description:'', 
               tags: '',
               diagrams: []
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

   addEmptyDiagram() {

      const count = this.state.sheet.diagrams.length;
      let nextDiagId = 1;

      if(count > 0) {

         nextDiagId = this.state.sheet.diagrams[count-1].number + 1;
      }
   
      this.addDiagram(this.getEmptyDiagram(nextDiagId));
   }


   addDiagram(diagram) {
      
      this.state.sheet.diagrams.push(diagram)
   }

   getEmptyDiagram(id) {

      return { id: 'diag_' + id, 
               number: id, 
               chordName:'', 
               notes:[], 
               fretNumbers: {'1':'', '2':'', '3' : '','4' : '','5':'','6':'','7':''}
         };
   }

   deleteDiagram(diagram) {

      const index = this.state.sheet.diagrams.indexOf(diagram);
      this.state.sheet.diagrams.splice(index, 1)
   }

   clearDiagram(diagId) {

      const diagram = this.getDiagram(diagId);

      diagram.notes = [];
      diagram.fretNumbers =  {'1':'', '2':'', '3' : '','4' : '','5':''}
      diagram.chordName = '';
   }

  /*-----------------------------------------NOTES--------------------------------------------------------------*/
   addNote(diagId, note) {

      const diagram = this.getDiagram(diagId);

      if(diagram == null)
         return;

      diagram.notes.push(note);

      HistoryService.add('add', diagId, note)
   
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

   deleteNoteByIndex(diagId, noteIndex) {
      
      const diagram = this.getDiagram(diagId);

      if(diagram == null)
         return;

      HistoryService.add('delete', diagId, diagram.notes[noteIndex]);

      diagram.notes.splice(noteIndex, 1);
   }

   deleteNote(diagId, note) {

      const diagram = this.getDiagram(diagId);

      if(diagram == null)
         return;
      
      let noteIndex = diagram.notes.findIndex( n => n.neckPosition.fret == note.neckPosition.fret &&
                                                    n.neckPosition.string == note.neckPosition.string &&
                                                    n.shape == note.shape);
      
      diagram.notes.splice(noteIndex, 1);
   }

   deleteNotes(diagId) {

      const diagram = this.getDiagram(diagId);

      diagram.notes = [];
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

