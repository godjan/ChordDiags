<template>
   <v-layout>
      <v-flex xs12 sm12 >
        <!-- <v-card> -->
           
            <v-container fluid grid-list-sm>
                <v-layout row wrap>
                    <v-flex v-for="tune in tunes" :key="tune._id.$oid">
                        <!-- <v-flex xs10> -->
                        <!-- <v-data-table
                            :headers="headers"
                            :items="tunes"
                            hide-actions
                            class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                
                                <td> <router-link :to="`/sheet/${props.item._id.$oid}`">{{ props.item.title }}</router-link></td>
                                <td >{{ props.item.description }}</td>
                                <td >{{ props.item.author.name }}</td>
                            
                            </template>
                        </v-data-table> -->

                        <v-card :to="`/sheet/${tune._id.$oid}`" >
                            
                            <v-card-title>
                                <div>
                                    <span >{{ tune.title }}</span><br>
                                    <span class="grey--text">{{ tune.description }}</span><br>
                                    <span class="grey--text">{{ tune.author.name }}</span>
                                </div>
                            </v-card-title>
                            <v-card-actions>
                         
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
           <!-- </v-card> -->
        </v-flex>
    </v-layout>
  
</template>

<script>

export default {

  name: "Home",

  methods: {},

  data() {

    return {
            tunes: [],
            headers: [
                { text: 'Title', value: 'title' },
                { text: 'Description', value: 'description',sortable: false },
                { text: 'Author', value: 'author' },
                ],
    }
  },
  mounted() {
      
      this.$sheetStore.loadSheets()
                    .then((response) => {
                        console.log(response);
                        this.tunes = response.data;
                    })
                    .catch((error) => { 
                        console.log(error);
                    })
  }
};
</script>

<style scoped>
</style>