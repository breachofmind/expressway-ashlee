<template>
	<div class="al-table-container" :class="{loading:loading}">
		<div class="al-table">
			<header class="al-thead">
				<div class="al-tr">
					<div class="al-th al-td-action" data-col="bulk" v-if="options.bulk">
						<input type="checkbox" v-model="checkAll" @change="selectAll($event)">
					</div>

					<heading v-for="(field,column) in fields"
					         :field="field"
					         :column="column"
					         :definition="model"
					         @sort="fetchData()"
					>
					</heading>

					<div class="al-th al-td-action" data-col="menu" v-if="options.menu"></div>

				</div>
			</header>

			<div class="al-tbody">

				<div class="al-tr al-table-empty" v-if="! populated && ! loading">
					<span>No records found.</span>
				</div>

				<row v-show="! loading" v-for="(record,index) in records"
				     @selected="selectRecord(record,index)"
				     :record="record"
				     :index.number="index"
				     :definition="model">
				</row>
			</div>

			<footer class="al-tfoot">

			</footer>
		</div>

		<div class="al-loader"><div class="al-loader-object"></div></div>
	</div>
</template>

<script>
	var REFRESH_TIMEOUT = 300;

	module.exports = {
	    name: "CMSTable",
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
			    this.checkAll = false;
			    this.loading = true;
			    this.$api.search(this.resource,this.searchParams).then(response => {
                    // Attach a $selected boolean value to the record.
                    response.data.forEach(record => { record.$selected = false });

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
                return this.records.forEach((record,index) => {
                    record.$selected = this.checkAll;
                });
			},
            /**
             * What to do when a record is selected.
             * @param record Object
             * @param index Number
             */
			selectRecord(record,index)
			{
			    console.log(record,index);
			}
		},
		components:{
	        'row' : require('./row.vue'),
	        'heading' : require('./heading.vue')
		}
	}
</script>