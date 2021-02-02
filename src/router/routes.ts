import {changeGuard} from './guards'
import Home from '../views/Home.vue'
import Oracle from '../components/Oracle.vue'
import About from '../views/About.vue'
import Config from '../views/Config.vue'
import Journal from '../views/Journal.vue'
import Login from '../views/Login.vue'
import Gratitude from '../views/Gratitude.vue'
import Change from '../views/Change.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
	},
	{
		path: '/oracle',
		name: 'oracle',
		component: Oracle,
	},
	{
		path: '/about',
		name: 'about',
		component: About,
	},
	{
		path: '/config',
		name: 'config',
		component: Config,
	},
	{
		path: '/journal',
		name: 'journal',
		component: Journal,
		meta: {requiresAuth: true},
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
	},
	{
		path: '/gratitude',
		name: 'gratitude',
		component: Gratitude,
	},
	{
		path: '/change/:id',
		name: 'change',
		component: Change,
		props: true,
		beforeEnter: changeGuard,
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'not-found',
		component: NotFound,
	},
]

export default routes
