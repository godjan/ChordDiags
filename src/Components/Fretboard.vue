<template>

    <section>
  
        <fret-annotations :height="noteHeight"
                          :fretSpan="fretSpan"
                          :fretNumbers="diagram.fretNumbers"
                          :fretNumberChanged="fretNumberChanged"
                          :edition="state.edition"
        ></fret-annotations>

        <div style="float:left" :style="state.edition ? 'margin-left:10px' : ''">

            <svg :width="width" :height="height" :id="`fb_${diagId}`" >
                <g @mouseleave="showShapeAtMouse = false">

                        <!--- vertical strings / line -->
                        <line v-for="s in stringCount" 
                            :x1="getStringX(s)" 
                            :y1="noteHeight" 
                            :x2="getStringX(s)" 
                            :y2="(fretSpan + 1) * noteHeight" 
                            class="string"
                            :key="`${diagId}_string_${s}`"
                            ></line>
                        
                        <!--- horizontal frets / line -->
                        <line v-for="f in fretbars" 
                            :x1="getStringX(1)" 
                            :y1="f * noteHeight" 
                            :x2="getStringX(stringCount)" 
                            :y2="f * noteHeight" 
                            class="string"
                            :key="`${diagId}_fret_${f}`"
                            ></line>

                        <!--- note placeholder rects -->
                        <template v-for="fret in fretSpan + 1">
                            <template v-for="string in strings">
                                <rect :x="(string-1) * noteWidth" 
                                    :y="(fret-1) * noteHeight"
                                    :width="noteWidth" 
                                    :height="noteHeight"
                                    :key="`${diagId}_${fret}_${string}`"
                                    class="fret"
                                    @click="toggleNote()"
                                    @mouseover="over(fret, string)"></rect>
                            </template>
                        </template>
                
                    <path :d="getShapePath(this.activeShape)" 
                        v-show="showShapeAtMouse && state.edition"  
                        @click="toggleNote()"
                        class="cursor"
                        :class="shapeClassCursor(this.activeShape)"/> 

                    <path v-for="(item, index) in notes" 
                        :d="getShapePath(item.shape, item.neckPosition)" 
                        @click="toggleNote() " 
                        :key="`${diagId}_note_${index}`"
                        class="note"
                        :class="shapeClass(item)"/>

                </g>
            </svg>
        </div>
       
    </section>
</template>

<script>

import Config from '../config.js'
import FretAnnotations from './FretAnnotations'
import Shapes from '../shapes.js'


let ShapeRender = null;

export default {

    name:'Fretboard',

    props:{

        diagId: String,
        fretSpan: Number,
        strings: Number,
        width: Number,
        height: Number,
        activeShape: String
    },

    data() {

        return {

            stringCount: Number(this.strings) ||  Config.STRINGS,
            noteWidth: Math.floor(this.width / (Number(this.strings) || Config.STRINGS)),
            showShapeAtMouse: false,
            neckPosition: { fret: 0, string: 0 },
            state: this.$sheetStore.state
        }
    },  
    computed: {

        noteHeight() {

            return Math.floor(this.height / (this.fretSpan + 1));
        },
        diagram() {

            return this.$sheetStore.getDiagram(this.diagId);
        },
        notes() {

            return this.diagram.notes;
        },
        noteCount() {

            return this.stringCount * this.fretSpan;
        },
        fretbars() {

            return this.fretSpan + 1;
        }
    },
    methods: {

        fretNumberChanged(fretIndex, newVal) {

           this.$sheetStore.updateFretContent(this.diagId, fretIndex, newVal);
        },
        
        toggleNote() {
            
            if(!this.state.edition)
                 return;

            var noteIndex = this.notes.findIndex(n => n.neckPosition.fret == this.neckPosition.fret && 
                                                     n.neckPosition.string == this.neckPosition.string &&
                                                     n.shape == this.activeShape);
            let noteExists = noteIndex > -1;
            //console.log(`toggling at ${JSON.stringify(this.neckPosition)}`)
           
            if(!noteExists) {

                this.$sheetStore.addNote(this.diagId,
                                        { 
                                          neckPosition: this.neckPosition,
                                          shape: this.activeShape
                                        });
            }
            else {

                 if(this.notes[noteIndex].shape != this.activeShape) {
                        
                         this.$sheetStore.addNote(this.diagId,
                                                    { 
                                                        neckPosition: this.neckPosition,
                                                        shape: this.activeShape
                                                    });
                 }
                 else {
                     this.$sheetStore.deleteNoteByIndex(this.diagId, noteIndex);   
                 }                                  
            }
        },
        over(fret, string) {

             if(!this.state.edition)
                 return;

            this.showShapeAtMouse = true;
            this.neckPosition = { fret: fret-1, string: string };
            //console.log('over ' + note)
        },
        getShapePath(shape, neckPos) {

            const _pos = neckPos || this.neckPosition;

            if(shape== 'dot')
                return ShapeRender.getCirclePath(_pos);

            if(shape == 'square')
                return ShapeRender.getSquarePath(_pos);

            if(shape == 'triangle')
                 return ShapeRender.getTrianglePath(_pos);
            
            if(shape == 'cross')
                 return ShapeRender.getCrossPath(_pos);

            return '';
        },
       
        getStringX(stringNumber) {
           
            return ((stringNumber-1) * this.noteWidth) + Math.floor(this.noteWidth / 2); 
        },

        shapeClassCursor(shape) {
            
            if(shape=='square' || shape == 'triangle' || shape == 'cross')
                return 'nofill';

            return ''
        },

        shapeClass(note) {

            const shape = note.shape;
            let cl = '';

            if(note.neckPosition.string == this.neckPosition.string && 
               note.neckPosition.fret == this.neckPosition.fret &&
               note.shape == this.activeShape
               ) {

                  cl += ' noteRemovable'; //:  ' noteHovered';      
            }

            if(shape=='square' || shape == 'triangle' || shape == 'cross')
                return cl + ' nofill';

            return cl;
        }
    },
    created() {
     
        ShapeRender = new Shapes(this.noteWidth, this.noteHeight)
    },
    components: { FretAnnotations }
}
</script>

<style scoped>

.nofill {
     /* fill:rgb(255,255,255);*/
     fill-opacity: 0; 
     stroke:black;
}

.note {
     /* fill:#000; 
    fill:rgb(255,255,255);*/
    stroke:black;
     opacity:1;
    /* fill-opacity: 0; */
}
.noteHovered {
   /* stroke:royalblue;*/
    stroke-width:2;
}

.noteRemovable {
    fill:crimson;
    stroke:crimson;
    stroke-width:2;
    fill-opacity: 1; 
}

.cursor {
   /* fill:hsl(213, 4%, 51%);*/
    fill:rgb(0,0,0);
    /*stroke:hsl(213, 4%, 51%);*/
    /* fill-opacity: 0; */
    opacity:0.5;
}

.fret {
    fill:rgb(255,255,255);
    stroke-width:  0;
    stroke:rgb(0, 0, 0);
    fill-opacity: 0;
}

.fret:hover {
   /*cursor:none;*/
}

.string {
    fill:rgb(121,0,121);
    stroke-width:1;
    /* stroke:rgb(0,0,0); */
    stroke:silver;
    fill-opacity: 0;
}

.fretNum {
    fill:white;
    stroke:grey; 
   
}

.fretNum:hover {
     stroke:cornflowerblue; 
     stroke-width: 1;
     cursor:text
}

.fretText {
     font-size:14px;
     fill: "black";
}
</style>
