<template>
	<div class="al-nav__group">
		<h3 class="al-nav__group-title">{{group.name}}</h3>
		<ul class="al-nav__group-links no-bullet">
			<nav-group-link :resource="object" v-for="object in group.objects"></nav-group-link>
		</ul>
	</div>
</template>

<script>
	module.exports = {
	    name:"NavGroup",
		props:['group'],
		components: {
	        'nav-group-link' : require('./nav-group-link.vue')
		}
	}
</script>