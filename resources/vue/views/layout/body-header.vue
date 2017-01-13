<template>
	<header class="al-layout__body-header has-header-size row align-middle">

		<div class="al-layout__title small-6">
			<div class="al-layout__page-title">
				<router-link to="/" class="al-nav__backwards">
					<icon name="navigation.arrow_back"></icon>
				</router-link>

				<router-link :to="to" class="al-page-title">
					<icon :name="icon"></icon>
					<h2>{{title}}</h2>
				</router-link>
			</div>

			<div class="al-layout__breadcrumbs">
				<slot name="breadcrumbs"></slot>
			</div>

		</div>

		<div class="al-layout__page-actions small-6 button-group align-right">
			<slot name="actions"></slot>
		</div>


	</header>
</template>

<script>
	module.exports = {
	    props:['title','icon','to'],
	    name:"BodyHeader"
	}
</script>