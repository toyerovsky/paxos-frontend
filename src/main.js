import {createApp} from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {loadFonts} from './plugins/webfontloader'
import VueAxios from "vue-axios";
import axios from 'axios'

loadFonts()

createApp(App)
    .use(vuetify)
    .use(VueAxios, axios)
    .mount('#app')
