<template>
  <component :is="codeTemplate" />
</template>

<script>
export default {
  name: 'code-preview',
  props: {
    code: {
      type: String,
      default: null
    }
  },
  computed: {
    codeTemplate () {
      return {
        template: this.code || '<pre class="shiki"></pre>'
      }
    }
  }
}
</script>
