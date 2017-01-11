<template>
	<div class="al-layout__body">
		<header class="al-layout__body-header has-header-size row align-middle">

			<div class="al-layout__breadcrumbs small-6">
				<router-link to="/" class="al-nav__backwards">
					<icon name="navigation.arrow_back"></icon>
				</router-link>

				<div class="al-layout__page-title">
					<icon :name="model.icon"></icon>
					<h2>{{model.name}} List</h2>
				</div>
			</div>

			<div class="al-layout__page-actions small-6 button-group align-right">
				<a href="javascript:;" class="button success al-page-action" @click="$modal.form('new', model.slug)">
					<icon type="create"></icon>
					<span>New</span>
				</a>
			</div>

		</header>

		<div class="al-layout__page-container">
			<div class="al-layout__page has-card-shadow">
				<cms-table :resource="model.slug" options="{bulk:true}"></cms-table>
			</div>
		</div>
	</div>
</template>

<script>
    module.exports = {
		computed: {
		    model() {
		        if (this.$store.state.loading) {
		            return {};
		        }
                return this.$store.state.objects[this.$route.params.model];
		    }
		},
		components: {
            'cms-table' : require('../table/table.vue'),
		}
    }
</script>