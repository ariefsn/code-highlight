import ajax from '../../axios'

export default {
  namespaced: true,
  state: () => ({
    profile: null
  }),
  mutations: {
    mutUserProfile (state, profile = null) {
      state.profile = profile
    }
  },
  actions: {
    async register (ctx, userName) {
      const payload = {
        name: userName
      }

      try {
        const res = await ajax().post('/user/register', payload)

        return Promise.resolve({
          status: res.data.success && !res.data.error,
          data: res.data.data,
          message: res.data.message
        })
      } catch (error) {
        return Promise.resolve({
          status: false,
          data: null,
          message: error
        })
      }
    },
    async login (ctx, userName) {
      const payload = {
        name: userName
      }

      try {
        const res = await ajax().post('/user/login', payload)
        if (res.data.success && !res.data.error) {
          ctx.commit('mutUserProfile', res.data.data)
        }

        return Promise.resolve({
          status: res.data.success && !res.data.error,
          data: res.data.data,
          message: res.data.message
        })
      } catch (error) {
        ctx.commit('mutUserProfile', null)

        return Promise.resolve({
          status: false,
          data: null,
          message: error
        })
      }
    },
    logout (ctx) {
      ctx.commit('mutUserProfile', null)
      localStorage.removeItem('userId')
      localStorage.removeItem('userName')
      location.href = '/'
    }
  }
}
