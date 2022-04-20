<template>
  <v-container>
    {{recetas}}
    <h1 class="secondary--text">
      {{categoria.name}}
      <v-icon large class="secondary--text">{{categoria.icon}}</v-icon>
    </h1>
    <p class="secondary--text">{{categoria.description}}</p>
    <v-row>
      <v-col cols="4" v-for="receta in recetas" :key="receta.id">
        <app-ui-nav-card-recipe :recipe = "receta"></app-ui-nav-card-recipe>
      </v-col>
    </v-row>
 <div class="mt-3">
   <v-alert type="info" v-if="recetas.length ==0">
     <p>No hay recetas disponibles, vuelve mas tarde</p>
     </v-alert>   
 </div>
<div class="mt-3">
  <app-ui-back-btn></app-ui-back-btn>
</div>
  </v-container>
</template>

<script>
import { categorias, category } from '../../graphql/querys';

export default {
    data(){
    return {

    };
  },

  computed:{
    categoria(){
      const slug = this.$route.params.category

      return this.$store.getters.readCategorias.find(categoria =>categoria.slug == slug)
    }
  },

  async asyncData({app,route}) {
    const slug = route.params.category
    const client= app.apolloProvider.defaultClient 
    const query = {
        query:require("../../graphql/recetas.gql"),
        variables:{slug}
    }
    let recetas = []
    await client.query(query).then(res => {
        res.data.recetas.data.forEach(element => {
          const receta = {
            id:element.id,
            name:element.attributes.name,
            likes:element.attributes.likes,
            img:element.attributes.img,
            categoria:{id:element.attributes.categoria.data.id,
            ...element.attributes.categoria.data.attributes},
            autor:element.attributes.autor.data.attributes.username
          }
          recetas.push(receta)
        });
    }).catch(e => console.log(e))
    return {recetas}     
  },
}
</script>