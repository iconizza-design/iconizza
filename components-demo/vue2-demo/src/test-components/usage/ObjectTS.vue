<template>
	<Icon :icon="icons.chart" height="20" :style="{ color: 'red' }" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Icon } from '@iconizza/vue2';
import adminCustomizer from '@iconizza-icons/dashicons/admin-customizer';

export default Vue.extend({
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
});
</script>
