<template>
    <section >
        <v-layout>
            <v-flex sm12 lg12> 
                <!-- <input type="text" 
                        placeholder="Sheet title" 
                        width="300"
                        v-model="sheet.title" 
                        class="headline grey--text text--darken-1"
                        style="width:100%"
                    /> -->
                 <v-text-field
                    v-model="sheet.title"
                    label="Title"
                    single-line
                    :disabled="state.edition == false"
                    dv-show="state.edition"
                    class="headline"
                ></v-text-field>  
                <!-- <label  class="headline" v-show="state.edition == false">{{sheet.title}}</label> -->
            </v-flex>
        </v-layout>

        <v-layout>
            <v-flex sm12 lg12 pb-5> 
                <span><strong>Tuning</strong> {{ sheet.tuning}}</span>
                <span class="ml-5" v-if="sheet.author"><strong>Author</strong> {{  sheet.author.name }} </span>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs6 sm6 md4 lg3 
                    v-for="(diagram, index) in sheet.diagrams" 
                    :key="`diag${index}`" >

                <Diagram :diagram="diagram"
                        :onDelete="deleteDiagram" 
                        :fretSpan="sheet.fretSpan"></Diagram>
            </v-flex>

            <v-flex xs3 v-if="state.edition">
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

        <confirm-dialog :content="`Delete diagram ?`" 
                        @Submit="confirmDeleteDiag"
                        @Cancel="dialog = false"
                        :dialog="dialog"> </confirm-dialog>

    
    </section>
</template>

<script>

import Diagram from './Diagram'
import ConfirmDialog from './ConfirmDialog'
// import HistoryService from '../history.js'

export default {

    name:'Editor',

    data() {

        return {
            dialog: false,
            selectedDiagram: null,
            state: this.$sheetStore.state,
           // historyService: HistoryService
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

        closeDeleteDiagramDialog() {

            this.dialog = false;
        },
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
            
            this.$sheetStore.addEmptyDiagram();
        },
        // undo() {

        //     this.$sheetStore.undo();
        // },
        // redo() {

        //     this.$sheetStore.redo();
        // }
     },
    // mounted() {

    //     var vm = this;

    //     window.addEventListener('keyup', function(event) {
        
    //         if (event.ctrlKey) {

    //         if(event.keyCode == 90) vm.undo();
    //         if(event.keyCode == 89) vm.redo();
    //         }

    //     });

    //     if(this.sheet.id == 0) {

    //         this.addDiagram();
    //     }
    // },
    components: { Diagram, ConfirmDialog}
}
</script>

<style>

</style>
