<template>
	<header class="al-layout__header has-header-size row">

		<div class="al-header__logo align-middle">
			<img :src="logo" alt="logo">
		</div>

		<div class="al-header__search">
			<div class="al-input has-icon">
				<input type="search" class="al-app__search-input">
				<icon type="search"></icon>
			</div>
		</div>

		<div class="al-header__user">
			<current-user :user="$store.state.currentUser"></current-user>
		</div>

		<div class="al-header__help">
			<router-link to="/"><icon type="help"></icon></router-link>
		</div>

	</header>

</template>

<script>
	module.exports = {
        name:"Header",
	    props:['logo'],
		components: {
            'current-user' : require('../../current-user.vue'),
		}
	}
</script>