<template>

<section>
    <v-card >       
        <v-toolbar dense flat  @mouseover="showmenu = true" @mouseleave="showmenu = false">
            <input class="title active" 
                   type="text" 
                   placeholder="Chord" 
                   title="Chord name"
                   style="width:40%"
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
        <v-card-text class="px-0">
            <v-container class="text-md-center ">
                <v-layout>
                   
                    <v-flex xs10 >
                       
                        <fretboard :diagId="diagram.id"
                                   :diagram="diagram"
                                   :width="150" 
                                   :height="140"
                                   :fretSpan="span" 
                                   :strings="strings"
                                   :activeShape="activeShape"
                                   :addNote="addNote"
                                  ></fretboard>
                    </v-flex>
                    <v-flex xs2>
                        <v-btn-toggle v-model="toggle_one" mandatory>
                        <v-btn flat icon @click="setShape('dot')"><v-icon size="18" >radio_button_unchecked</v-icon></v-btn>
                        <v-btn flat icon @click="setShape('square')"><v-icon size="18">check_box_outline_blank</v-icon></v-btn>
                        <v-btn flat icon @click="setShape('cross')"><v-icon size="18">close</v-icon></v-btn>
                        <v-btn flat icon @click="setShape('triangle')"><v-icon size="18" >navigation</v-icon></v-btn>
                         </v-btn-toggle>
                    </v-flex>
                </v-layout>
            </v-container>
        <!-- <span @mouseover="flag = true" @mouseleave="flag = false"> -->
          
       </v-card-text>
    </v-card>
</section>
</template>

<script>
import Fretboard from './Fretboard';
import Config from '../config.js'

export default {

    name:'Diagram',

    props:{
        diagram: Object,
        onDelete: Function,
        fretSpan: Number
    },

    data: () => (
       {
           showmenu: false,
           span: this.fretSpan || Config.FRETSPAN_DEFAULT,
           strings: Config.STRINGS,
           activeShape: 'dot',
           toggle_one: 0
        })
    ,

    methods:{
       
        clearAll() {   

            this.$sheetStore.clearDiagram(this.diagram.id)
        },
        clearNotes() {
            
           this.$sheetStore.deleteNotes(this.diagram.id)
        },
        setShape(shape) {

            this.activeShape = shape
        },
        addNote(note) {

        }
    },

    components: { Fretboard }
}
</script>

<style >

.v-btn-toggle {
  flex-direction: column; box-shadow:none;
}



</style>



