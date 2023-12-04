<template>
	<iconizza-icon :icon="icons.chart" height="20" :style="{ color: 'red' }" />
</template>

<script lang="ts">
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
