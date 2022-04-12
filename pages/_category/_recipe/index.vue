<template>
  <v-container>
      {{userFavorites}}
      {{recipeIsLiked}}
    <h1 class="secondary--text">{{receta.name}}</h1>
    <h5 class="secondary--text">{{receta.categoria.name}}</h5>
    <v-card class="mt-3">
        <c-card-title>
            <v-icon>mdi-information</v-icon>
            Informacion
        </c-card-title>
        <v-card-text class="black--text">
            <v-row>
                <v-col cols="6">
                    <v-chip color="primary" outlined>
                        <v-icon left>mdi-account-group</v-icon>
                        Servicios: {{receta.servings}}
                    </v-chip>

                    <v-chip color="primary" outlined>
                        <v-icon left>mdi-account-group</v-icon>
                        Tiempo: {{formatedTime}}
                    </v-chip>

                    <v-chip color="primary" outlined>
                        <v-icon left>mdi-account-group</v-icon>
                        Autor: {{receta.autor}}
                    </v-chip>
                    <v-divider class="my-3"></v-divider>
                    <h4 class="body-1">Descripcion</h4>
                    <div v-html="receta.description"></div>


                </v-col>
                <v-col cols="6">
                    <v-img :src="receta.img" max-height="500"></v-img>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-action>
            <v-btn icon v-if="$auth.loggedIn" large @click="toggleLiked()">
                <v-icon :color="recipeIsLiked?'error':'grey'" large>mdi-heart</v-icon>
            </v-btn>
            <v-icon v-else class="mr-3">mdi-heart</v-icon>
            <span class="overline">Likes {{receta.likes}}</span>
        </v-card-action>
    </v-card>     

    <div class="mt-3">
        <v-row>
            <v-col cols="5">
                <v-card>
                    <v-card-title>
                        <v-icon class="mr-3">mdi-fridge</v-icon>Ingredientes
                    </v-card-title>
                    <v-list>
                        <v-list-item v-for="(ingredient,i) in receta.ingredients" :key="i">
                            {{ingredient}}
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="7">
                <v-card>
                    <v-card-title>
                        <v-icon class="mr-3">mdi-stove</v-icon>Pasos
                    </v-card-title>

                    <v-timeline dense>
                        <v-timeline-item v-for="(step,k) in receta.steps" :key="k+Math.random" color="secondary" small>
                            {{step}}
                        </v-timeline-item>
                    </v-timeline>
                </v-card>
            </v-col>
        </v-row>
    </div>
    <div class="mt-3">
      <app-ui-back-btn label="Volver a Recetas zopi"></app-ui-back-btn>
    </div>
  </v-container>
</template>
<script>
export default {
    data() {
        return {
            likedRecipe:false
        }
    },
  computed:{
      formatedTime(){
          let hours = Math.floor(this.receta.duration / 60)
          let minutes = this.receta.duration % 60
          let total = ("0"+hours).slice(-2) +":"+ ("0"+minutes).slice(-2)
          return total
      },
      userFavorites(){
      return this.$store.getters['user/favorites']
      },
      recipeIsLiked(){
          let liked = false
          if (this.userFavorites){
              const id = this.receta.id
              liked = this.userFavorites.some((fav) => fav.id ===id)
          }
          this.likedRecipe = liked
          return liked
      }
  },  
  methods: {
      toggleLiked(){
          this.likedRecipe = !this.likedRecipe
          if (this.likedRecipe) {
              this.likeRecipe()
          } else{
              this.unlikeRecipe()
          }  
      },
      likeRecipe(){
      this.$store.commit("user/addRecipe", this.receta)
      let userFav = this.$store.getters['user/favoritesGQL']
      const variables = {
        id:this.receta.id,
        idUser:this.$auth.user.id,
        favorites:userFav
      }
 
      this.$apollo.query({
        query:require("../../../graphql/getLikes.gql"),
        variables:{id:this.receta.id}
      }).then(res =>{
 
        let likes = res.data.receta.data.attributes.likes + 1
        this.receta.likes = likes
        variables.likes = likes
        this.$apollo.mutate({
          context:{
            headers:{
              authorization:this.$auth.strategy.token.get()
            }
          },
          mutation:require("../../../graphql/updateLikes.gql"),
          variables:variables
        })
 
      })
 
    }
      ,
      unlikeRecipe(){
      this.$store.commit("user/removeRecipe", this.receta.id)
 
      let userFav = this.$store.getters['user/favoritesGQL']
      const variables = {
        id:this.receta.id,
        idUser:this.$auth.user.id,
        favorites:userFav
      }
 
      this.$apollo.query({
        query:require("../../../graphql/getLikes.gql"),
        variables:{id:this.receta.id}
      }).then(res =>{
        let likes = res.data.receta.data.attributes.likes - 1
        this.receta.likes = likes
        variables.likes = likes
        this.$apollo.mutate({
          context:{
            headers:{
              authorization:this.$auth.strategy.token.get()
            }
          },
          mutation:require("../../../graphql/updateLikes.gql"),
          variables:variables
        })
 
      })
    }
  },

  async asyncData({ app, route }) {
    const client = app.apolloProvider.defaultClient;
    const id = route.params.recipe;
    const query = {
      query: require("../../../graphql/receta.gql"),
      variables: { id },
    };
    
    let receta = null;
    await client
      .query(query)
      .then((res) => {
        const id = res.data.receta.data.id
        //separo los attributos
        const attributes = res.data.receta.data.attributes
        //a recipe le doy un nuevo valor organizando el objeto a mi medida
        //este es el objeto utilizado para renderizar la UI
        receta = {
          id,
          name:attributes.name,
          duration:attributes.duration,
          servings:attributes.servings,
          img:attributes.img,
          description:attributes.description,
          ingredients:attributes.ingredients,
          steps:attributes.steps,
          likes:attributes.likes,
          categoria:{id:attributes.categoria.data.id, ...attributes.categoria.data.attributes},
          autor:attributes.autor.data.attributes.username
        }
      })
      .catch((e) => console.log(e));
    return { receta };
  },
  async mounted(){
      if(this.$auth.loggedIn && this.$store.getters['user/favorites'] == null){
          console.log('call favorites')
   await this.$store.dispatch("user/getFavorites")       
      }
  }
};
</script>