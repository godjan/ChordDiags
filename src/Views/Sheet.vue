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
                        :label="state.edition ? 'Edition' : 'View'"
                        v-model="state.edition"
                    > 
                </v-switch>
            </v-flex>
            
            <v-flex xs6>               
            </v-flex>
            <v-flex xs4 class="text-xs-right">
                
                <v-btn flat color="info"><v-icon>help</v-icon>How to play</v-btn>
            </v-flex>

            
            <v-flex xs12>
                <v-toolbar>
                     <span style="width:80px">
                        <v-select
                            :items="range"
                            label="Frets"
                            v-model="state.sheet.fretSpan"
                            ></v-select>
                    </span>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom>
                        <v-btn flat small color="primary" slot="activator" @click="detailsDialog = true"> 
                           <v-icon>list_alt</v-icon> Details...
                        </v-btn>
                        <span>Tune settings (Author, Tuning, ...)</span>
                    </v-tooltip>

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
            snackbar: false,
            range: Array.from(new Array(Config.MAX_FRETSPAN), (val, index)=>index + 1), 
        }
    },
    methods: {
        saveSheet() {

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
        }
    },
    created() {

        //console.log('Sheet created')
        this.loading = true;

        if(this.$route.params.id) {

            this.$sheetStore.loadSheet(this.$route.params.id)
                    .then((response)=> {

                        console.log('Sheet from api : ' + response.data)
                        //this.sheet = response.data;
                        this.loading = false;
                        this.state.sheet = response.data;
                    })
        }
        else {
            this.$sheetStore.createEmptySheet();
        }
                  
    },
    components: { Editor, ConfirmDialog, SheetDetailsDialog}
}
</script>

<style>

</style>
