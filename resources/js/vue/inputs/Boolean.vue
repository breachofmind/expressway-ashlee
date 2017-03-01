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
					type="checkbox"
			>
		</div>
	</div>

	<div v-else>
		<icon :name="displayIcon"></icon>
	</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "BooleanInput",
	computed: {
        displayIcon() {
            return this.value ? "toggle.check_box" : "toggle.check_box_outline_blank";
        }
	}
}
</script>