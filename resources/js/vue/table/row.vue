<template>
	<tr class="data-table-tr" :data-uid="uid" :class="{'is-checked':isChecked}">
		<td class="data-table-td is-td-thin is-td-center" data-col="bulk" v-if="$parent.options.bulk">
			<input class="data-table-cb" type="checkbox" :checked="isChecked" @change="$emit('selected',record)">
		</td>

		<td class="data-table-td is-td-preview is-td-center" data-col="preview" v-if="$parent.showPreview">
			<router-link :to="link">
				<img :src="preview" alt="Preview"/>
			</router-link>
		</td>

		<data-table-td v-for="(field,column) in fields"
		      :record="record"
		      :field="field"
		      :column="column"
		      :definition="definition">
		</data-table-td>

		<td class="data-table-td is-td-thin is-td-center" data-col="menu" v-if="$parent.options.menu">
			<dropdown-menu ref="menu">
				<a href="javascript:;" class="is-danger" @click="deleteRecord()">
					<icon type="delete"></icon>
					<span>Delete</span>
				</a>
			</dropdown-menu>
		</td>
	</tr>

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
			isChecked() {
	            return this.$parent.checked.indexOf(this.record) > -1;
			},
			link() {
			    return "/"+[this.definition.slug,this.record.id].join("/");
			},
			preview() {
			    return this.record.$preview || this.definition.preview;
			},
			uid() {
	            return this.definition.slug + "/" + this.record.id;
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
		            this.$snack.success(response.data.message);
		            this.$store.commit('deleteRecord', {
		                model: this.definition,
			            objectId: id
		            });
		            this.$store.commit('tableUpdate', this.definition.slug);

		        }).catch(this.$api.errorHandler());
		    }
		},
		components: {
	        "data-table-td" : require('./cell.vue'),
		}
	}
</script>