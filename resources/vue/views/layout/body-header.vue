<template>
	<header class="al-layout__body-header has-header-size row align-middle">

		<div class="al-layout__breadcrumbs small-6">
			<router-link to="/" class="al-nav__backwards">
				<icon name="navigation.arrow_back"></icon>
			</router-link>

			<div class="al-layout__page-title">
				<icon :name="icon"></icon>
				<h2>{{title}}</h2>
			</div>

			<slot name="breadcrumbs"></slot>
		</div>

		<div class="al-layout__page-actions small-6 button-group align-right">
			<slot name="actions"></slot>
		</div>


	</header>
</template>

<script>
	module.exports = {
	    props:['title','icon'],
	    name:"BodyHeader"
	}
</script>