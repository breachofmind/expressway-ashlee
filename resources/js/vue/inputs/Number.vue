<template>
	<div v-if="editing" class="al-input-group row" :class="inputGroupClasses">
		<div class="al-input-label column" v-if="! inline">
			<label :for="inputId">{{field.label}}</label>
		</div>
		<div class="al-input-field column">
			<input
					:id="inputId"
					:class="inputClasses"
					v-model="record[field.name]"
					:required="field.required"
					:name="field.name"
					@change="$emit('change')"
					type="number"
			>
		</div>
	</div>

	<div v-else>
		<span>{{value}}</span>
	</div>
</template>

<script>
module.exports = {

    name: "NumberInput",

    mixins: [require('./_mixin')],

}
</script>