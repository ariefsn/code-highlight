<template>
  <v-row justify="space-between" class="mx-0">
    <v-col cols="6" class="text-center">
      <v-card class="pa-5">
        <loading v-model="loading" />
        <code-form v-model="code" @preSubmit="loading = true" @postSubmit="loading = false" />
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
  name: 'home',
  data: () => ({
    code: '',
    loading: false
  })
}
</script>
