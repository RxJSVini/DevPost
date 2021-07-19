<template>
  <header id="header">
      <router-link to="/">DevPost</router-link>
      <router-link tag="button" to="/dashboard">Dashboard</router-link>
  </header>
</template>

<script>
export default {
    name:'Header'
}
</script>

<style>
    #header{
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 60px;
        background-color:#202225;
        box-shadow: 0 0 10px rgb(0,0,0, 0.2);

    }   

    #header a {
        text-decoration: none;
        font-size: 30px;
        color:#FFF;
        cursor:pointer;
        font-weight: bold;
    }

    botton{
        cursor:pointer;
        border: #FFF;
        background-color: transparent;
        padding: 5px 15px;
        outline: none;
        font-weight: bold;
    }
</style>