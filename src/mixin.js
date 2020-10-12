import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['setNotify']),
    getUserId () {
      return localStorage.getItem('userId')
    },
    getUserName () {
      return localStorage.getItem('userName')
    },
    showNotify (text = '', color = null) {
      this.setNotify({ show: true, text, color })
    },
    resetNotify () {
      this.setNotify({ show: false, text: '', color: null })
    }
  }
}
