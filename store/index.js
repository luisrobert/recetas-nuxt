export const strict = false
export const state = () => ({
counter:0,
categorias:[],
loadedRecetas:[]

})

export const getters ={
    readCategorias(state){
        return state.categorias
    },
    readLoadedRecetas(state){
        return state.loadedRecetas
    },
    readCounter(state){
        return state.counter
    }
}

export const mutations = {
    addCategorias(state,payload){
        const categorias = []
        payload.forEach(element => {
          categorias.push({id:element.id, ...element.attributes})            
        });
        state.categorias = categorias
    },

  addLoadedRecetas(state,payload){
    const recetas = []
    payload.forEach(element =>{
        recetas.push({
            id:element.id, 
            name:element.attributes.name,
            categoria:{
                id:element.attributes.categoria.data.id, 
                ...element.attributes.categoria.data.attributes
            }
        })
    })
    state.loadedRecetas = recetas
  },  

    increment(state){
        state.counter ++
    }
}

export const actions = {
 async   nuxtServerInit({commit}){
        console.log("hola nuxt server")
        //return new Promise((resolve, reject) =>{
            const client = this.app.apolloProvider.defaultClient
            const query = {
                query: require("../graphql/categorias.gql")                
            }

        await    client.query(query).then(data => {
                commit('addCategorias',data.data.categorias.data)
            //    commit('addLoadedRecetas',data.data.recetas.data)
             //   resolve()
            }).catch(error => {
                console.log(error)
            //    reject()
            })
      //  })
    },
    searchReceta({commit},payload){
        let client = this.app.apolloProvider.defaultClient
        const query = {
            query:require('../graphql/searchReceta.gql'),
            variables:{term:payload}
        }
        client.query(query).then(data =>{
            //console.log(data)
            commit('addLoadedRecetas',data.data.recetas.data)
        }).catch(e => console.log(e))
    },
    increment(context){
        setTimeout(()=>{
            context.commit("increment")
        },1000)
    }
}