<template>
	<div class="l-data-table-outer" :class="{'is-loading':loading}" :data-resource="resource">

		<data-table-actions :checked="checked"></data-table-actions>

		<table class="data-table">
			<thead class="data-table-thead">
				<tr class="data-table-tr is-th-row">

					<th class="data-table-th is-td-thin is-td-center" data-col="bulk" v-if="options.bulk">
						<input class="data-table-cb" type="checkbox" v-model="checkAll" @change="selectAll($event)">
					</th>

					<th class="data-table-th is-td-preview is-td-center" data-col="preview" v-if="showPreview">
						<span>Preview</span>
					</th>

					<data-table-th v-for="(field,column) in fields"
					               :field="field"
					               :column="column"
					               :definition="model"
					               @sort="fetchData()">
					</data-table-th>

					<th class="data-table-th is-td-thin" data-col="menu" v-if="options.menu"></th>
				</tr>
			</thead>

			<tbody class="data-table-tbody">

				<tr class="data-table-tr is-empty-tr" v-if="! populated && ! loading">
					<td class="data-table-td is-empty-td" :colspan="columns.length">
						<span>No records found.</span>
					</td>
				</tr>

				<data-table-tr v-show="! loading" v-for="(record,index) in records"
				     @selected="selectRecord(record,index)"
				     :record="record"
				     :index.number="index"
				     :definition="model">
				</data-table-tr>

			</tbody>

			<tfoot class="data-table-tfoot"></tfoot>
		</table>

		<loader></loader>

	</div>
</template>

<script>
	var REFRESH_TIMEOUT = 300;

	module.exports = {
	    name: "DataTable",
		props: {
	        // The model slug.
	        "resource": {
	            type: String,
		        required: true,
	        },
			// Records to use.
			// Keep empty to return a list from the server.
	        "objects": {
	            type: [Array,Boolean],
		        default() {
	                return false;
		        }
	        },
			// Options for the table.
			"options": {
	            type: Object,
				default() {
	                return {
	                    bulk: true,
                        menu: true,
		                preview:true,
		                search: true,
	                }
				}
			}
		},

		data() {
		    return {
		        paging: {},
                searchParams: {
		            where: {},
		            sort: {}
			    },
			    checked: [],
			    records: [],
		        loading: true,
			    checkAll: false,
		    }
		},

		/**
		 * Add a default search parameter.
		 */
		created()
		{
            this.searchParams.sort[this.model.title] = 1;

            this.$store.subscribe((mutation, state) => {
                // If a form is saved with this table around, this table will refresh.
                if (mutation.type == 'tableUpdate' && mutation.payload == this.model.slug) {
                    this.fetchData();
                }
            });
		},
        /**
         * Refresh the table when mounted.
         * Use the given records or retrieve the records from the server.
         * @returns void
         */
		mounted()
		{

		    if (this.objects === false) {
		        return this.fetchData();
            }
            return this.records = this.objects;
		},

		computed: {
            /**
             * Return the model object given the resource slug.
             * @returns {Object}
             */
			model()
			{
				return this.$store.state.objects[this.resource];
			},
			/**
			 * Get the displayed fields for the table resource.
			 * @returns {Array}
			 */
			fields()
			{
                return this.model.getFields('display');
			},
			/**
			 * Check if the table is not loading and is populated with records.
			 * @returns {Boolean}
			 */
			populated()
			{
			    return this.records.length > 0;
			},
			/**
			 * Get the selected records.
			 * @returns {Array}
			 */
			selected()
			{
			    return this.records.reduce((a,b) => {
					if (b.$selected) return a.concat(b);
					return a.concat([]);
			    }, [])
			},
			/**
			 * Should the preview column be shown?
			 * @returns {Boolean}
			 */
			showPreview()
			{
			    return this.options.preview == true && this.model.preview;
			},

			/**
			 * Return the column field names.
			 * @returns {Array}
			 */
			columns()
			{
			    var columns = [];
			    var fields = this.fields.map(field => { return field.name });
			    if (this.options.bulk) columns.push('bulk');
			    if (this.showPreview) columns.push('preview');
			    return columns.concat(fields);
			}
		},
		watch: {
			/**
			 * When the model changes, refresh the table.
			 */
	        model() {
	            this.searchParams = {where:{}, sort:{[this.model.title]: 1}};
	            this.fetchData();
	        }
		},

		methods: {
            /**
             * Refresh the table records.
             * @returns void
             */
			fetchData()
			{
			    this.reset();
			    this.loading = true;
			    this.$api.search(this.resource,this.searchParams).then(response =>
			    {
                    setTimeout(() => {
                        this.paging = response.pagination;
                        this.records = response.data;
                        this.loading = false;

                    }, REFRESH_TIMEOUT)
			    });
			},

            /**
             * Select or unselect all records based on the checkAll value.
             * @param $event Event
             * @returns {*}
             */
			selectAll($event)
			{
			    if (! this.checkAll) {
			        return this.checked = [];
			    }
                return this.records.forEach(record => {
                    this.checked.push(record);
                });
			},
            /**
             * What to do when a record is selected.
             * @param record Object
             * @param index Number
             */
			selectRecord(record,index)
			{
				var checkedIndex = this.checked.indexOf(record);
                // Exists, remove it.
			    if (checkedIndex > -1) {
			        this.checked.splice(checkedIndex,1);
			    } else {
                    this.checked.push(record);
			    }
			},

            /**
             * Reset some properties on the table.
             */
			reset()
			{
			    this.checkAll = false;
			    this.checked = [];
			    this.$emit('reset');
			}
		},
		components:{
	        'data-table-tr' : require('./row.vue'),
	        'data-table-th' : require('./heading.vue'),
			'data-table-actions' : require('./actions.vue')
		}
	}
</script>