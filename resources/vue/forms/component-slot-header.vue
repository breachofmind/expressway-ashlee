<template>
	<header class="al-component-slot-header">
		<div class="al-component-slot__name row">
			<label>Name</label>
			<input type="text" v-model="options.name" placeholder="Name">
		</div>
		<div class="al-component-slot__id row">
			<label>ID</label>
			<input type="text" v-model="options.id">
		</div>
		<div class="al-component-slot__classes row">
			<label>Classes</label>
			<input type="text" v-model="options.classes">
		</div>
		<div class="al-component-slot__action row">
			<button class="button link has-icon" @click.prevent="clickDelete()" title="Remove">
				<icon type="delete"></icon>
				<span>Remove</span>
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