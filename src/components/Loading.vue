<template>
  <v-overlay :value="loading" :absolute="absolute">
    <v-progress-circular
      indeterminate
      size="48"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  name: 'loading',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    absolute: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    loading: false
  }),
  watch: {
    value: {
      handler (v) {
        this.loading = v
      },
      immediate: true
    },
    loading: {
      handler (v) {
        this.$emit('input', v)
      }
    }
  }
}
</script>
