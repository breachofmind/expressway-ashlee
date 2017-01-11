<template>
	<li class="al-nav__group-link">
		<nav-link :label="model.plural" :to="model.slug" :icon="model.icon"></nav-link>
	</li>
</template>

<script>
	module.exports = {
	    name:"NavGroupLink",
		props:['resource'],
		computed: {
	        model() {
	            return this.$store.state.objects[this.resource];
	        }
		}
	}
</script>