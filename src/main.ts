import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import ToastService from 'primevue/toastservice'
import router from './router'
import './style.css'
import App from './App.vue'
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import ConfirmDialog from 'primevue/confirmdialog';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)
app.use(ToastService)
app.use(PrimeVue, {
	ripple: true,
	theme: {
		preset: Aura,
	},
})

app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Card', Card);
app.component('ConfirmDialog', ConfirmDialog);

app.mount('#app')
