<template>
	<div class="al-currentuser">
		<div class="al-currentuser__info">
			<router-link :to="'user/'+user.id" class="al-currentuser__name">{{user.name}}</router-link>
		</div>

		<a href="#" class="al-currentuser__image">
			<img :src="user.$preview" alt="user gravatar">
		</a>

		<a href="/auth/logout" class="al-currentuser__logout" title="Log out">
			<icon type="logout"></icon>
		</a>

	</div>
</template>

<script>
	module.exports = {
	    name:"currentUser",
		props:['user']
	}
</script>