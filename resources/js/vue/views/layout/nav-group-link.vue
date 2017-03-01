<template>
	<li class="al-nav__group-link">
		<nav-link :label="model.plural" :to="link" :icon="model.icon"></nav-link>
	</li>
</template>

<script>
	module.exports = {
	    name:"NavGroupLink",
		props:['resource'],
		computed: {
	        model() {
	            return this.$store.state.objects[this.resource];
	        },
	        link() {
	            return "/" + [this.model.slug];
	        }
		}
	}
</script>