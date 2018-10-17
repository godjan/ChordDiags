<template>
    
    <v-container fluid grid-list-md >

        <v-layout v-show="loading" fill-height>
            <v-flex xs12 class="text-md-center mt-5" >

                <v-progress-circular
                indeterminate
                color="primary"
                :size="50"
                ></v-progress-circular>
            </v-flex>
        </v-layout>

        <v-layout row wrap v-show="!loading">
            <v-flex xs8>
                <!-- <v-btn flat color="info"><v-icon>add</v-icon>New sheet</v-btn> -->
               
            </v-flex>
            
            <v-flex xs4 class="text-xs-right">
                <v-btn flat color="info"><v-icon>help</v-icon>How to play</v-btn>
            </v-flex>

            
            <v-flex xs12>
                <v-toolbar>
                    <v-btn flat small color="primary"> Sheet Details...</v-btn>
                     <v-btn flat color="info"><v-icon>grade</v-icon>Add to favorites</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn  small color="info">save </v-btn>
                    <v-btn flat small><v-icon>delete_outline</v-icon></v-btn>
                </v-toolbar>
                <v-card>
                    <v-container
                        fluid
                        grid-list-lg
                    >
                        <Editor></Editor> 
                    </v-container>
                 </v-card>
            </v-flex>
         </v-layout>
    </v-container>

</template>

<script>

import Editor from '../Components/Editor'
import ApiService from '../api.js'
import Config from '../config.js'
import Store from '../store.js'

export default {

    name:'Sheet',
    
    props:[],

    data() {
        return {
            diagrams:[],
            sheet:{},
            loading: false,
            state: this.$sheetStore.state
        }
    },
    created() {

        console.log('Sheet created')
        this.loading = true;

        if(this.$route.params.id) {

            ApiService.getSheet(this.$route.params.id)
                    .then((response)=> {

                        console.log('Sheet from api : ' + response.data)
                        //this.sheet = response.data;
                        this.loading = false;
                        this.state.sheet = response.data;
                    })
        }
        else {
            this.state.sheet= { id: 0, fretspan: Config.FRETSPAN_DEFAULT, version: 1, title: null, description:'', tags: '' };
        }
                  
    },
    components: { Editor},
}
</script>

<style>

</style>
