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
					@change="$emit('change')"
					type="text"
			>
		</div>
	</div>

	<div v-else>
		<router-link v-if="isTitle" :to="link">{{value}}</router-link>
		<div v-else>
			<a :href="value" target="_blank"><icon type="link" class="is-inline"></icon></a>
			<span>{{value}}</span>
		</div>
	</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "URLInput",
}
</script>