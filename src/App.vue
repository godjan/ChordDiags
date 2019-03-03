<template>

    <v-app>
       <v-content>
         <v-toolbar class="white--text light-blue ">
            <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
            <v-toolbar-title >
              <v-btn flat to="/" class="white--text">TG Chord Diagrams</v-btn>
            </v-toolbar-title>
            <v-btn flat class="white--text" href="/sheet"> <v-icon>add_circle_outline</v-icon> new sheet</v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-items dclass="hidden-sm-and-down">
              <v-btn flat to="/login">Log in</v-btn>
          
            </v-toolbar-items>
          </v-toolbar>
         
            <router-view></router-view>
       
       </v-content>
    </v-app>


</template>

<script>

export default {
  
  name: 'app',
  data () {
    return {
   
    }
  }
}
</script>

<style>

</style>
