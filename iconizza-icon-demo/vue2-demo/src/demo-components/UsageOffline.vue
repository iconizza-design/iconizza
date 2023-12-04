<template>
	<section class="icon-24">
		<h1>Usage (full module, offline mode)</h1>
		<div>
			Icon referenced by name:
			<iconizza-icon icon="demo" />
		</div>
		<div>
			Icon referenced by object:
			<iconizza-icon v-bind:icon="demoIcon" />
		</div>
		<div>
			2 icons imported from icon set:
			<iconizza-icon icon="alert1" />
			<iconizza-icon icon="link1" />
		</div>
		<div class="alert">
			<iconizza-icon :icon="alertIcon" />Important notice with alert icon!
		</div>
	</section>
</template>

<script>
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
