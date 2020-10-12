import axios from 'axios'

let _ajax = null

const ajax = () => {
  if (!_ajax) {
    _ajax = axios.create({
      baseURL: process.env.VUE_APP_API_URL
    })
  }

  return _ajax
}

export default ajax
