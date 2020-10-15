<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <div class="d-flex align-center">
      <h3>Code Highlighter</h3>
    </div>

    <v-spacer></v-spacer>

    <v-btn
      tile
      small
      text
      to="/"
    >
      <span>Home</span>
    </v-btn>

    <v-dialog
      v-if="!profile"
      v-model="showFormLogin"
      max-width="290"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          v-bind="attrs"
          v-on="on"
          small
          text
          tile
        >
          Login
        </v-btn>
      </template>
      <login @onClose="showFormLogin = false" />
    </v-dialog>

    <v-btn
      v-if="profile"
      tile
      small
      text
      to="/my-codes"
    >
      <span>My Codes ({{ profile.name }})</span>
    </v-btn>

    <v-btn
      v-if="profile"
      tile
      small
      text
      @click="logout"
    >
      <span>Logout</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Login from '@/components/Login'

export default {
  components: {
    Login
  },
  data: () => ({
    showFormLogin: false
  }),
  computed: {
    ...mapState('user', ['profile'])
  },
  methods: {
    ...mapActions('user', ['logout'])
  }
}
</script>
