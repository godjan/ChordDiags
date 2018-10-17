<template>
    <div>
        <input type="text" v-model="chord" @keyup.13="addChord(chord)"/>

        <p v-for="(chord, index) in chords" :key="'c' + index"> {{ chord.name }}</p>
    </div>
</template>

<script>

import chordsRef from '../firebase'
//import firebase from 'firebase'

export default {
    name:'Bar',

    data() {
         return {
            chords:[],
            chord:''
         }
    },
    methods: {
        addChord(chord) {
            chordsRef.push({ name : chord})
                     .then((data) => {
                         //console.log(data.val());
                        // this.chords.push()
                        this.chord = '';
                     })
                     .catch((error) => { console.log(error)})
        }
    },
    mounted() {
        // chordsRef.on('value', (data) => {
        //    // this.chords = data.val();
        //    console.log(data)
        // })
        // const app = firebase.initializeApp({
        //     apiKey: "AIzaSyAJMK-hjtmaNx9fIYUeKftJeJcEAUjHmiE",
        //     authDomain: "tedgreene-diagrams.firebaseapp.com",
        //     databaseURL: "https://tedgreene-diagrams.firebaseio.com",
        //     projectId: "tedgreene-diagrams",
        //     storageBucket: "tedgreene-diagrams.appspot.com",
        //     messagingSenderId: "284562345798"
        // });

        // const chordsRef = app.database().ref('chords');

        // chordsRef.push({ name : 'Cmin7b5'})
        //             .then((data) => {
        //                 console.log(data);
                        
        //             }).catch((error) => {
        //                 console.log(error)
        //             });
    },
    created() {
        chordsRef.on('value', (data) => {
            this.chords = data.val();
        })
    }
}
</script>

<style scoped>

</style>