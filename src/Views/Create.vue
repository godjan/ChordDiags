<template>

    <v-container fluid grid-list-md >
        <v-layout row wrap>
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
               
                <v-toolbar v-show="state.edition">
                   
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
                    <v-container
                        fsluid
                        grid-list-xs>

                        <!------------------------- Editor ---------------------->
                        <Editor ></Editor>
                         
                    </v-container>
                 </v-card>
            </v-flex>
         </v-layout>
           <confirm-dialog :content="`Delete sheet ?`" 
                            @Submit="confirmDeleteSheet"
                            @Cancel="deleteSheetDialog = false"
                            :dialog="deleteSheetDialog"> </confirm-dialog>

        <sheet-details-dialog :active="detailsDialog"
                              @onSubmit="detailsDialog = false"
                              @onClose=" detailsDialog = false"
        ></sheet-details-dialog>

    </v-container>
</template>

<script>


import Store from '../store.js'
import Editor from '../Components/Editor'
import ConfirmDialog from '../Components/ConfirmDialog'
import SheetDetailsDialog from '../Components/SheetDetailsDialog'
import Config from '../config.js'


export default {
    
    props:[],

    components: { Editor, ConfirmDialog, SheetDetailsDialog},

    data() {

        return {
           range: Array.from(new Array(Config.MAX_FRETSPAN), (val, index)=>index + 1), 
           state: this.$sheetStore.state,
           deleteSheetDialog: false,
           detailsDialog: false
        }
    },
    methods:
    {
        saveSheet() {
            
            this.$sheetStore.saveSheet()
                            .then(function (response) {

                                console.log(response);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
        },
        confirmDeleteSheet() {

             this.deleteSheetDialog = false;
             this.$router.push('/')
        },
        closeDeleteSheetDialog() {

             this.deleteSheetDialog = false;
        }
    },
    created() {

        this.$sheetStore.createEmptySheet();
        this.state.edition = true;
    }
}
</script>

<style scoped>

</style>