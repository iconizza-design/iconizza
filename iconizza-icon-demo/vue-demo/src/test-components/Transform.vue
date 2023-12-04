<template>
	<section>
		<h1>Transformations (components/Transform.vue)</h1>
		<div>
			Default icon:
			<iconizza-icon icon="demo" />
		</div>
		<div>
			Flip horizontally:
			<iconizza-icon icon="demo" flip="horizontal" />
		</div>
		<div>
			Flip vertically:
			<iconizza-icon icon="demo" flip="vertical" />
		</div>
		<div>
			Flip horizontally and vertically:
			<iconizza-icon icon="demo" flip="horizontal,vertical" />
		</div>
		<div>
			90&deg; rotation:
			<iconizza-icon icon="demo" rotate="1" />
			<iconizza-icon icon="demo" rotate="90deg" />
			<iconizza-icon icon="demo" rotate="25%" />
		</div>
		<div>
			180&deg; rotation:
			<iconizza-icon icon="demo" rotate="2" />
			<iconizza-icon icon="demo" rotate="180deg" />
			<iconizza-icon icon="demo" rotate="50%" />
		</div>
		<div>
			270&deg; rotation:
			<iconizza-icon icon="demo" rotate="3" />
			<iconizza-icon icon="demo" rotate="270deg" />
			<iconizza-icon icon="demo" rotate="-25%" />
		</div>
	</section>
</template>

<style scoped>
iconizza-icon {
	font-size: 20px;
	line-height: 1em;
}
</style>
