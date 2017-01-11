<template>
	<div v-if="editing">
		<label v-if="editing !== 'inline'" :for="inputId">{{field.label}}</label>
		<input :id="inputId" v-validate :data-vv-rules="rules" :data-vv-as="field.label" type="text" v-model="record[field.name]" :name="field.name">
		<p v-show="v_errors.has(field.name)" class="al-input-error">
			{{ v_errors.first(field.name) }}
		</p>
	</div>
	<div v-else>
		<router-link v-if="isTitle" :to="link">{{value}}</router-link>
		<div v-else>{{value}}</div>
	</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "TextInput",
	computed: {

	}
}
</script>