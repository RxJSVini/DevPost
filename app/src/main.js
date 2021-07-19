import Vue from 'vue'
import App from './App.vue'
import router from './routes';
import firebase from './services/firebaseCon'

Vue.config.productionTip = false
let app
firebase.auth().onAuthStateChanged(()=>{
  if(!app){
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app')    
  }
})
