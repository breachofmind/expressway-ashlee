<template>
	<form class="al-form__edit" method="PUT">

		<component
				:is="'Input'+field.typeName"
				:record="input" :field="field"
				:definition="model"
				:editing="true"
				@change="dirty=true"
				v-for="field in fields">
		</component>

	</form>
</template>

<script>
    var SUBMIT_TIMEOUT = 800;

	module.exports = {

		name: "EditForm",

        props:['options','input'],

		data: function() {
		    return {
		        submitting: false,
			    dirty: false,
		    }
		},

		computed: {
		    model() {
		        return this.options.model;
		    },
			fields() {
		        return this.model.getFields('fillable');
			},
		},
    }
</script>