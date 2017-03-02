<template>
	<div class="l-data-table-actions row collapse-outer">
		<div class="column medium-3 l-data-table-bulk" v-if="$parent.options.bulk">
			<div class="input-group" :class="{'is-ghosted': ! checked.length}">
				<select class="input-group-field" v-model="bulkSelectOption" :disabled="! checked.length">
					<option value="">Bulk Action...</option>
					<option value="delete">Delete</option>
				</select>
				<div class="input-group-button">
					<button class="button primary" :disabled="! bulkSelectOption || ! checked.length" @click="doBulkAction">
						<icon type="check"></icon>
					</button>
				</div>
			</div>
		</div>
		<div class="column medium-3">

		</div>
		<div class="column medium-6 l-data-table-search" v-if="$parent.options.search">
			<div class="data-table-search">
				<input type="search" v-model="searchInput" placeholder="Search..." disabled>
			</div>
		</div>
	</div>
</template>

<script>
    var BULK_ACTIONS = {
        "delete" : function(records)
        {
            var ids = records.map(record => { return record.id });
            this.$api.delete(this.resource, {data: {ids: ids}}).then(response => {
                this.$snack.success(response.data.message);
                this.fetchData();
            }).catch(err => {
                this.$snack.alert(err.response.data.message);
            });
        }
    };

	module.exports = {

	    name:"DataTableActions",

		props:['checked'],

		data: function()
		{
		    return {
		        searchInput: "",
			    bulkSelectOption: ""
		    }
		},

		created: function()
		{
		    this.$parent.$on('reset', () => {
		        this.reset();
		    })
		},

		computed: {

		},
		methods: {
            /**
             * Click event to perform the selected bulk action.
             * @returns void
             */
            doBulkAction()
            {
                var action = BULK_ACTIONS[this.bulkSelectOption];

                action.call(this.$parent,this.checked);

                this.$emit('bulk', this.bulkSelectOption, this.checked);
            },

            /**
             * Reset some of the form fields.
             * @returns void
             */
			reset()
			{
			    this.bulkSelectOption = "";
			    this.searchInput = "";
			}
		}
	}
</script>