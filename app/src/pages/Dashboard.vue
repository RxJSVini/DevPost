<template>
  <div id="dashboard">
      <h2>Minha conta</h2>
      <span>Atualize seu perfil</span>

      <form @submit.prevent="updateProfile"> 
          <label>Nome:</label>
          <input type="text" v-model="nome" id="name" :placeholder="user.nome">
          <button class="button" type="submit">Atualizar perfil</button>
      </form>
      <button class="button logout" @click="logOut()">Sair</button>
  </div>
</template>

<script>
import firebase from '../services/firebaseCon'
export default {
    name:'Dashboard',

    data(){
        return{
            nome:'',
            user:{}
        }
    },
    created(){
        const user = localStorage.getItem('devpost')
        this.user = JSON.parse(user)
      
    },

    methods:{
        async logOut(){
            const confirm = window.confirm("Você realmente deseja sair ?")
            if(confirm){
                await firebase.auth().signOut()
                .then(async () =>{
                    localStorage.removeItem('devpost')
                    this.$router.push({name:'login'})
                })
            } else {
                return;
            }
        },
        async updateProfile(){
            if(this.nome === ''){
                return;
            }

            await firebase.firestore().collection("users")
            .doc(this.user.uid).update({
                nome:this.nome
            })

            //Atualizando nome nos posts do usuário

            const postDocs = await firebase.firestore().collection("posts")
            .where("userId", "==", this.user.uid).get();

            //percorer todos os pots para mudar o nome
            postDocs.forEach(async doc =>{
                await firebase.firestore().collection("posts").doc(doc.id).update({
                    author:this.nome
                })
            })

            //Atualizar nosso localStorage
            localStorage.setItem('devpost', JSON.stringify({uid:this.user.uid, nome:this.nome}))
            alert("Perfil atualizado com sucesso")
            this.$router.push({name:"home"})
        }
    }
}
</script>

<style scoped>
    #dashboard{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 60px;
        padding: 15px 20px;
        max-width: 600px;
        background: #4c5059;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    h2{
        color:#fff;
    }
    span{
         color:#fff;
         margin-bottom: 25px;
    }
    form{
        width: 500px;
        display: flex;
        flex-direction:column;
        padding-bottom: 5px;
    }

    form input{
        height: 30px;
        font-size:17px;
        border:0;
        outline: none;
        margin-bottom: 5px;
        background: #fafafa;
    }
    form.label{
        color: #fff;
    }
    button{
        cursor:pointer;
        margin-top: 15px;
        height: 35px;
        border: 0;
        background: #7289d7;
        color: #fafafa;
        font-family:sans-serif;
        font-size: 17px;

    }
    button.logout{
        width: 500px;
        background: #e36d6d;
        color: #fff;
    }
</style>