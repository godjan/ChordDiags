<template>

    <section>
  
        <fret-annotations :height="noteHeight"
                          :fretSpan="fretSpan"
                          :fretNumbers="diagram.fretNumbers"
                          :fretNumberChanged="fretNumberChanged"
        ></fret-annotations>

        <div  style="float:left">
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
                        v-show="showShapeAtMouse"  
                        @click="toggleNote()"
                        class="cursor"
                        :class="shapeClass(this.activeShape)"/> 

                    <path v-for="(item, index) in notes" 
                        :d="getShapePath(item.shape, item.neckPosition)" 
                        @click="toggleNote()" 
                        :key="`${diagId}_note_${index}`"
                        class="note"
                        :class="shapeClass(item.shape)"/>

                </g>
            </svg>
        </div>
    </section>
</template>

<script>

import Config from '../config.js'
import FretAnnotations from './FretAnnotations'

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
            stringCount: Number(this.strings) || 6,
            noteWidth: Math.floor(this.width / (Number(this.strings) || Config.STRINGS)),
            noteHeight: Math.floor(this.height / ((this.fretSpan +1) || Config.FRETSPAN_DEFAULT)),
            showShapeAtMouse: false,
            neckPosition: { fret: 0, string: 0 },
            state: this.$sheetStore.state
        }
    },  
    computed: {

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
        },
        widthScale() {

            return { quarter: Math.floor(this.noteWidth / 4),
                     half: Math.floor(this.noteWidth / 2),
                     third: Math.floor(this.noteWidth / 3),
                     twoThirds: Math.floor(this.noteWidth / 3) *  2
            }
        },
        heightScale() {

             return { quarter: Math.floor(this.noteHeight / 4),
                     half: Math.floor(this.noteHeight / 2),
                     third: Math.floor(this.noteHeight / 3),
                     twoThirds: Math.floor(this.noteHeight / 3) * 2 
            }
        }
    },
    methods: {

        fretNumberChanged(fretIndex, newVal) {

           this.$sheetStore.updateFretContent(this.diagId, fretIndex, newVal);
        },
        
        toggleNote() {
         
            var noteIndex = this.notes.findIndex(n => n.neckPosition.fret == this.neckPosition.fret && 
                                                     n.neckPosition.string == this.neckPosition.string);

            //console.log(`toggling at ${JSON.stringify(this.neckPosition)}`)
           
            if(noteIndex == -1) {

                this.$sheetStore.addNote(this.diagId,
                                        { neckPosition: this.neckPosition,
                                          shape: this.activeShape
                                        });
            }
            else {

                 if(this.notes[noteIndex].shape != this.activeShape) {

                        this.$sheetStore.updateNote(this.diagId, 
                                                    noteIndex,
                                                    { 
                                                      neckPosition: this.neckPosition,
                                                      shape: this.activeShape
                                                    }); 
                 }
                 else {
                     this.$sheetStore.deleteNote(this.diagId, noteIndex);   
                 }                                  
            }
        },
        over(fret, string) {

            this.showShapeAtMouse = true;
            this.neckPosition = { fret: fret-1, string: string };
            //console.log('over ' + note)
        },
        getShapePath(shape, neckPos) {

            const _pos = neckPos || this.neckPosition;

            if(shape== 'dot')
                return this.getCirclePath(_pos);

            if(shape == 'square')
                return this.getSquarePath(_pos);

            if(shape == 'triangle')
                 return this.getTrianglePath(_pos);
            
            if(shape == 'cross')
                 return this.getCrossPath(_pos);

            return '';
        },
        getCirclePath(neckPos) {

            const startX = this.widthScale.quarter + (neckPos.string-1) * this.noteWidth -2;
            const startY = (this.noteHeight/2) + ((neckPos.fret) * this.noteHeight);

            const third = this.widthScale.third;
            const twoThirds = this.widthScale.twoThirds;

            return `M${startX},${startY} 
                    a${third},${third} 0 1,0 ${twoThirds},0a${third},${third} 0 1,0 -${twoThirds},0`;
        },
        getSquarePath(neckPos) {

            const twoThirds = this.widthScale.twoThirds;
            const startX = this.widthScale.quarter + (neckPos.string-1) * this.noteWidth -2
            const startY = (this.noteHeight/2) + ((neckPos.fret) * this.noteHeight) - this.widthScale.third
          
            var p =  `M${startX},${startY} 
                     ${startX + twoThirds },${startY} 
                     ${startX + twoThirds},${startY + twoThirds} 
                     ${startX},${startY + twoThirds} z`;
            return p;
        },
        getCrossPath(neckPos) {

            const twoThirds = this.widthScale.twoThirds;
            const startX = this.widthScale.quarter + (neckPos.string-1) * this.noteWidth -2;
            const startY = (this.noteHeight/2) + ((neckPos.fret) * this.noteHeight) - this.widthScale.third

             var p =  `M${startX},${startY} 
                        ${startX + twoThirds},${startY + twoThirds} 
                       M${startX + twoThirds},${startY} 
                        ${startX},${startY + twoThirds} z`;
             return p;
        },
        getTrianglePath(neckPos) {
            
            const topFret = ((neckPos.fret) * this.noteHeight);
            const startX = this.getStringX(neckPos.string); // middle
            const startY = topFret + this.heightScale.quarter;
             
             return `M ${startX},${startY} 
                    ${startX + this.widthScale.third},${topFret + this.noteHeight - (this.heightScale.quarter)+1} 
                    ${startX - this.widthScale.third},${topFret + this.noteHeight - (this.heightScale.quarter)+1} z`;

        },
        getStringX(stringNumber) {
           
            return ((stringNumber-1) * this.noteWidth) + this.widthScale.half
        },

        getStringBottomY() {
           
            return (this.fretSpan +1) * this.noteHeight;
        },

        shapeClass(shape) {
            
            if(shape=='square' || shape == 'triangle' || shape == 'cross')
                return 'nofill';

            return ''
        },
    },
    created() {
      
        //this.diagram = this.$sheetStore.getDiagram(this.diagId);
        //this.notes = this.diagram.notes;
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
.cursor {
   /* fill:hsl(213, 4%, 51%);*/
    fill:rgb(0,0,0);
    /*stroke:hsl(213, 4%, 51%);*/
    /* fill-opacity: 0; */
    opacity:0.5;
}

.fret {
    fill:rgb(255,255,255);
    stroke-width:0;
    stroke:rgb(0, 0, 0);
    fill-opacity: 0;
}

.fret:hover {
   cursor:none;
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
