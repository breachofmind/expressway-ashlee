<template>
	<div class="al-table-container" :class="{loading:loading}">
		<div class="al-table">
			<header class="al-thead">
				<div class="al-tr">
					<div class="al-th al-td-action" data-col="bulk" v-if="bulk">
						<input type="checkbox" v-model="checkAll" @change="selectAll($event)">
					</div>
					<heading v-for="(field,column) in fields"
					         :field="field"
					         :column="column"
					         :definition="definition">
					</heading>
					<div class="al-th al-td-action" data-col="bulk" v-if="opts"></div>
				</div>
			</header>

			<div class="al-tbody">
				<div class="al-tr callout primary" v-if="! populated && ! loading">
					No records found.
				</div>
				<row v-show="! loading" v-for="(record,index) in records"
				     @selected="selectRecord"
				     :record="record"
				     :index.number="index"
				     :definition="definition">
				</row>
			</div>

			<footer class="al-tfoot">

			</footer>
		</div>
		<div class="al-loader"><div class="al-loader-object"></div></div>
	</div>
</template>

<script>
	var LOAD_TIMEOUT = 300;

	module.exports = {
	    name: "cms-table",
		props: ['resource','objects','options'],
		data() {
		    return {
		        bulk: this.options.bulk || true,
		        opts: this.options.opts || true,
		        paging: {},
			    records: [],
		        loading: true,
			    checkAll: false,
		    }
		},
		mounted()
		{
		    if (! this.objects) this.refresh();
		},
		computed: {
			definition()
			{
			    if (! this.resource) return {};

			    return this.$store.state.loading ? {} : this.$store.state.objects[this.resource];
			},
			fields()
			{
                var fields = [];
			    if (this.$store.state.loading) return fields;

			    this.definition.fields.forEach(function(field) {
			        if (field.display) fields.push(field);
			    });
			    return fields;
			},
			populated()
			{
			    return ! this.loading && this.records.length;
			},
			selected()
			{
			    return this.records.reduce((a,b) => {
					if (b.$selected) return a.concat(b);
					return a.concat([]);
			    }, [])
			}
		},
		watch: {
	        definition(val) {
	            this.refresh();
	        }
		},
		methods: {
			refresh()
			{
			    if (! this.resource) return;

			    this.loading = true;
                this.$api.resource(this.resource).then(response =>
                {
                    setTimeout(() => {
                        var records = response.data;
                        // Attach a $selected boolean value to the record.
                        records.forEach(record => { record.$selected = false });
                        this.paging = response.pagination;
                        this.records = records;
                        this.loading = false;
                    }, LOAD_TIMEOUT)
                })
			},
			selectAll($event)
			{
                return this.records.forEach((record,index) => {
                    record.$selected = this.checkAll;
                });

			},
			selectRecord(record)
			{
			    //
			}
		},
		components:{
	        'row' : require('./row.vue'),
	        'heading' : require('./heading.vue')
		}
	}
</script>