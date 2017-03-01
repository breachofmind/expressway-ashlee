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
					type="password"
			>
		</div>
	</div>

	<div v-else>
		<span>***</span>
	</div>
</template>

<script>
var PASSWORD_REGEX = "^([0-9a-zA-Z!@#$%^&*()_+-=?~]+)$";
var PASSWORD_MIN = 6;
var PASSWORD_MAX = 14;

module.exports = {

    name: "PasswordInput",

    mixins: [require('./_mixin')],

	computed: {
        value() {
            return "";
        }
	}
}
</script>