import {RouteLocationRaw, RouteLocationNormalized} from 'vue-router'
import {auth} from '../firebase'
import {set} from '../store'
import {cached, cacheUser} from '../store/cache'

export function beforeEach(
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
): RouteLocationRaw | boolean {
	const requiresAuth = to.matched.some((x) => x.meta.requiresAuth)
	console.log('before this route', to)
	console.log('user authd?', cached.uid)
	if (requiresAuth && !cached.uid) {
		console.log('need auth and no user signed in')
		console.log('coming in from path', from.path)
		console.log('window.location.pathname', window.location.pathname)
		const loginPath = from.path || window.location.pathname
		return {name: 'login', query: {from: loginPath}}
	}

	if (auth.isSignInWithEmailLink(window.location.href)) {
		console.log('coming in from a magic link')
		console.log('checking for cached email', cached.email)
		if (!cached.email) {
			console.warn('different device than last sign-in,  need to sign in here.')
			return {
				name: 'login',
				query: {from: to.path},
				replace: true,
			}
		}
		auth
			.signInWithEmailLink(cached.email, window.location.href)
			.then((result) => {
				if (result.user) {
					console.log('user signed in!', result.user)
					cacheUser(result.user)
				}
				if (result.additionalUserInfo) {
					console.log('user is new', result.additionalUserInfo.isNewUser)
					// can trigger onboarding flow here
					set('beeny', false)
				}
				console.log('logged in successfully to', to)

				return {name: 'home', replace: true}
			})
			.catch((error) => {
				console.error(
					"couldn't complete email link sign-in due to invalid email and invalid or expired OTPs",
					error,
				)
				return false
			})
	}
	// no auth needed
	return true
}

export function oracleGuard(): RouteLocationRaw {
	console.log('guarding the oracle')
	if (cached.query) return {name: 'cast'}
	else return {name: 'query'}
}

export function changeGuard(to: RouteLocationNormalized): RouteLocationRaw | boolean {
	const id =
		typeof to.params.id === 'string'
			? parseInt(to.params.id, 10)
			: parseInt(to.params.id.join(''), 10)
	if (id < 1 || id > 64) {
		return {name: 'not-found'}
	} else return true
}
