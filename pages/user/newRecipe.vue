<template>
    <div>
        <v-container>
          <h2>Agragar nueva receta</h2>
          <v-divider class="my-5"></v-divider>

          <app-forms-recipe></app-forms-recipe>
          
        </v-container>
    </div>
</template>
<script>
export default {
    middleware:'auth',
}
</script>