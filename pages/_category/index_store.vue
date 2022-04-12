<template>
  <div>
    {{ $route.params.category }}
    {{categoria}}
    <div>
      {{counter}}
    </div>
    <v-btn @click="callMutation()">Mutation</v-btn>
    <v-btn @click="callAction()">Action</v-btn>

  </div>
</template>

<script>
//import gql from "graphql-tag";
import { category } from "../../graphql/querys";
export default {
  data() {
    return {
      query:category ,
    };
  },
    computed:{
    counter(){
      return this.$store.getters.readCounter
    }
  },
  methods:{
    callMutation(){
      this.$store.commit("increment")
    },
    callAction(){
      this.$store.dispatch("increment")
    }
  },
  apollo: {
    categoria:{
      query:category,
    variables() {
      return { id:this.$route.query.id };
    }
    //update: data => data.categoria
  }
}
};
</script>
