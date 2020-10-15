<template>
  <v-row justify="space-between" class="mx-0">
    <v-col cols="6" class="text-center">
      <v-card class="pa-5">
        <loading v-model="loading" />
        <code-form
          v-model="code"
          :initial-data="$attrs['initial-data']"
          @preSubmit="preSubmit"
          @postSubmit="postSubmit"
        />
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card class="pa-5">
        <loading v-model="loading" />
        <code-preview :code="code" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'highlighter',
  data: () => ({
    code: '',
    loading: false
  }),
  mounted () {
    if (this.$attrs['initial-data']) {
      this.code = this.$attrs['initial-data'].codeOriginal
    }
  },
  methods: {
    preSubmit (params) {
      this.loading = true
      this.$emit('preSubmit')
    },
    postSubmit () {
      this.loading = false
      this.$emit('postSubmit')
    }
  }
}
</script>
