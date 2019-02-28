<template>

    <div @keyup="onEditFretNumber" style="float:left">
     
        <svg :width="edition ? 35 : 25" height="150">

             <text v-for="fret in fretSpan" 
              
                  :key="`annot_${fret}`"
                   :x="edition ? 17 : 11"  
                  :y="fret * height + height-4" 
                  :height="height"
                   @click="setEditedFret(fret)"
                  class="fretText">{{ fretNumbers[fret] }}</text>

            <rect   v-for="fret in fretSpan"
                    v-show="edition"
                    x="15" 
                    :y="(fret) * height"
                    width="20" 
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

    props: ['fretNumbers', 'fretNumberChanged', 'height','fretSpan', 'edition'],

    data() {
        return {
            validFrets: ['0','1','2','3','4','5','6','7','8','9'],
            selectedFret: -1
        }
    },

    methods: {

        onEditFretNumber(event) {
          
           console.log('editing fret ' + this.selectedFret)
           
           const fretContent = this.fretNumbers[this.selectedFret];

            if(event.key == 'Backspace') {
       
                this.fretNumberChanged(this.selectedFret, fretContent.substring(0, fretContent.length-1));
                //this.fretNumbers[this.selectedFret] = fretContent.substring(0, fretContent.length-1);
            }
            else  {
                 
                if(this.validFrets.indexOf(event.key) == -1 || fretContent.length >=2)
                    return;

                //let fretNumber = this.fretNumbers[this.selectedFret] + event.key.toString();
                this.fretNumberChanged(this.selectedFret, fretContent + event.key.toString());
             
               //this.fretNumbers[this.selectedFret] +=  event.key;

                //todo : remove 0 in front
             }
            //console.log(event.key)
        },
        setEditedFret(fretNum) {

            this.selectedFret = fretNum;
            console.log('selectedFret = ' + fretNum)
        },
       
    },
     mounted() {

        //  for(let i=1;i<this.fretbars;i++) {
        //     this.fretText[i] = '';
        // }
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
