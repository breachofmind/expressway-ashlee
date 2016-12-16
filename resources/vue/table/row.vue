<template>
	<div class="ashlee-tr">
		<div class="ashlee-td" data-col="bulk" v-if="$parent.bulk">
			<input type="checkbox" v-model="record.$selected" @change="$emit('selected',record)">
		</div>
		<cell v-for="(field,column) in fields"
		      :record="record"
		      :field="field"
		      :column="column"
			  :definition="definition">
		</cell>
		<div class="ashlee-td" data-col="opts" v-if="$parent.opts">
			<a href="#"><icon name="navigation.more_horiz"></icon></a>
		</div>
	</div>
</template>

<script>
	module.exports = {
	    name:"cms-table-row",
		props:['record','index','definition'],
		computed: {
	        fields() {
	            return this.definition.fields;
	        },
	        isBulk() {
	            return this.$parent.bulk;
	        },
		},
		components: {
	        cell: require('./cell.vue'),
		}
	}
</script>