<template>
	<iconizza-icon :icon="icons.chart" height="20" :style="{ color: 'green' }" />
</template>

<script>
import adminCustomizer from '@iconizza-icons/dashicons/admin-customizer';

export default {
	data() {
		return {
			icons: {
				chart: JSON.stringify(adminCustomizer),
			},
		};
	},
};
</script>
