<template>
	<section>
		<h1>Transformations (components/Transform.vue)</h1>
		<div>
			Default icon:
			<iconizza-icon icon="experiment" />
		</div>
		<div>
			Flip horizontally:
			<iconizza-icon icon="experiment" flip="horizontal" />
		</div>
		<div>
			Flip vertically:
			<iconizza-icon icon="experiment" flip="vertical" />
		</div>
		<div>
			Flip horizontally and vertically:
			<iconizza-icon icon="experiment" flip="horizontal,vertical" />
		</div>
		<div>
			90&deg; rotation:
			<iconizza-icon icon="experiment" rotate="1" />
			<iconizza-icon icon="experiment" rotate="90deg" />
			<iconizza-icon icon="experiment" rotate="25%" />
		</div>
		<div>
			180&deg; rotation:
			<iconizza-icon icon="experiment" rotate="2" />
			<iconizza-icon icon="experiment" rotate="180deg" />
			<iconizza-icon icon="experiment" rotate="50%" />
		</div>
		<div>
			270&deg; rotation:
			<iconizza-icon icon="experiment" rotate="3" />
			<iconizza-icon icon="experiment" rotate="270deg" />
			<iconizza-icon icon="experiment" rotate="-25%" />
		</div>
	</section>
</template>

<style scoped>
iconizza-icon {
	font-size: 20px;
	line-height: 1em;
}
</style>
