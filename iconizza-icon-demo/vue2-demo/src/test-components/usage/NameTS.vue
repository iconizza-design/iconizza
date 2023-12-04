<template>
	<iconizza-icon icon="customizer" height="20" :style="{ color: 'blue' }" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { addIcon } from 'iconizza-icon';
import adminCustomizer from '@iconizza-icons/dashicons/admin-customizer';

addIcon('customizer', adminCustomizer);
</script>
