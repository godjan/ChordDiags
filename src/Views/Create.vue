<template>

    <v-container fluid grid-list-md >
        <v-layout row wrap>
            <v-flex xs8>
                <!-- <v-btn flat color="info"><v-icon>add</v-icon>New sheet</v-btn> -->
                <v-btn flat color="info"><v-icon>grade</v-icon> Bookmark sheet</v-btn>
            </v-flex>
            
            <v-flex xs4 class="text-xs-right">
                <v-btn flat color="info"><v-icon>help</v-icon>How to play</v-btn>
            </v-flex>
            
            <v-flex xs12>
               
                <v-toolbar>
                    <v-switch
                    :label="state.edition ? 'Edition' : 'View'"
                    v-model="state.edition"
                    >
                    </v-switch>

                    <v-spacer></v-spacer>
                    <v-btn color="info"> Save </v-btn>
                    <v-btn>Delete</v-btn>
                </v-toolbar>

                 <v-card>
                    <v-container
                        fluid
                        grid-list-lg>
                         
                        <Editor></Editor>
                         
                    </v-container>
                 </v-card>
            </v-flex>
         </v-layout>
    </v-container>
</template>

<script>

import Store from '../store.js'
import Editor from '../Components/Editor'
import Config from '../config.js'

export default {
    
    props:[],

    components: { Editor},

    data() {
        return {
          // sheet : {},
           state: this.$sheetStore.state
        }
    },
    
    created() {

         this.$sheetStore.setSheet({ id: 0, 
                        fretspan: Config.FRETSPAN_DEFAULT, 
                        tuning: Config.TUNING_DEFAULT,  
                        version: 1, 
                        title: '', 
                        description:'', 
                        tags: '',
                        diagrams: []
                     });
        // show one diagram by default          
       this.$sheetStore.setDiagrams([{}]);
   
       // console.log('created ' + JSON.stringify(this.$sheetStore.state.sheet.diagrams))
    }
}
</script>

<style scoped>

</style>