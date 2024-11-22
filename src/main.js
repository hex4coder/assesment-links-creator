import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import LoadScript from 'vue-plugin-load-script';
import {loadScript} from 'vue-plugin-load-script'


{/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js"></script> */}



const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(LoadScript)
loadScript("https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js")
loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/jszip.js")
loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.js")
loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.1/xlsx.full.min.js")
app.mount('#app')
