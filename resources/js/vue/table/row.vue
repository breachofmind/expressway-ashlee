<template>
	<div class="al-tr" :data-id="record.id">
		<div class="al-td al-td-action" data-col="bulk" v-if="$parent.options.bulk">
			<input type="checkbox" v-model="record.$selected" @change="$emit('selected',record)">
		</div>
		<div class="al-td al-td-preview" data-col="preview" v-if="$parent.showPreview">
			<router-link :to="link">
				<img :src="preview" alt="Preview"/>
			</router-link>
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

	    name:"CMSTableRow",

		props:['record','index','definition'],

		computed: {
	        fields() {
	            return this.$parent.fields;
	        },
	        isBulk() {
	            return this.$parent.bulk;
	        },
			link() {
			    return "/"+[this.definition.slug,this.record.id].join("/");
			},
			preview() {
			    return this.record.$preview || this.definition.preview;
			}
		},
		methods: {

            /**
             * Delete a record in the table.
             */
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

		        }).catch(this.$api.errorHandler());
		    }
		},
		components: {
	        cell: require('./cell.vue'),
		}
	}
</script>