<template>
	<div class="al-layout__body">
		<header class="al-layout__body-header has-header-size row align-middle">

			<div class="al-layout__breadcrumbs small-6">
				<router-link to="/" class="al-nav__backwards">
					<icon name="navigation.arrow_back"></icon>
				</router-link>

				<div class="al-layout__page-title">
					<icon name="action.dashboard"></icon>
					<h2>Dashboard</h2>
				</div>
			</div>

			<div class="al-layout__page-actions small-6 button-group align-right">

			</div>

		</header>

		<div class="al-layout__page-container">
			<div class="al-layout__page has-card-shadow">
				<h1>Home</h1>
			</div>
		</div>
	</div>
</template>

<script>
    module.exports = {
		name:"HomeView"
    }
</script>