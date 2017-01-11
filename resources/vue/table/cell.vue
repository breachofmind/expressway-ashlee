<template>
	<div class="al-td" :data-col="field.name">
		<component :is="'Input'+field.typeName" :record="record" :field="field" :definition="definition"></component>
	</div>
</template>

<script>
	module.exports = {
        name:"cms-table-cell",
        props:['record','field','column','definition'],
	}
</script>