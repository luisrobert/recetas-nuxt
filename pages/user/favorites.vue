<template>
  <v-container>
    <h1 class="secondary--text">
      Recetas Favoritas
      <v-icon large class="secondary--text">mdi-heart</v-icon>
    </h1>
    <p class="secondary--text">Tus recetas favoritas</p>
    <v-row>
      <v-col cols="4" v-for="favorite in favorites" :key="favorite.id">
        <app-ui-nav-card-recipe :recipe="favorite"></app-ui-nav-card-recipe>
      </v-col>
    </v-row>
    <div class="mt-3">
      <v-alert type="info" v-if="favorites.length == 0">
        <p>No tienes recetas favoritas</p>
      </v-alert>
    </div>
    <div class="mt-3">
      <app-ui-back-btn></app-ui-back-btn>
    </div>
  </v-container>
</template>
<script>
export default {
  middleware: "auth",
  async asyncData({ app, store }) {
    console.log("sale");
    let client = app.apolloProvider.defaultClient;
    let id = app.$auth.user.id;
    let query = {
      context: {
        headers: {
          authorization: app.$auth.strategy.token.get(),
        },
      },
      query: require("../../graphql/userFavorites.gql"),
      fetchPolicy: "no-cache",
      variables: { id },
    };
    let favorites = [];
    await client
      .query(query)
      .then((res) => {
        //esto es rediculo, esperemos que Strapi cambie su esquema de graphql de la V4
        console.log(
          "de favorite:",
          res.data.usersPermissionsUser.data.attributes.favorites.data
        );
        //vamos a organizar los datos para usarlos rapidamente
        res.data.usersPermissionsUser.data.attributes.favorites.data.forEach(
          (element) => {
            console.log("los elementos son:", element);

            const recipe = {
              id: element.id,
              name: element.attributes.name,
              likes: element.attributes.likes,
              img: element.attributes.img,

              //en la propiedad category conservo un objeto
              //pero filtro las propiedades data y attributos para facil uso
              categoria: {
                id: element.attributes.categoria.data.id,
                ...element.attributes.categoria.data.attributes,
              },
              //autor
              autor: element.attributes.autor.data.attributes.username,
            };

            favorites.push(recipe);
        
          });
          store.commit("user/setFavorites",favorites)
        // favorites = data.data.user.favorites;
        // store.commit("user/setFavorites", favorites)
      })
      .catch((e) => console.log("el error es:", e));
    return { favorites };
  },
};
</script>