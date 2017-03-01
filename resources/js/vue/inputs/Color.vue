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
					type="text"
			>
		</div>
	</div>

	<div v-else>
		<div :style="style" class="al-color-swatch"></div>
	</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "ColorInput",
	computed: {
        style() {
            return "background-color: "+this.value+";";
        }
	}
}
</script>