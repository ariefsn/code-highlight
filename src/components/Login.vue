<template>
  <v-card>
    <loading v-model="loading" />

    <v-tabs
      v-model="activeMenu"
      align-with-title
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab
        v-for="item in menus"
        :key="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-card-text class="pt-2">
      <validate-all ref="form">
        <validate ref="username" name="Username" rules="required" #default="{ errors }">
          <v-text-field
            v-model="username"
            name="username"
            label="Username"
            id="username"
            :error-messages="errors"
          ></v-text-field>
        </validate>
      </validate-all>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="green darken-1"
        text
        small
        tile
        @click="submit"
      >
        {{ activeMenu === 0 ? 'Login' : 'Register' }}
      </v-btn>
      <v-btn
        color="red darken-1"
        text
        small
        tile
        @click="closeDialog"
      >
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: () => ({
    username: '',
    activeMenu: 0,
    menus: ['Login', 'Register'],
    loading: false
  }),
  methods: {
    ...mapActions('user', ['register', 'login']),
    reset (form = null) {
      this.username = ''
      console.log(form)
      if (form) {
        form.reset()
        return
      }
      if (this.$refs.form) this.$refs.form.reset()
    },
    closeDialog () {
      this.$emit('onClose')
    },
    async submit () {
      const form = this.$refs.form
      const valid = await form.validate()
      if (!valid) {
        const { errors } = await this.$refs.username.validate()
        this.showNotify(errors[0], 'red')
        return
      }

      let res = null

      this.loading = true

      if (this.activeMenu === 0) {
        res = await this.login(this.username)
      } else {
        res = await this.register(this.username)
      }

      this.loading = false

      if (!res.status) {
        this.showNotify(res.message, 'red')
      } else {
        if (this.activeMenu === 0) {
          localStorage.setItem('userId', res.data.id)
          localStorage.setItem('userName', res.data.name)
        }

        this.reset(form)
        this.closeDialog()

        this.showNotify(`Welcome to the club, ${res.data.name}`, 'success')
      }
    }
  }
}
</script>
