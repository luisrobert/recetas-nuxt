<template>
    <div>
        <v-container>
          <h2>Bienvenido {{$auth.user.username}}</h2>
          <v-divider class="my-5"></v-divider>
          <h3>Lista de Recetas</h3>
          <v-btn color="primary" small class="my-3" to="user/newRecipe">Agregar Receta</v-btn>

          <div v-if="recipes">
              <app-ui-list-recipes :recipes="recipes"></app-ui-list-recipes>
          </div>
          <div v-else>Cargando...</div>
        </v-container>
    </div>
</template>
<script>
export default {
    middleware:'auth',

    async asyncData({ app }) {
    let client = app.apolloProvider.defaultClient;
    let id = app.$auth.user.id;
    let query = {
      query: require("../../graphql/userRecipes.gql"),
      variables: { id },
      fetchPolicy:'no-cache'
    };
    let recipes = null;
    await client.query(query).then((res) => {
      //recuarda analizar los datos que trae tu servidor
      console.log(res);
      //convierto a recipes de un nulo a un array
      recipes = [];
      //hago un bucle para crear obtener los datos de manera sencilla
      res.data.recetas.data.forEach((element) => {
        //creo un nuevo objeto con el formato deseado
        const recipe = {
          id: element.id,
          name: element.attributes.name,
          category: {
            id: element.attributes.categoria.data.id,
            name:element.attributes.categoria.data.attributes.name
          },
        };
        //recuerda analizar los datos que recibes en la respuesta
        recipes.push(recipe);
      });
    });
    return { recipes };
  },
}
</script>