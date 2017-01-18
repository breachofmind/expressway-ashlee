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
					type="email"
			>
		</div>
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
}
</script>