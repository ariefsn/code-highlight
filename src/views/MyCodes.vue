<template>
  <v-row justify="space-between" class="mx-0">
    <v-dialog
      v-model="selectedCode.show"
      scrollable
      max-width="480px"
    >
      <v-card>
        <v-card-text class="pt-5 text-right">
          <v-btn text icon color="primary" x-small title="download" class="mb-3">
            <v-icon>fas fa-download</v-icon>
          </v-btn>
          <code-preview :code="selectedCode.data ? selectedCode.data.code : ''" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-col cols="12" class="text-center">
      <v-card class="pa-5">
        <loading v-model="loading" />
        <v-data-table
          :headers="headers"
          :items="codes"
          :options.sync="options"
          :server-items-length="total"
          :loading="loading"
          class="elevation-1"
        >

          <template #[`item.action`]>
            <span>
              <v-btn text icon color="primary" x-small title="edit">
                <v-icon>fas fa-edit</v-icon>
              </v-btn>
              <v-btn text icon color="error" x-small title="delete" class="mx-3">
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
              <v-btn text icon color="primary" x-small title="download">
                <v-icon>fas fa-download</v-icon>
              </v-btn>
            </span>
          </template>

          <template #[`item.highlight`]="{ item }">
            <span>{{ item.highlight ? item.highlight : '-' }}</span>
          </template>

          <template #[`item.code`]="{ item }">
            <v-btn color="success" text small @click="viewCode(item)">View</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'my-codes',
  data: () => ({
    loading: false,
    headers: [
      {
        text: 'Action',
        align: 'center',
        sortable: false,
        value: 'action'
      },
      {
        text: 'Language',
        align: 'start',
        sortable: true,
        value: 'lang'
      },
      {
        text: 'File Name',
        align: 'start',
        sortable: true,
        value: 'fileName'
      },
      {
        text: 'Highlight',
        align: 'end',
        sortable: false,
        value: 'highlight'
      },
      {
        text: 'Code',
        align: 'center',
        sortable: false,
        value: 'code'
      },
      {
        text: 'CreatedAt',
        align: 'center',
        sortable: true,
        value: 'createdAt'
      }
    ],
    total: 0,
    codes: [],
    options: {},
    selectedCode: {
      show: false,
      data: null
    }
  }),
  methods: {
    async getCodes (options = {}) {
      if (!this.getUserId()) {
        return Promise.resolve({
          status: false,
          data: null,
          message: 'User id cannot be empty'
        })
      }

      const opt = {
        page: options.page ?? 1,
        limit: options.itemsPerPage ?? 6,
        sortBy: options.sortBy ? (options.sortBy.length > 0 ? options.sortBy[0] : 'createdAt') : 'createdAt',
        sort: options.sortDesc ? (options.sortDesc.length > 0 ? (options.sortDesc[0] ? 'DESC' : 'ASC') : 'DESC') : 'DESC'
      }

      const params = []

      for (const key in opt) {
        if (opt[key]) {
          const el = opt[key]
          params.push(`${key}=${el}`)
        }
      }

      const payload = {
        user: this.getUserId()
      }

      try {
        const res = await this.$axios.post('/code/list?' + params.join('&'), payload)

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
    viewCode (item) {
      if (item.code) {
        this.selectedCode.show = true
        this.selectedCode.data = item
      }
    }
  },
  watch: {
    options: {
      async handler (v) {
        this.loading = true

        const res = await this.getCodes(v)

        const optionNextPage = JSON.parse(JSON.stringify(v))
        optionNextPage.page += 1

        const resNextPage = await this.getCodes(optionNextPage)

        if (res.status) {
          this.codes = res.data
          this.total = res.data.length

          if (resNextPage.status) {
            this.total += resNextPage.data.length
          }
        }

        this.loading = false
      },
      deep: true,
      immediate: false
    }
  }
}
</script>
