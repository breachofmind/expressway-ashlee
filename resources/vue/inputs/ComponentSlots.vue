<template>
	<div v-if="editing" class="al-input-group" :class="inputGroupClasses">
		<div class="al-input-label" v-if="! inline">
			<label :for="inputId">{{field.label}}</label>
		</div>
		<div class="al-input-component-slot" v-for="slot in value">
			<component :is="slot.component" :options="slot"></component>
		</div>
	</div>

	<div v-else>
		<span>{{value.length}}</span>
	</div>

</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "ComponentSlotsInput",
}
</script>