<template>
	<div class="al-td" :data-col="field.name">
		<component :is="'input_'+field.type" :record="record" :field="field" :definition="definition"></component>
	</div>
</template>

<script>
	var types = ['text','url','email','slug','bool'];

	var component = {
	    name:"cms-table-cell",
        props:['record','field','column','definition'],
		components:{}
	};
	types.forEach(type => {
	    component.components["input_"+type] = require('./types/'+type+".vue");
	});
	module.exports = component;
</script>