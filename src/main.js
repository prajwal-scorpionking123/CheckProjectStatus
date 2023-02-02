import { createApp, h } from 'vue'
import "./style.css";
import App from "./App.vue";
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.bundle"
import "./assets/template.scss"


var vm = createApp({
    render: () => h(App),
  })
vm.$store = store
vm.$router = router
vm.use(store)
vm.use(router)

vm.mount("#app");
