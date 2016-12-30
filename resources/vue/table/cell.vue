<template>
	<div class="ashlee-td" :data-col="field">
		<component :is="'_'+field.type" :record="record" :field="field" :definition="definition"></component>
	</div>
</template>

<script>
	module.exports = {
	    name:"cms-table-cell",
		props:['record','field','column','definition'],
		components: {
	        _text: require('./types/text.vue'),
	        _email: require('./types/email.vue')
		}
	}
</script>