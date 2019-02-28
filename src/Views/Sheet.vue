<template>
    <section>

    <v-container fluid grid-list-md >

        <v-layout v-show="loading" fill-height>
            <v-flex xs12 class="text-md-center mt-5" >

                <v-progress-circular
                indeterminate
                color="primary"
                :size="50"
                ></v-progress-circular>
            </v-flex>
        </v-layout>

        <v-layout row wrap v-show="!loading">
             <v-flex xs2>
                <!-- <v-btn flat color="info"><v-icon>add</v-icon>New sheet</v-btn> -->
                <v-switch
                        :label="state.edition ? 'Edition ON' : 'Edition OFF'"
                        :color="state.edition ? 'success' : ''"
                        v-model="state.edition"
                    > 
                </v-switch>
            </v-flex>
            
            <v-flex xs6 class="mt-2">   
                
            </v-flex>
            <v-flex xs4 class="text-xs-right">
                
                <v-btn flat color="info"><v-icon>help</v-icon>How to play</v-btn>
            </v-flex>

            
            <v-flex xs12>
                <v-toolbar  v-show="state.edition">
                     <span style="width:80px">
                        <v-select
                            :items="range"
                            label="Frets"
                            v-model="state.sheet.fretSpan"
                            ></v-select>
                    </span>
                   
                    <span class="ml-5" style="width:120px">
                        <v-tooltip bottom>
                            <v-btn outline icon small slot="activator" @click="undo()"><v-icon size="13">fa-undo</v-icon></v-btn>
                            <span>Undo</span>
                        </v-tooltip> 
                       <v-tooltip bottom>
                           <v-btn outline icon small slot="activator" @click="redo()"><v-icon size="13">fa-redo</v-icon></v-btn> 
                           <span>Redo</span>   
                       </v-tooltip> 
                    </span>  
                    <v-spacer></v-spacer>

                    <!-- <v-tooltip bottom>
                        <v-btn flat small color="primary" slot="activator" @click="detailsDialog = true"> 
                           <v-icon>list_alt</v-icon> Details...
                        </v-btn>
                        <span>Tune settings (Author, Tuning, ...)</span>
                    </v-tooltip> -->

                    <v-tooltip bottom>
                        <v-btn flat color="info"  slot="activator"><v-icon>bookmark</v-icon></v-btn>
                        <span>Bookmark it</span>
                    </v-tooltip>
                    <v-divider vertical></v-divider>

                    <v-btn color="success" @click="saveSheet()"> Save </v-btn>
                    <v-btn @click="deleteSheetDialog = true"><v-icon>delete_outline</v-icon></v-btn>
                    
                </v-toolbar>
                <v-card>
                    <v-container fluid grid-list-lg>
                        <Editor></Editor> 
                    </v-container>
                 </v-card>
            </v-flex>
         </v-layout>
    </v-container>
    
     <confirm-dialog :content="`Delete sheet ?`" 
                            @Submit="confirmDeleteSheet"
                            @Cancel="deleteSheetDialog = false"
                            :dialog="deleteSheetDialog"> </confirm-dialog>

     <sheet-details-dialog :active="detailsDialog"
                            @onSubmit="detailsDialog = false"
                            @onClose=" detailsDialog = false"
     >
     </sheet-details-dialog>

    <v-snackbar
      v-model="snackbar"
      color="#1dd1a1"
      :timeout="2000"
      :bottom="true"
    >
      Saved
      <v-btn
        color="white"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    
    <!-- Title input dialog -->
    <v-dialog
      v-model="titleDialog"
      max-width="290"
    >
      <v-card>
       
        <v-card-text>
         Please give a title to your sheet.
        </v-card-text>
         <v-card-text>
            <v-text-field
                v-model="state.sheet.title"
                label="Title"
                required
            ></v-text-field>
         </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="titleDialog = false; saveSheet()"
            :disabled="!state.sheet.title || state.sheet.title.length==0"
          >
            Save
          </v-btn>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click="state.sheet.title = '';titleDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </section>
</template>

<script>

import Editor from '../Components/Editor'
import ApiService from '../api.js'
import Config from '../config.js'
import ConfirmDialog from '../Components/ConfirmDialog'
import SheetDetailsDialog from '../Components/SheetDetailsDialog'

export default {

    name:'Sheet',
    
    props:[],

    data() {

        return {

            diagrams:[],
            sheet:{},
            loading: false,
            state: this.$sheetStore.state,
            deleteSheetDialog: false,
            detailsDialog: false,
            titleDialog: false,
            snackbar: false,
            range: Array.from(new Array(Config.MAX_FRETSPAN), (val, index)=>index + 1), 
        }
    },
    methods: {
      
        saveSheet() {

            if(this.state.sheet.title.length ==0) {
                // alert('Please enter a title')
                this.titleDialog = true;
                return
            }
            var self = this;
            this.$sheetStore.saveSheet()
                            .then(function (response) {

                                self.snackbar = true;
                                console.log(response);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
        },
        confirmDeleteSheet() {
            
            // call server API to delete the sheet
             this.deleteSheetDialog = false;
             this.$router.push('/')
        },
        closeDeleteSheetDialog() {
             this.deleteSheetDialog = false;
        },

        undo() {

            this.$sheetStore.undo();
        },
        redo() {

            this.$sheetStore.redo();
        }
    },
   
    created() {

        console.log('Sheet created')
        this.loading = true;
       
        if(this.$route.params.id) {

            this.$sheetStore.loadSheet(this.$route.params.id)
                    .then((response)=> {

                        console.log('Sheet from api : ' + response.data)
                        //this.sheet = response.data;
                        this.loading = false;
                        this.state.sheet = response.data;
                    })
                    .catch((err) => {
                         this.$router.push('/');
                    })
        }
        else {
               this.loading = false;
               this.$sheetStore.createNewSheet();
         
               this.state.edition = true;
        }          
    },
     mounted() {

        var vm = this;

        window.addEventListener('keyup', function(event) {
        
            if (event.ctrlKey) {

            if(event.keyCode == 90) vm.undo();
            if(event.keyCode == 89) vm.redo();
            }

        });

        if(this.sheet.id == 0) {

            this.addDiagram();
        }
    },
    components: { Editor, ConfirmDialog, SheetDetailsDialog}
}
</script>

<style>

</style>
