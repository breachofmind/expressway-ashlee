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
					@change="changeInput()"
					type="text"
			        :placeholder="field.default"
			>
		</div>
	</div>

	<div v-else>
		<router-link v-if="isTitle" :to="link">{{value}}</router-link>
		<span v-else>{{value}}</span>
	</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "TextInput",
	created()
	{
	    if (this.editing && ! this.value) {
	        this.value = this.field.default;
	    }
	},
	methods: {
        changeInput()
        {
            this.$emit('change', this);
        }
	}
};
</script>