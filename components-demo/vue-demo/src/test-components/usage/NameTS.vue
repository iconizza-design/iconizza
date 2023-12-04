<template>
	<Icon icon="customizer" height="20" :style="{ color: 'blue' }" />
</template>

<script lang="ts">
import { Icon, addIcon } from '@iconizza/vue/dist/offline';
import adminCustomizer from '@iconizza-icons/dashicons/admin-customizer';

addIcon('customizer', adminCustomizer);

export default {
	components: {
		Icon,
	},
};
</script>
