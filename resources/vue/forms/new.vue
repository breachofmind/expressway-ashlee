<template>
	<form class="al-form__new">
		<div class="input-component" v-for="field in fields">
			<component :is="'Input'+field.typeName" :record="input" :field="field" :definition="model" :editing="true"></component>
		</div>
		<button class="button" :disabled="false">Submit</button>
	</form>
</template>

<script>
	module.exports = {
		name: "FormNew",
        props:['options','input'],
		data: function() {
		    return {
		        formFields: []
		    }
		},
		computed: {
		    model() {
		        return this.options.model;
		    },
			fields() {
		        var fields = [];
		        this.model.fields.forEach(field => {
		            if (field.fillable) fields.push(field);
		        });
				return fields;
			},
		},
        methods: {
		    validate() {
                var valid = true;
                this.formFields.forEach(component => {
                    if (! component.v_fields || ! valid) return;
                    var validator = component.v_fields.fields[component.field.name];
                    if (validator && ! validator.valid) valid = false;
                });
                return valid;
		    },
        }
    }
</script>