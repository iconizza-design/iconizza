<template>
	<section>
		<h1>Vue attributes (components/VueAttributes.vue)</h1>
		<div>
			Icon with color (red):
			<Icon :icon="icon" color="red" :inline="true" />
		</div>
		<div>
			Icon size (2em):
			<IconizzaIcon icon="admin-users" height="2em" />
		</div>
		<div>
			Icon style as string (red):
			<IconizzaIcon icon="admin-users" style="color: red" />
		</div>
		<div>
			Inline icon with vertical-align style as string (aligned to top):
			<IconizzaIcon
				icon="admin-users"
				style="vertical-align: 0.25em"
				:inline="true"
			/>
		</div>
		<div>
			Inline icon with bound style as object (purple, 2em, no alignment):
			<IconizzaIcon
				icon="admin-users"
				v-bind:style="icon1StyleObj"
				:inline="true"
				color="green"
			/>
		</div>
		<div>
			Inline icon with bound style as string (purple, 2em, no alignment):
			<IconizzaIcon
				icon="admin-users"
				v-bind:style="icon1StyleStr"
				:inline="true"
				color="green"
			/>
		</div>
		<div>
			Combined styles (green, 2em, shadow):
			<IconizzaIcon
				icon="admin-users"
				v-bind:style="[boxShadowStyleObj, fontSizeStyleObj2]"
				:inline="true"
				color="green"
			/>
		</div>
		<div>
			Dynamic style (red / green, shadow):
			<IconizzaIcon
				icon="admin-users"
				v-bind:style="[boxShadowStyleObj, dynamicStyleObj]"
				:inline="true"
				v-on:click="
					dynamicStyleObj.color =
						dynamicStyleObj.color === 'red' ? 'green' : 'red'
				"
			/>&nbsp;(click it!)
		</div>
		<div>
			Dynamic style (shadow / color):
			<IconizzaIcon
				icon="admin-users"
				v-bind:style="[
					showShadow ? boxShadowStyleObj : dynamicStyleObj,
				]"
				:inline="true"
				v-on:click="showShadow = !showShadow"
			/>&nbsp;(click it!)
		</div>
		<div>
			Reference:
			<IconizzaIcon
				icon="admin-users"
				ref="icon1"
				@click="logReference"
			/>&nbsp;(click to log)
		</div>
	</section>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { Icon, addIcon } from '@iconizza/vue2';
import adminUsers from '@iconizza-icons/dashicons/admin-users';

addIcon('admin-users', adminUsers);

export default Vue.extend({
	components: {
		Icon,
	},
	data: () => {
		return {
			icon: adminUsers,
			icon1StyleObj: {
				fontSize: '2em',
				color: 'purple',
				verticalAlign: 0,
			},
			icon1StyleStr: 'color: purple; vertical-align: 0; font-size: 2em;',
			colorStyleStr: 'color: purple',
			colorStyleObj: {
				color: 'purple',
			},
			fontSizeStyleStr: 'font-size: 2em',
			fontSizeStyleObj: {
				fontSize: '2em',
			},
			fontSizeStyleObj2: {
				'font-size': '2em',
			},
			boxShadowStyleStr: 'box-shadow: 0 0 2px #000;',
			boxShadowStyleObj: {
				boxShadow: '0 0 2px #000',
			},
			dynamicStyleObj: {
				color: 'red',
			},
			showShadow: true,
		};
	},
	methods: {
		logReference: function () {
			console.log('References:', this.$refs);
		},
	},
});
</script>
