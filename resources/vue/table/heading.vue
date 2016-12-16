<template>
	<div class="ashlee-th">
		{{label}}
	</div>
</template>

<script>
	module.exports = {
	    name:"cms-table-heading",
		props:['field','column','definition'],
		data() {
	        return {
	            checkAll: false
	        }
		},
		computed: {
            label() {
                return this.definition.labels[this.field] || this.field;
	        }
		}
	}
</script>