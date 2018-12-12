<template>

    <section>
     
    <v-dialog v-model="dialog" 
              max-width="290"
    >
        <v-card>
            
            <v-card-text>
                 {{ content }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="green darken-1"
                    flat="flat"
                    @click="cancel()"
                >
                    No
                </v-btn>

                <v-btn
                    color="green darken-1"
                    flat="flat"
                    @click="submit()"
                >
                    Yes
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog></section>
</template>

<script>

export default {

    name:'ConfirmDialog',

    props:['dialog', 'content'],//, 'onClose'],
    
    data() {

        return {
            
        }
    },
    computed: {

        show() {
            return this.dialog;
        }
    },
    methods: {

        cancel() {
         
            this.$emit('Cancel')
        }
        ,
        submit() {
            
             this.$emit('Submit')
        }
    }
}
</script>

<style>

</style>
