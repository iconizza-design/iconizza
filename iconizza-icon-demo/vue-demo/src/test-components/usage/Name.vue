<template>
	<iconizza-icon icon="customizer" height="20" :style="{ color: 'purple' }" />
</template>

<script>
import { addIcon } from 'iconizza-icon';
import adminCustomizer from '@iconizza-icons/dashicons/admin-customizer';

addIcon('customizer', adminCustomizer);
</script>
