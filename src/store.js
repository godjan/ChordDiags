import Config from './config.js'
import ApiService from './api.js'
import HistoryService from './history.js'
import * as Firebase from 'firebase'

 class SheetStore
 {
   constructor() {

      this.state = {

            sheet: {
               diagrams:[]
            },
            
            edition: false,
            user: { userId: null, mail: null},
            userId:null
      }
   }

   loadSheets() {
      
      return ApiService.getSheets();
   }

   loadSheet(id) {
      const self = this;
      return ApiService.getSheet(id)
                       .then((response) => {
                           self.state.edition = false;
                           HistoryService.reset();
                           HistoryService.add(response.data.diagrams);
                           return response;
                       });
   }

   saveSheet() {
      
      if(this.state.sheet._id) {

         return ApiService.updateSheet(this.state.sheet)
      }
      return ApiService.createSheet(this.state.sheet)
   }

   createEmptySheet() {

      HistoryService.reset();
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

   createNewSheet() {
      
      this.createEmptySheet();
      this.addEmptyDiagram();     
      //HistoryService.add(this.state.sheet.diagrams);  
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
      
      this.state.sheet.diagrams.push(diagram);
      HistoryService.add(this.state.sheet.diagrams);
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
      this.state.sheet.diagrams.splice(index, 1);
      HistoryService.add(this.state.sheet.diagrams);
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
      HistoryService.add(this.state.sheet.diagrams);
      //HistoryService.add('ADD_NOTE', diagId, note)
      
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

      //HistoryService.add('DELETE_NOTE', diagId, diagram.notes[noteIndex]);
   
      diagram.notes.splice(noteIndex, 1);
      HistoryService.add(this.state.sheet.diagrams);
   }

   deleteNote(diagId, note) {

      const diagram = this.getDiagram(diagId);

      if(diagram == null)
         return;
      
      let noteIndex = diagram.notes.findIndex( n => n.neckPosition.fret == note.neckPosition.fret &&
                                                    n.neckPosition.string == note.neckPosition.string &&
                                                    n.shape == note.shape);

      HistoryService.add('DELETE_NOTE', diagId, diagram.notes[noteIndex]);

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
   
   // triggers a state save
   saveState() {

      HistoryService.add(this.state.sheet.diagrams);
   }

   undo() {

      var state = HistoryService.undo();
         
      if(!state) return;

      //executeAction(item);
      
      this.state.sheet.diagrams = JSON.parse(JSON.stringify(state));
   }

   redo() {

      let state = HistoryService.redo();

      if(!state) return;

      this.state.sheet.diagrams = JSON.parse(JSON.stringify(state));
      //executeAction(item);
   }

   executeAction(action) {

      if(item.action =='ADD_NOTE') {
         
         this.deleteNote(item.diagId, item.note);

       } 
       else if(item.action == 'DELETE_NOTE') {
         
         this.addNote(item.diagId, item.note)
      }
   }
   
   // user
   signUserUp(user) {

      return Firebase.auth()
                     .createUserWithEmailAndPassword(user.email, user.password)
                     .then(result => {

                        this.state.user = { userId: result.user.uid, 
                                             email: result.user.email };
                     });
                     // .catch(
                     //    error => { console.log(error) }
                     // );
   }

   signUserIn(user) {

      return Firebase.auth()
              .signInWithEmailAndPassword(user.email, user.password)
              .then(result => {

                 this.state.user = { userId: result.user.uid, 
                                     email: result.user.email };

                 console.log('user logged in : ' + this.state.user.userId);
              });
             
   }
 }

 export default new SheetStore()

