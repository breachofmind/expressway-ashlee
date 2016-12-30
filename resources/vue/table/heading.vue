<template>
	<div class="ashlee-th">
		{{field.label}}
	</div>
</template>

<script>
	module.exports = {
	    name:"cms-table-heading",
		props:['field','column','definition'],
	}
</script>