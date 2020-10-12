<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
  >
    {{ text }}

    <template v-slot:action="{ attrs }">
      <v-btn
        text
        small
        tile
        v-bind="attrs"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'notify',
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: null
    }
  },
  data: () => ({
    snackbar: false
  }),
  watch: {
    snackbar (v) {
      this.$emit('input', v)
    },
    value (v) {
      this.snackbar = v
    }
  }
}
</script>
