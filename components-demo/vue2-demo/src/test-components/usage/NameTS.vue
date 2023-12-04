<template>
	<Icon icon="customizer" height="20" :style="{ color: 'blue' }" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Icon, addIcon } from '@iconizza/vue2';
import adminCustomizer from '@iconizza-icons/dashicons/admin-customizer';

addIcon('customizer', adminCustomizer);

export default Vue.extend({
	components: {
		Icon,
	},
});
</script>
