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
            <v-toolbar-items dclass="hidden-sm-and-down" sv-show="userId">
               <v-btn flat to="/profile">
               <v-icon>face</v-icon>
               Profile</v-btn>
            </v-toolbar-items>
            <v-toolbar-items dclass="hidden-sm-and-down" v-show="!userId">
               <v-btn flat to="/signup">Sign up</v-btn>
               <v-btn flat to="/signin">Sign in</v-btn>
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
  },
  computed: {
    userId() {
        return this.$sheetStore.state.userId;
    }
  }
}
</script>

<style>

</style>
