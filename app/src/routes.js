import Vue from 'vue'
import Router from 'vue-router'
import firebase from './services/firebaseCon'

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Perfil from './pages/Perfil';


Vue.use(Router);
const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name:'home',
            component: Home,
            meta:{
                requiresAuth: true,
            }
        },
        {
            path: '/dashboard',
            name:'dashboard',
            component: Dashboard,
            meta:{
                requiresAuth: true,
            }
        },
        {
            path: '/perfil/:userid',
            component: Perfil,
            name:'perfil',
            props: true,
            meta:{
                requiresAuth: true,
            }
        },
        {
            path: '/login',
            name:'login',
            component: Login
        }
    ]
});


router.beforeEach((to, from, next)=> {
    const requiresAuth = to.matched.some( x => x.meta.requiresAuth);

    if(requiresAuth && !firebase.auth().currentUser){
        next('/login');
    }else{
        next();
    }

})
export default router;