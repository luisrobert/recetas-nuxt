<template>
<v-container>
  esto es index
  {{categorias}}
  <v-row>
    <v-col cols="3" v-for="category in categorias" :key="category.id">
      <app-ui-nav-card :category="category"></app-ui-nav-card>
    </v-col>
  </v-row>
  </v-container>
</template>
<script>
//import {categorias} from '../graphql/querys';
export default {
    middleware:"initData",
    data(){
        return{
        //  categorias:[]
       // query:categorias,
        };
    },
    computed:{
      categorias(){
         return this.$store.getters.readCategorias
      }
      
    }
    // async fetch(){
    //   //const client = this.$apollo.getClient()
    //   const query ={
    //     query:require("../graphql/categorias.gql")
    //   }
      
    //   await this.$apollo.query(query).then(data => {
    //     console.log(data)
    //     this.categorias = data.data.categorias
    //     });
    // }
    // async asyncData(context) {
    //   const client = context.app.apolloProvider.defaultClient

    //   const query ={
    //     query:require("../graphql/categorias.gql")
    //   }
    //   let categorias = []
    //   await client.query(query).then(data => {
    //     console.log(data)
    //     categorias = data.data.categorias
    //     });
    //    return {categorias} 
    // },
//  apollo:{
//         cat:{
//             query:categorias,
//             update: data => data.categorias
//         }
        
//     }
 };

</script>
