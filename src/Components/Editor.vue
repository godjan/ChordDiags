<template>
<div>
  
    <v-layout>
        <v-flex sm12 lg12> 
             <input type="text" 
                    placeholder="Sheet title" 
                    width="300"
                    :value="sheet.title" 
                    class="headline grey--text text--darken-1"
                    style="width:100%"
                   />
        </v-flex>
    </v-layout>
    <v-layout>
        <v-flex sm12 lg12> 
            <strong>Tuning</strong> {{ sheet.tuning}}
        </v-flex>
    </v-layout>
        <v-layout row wrap>
            <v-flex xs6 sm6 md4 lg3 v-for="(item, index) in sheet.diagrams" :key="`diag${index}`" >

                <Diagram :diagram="item" 
                        :onDelete="deleteDiagram" 
                        :fretspan="sheet.fretspan"></Diagram>
            </v-flex>

            <v-flex xs3>
                <v-btn
                    @click="addDiagram()"
                    color="pink"
                    fab
                    dark
                    small
                >
                    <v-icon>add</v-icon>
                </v-btn>
            </v-flex> 
        </v-layout>
    <v-dialog
            v-model="dialog"
            max-width="290"
    >
      <v-card>
        
        <v-card-text>
         Delete diagram ?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="confirmDeleteDiag()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </v-layout>
</div>
</template>

<script>

import Diagram from './Diagram'
//import Store from '../store.js'

export default {

    name:'Editor',

    //props: ['sheet'],

    data() {

        return {
            dialog: false,
            selectedDiagId: 0,
            state: this.$sheetStore.state
        }
    },
    mounted() {
        
        //console.log('Editor mounted ' + JSON.stringify(this.state.sheet));
    },
    computed: {
        sheet() {
            return this.state.sheet;
        }
      
    },
    methods: {

        confirmDeleteDiag() {

            this.dialog = false;
            this.sheet.diagrams = this.sheet.diagrams.filter(d => d.id !=  this.selectedDiagId)
            this.selectedDiagId = 0;
        },
        deleteDiagram(diagId) {

            this.selectedDiagId = diagId;
            this.dialog = true;
           
        },
        addDiagram() {
          
            const count = this.sheet.diagrams.length;
            let nextId = 1;

            if(count > 0) {
                nextId = this.sheet.diagrams[count-1].number + 1;
            }
            var diag =  { id: 'diag_' + nextId, number: nextId, chordName:'', notes:[], fretNumbers:[]}
            this.sheet.diagrams.push(diag);
        }
    },

    components: { Diagram }
}
</script>

<style>

</style>
