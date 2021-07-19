<template>
  <div id="home">
      
      <div class="newpost">
        <h2>Bem vindo de volta!</h2>
        <span>Compartilhe seu dia</span>
        <textarea
        placeholder="O que está fazendo hoje?"
        rows="15"
        v-model="input">
        </textarea>
        <button @click.prevent="createPost()">Compartilhar</button>
      </div>
    
      <div class="postarea">  

        <article class="post" v-for="post in posts" :key="post.id">
          <!-- <h1>{{ post.autor }}</h1> -->
          <router-link tag="h1" :to="`/perfil/${post.userId}`">{{ post.autor }}</router-link>
          <p>
            {{ post.content | postLength }}
          </p>

          <div class="action-post">
            <button @click="likePost(post.id, post.likes)">{{ post.likes === 0 ? 'Curtir' : post.likes + ' Curtidas'}}</button>
            <button @click="togglePostModal(post)">Veja post completo</button>
          </div>
        </article>

        <Modal v-if="showPostModal"  :post="fullPost" @close="togglePostModal()"> </Modal>
      </div>
  </div>

</template>

<script>
import firebase from '../services/firebaseCon'
import Modal from '../components/Modal.vue'
export default {
  name: 'Home',
  components:{
      Modal
  },
  data(){
      return {
          input:'',
          user:{},
          loading:true,
          posts:[],
          showPostModal:false,
          fullPost:{}
      }
  },
  async created(){
      const user = localStorage.getItem('devpost');
      this.user = JSON.parse(user);

      await firebase.firestore().collection("posts")
      .orderBy("created", "desc")
      .onSnapshot((doc) =>{
          this.posts = [];
          doc.forEach((item) =>{
              this.posts.push({
                  id:item.id,
                  autor:item.data().author,
                  content:item.data().content,
                  likes:item.data().likes,
                  created:item.data().created,
                  userId:item.data().userId
              })
          })
            this.loading=false;
            console.log(this.posts)
      })
 

  },
  methods:{
      async togglePostModal(post){
         this.showPostModal = !this.showPostModal
         if(this.showPostModal){
             this.fullPost = post
         } else {
            this.fullPos = {} 
         }
      },
      async createPost(){
            if(this.input === ''||this.input === null){
                return;
            } else {
                await firebase.firestore().collection("posts")
                .add({
                    created: new Date(),
                    content:this.input,
                    author:this.user.nome,
                    userId:this.user.uid,
                    likes:0
                })
                .then(() =>{
                    this.input='';
                    console.log("Post criado com sucesso")
                })
                .catch((error) =>{
                    console.log(error)
                })
            }
       
       },
       async likePost(id, likes){
           console.log(likes)
           const userId = this.user.uid;
           const docId = `${userId}_${id}`;

    
           //Checando se o post já foi curtido

           const doc = await firebase.firestore().collection("likes")
           .doc(docId).get()

           if(doc.exists){
               await firebase.firestore().collection("posts")
               .doc(id).update({
                   likes:likes -1
               })

               await firebase.firestore().collection("likes")
               .doc(docId).delete();
               return;
           }


            await firebase.firestore().collection("likes")
            .doc(docId).set({
                postId:id,
                userId:userId
            })
           //Criar o like
           await firebase.firestore().collection("posts")
           .doc(id).update({
               likes: likes + 1
           })

           
       }
  },
  filters:{
      postLength(valor){
          if(valor.length < 200){
              return valor;
          }

          return `${valor.substring(0, 200)}...`
      }
  }

}
</script>

<style scoped>
 #home{
   display: flex;
   flex-direction: row;
   margin: 25px;
 }

 @import './home.css';

</style>
