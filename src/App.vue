<template>
  <v-app>
    <app-bar />
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- notify -->
    <notify
      v-model="notify.show"
      :text="notify.text"
      :color="notify.color"
    />
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    AppBar
  },
  data: () => ({
    notifyScoped: {
      show: false,
      text: '',
      color: null
    }
  }),
  computed: {
    ...mapState(['notify'])
  },
  async mounted () {
    await this.getOptions()

    if (this.getUserName()) {
      await this.login(this.getUserName())
    }
  },
  methods: {
    ...mapActions(['getOptions']),
    ...mapActions('user', ['login'])
  },
  watch: {
    notify: {
      handler (v) {
        if (v) {
          if (v.show) {
            this.notifyScoped.show = v.show
            this.notifyScoped.text = v.text
            this.notifyScoped.color = v.color
          }
        }
      },
      deep: true,
      immediate: true
    },
    notifyScoped: {
      handler (v) {
        if (v) {
          if (!v.show) {
            this.resetNotify()
          }
        }
      },
      deep: true,
      immediate: true
    },
    '$route' (to, from) {
      document.title = to.meta.title || process.env.VUE_APP_NAME
    }
  }
}
</script>
