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

 }

 export default new SheetStore()

