<template>
	<div class="ashlee-table-container">
		<div class="ashlee-table">
			<header class="ashlee-thead">
				<div class="ashlee-tr">
					<div class="ashlee-th" data-col="bulk" v-if="bulk">
						<input type="checkbox" v-model="checkAll" @change="selectAll($event)">
					</div>
					<heading v-for="(field,column) in fields"
					         :field="field"
					         :column="column"
					         :definition="definition">
					</heading>
					<div class="ashlee-th" data-col="bulk" v-if="opts"></div>
				</div>
			</header>

			<div class="ashlee-tbody">
				<div class="ashlee-tr callout primary" v-if="! populated">
					No records found.
				</div>
				<row v-for="(record,index) in records"
				     @selected="selectRecord"
				     :record="record"
				     :index.number="index"
				     :definition="definition">
				</row>
			</div>

			<footer class="ashlee-tfoot">

			</footer>
		</div>
	</div>
</template>

<script>
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
			    return this.$store.state.loading ? {} :this.$store.state.definitions[this.resource];
			},
			fields()
			{
			    return this.$store.state.loading ? [] : this.definition.fields;
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
		methods: {
			refresh()
			{
			    this.loading = true;
                this.$api.resource(this.resource).then(response =>
                {
                    var records = response.data;
                    // Attach a $selected boolean value to the record.
                    records.forEach(record => { record.$selected = false });
                    this.paging = response.pagination;
                    this.records = records;
                    this.loading = false;
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