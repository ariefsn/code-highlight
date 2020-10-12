import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import ajax from '../axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    options: {
      languages: [],
      twoSlashes: []
    },
    notify: {
      show: false,
      text: '',
      color: null
    }
  },
  mutations: {
    mutOptionsLanguages (state, langs) {
      state.options.languages = langs
    },
    mutOptionsTwoSlashes (state, slashes) {
      state.options.twoSlashes = slashes
    },
    mutNotify (state, { show = false, text = '', color = null }) {
      state.notify.show = show
      state.notify.text = text
      state.notify.color = color
    }
  },
  actions: {
    async getOptions (ctx) {
      try {
        const res = await ajax().get('/options')

        if (res.data.success && !res.data.error) {
          ctx.commit('mutOptionsLanguages', res.data.data.languages)
          ctx.commit('mutOptionsTwoSlashes', res.data.data.twoslashes)

          return Promise.resolve({
            status: true,
            data: res.data.data,
            message: null
          })
        }
      } catch (error) {
        ctx.commit('mutOptionsLanguages', [])
        ctx.commit('mutOptionsTwoSlashes', [])

        return Promise.resolve({
          status: false,
          data: null,
          message: error
        })
      }
    },
    setNotify (ctx, { show = false, text = false, color = null }) {
      ctx.commit('mutNotify', { show, text, color })
    }
  },
  modules: {
    user
  }
})
