import Vue from 'vue';
import VueRouter from 'vue-router';
import firebase from 'firebase';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/login',
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: () =>
      import(
        /* webpackChunkName: "signup" */ '@/components/sign-up/sign-up.vue'
      ),
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/components/login/login.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/components/dashboard/dashboard.vue'
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(
        /* webpackChunkName: "settings" */ '@/components/settings/settings.vue'
      ),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('sign-in');
  else if (!requiresAuth && currentUser) next('dashboard');
  else next();
});

export default router;
