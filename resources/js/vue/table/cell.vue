<template>
	<td class="data-table-td" :data-col="field.name" :class="classes">
		<component :is="'Input'+field.typeName" :record="record" :field="field" :definition="definition"></component>
	</td>
</template>

<script>
	module.exports = {

        name:"CMSTableCell",

        props:['record','field','column','definition'],

		computed: {
            classes()
            {
                var classes = ["is-type-"+this.field.typeName];
				if (this.definition.title == this.field.name) classes.push('is-title-field');
                return classes;
            }
		}
	}
</script>