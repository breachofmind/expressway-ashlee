<template>
	<div class="al-tr" :data-id="record.id">
		<div class="al-td al-td-action" data-col="bulk" v-if="$parent.options.bulk">
			<input type="checkbox" v-model="record.$selected" @change="$emit('selected',record)">
		</div>
		<cell v-for="(field,column) in fields"
		      :record="record"
		      :field="field"
		      :column="column"
			  :definition="definition">
		</cell>
		<div class="al-td al-td-action" data-col="menu" v-if="$parent.options.menu">
			<dropdown-menu ref="menu">
				<a href="javascript:;" class="is-danger" @click="deleteRecord()">
					<icon type="delete"></icon>
					<span>Delete</span>
				</a>
			</dropdown-menu>
		</div>
	</div>
</template>

<script>
	module.exports = {
	    name:"cms-table-row",
		props:['record','index','definition'],
		computed: {
	        fields() {
	            return this.$parent.fields;
	        },
	        isBulk() {
	            return this.$parent.bulk;
	        },
		},
		methods: {
		    deleteRecord()
		    {
		        var id = this.record.id;
                this.$refs.menu.toggle(false);
		        this.$api.delete([this.definition.slug, this.record.id]).then(response => {
		            this.$snack.success(this.definition.singular+" deleted.");
		            this.$store.commit('deleteRecord', {
		                model: this.definition,
			            objectId: id
		            });
		            this.$store.commit('tableUpdate', this.definition.slug);

		        }).catch(err => {
		            var response = err.response.data;
		            this.$snack.alert(response.error.message);
		        });
		    }
		},
		components: {
	        cell: require('./cell.vue'),
		}
	}
</script>