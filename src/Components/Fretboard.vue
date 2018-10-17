<template>
    
    <svg :width="width" :height="height" :id="`fb_${diagId}`" >
        <g @mouseleave="showShapeAtMouse = false">

                <!--- vertical strings / line -->
                <line v-for="s in stringCount" 
                    :x1="getStringX(s)" 
                    y1="0" 
                    :x2="getStringX(s)" 
                    :y2="getStringBottomY()" 
                    class="string"
                    :key="`${diagId}_string_${s}`"
                    ></line>
                
                 <!--- horizontal frets / line -->
                <line v-for="f in fretbars" 
                    :x1="getStringX(1)" 
                    :y1="(f-1) * noteHeight" 
                    :x2="getStringX(stringCount)" 
                    :y2="(f-1) * noteHeight" 
                    class="string"
                    :key="`${diagId}_fret_${f}`"
                    ></line>

                 <!--- note placeholder rects -->
                 <template v-for="fret in span">
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
                  :class="`${this.activeShape == 'square' ? 'nofill' : ''}`"/> 

            <path v-for="(item, index) in notes" 
                  :d="getShapePath(item.shape, item.neckPosition)" 
                   @click="toggleNote()" 
                   :key="`${diagId}_note_${index}`"
                   class="note"
                   :class="`${item.shape == 'square' ? 'nofill' : ''}`"/>

        </g>
    </svg>
    
</template>

<script>

export default {

    name:'Fretboard',

    props:{
        diagId: String,
        span: Number,
        strings: Number,
        width: Number,
        height: Number,
        activeShape: String
    },

    data() {
        return {
            stringCount: Number(this.strings) || 6,
            noteWidth: Math.floor(this.width / (Number(this.strings) || 6)),
            noteHeight: Math.floor(this.height / (this.span || 5)),
            showShapeAtMouse: false,
            //fretboardCoord:{ x: 0, y: 0}, 
            neckPosition: { fret: 0, string: 0 },
            notes:[]
        }
    },
    computed: {

        noteCount() {

            return this.stringCount * this.span;
        },
        fretbars() {

            return this.span + 1;
        },
        widthScale() {

            return { quarter: Math.floor(this.noteWidth / 4),
                     half: Math.floor(this.noteWidth / 2),
                     third: Math.floor(this.noteWidth / 3),
                     twoThirds: Math.floor(this.noteWidth / 3)  *2 
            }
         }
    },
    methods: {

        toggleNote() {
         
            var index = this.notes.findIndex(n => n.neckPosition.fret == this.neckPosition.fret && 
                                                  n.neckPosition.string == this.neckPosition.string);

            //console.log(`toggling at ${JSON.stringify(this.neckPosition)}`)
           
            if(index == -1) {

                this.notes.push({ neckPosition: this.neckPosition,
                                  shape: this.activeShape
                                })
            }
            else {

                if(this.notes[index].shape != this.activeShape) {

                    this.notes[index] = { neckPosition: this.neckPosition,
                                          shape: this.activeShape
                                        };
                }
                else
                    this.notes.splice(index, 1)                                      
            }
        },
        over(fret, string) {

            this.showShapeAtMouse = true;
            
            // this.fretboardCoord.x = this.widthScale.quarter + (string-1) * this.noteWidth ;
            // this.fretboardCoord.y = this.noteHeight / 2 + ((fret-1) * this.noteHeight);
            this.neckPosition = { fret: fret, string: string };
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

            return '';
        },
        getCirclePath(neckPos) {

            const startX = this.widthScale.quarter + (neckPos.string-1) * this.noteWidth -2;
            const startY = (this.noteHeight/2) + ((neckPos.fret-1) * this.noteHeight);

            const third = this.widthScale.third;
            const twoThirds = this.widthScale.twoThirds;

            return `M${startX},${startY} 
                    a${third},${third} 0 1,0 ${twoThirds},0a${third},${third} 0 1,0 -${twoThirds},0`;
        },
        getSquarePath(neckPos) {

            const twoThirds = this.widthScale.twoThirds;
            const startX = this.widthScale.quarter + (neckPos.string-1) * this.noteWidth -2
            const startY = (this.noteHeight/2) + ((neckPos.fret-1) * this.noteHeight) - this.widthScale.third
          
            var p =  `M${startX},${startY} 
                     ${startX + twoThirds },${startY} 
                     ${startX + twoThirds},${startY + twoThirds} 
                     ${startX},${startY + twoThirds} z`;
            return p;
        },
        getCrossPath(neckPos) {

        },
        getTrianglePath(neckPos) {

             const startX = this.getStringX(neckPos.string); // middle
             const startY = (this.noteHeight/2) + ((neckPos.fret-1) * this.noteHeight) - this.widthScale.third

             return `M ${startX},${startY} 95,97.5 5,97.5 z`;

        },
        getStringX(stringNumber) {
           
            return ((stringNumber-1) * this.noteWidth) + this.widthScale.half
        },

        getStringBottomY() {
           
            return this.span * this.noteHeight;
        },

        // getX(index) {

        //     let res = ((index-1) % this.stringCount) * this.noteWidth
          
        //     return ((index-1) % this.stringCount) * this.noteWidth;
        // },
        // getY(index) {

        //     let y;

        //     let newLine = (index-1) % this.stringCount == 0;

        //     if(newLine) {
        //        y = ((index-1) / this.stringCount) * this.noteWidth;
        //     } else {
        //        y = Math.floor((index-1) / this.stringCount) * this.noteWidth;
        //     }

        //    // console.log('index: ' + index + ' y = '+ y)
        //     return y;
        // }
        
    },
    mounted() {
        // var svg1 = document.getElementById(`fb_${this.diagId}`);
        // var bbox = svg1.getBBox();
        // console.log('W = ' + bbox.width + ' H = ' + bbox.height);
        
    }
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


</style>
