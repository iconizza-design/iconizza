<template>
	<Icon :icon="icons.chart" height="20" :style="{ color: 'green' }" />
</template>

<script>
import { Icon } from '@iconizza/vue/dist/offline';
import adminCustomizer from '@iconizza-icons/dashicons/admin-customizer';

export default {
	components: {
		Icon,
	},
	data() {
		return {
			icons: {
				chart: adminCustomizer,
			},
		};
	},
};
</script>
