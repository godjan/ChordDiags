<template>

    <div @keyup="fretTextChanged" style="float:left">
       
        <svg width="60" height="150">

             <text v-for="fret in fretbars-1" 
                  :key="`annot_${fret}`"
                  x="25"  
                  :y="fret * height + height-2" 
                  :height="height"
                   @click="setEditedFret(fret)"
                  class="fretText">{{fretText[fret]}}</text>

            <rect   v-for="fret in fretbars-1"
                    x="15" 
                    :y="(fret) * height"
                    width="30" 
                    :height="height"
                    class="fretNum"
                    stroke-dasharray="2,2"
                    tabindex="0"
                    @click="setEditedFret(fret)"
            ></rect>

           
                
        </svg> 
    </div> 
</template>

<script>

export default {

    name:'FretAnnotations',

    props: ['height','fretbars'],

    data() {
        return {
            validFrets: ['0','1','2','3','4','5','6','7','8','9'],
            fretText:{ 1:'', 2: '', 3:'', 4:'', 5:''},
            selectedFret: -1
        }
    },

    methods: {

        fretTextChanged(event) {
          
           console.log('selected fret ' + this.selectedFret)
           
            if(event.key == 'Backspace') {
              
                this.fretText[this.selectedFret] = this.fretText[this.selectedFret].substring(0, this.fretText.length-1)
            }
            else  {
                 
                if(this.validFrets.indexOf(event.key) == -1)
                    return;

                this.fretText[this.selectedFret] += event.key.toString()

                //todo : remove 0 in front
             }
            //console.log(event.key)
        },
        setEditedFret(fretNum) {

            this.selectedFret = fretNum;
            console.log(fretNum-1)
        },
       
    },
     mounted() {
         for(let i=0;i<this.fretbars-1;i++) {
            this.fretText[i] = '';
        }
     }
}
</script>

<style scoped>

.fretNum {
    fill:white;
    stroke:lightgray; 
    stroke-width: 2;
    fill-opacity: 0;
}

.fretNum:hover {
     stroke:cornflowerblue; 
     stroke-width: 2;
     cursor:text
}

.fretText {
     font-size:14px;
     fill: "black";
}
</style>
