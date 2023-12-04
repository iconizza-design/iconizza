// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
	vue: {
		compilerOptions: {
			isCustomElement: (tag) => tag === 'iconizza-icon',
		},
	},
});
