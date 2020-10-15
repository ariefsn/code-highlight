<template>
  <div>
    <v-row v-show="!showHighlighter" justify="space-between" class="mx-0">
      <!-- Dialog for show confirmation delete -->
      <v-dialog
        v-model="showDialog"
        scrollable
        max-width="240px"
      >
        <v-card>
          <v-card-text class="pt-5 text-right">
            <v-row>
              <v-col class="text-center">
                <h3 class="mb-3">Confirm</h3>
                Delete this code forever?
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center py-0">
                <v-btn
                  class="mr-1"
                  color="success"
                  text
                  small
                  tile
                  @click="doRemove"
                >Yes</v-btn>
                <v-btn
                  class="mr-2"
                  color="error"
                  text
                  small
                  tile
                  @click="showDialog = false"
                >No</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Dialog for showing code -->
      <v-dialog
        v-model="selectedCode.show"
        scrollable
        max-width="80%"
      >
        <v-card>
          <v-card-text class="pt-5">
            <v-btn text icon color="primary" x-small title="download" class="mb-3" @click="download(selectedCode.data)">
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

            <template #[`item.action`]="{ item }">
              <div class="text-center">
                <!-- <v-btn text icon color="primary" x-small title="edit" @click="edit(item)">
                  <v-icon>fas fa-edit</v-icon>
                </v-btn> -->
                <v-btn text icon color="error" x-small title="delete" class="mx-3" @click="remove(item)">
                  <v-icon>fas fa-trash</v-icon>
                </v-btn>
                <v-btn text icon color="primary" x-small title="download" @click="download(item)">
                  <v-icon>fas fa-download</v-icon>
                </v-btn>
              </div>
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

    <v-row v-if="showHighlighter" justify="space-between" class="mx-0">
      <v-col cols="12" class="px-6">
        <v-btn color="error" tile small @click="showHighlighter = false">Back</v-btn>
      </v-col>
      <v-col cols="12">
        <highlighter
          :initial-data="initialData"
          @postSubmit="refreshGrid(options)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import fs from 'file-saver'

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
    },
    showHighlighter: false,
    initialData: null,
    showDialog: false
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
    },
    async refreshGrid (options = {}) {
      this.loading = true

      const res = await this.getCodes(options)

      const optionNextPage = JSON.parse(JSON.stringify(options))
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
    splitCode (code) {
      return code.split('<code>')[1].split('</code>')[0]
      // return code.split('<span style="color: #D6DEEB">')[1].split('</span>')[0]
    },
    edit (item) {
      const temp = JSON.parse(JSON.stringify(item))
      const splitCode = this.splitCode(temp.code)
      temp.code = splitCode
      temp.codeOriginal = item.code
      this.initialData = temp
      this.showHighlighter = true
    },
    remove (item) {
      if (item) {
        this.selectedCode.data = item
      }
      this.showDialog = true
    },
    async doRemove () {
      if (!this.getUserId()) {
        return
      }

      this.showDialog = false
      this.loading = true

      const payload = {
        id: this.selectedCode.data.id,
        user: this.getUserId()
      }

      try {
        const res = await this.$axios.post('/code/delete', payload)

        this.loading = false

        this.showNotify('Code has been deleted!', 'success')

        this.refreshGrid(this.options)

        return Promise.resolve({
          status: res.data.success && !res.data.error,
          data: res.data.data,
          message: res.data.message
        })
      } catch (error) {
        this.loading = false

        return Promise.resolve({
          status: false,
          data: null,
          message: error
        })
      }
    },
    async download (item) {
      const params = ['download=1']

      for (var key in item) {
        if (['lang', 'fileName', 'highlight', 'twoslash'].indexOf(key) > -1) {
          if (item[key]) {
            params.push(`${key}=${item[key]}`)
          }
        }
      }

      try {
        const res = await this.$axios.post('/?' + params.join('&'), { code: this.splitCode(item.code) }, { responseType: 'blob' })

        fs.saveAs(new Blob([res.data]), `code-highlighter-${item.fileName}-${new Date().getTime()}.png`)
      } catch (error) {
        this.showNotify(error, 'red')
      }
    }
  },
  watch: {
    options: {
      async handler (v) {
        this.refreshGrid(v)
      },
      deep: true,
      immediate: false
    }
  }
}
</script>
