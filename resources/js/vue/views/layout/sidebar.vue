<template>
	<aside class="al-layout__sidebar">
		<div class="al-layout__sidebar-header has-header-size">
			<nav-link label="Dashboard" to="/" icon="action.dashboard"></nav-link>
		</div>

		<div class="al-nav__groups">
			<nav-group v-for="group in $store.state.groups" :group="group"></nav-group>
		</div>

	</aside>
</template>

<script>
	module.exports = {
	    name:"Sidebar",
		components: {
            'nav-group' : require('./nav-group.vue'),
		}
	}
</script>