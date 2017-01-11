<template>
	<div v-if="editing">
		<label v-if="editing !== 'inline'" :for="inputId">{{field.label}}</label>
		<input :id="inputId" v-validate :data-vv-rules="rules" :data-vv-as="field.label" type="password" v-model="record[field.name]" :name="field.name">
		<p v-show="v_errors.has(field.name)" class="al-input-error">
			{{ v_errors.first(field.name) }}
		</p>
	</div>
	<div v-else>
		***
	</div>
</template>

<script>
var PASSWORD_REGEX = "^([0-9a-zA-Z!@#$%^&*()_+-=?~]+)$";
var PASSWORD_MIN = 6;
var PASSWORD_MAX = 14;

module.exports = {
    mixins: [require('./_mixin')],
    name: "PasswordInput",
	computed: {
        value() {
            return "";
        }
	},
	created() {
        this.validationRules.push('regex:'+PASSWORD_REGEX);
        this.validationRules.push('min:'+PASSWORD_MIN);
        this.validationRules.push('max:'+PASSWORD_MAX);
	}
}
</script>