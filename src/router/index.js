import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import MyCodes from '../views/MyCodes.vue'
import ajax from '../axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/my-codes',
    name: 'MyCodes',
    component: MyCodes,
    meta: {
      title: 'My Codes'
    }
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// check user
const checkUser = async () => {
  const userName = localStorage.getItem('userName')
  if (!userName) {
    return Promise.resolve({
      status: false,
      data: null,
      message: null
    })
  }

  const payload = {
    name: userName
  }

  const res = await ajax().post('/user/login', payload)
  if (res.data.success && !res.data.error) {
    return Promise.resolve({
      status: true,
      data: res.data.data,
      message: null
    })
  }
}

router.beforeEach(async (to, from, next) => {
  const res = await checkUser()
  if (to.path !== '/') {
    if (res.status) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
