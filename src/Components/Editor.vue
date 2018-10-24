<template>
<section>
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
        <v-flex xs6 sm6 md4 lg3 v-for="(diagram, index) in sheet.diagrams" :key="`diag${index}`" >

            <Diagram :diagram="diagram"
                     :onDelete="deleteDiagram" 
                     :fretSpan="sheet.fretSpan"></Diagram>
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


    <v-dialog v-model="dialog"
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

  
</section>
</template>

<script>

function getEmptyDiagram(id) {

    return { id: 'diag_' + id, 
            number: id, 
            chordName:'', 
            notes:[], 
            fretNumbers: {'1':'', '2':'', '3' : '','4' : '','5':''}
        };
}

import Diagram from './Diagram'
//import Store from '../store.js'

export default {

    name:'Editor',

    //props: ['sheet'],

    data() {

        return {
            dialog: false,
            selectedDiagram: null,
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
            
            this.$sheetStore.deleteDiagram(this.selectedDiagram);
            this.selectedDiagram = null;
        },
        deleteDiagram(diagram) {

            this.selectedDiagram = diagram;
            this.dialog = true;
           
        },
        addDiagram() {
          
            const count = this.sheet.diagrams.length;
            let nextDiagId = 1;

            if(count > 0) {
                nextDiagId = this.sheet.diagrams[count-1].number + 1;
            }
            var diagram = getEmptyDiagram(nextDiagId);
            
            this.$sheetStore.addDiagram(diagram);
        }
    },
    mounted() {

        if(this.sheet.id == 0) {

            this.addDiagram();
        }
    },
    components: { Diagram }
}
</script>

<style>

</style>
