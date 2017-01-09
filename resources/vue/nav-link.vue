<template>
	<router-link :to="to" class="al-nav__link">
		<icon v-if="icon" :name="icon"></icon>
		<span>{{label}}</span>
	</router-link>
</template>

<script>
	module.exports = {
	    name:"navLink",
		props:['icon','to','label']
	}
</script>