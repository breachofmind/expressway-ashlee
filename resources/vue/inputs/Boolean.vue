<template>
	<div v-if="editing" class="al-input-group" :class="inputGroupClasses">
		<div class="al-input-label" v-if="! inline">
			<label :for="inputId">{{field.label}}</label>
		</div>
		<div class="al-input-field">
			<input
					:id="inputId"
					:class="inputClasses"
					v-model="record[field.name]"
					:required="field.required"
					:name="field.name"
					type="checkbox"
			>
		</div>
	</div>

	<div v-else>
		<span>{{displayValue}}</span>
	</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "BooleanInput",
	computed: {
        displayValue() {
            return this.value ? "True" : "False"
        }
	}
}
</script>