import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import '@/scss/custom.scss'
import '@/css/main.css'

let bootstrap = require('bootstrap');
Vue.prototype.$bootstrap = bootstrap

require('./vee-validate')

// vuex
import Vuex from 'vuex'

Vue.use(Vuex)
import store from './store'

// Repository Config
import Axios from "./repositories/clients/Axios";
import {repository} from './repositories/RepositoryFactory'

Vue.prototype.$repository = repository(Axios); // Global variable to access repositories
// End of Repository Config

Vue.filter('formatDate', function (value) {
    if (value) {
        return moment(String(value)).fromNow()
    }
})

Vue.filter('formatDateWithMonth', function (value) {
    if (value) {
        return moment(String(value)).format('Do MMMM, YYYY');
    }
})

Vue.mixin({
    methods: {
        slugMaker: function (string) {
            string = string.replace(/^\s+|\s+$/g, ''); // trim
            string = string.toLowerCase();

            // remove accents, swap ñ for n, etc
            let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
            let to = "aaaaeeeeiiiioooouuuunc------";
            for (let i = 0, l = from.length; i < l; i++) {
                string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }

            string = string.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                .replace(/\s+/g, '-') // collapse whitespace and replace by -
                .replace(/-+/g, '-'); // collapse dashes

            return string;
        }
    }
})

import VueLayers from 'vuelayers'
import 'vuelayers/dist/vuelayers.min.css' // needs css-loader

Vue.use(VueLayers)

// vue select
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)

import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';

Vue.component('v-multiselect', Multiselect)

// vue random color
import VueRandomColor from 'vue-randomcolor'

Vue.use(VueRandomColor)

Vue.config.productionTip = false

// highcharts
import Highcharts from "highcharts";
import Stock from "highcharts/modules/stock";

Stock(Highcharts);
import HighchartsVue from 'highcharts-vue'

Vue.use(HighchartsVue)
Vue.prototype.$highcharts = Highcharts;

// confirm dialog
import VueConfirmDialog from 'vue-confirm-dialog'

// vue toast notification
import VueToast from 'vue-toast-notification';
// Import one of the available themes
// import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueToast, {
    position: 'top-right',
    duration: 5000,
    dismissible: true
});

Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
