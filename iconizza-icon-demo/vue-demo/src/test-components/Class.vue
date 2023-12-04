<template>
	<section>
		<h1>Class (components/Class.vue)</h1>
		<div>
			Default icon:
			<iconizza-icon icon="demo" />
		</div>
		<div>
			Red color:
			<iconizza-icon icon="demo" class="red-color" />
			<iconizza-icon icon="demo" :class="redClass" />
		</div>
		<div>
			Red color and 20px:
			<iconizza-icon icon="demo" class="red-color big-icon" />
			<iconizza-icon icon="demo" :class="[redClass, bigIcon]" />
		</div>
	</section>
</template>

<script lang="ts">
export default {
	data: () => {
		return {
			redClass: 'red-color',
			bigIcon: 'big-icon',
		};
	},
};
</script>

<style>
.red-color {
	color: red;
}
.big-icon {
	font-size: 20px;
}
</style>
