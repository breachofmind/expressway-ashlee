<template>
	<div class="al-nav__group">
		<h3 class="al-nav__group-title">{{group.name}}</h3>
		<ul class="al-nav__group-links no-bullet">
			<li class="al-nav__group-link" v-for="object in group.objects">
				<nav-link :label="object.name" :to="object.slug" :icon="object.icon"></nav-link>
			</li>
		</ul>
	</div>
</template>

<script>
	module.exports = {
	    name:"navGroup",
		props:['group'],
	}
</script>