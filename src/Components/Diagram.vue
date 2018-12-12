<template>

<section>
    <!-- <v-card -->       
        <v-toolbar dense flat  @mouseover="showmenu = true" @mouseleave="showmenu = false" v-show="state.edition">
            <input class="title active" 
                   type="text" 
                   placeholder="Chord" 
                   title="Chord name"
                   style="width:50%"
                   v-model="diagram.chordName"/>
                   
            <v-spacer></v-spacer>

            <v-toolbar-items v-show="showmenu">
                <v-btn icon flat @click="onDelete(diagram)"><v-icon small color="red">clear</v-icon></v-btn>

                <v-menu bottom left>
                    <v-btn  slot="activator" icon>
                        <v-icon>more_vert</v-icon>
                    </v-btn>

                    <v-list>
                        <v-list-tile  @click="clearAll()">
                            <v-list-tile-title>Clear all</v-list-tile-title>
                        
                        </v-list-tile>
                        <v-list-tile  @click="clearNotes()">
                            <v-list-tile-title>Clear notes</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-toolbar-items>
        </v-toolbar>
        <!--v-card-text class="px-0"-->
            <v-container  text-center-xs style="padding:5px">
                <v-layout row>
                   
                    <span style="margin-top:15px">   
                        <fretboard :diagId="diagram.id"
                                   :width="150" 
                                   :height="140"
                                   :fretSpan="span" 
                                   :strings="strings"
                                   :activeShape="activeShape"
                                  ></fretboard>
                    </span>
                    <span v-if="state.edition" class="mt-3">
                  
                        <v-btn-toggle v-model="toggle_one" mandatory class="ml-2">
                            <v-icon size="17" class="mb-1" @click="setShape('dot')">fas fa-circle</v-icon>
                            <v-icon size="18" class="mb-1" @click="setShape('cross')"> fa-times</v-icon>
                            <v-icon size="17" class="mb-1" @click="setShape('square')">check_box_outline_blank</v-icon>
                            <a  @click="setShape('triangle')">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle" width='15' height='15'>
                                    <path d="M 9,1 15,13 3,13 z"/>
                                </svg>
                            </a>
                            <v-icon size="17" class="mt-1">check_box_outline_blank</v-icon>
                            <!-- <v-btn flat icon @click="setShape('dot')"><v-icon size="17" >fas fa-circle</v-icon></v-btn>
                            <v-btn flat icon @click="setShape('cross')"><v-icon size="18"> fa-times</v-icon></v-btn>
                            <v-btn flat icon @click="setShape('square')"><v-icon size="17">check_box_outline_blank</v-icon></v-btn>
                            <v-btn flat icon @click="setShape('triangle')">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-triangle" width='15' height='15'>
                                    <path d="M 7.5,0 15,13 0,13 z"/>
                                </svg>
                            </v-btn>
                            <v-btn flat icon @click="setShape('square')"><v-icon size="17">check_box_outline_blank</v-icon></v-btn> -->
                        
                        </v-btn-toggle>
                    
                    </span>
                </v-layout>
            </v-container>
      
          
       <!--/v-card-text>
    </v-card> -->

    <confirm-dialog :content="currentDialogAction" 
                   v-on:Submit="submitCallback"
                   v-on:Cancel="closeDialog"
                   :dialog="diagramDialog"> </confirm-dialog>
</section>
</template>

<script>
import Store from '../store.js'
import Fretboard from './Fretboard';
import Config from '../config.js'
import ConfirmDialog from './ConfirmDialog'

export default {

    name:'Diagram',

    props:{
        diagram: Object,
        onDelete: Function,
        fretSpan: Number
    },

    data() {
       return {
           showmenu: false,
           strings: Config.STRINGS,
           activeShape: 'dot',
           toggle_one: 0,
           diagramDialog: false,
           currentDialogAction:'',
           submitCallback: () => {},
           state: this.$sheetStore.state
        }
    },
    computed: {
        span() {

            return this.fretSpan || Config.FRETSPAN_DEFAULT;
        }
    },
    methods:{
       
        clearAll() {  

            this.currentDialogAction = 'Clear all symbols (notes, annotations) ?';
            this.diagramDialog = true;
            this.submitCallback = ()=>{ this.diagramDialog = false; 
                                        this.$sheetStore.clearDiagram(this.diagram.id);} 
        },
        clearNotes() {

            this.currentDialogAction = 'Clear all notes ?';
            this.diagramDialog = true;
            this.submitCallback = () => {
                this.diagramDialog = false;
                this.$sheetStore.deleteNotes(this.diagram.id)
            }
        },
      
        setShape(shape) {

            this.activeShape = shape
        },
        closeDialog() {
            this.diagramDialog = false;
        }
    },

    components: { Fretboard, ConfirmDialog }
}
</script>

<style >

.v-btn-toggle {
  flex-direction: column; box-shadow:none;
}


.svg-triangle {
     fill-opacity: 0; 
     stroke:black;
}
</style>



