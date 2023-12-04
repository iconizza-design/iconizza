<template>
	<section class="icon-24">
		<h1>Usage (offline mode)</h1>
		<div>
			Icons referenced by name (rendered as SVG, then as SPAN):
			<iconizza-icon icon="demo" /><iconizza-icon
				icon="demo"
				mode="style"
			/>
		</div>
		<div>
			Icons referenced by object:
			<iconizza-icon v-bind:icon="demoIcon" /><iconizza-icon
				v-bind:icon="demoIcon"
				mode="style"
			/>
		</div>
		<div>
			2 icons imported from icon set:
			<iconizza-icon icon="alert1" />
			<iconizza-icon icon="link1" mode="style" />
		</div>
		<div class="alert">
			<iconizza-icon :icon="alertIcon" mode="style" />Important notice with
			alert icon!
		</div>
	</section>
</template>

<script lang="ts">
import demoIcon from '@iconizza-icons/dashicons/info-outline';
import alertIcon from '@iconizza-icons/bx/bx-error';

export default {
	data() {
		return {
			demoIcon: JSON.stringify(demoIcon),
			alertIcon: JSON.stringify(alertIcon),
		};
	},
};
</script>
