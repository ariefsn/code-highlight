<template>
  <validate-all ref="form">
    <v-row>
      <v-col :cols="(['typescript', 'json'].indexOf(file.lang) > -1) ? (profile ? 4 : 6) : 12">
        <validate name="Languages" rules="required" #default="{ errors }">
          <v-autocomplete
            v-model="file.lang"
            :items="options.languages"
            dense
            label="Languages"
            :error-messages="errors"
          ></v-autocomplete>
        </validate>
      </v-col>
      <v-col :cols="(['typescript', 'json'].indexOf(file.lang) > -1) ? (profile ? 4 : 6) : 12" v-if="['typescript', 'json'].indexOf(file.lang) > -1">
        <validate name="Two Slashes" #default="{ errors }">
          <v-autocomplete
            v-model="file.twoslash"
            :items="options.twoSlashes"
            dense
            label="Two Slashes"
            :error-messages="errors"
          ></v-autocomplete>
        </validate>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <validate rules="required" name="File Name" #default="{ errors }">
          <v-text-field
            v-model="file.fileName"
            name="fileName"
            label="File Name"
            id="fileName"
            :error-messages="errors"
          ></v-text-field>
        </validate>
      </v-col>
      <v-col cols="6">
        <validate name="Highlight Rows" #default="{ errors }">
          <v-text-field
            v-model="file.highlight"
            name="highlightRows"
            label="Highlight Rows"
            id="highlightRows"
            :error-messages="errors"
          ></v-text-field>
        </validate>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <validate name="Code" rules="required" #default="{ errors }">
          <v-textarea
            v-model="code"
            name="code"
            label="Code"
            id="code"
            :error-messages="errors"
          ></v-textarea>
        </validate>
      </v-col>
    </v-row>
    <v-row v-if="profile">
      <v-col cols="4">
        <v-switch
          v-model="save"
          dense
          label="Save to my codes"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <v-btn color="primary" class="mx-1" tile small @click="submit(0)">Go</v-btn>
        <v-btn color="secondary" class="mx-1" tile small @click="submit(1)">Download</v-btn>
      </v-col>
    </v-row>
  </validate-all>
</template>

<script>
import { mapState } from 'vuex'
import fs from 'file-saver'

export default {
  name: 'code-form',
  props: {
    value: {
      type: String,
      default: ''
    },
    initialData: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    file: {
      id: '',
      lang: '',
      twoslash: '',
      fileName: '',
      highlight: '',
      download: 0
    },
    code: '',
    save: false
  }),
  computed: {
    ...mapState(['options']),
    ...mapState('user', ['profile'])
  },
  methods: {
    async saveToUser () {
      if (!this.getUserId()) {
        return
      }

      const payload = {
        user: this.getUserId(),
        content: {
          ...this.file,
          code: this.code
        }
      }

      for (const key in payload.content) {
        if (!payload.content[key]) {
          delete payload.content[key]
        }
      }

      try {
        const res = await this.$axios.post('/code/store', payload)

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
    async submit (download = 0) {
      const valid = await this.$refs.form.validate()
      if (!valid) {
        return
      }

      this.file.download = download

      const params = []

      for (var key in this.file) {
        if (key.toLowerCase() === 'id') continue

        if (this.file[key]) {
          params.push(`${key}=${this.file[key]}`)
        }
      }

      this.$emit('preSubmit', params)

      let res = null

      try {
        res = await this.$axios.post('/?' + params.join('&'), { code: this.code }, { responseType: this.file.download ? 'blob' : 'json' })

        if (this.file.download === 1) {
          fs.saveAs(new Blob([res.data]), `code-highlighter-${this.file.fileName}-${new Date().getTime()}.png`)
        }

        if (res.data.success && !res.data.error) {
          if (this.save) {
            let resSave = null
            if (this.initialData) {
              resSave = await this.update()
            } else {
              resSave = await this.saveToUser()
            }

            if (resSave.status) {
              this.showNotify(`Nice! Code ${this.initialData ? 'updated' : 'saved'}!`, 'success')
            } else {
              this.showNotify(resSave.message, 'red')
            }
          }

          this.$emit('input', res.data.data)
        }
      } catch (error) {
        this.showNotify(error, 'red')
      }

      this.$emit('postSubmit', res)
    },
    async update () {
      if (!this.getUserId()) {
        return
      }

      const temp = JSON.parse(JSON.stringify(this.file))

      delete temp.id

      const payload = {
        id: this.file.id,
        user: this.getUserId(),
        content: {
          ...temp,
          code: this.code
        }
      }

      for (const key in payload.content) {
        if (!payload.content[key]) {
          delete payload.content[key]
        }
      }

      try {
        const res = await this.$axios.post('/code/edit', payload)

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
    }
  },
  watch: {
    initialData: {
      handler (v) {
        if (v) {
          this.file.id = v.id
          this.file.lang = v.lang
          this.file.twoslash = v.twoslash
          this.file.fileName = v.fileName
          this.file.highlight = v.highlight
          this.code = v.code
        }
      },
      deep: true,
      immediate: true
    },
    profile: {
      handler (v) {
        if (v) {
          this.save = true
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
