<template>
	<section>
		<h1>Style (components/Style.vue)</h1>
		<div>
			Default icon:
			<iconizza-icon icon="demo" />
		</div>
		<div>
			Red color:
			<iconizza-icon
				icon="demo"
				inline
				:style="{ color: 'red', verticalAlign: 0 }"
			/>
			<iconizza-icon
				icon="demo"
				inline
				style="color: red; vertical-align: 0"
			/>
			<Icon icon="demo" :style="redIcon" />
		</div>
		<div>
			40px:
			<iconizza-icon icon="demo" height="40" />
			<iconizza-icon icon="demo" width="40" />
			<iconizza-icon
				icon="demo"
				inline
				:style="{ fontSize: '40px', verticalAlign: 0 }"
			/>
			<iconizza-icon icon="demo" style="font-size: 40px" />
			<iconizza-icon icon="demo" :style="bigIcon" />
		</div>
		<div>
			Red and 40px:
			<iconizza-icon icon="demo" height="40" style="color: red" />
			<iconizza-icon icon="demo" width="40" :style="redIcon" />
			<iconizza-icon
				icon="demo"
				:style="{ color: 'red', fontSize: '40px' }"
			/>
			<iconizza-icon icon="demo" style="color: red; font-size: 40px" />
			<iconizza-icon icon="demo" :style="[bigIcon, redIcon]" />
		</div>
	</section>
</template>

<script lang="ts">
export default {
	data: () => {
		return {
			redIcon: {
				color: 'red',
			},
			bigIcon: {
				fontSize: '40px',
			},
		};
	},
};
</script>
