<template>
	<div class="ashlee-td" :data-col="field">
		<a href="#" v-if="isTitle">{{value}}</a>
		<span v-else>{{value}}</span>
	</div>
</template>

<script>
	module.exports = {
	    name:"cms-table-cell",
		props:['record','field','column','definition'],
		computed: {
	        value() {
	            return this.record[this.field];
	        },
			isTitle()
			{
			    return this.definition.title == this.field;
			}
		}
	}
</script>