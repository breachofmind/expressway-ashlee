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
					type="text"
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

    name: "SlugInput",

    mixins: [require('./_mixin')],

	created()
	{
	    this.$parent.$on('change', $cmp => {
	        if ($cmp.isTitle && (this.value == "" || ! this.value)) {
	            this.value = slugify(this.record[$cmp.field.name]);
	            this.$forceUpdate();
	        }
	    })
	},
};

/**
 * Converts text to a slug string.
 * @param text string
 * @returns {string}
 */
function slugify(text)
{
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}
</script>