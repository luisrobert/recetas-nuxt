export default function({store}){
    console.log("hola soy un middleware")
    if (store.state.categorias.length == 0) {
        store.dispatch('nuxtServerInit')
    }
}