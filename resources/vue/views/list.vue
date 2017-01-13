<template>
	<div class="al-layout__body">

		<layout-body-header :title="model.plural" :icon="model.icon" :to="'/'+model.slug">
			<template slot="actions">
				<a href="javascript:;" class="button success has-icon" @click="$modal.form('new', model.slug)">
					<icon type="create"></icon>
					<span>New</span>
				</a>
			</template>
		</layout-body-header>


		<layout-page-container>
			<div class="al-layout__page has-card-shadow">
				<cms-table :resource="model.slug"></cms-table>
			</div>
		</layout-page-container>

	</div>
</template>

<script>
    module.exports = {
        name:"ListView",
		computed: {
		    model() {
                return this.$store.state.objects[this.$route.params.model];
		    }
		},
		components: {
            'cms-table' : require('../table/table.vue'),
		}
    }
</script>