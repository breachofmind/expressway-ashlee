<template>
	<header class="al-component-slot-header row">
		<div class="column">
			<label>Name</label>
			<input type="text" v-model="options.name">
		</div>
		<div class="column">
			<label>ID</label>
			<input type="text" v-model="options.id">
		</div>
		<div class="column">
			<label>Classes</label>
			<input type="text" v-model="options.classes">
		</div>
		<div class="column">
			<button class="button link alert" @click.prevent="clickDelete()" title="Remove">
				<icon type="delete"></icon>
			</button>
		</div>
	</header>
</template>

<script>
module.exports = {
    name: "ComponentSlotHeader",
	props: ['options','index'],
	created()
	{
	    if (! this.options.name) this.options.name = "component_"+this.index;
	},
	methods: {
		clickDelete()
		{
		    this.$emit('delete');
		}
	}
}
</script>