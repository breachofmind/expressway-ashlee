<template>
	<div v-if="editing">
		<label :for="inputId" v-if="editing !== 'inline'">{{field.label}}</label>
		<input :id="inputId" v-validate :data-vv-rules="rules" :data-vv-as="field.label" type="email" v-model="record[field.name]" :name="field.name">
		<p v-show="v_errors.has(field.name)" class="al-input-error">
			{{ v_errors.first(field.name) }}
		</p>
	</div>
	<div v-else>
		<router-link v-if="isTitle" :to="link">{{value}}</router-link>
		<a v-else :href="'mailto:'+value">{{value}}</a>
	</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "EmailInput",
	created() {
        this.validationRules.push('email');
	},
}
</script>