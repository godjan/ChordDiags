import store from './store.js'

export default {
  store,
  install (Vue, options) {
    Vue.prototype.$sheetStore = store
    //console.log('ok store')
  }
}