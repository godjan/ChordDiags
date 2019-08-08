<template>

<section>
    <!-- <v-card -->
        <p class="title"
           :style="edition ? 'margin-left:27%' : 'margin-left:40%'"
           v-show="edition == false">{{diagram.chordName}}
        </p> 

        <v-toolbar dense flat  
                   @mouseover="showmenu = true" 
                   @mouseleave="showmenu = false" 
                   v-show="edition">

            <input class="title active ml-5" 
                   type="text" 
                   placeholder="Chord" 
                   title="Chord name"
                   style="width:70% "
                   v-model="diagram.chordName"
                   @blur="onChordChanged()" />
                   
            <v-spacer></v-spacer>

            <v-toolbar-items v-show="showmenu">
                 
                    <v-btn icon flat @click="onDelete(diagram)">
                         <v-tooltip top>
                        <v-icon size="13" color="red" slot="activator">clear</v-icon>
                        <span>Delete chord</span>      </v-tooltip>
                    </v-btn>
           

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
            <v-container fluid class="mb-4" style="padding:20px">
                <v-layout row  align-center style="min-width:184px">
                   <v-flex xs12>
                    <span :class="{ 'mt-3 ' : state.edition}">   
                        <fretboard :diagId="diagram.id"
                                   :width="140" 
                                   :height="150"
                                   :fretSpan="span" 
                                   :strings="strings"
                                   :activeShape="activeShape"
                                  ></fretboard>
                    </span>
                    <span v-if="state.edition" class="mt-3">

                        <v-btn-toggle v-model="toggle_one" mandatory class="ml-2">

                            <v-icon size="17" class="mb-1 icon-hovered" @click="setShape('dot')" 
                                    :color="activeShape == 'dot' ? 'info' : ''">fas fa-circle</v-icon>

                            <v-icon size="18" class="mb-1 icon-hovered" @click="setShape('cross')" 
                                   :color="activeShape == 'cross' ? 'info' : ''"> fa-times</v-icon>

                            <v-icon size="17" class="mb-1 icon-hovered" @click="setShape('square')" 
                                   :color="activeShape == 'square' ? 'info' : ''">check_box_outline_blank</v-icon>
                            
                            <a  @click="setShape('triangle')"  :color="activeShape == 'square' ? 'info' : ''">
                                <svg  class="svg-triangle" width='15' height='15'>
                                    <path id="trg" d="M 8.5,1 14,13 3,13 z"  :stroke="activeShape == 'triangle' ? '#03A9F4' : '#757575'" stroke-width="2"/>
                                </svg>
                            </a>
                          
                            <v-icon size="17" class="mt-1 icon-hovered" @click="setShape('square')">check_box_outline_blank</v-icon>
                       
                        
                        </v-btn-toggle>
                    
                    </span>
                    </v-flex>
                </v-layout>
                 <v-layout row>
                     <input :disabled="!state.edition"
                            class="ml-4 diagram-comments" 
                            :class="state.edition ? 'input-edition' : ''"
                            type="text" 
                            :placeholder="state.edition ? 'add comment' : ''" 
                            title="comments"
                            estyle="width:100%"
                            v-model="diagram.comments"
                 />   </v-layout>
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
        edition() {
            return this.state.edition;
        },
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
        },

        onChordChanged() {
            this.$sheetStore.saveState();
           
        }
    },

    components: { Fretboard, ConfirmDialog }
}
</script>

<style >
input { 
    text-align: center; 
}

.v-btn-toggle {
  flex-direction: column; box-shadow:none;
}


.svg-triangle {
     fill-opacity: 0;     
}
path{
   
   
}
path:hover{
   
    stroke:#03A9F4;
}

/* path:hover {
  stroke:#03A9F4;
  fill:none;
  pointer-events:all;
} */

.icon-hovered:hover
{
    color:rgb(33,150,243);
}
/* svg#but {
  height: 50px;
  width: 50px;
} */

.diagram-comments {
    width: 90%;
    /* margin-left: 15px; */
}

.input-edition {
  
     border: dashed #e2e2;
}

/* .diagram-comments::placeholder { 
 
  opacity: 0.5
} */

::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  opacity: 0.5
}
::-moz-placeholder { /* Firefox 19+ */
  opacity: 0.5
}
:-ms-input-placeholder { /* IE 10+ */
  opacity: 0.5
}
:-moz-placeholder { /* Firefox 18- */
  opacity: 0.5
}

</style>



