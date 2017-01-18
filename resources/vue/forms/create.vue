<template>
	<form class="al-form__new" method="POST">

		<component
				:is="'Input'+field.typeName"
				:record="input" :field="field"
				:definition="model"
				:editing="true"
				@change="onChange"
				v-for="field in fields">
		</component>

		<div class="al-form__actions">
			<button class="button success has-icon loader" :disabled="submitting" :class="{loading:submitting}" @click.prevent="submit($event)">
				<icon type="loader"></icon>
				<span>Create</span>
			</button>
		</div>

	</form>
</template>

<script>
    var SUBMIT_TIMEOUT = 800;
	module.exports = {
		name: "CreateForm",
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
		        return this.model.getFields('required');
			},
		},
		created()
		{
		    this.fields.forEach(field => {
		        this.input[field.name] = null;
		    });
		},
        methods: {
			submit($event)
			{
			    this.submitting = true;

			    this.$api.post(this.model.slug, this.input).then(response =>
			    {
			        setTimeout(() => {
			            var createdObject = response.data.data;
                        this.$snack.success(this.model.singular+" created.");
                        this.$modal.close();
                        this.submitting = false;
                        this.$store.commit('formSaved', {
                            model: this.model,
	                        input: this.input
                        });
                        this.$store.commit('tableUpdate', this.model.slug);

                        // If we're on an interior route, push to the new page?
                        if (this.$route.params.id) {
                            this.$router.push({name:"edit", params: {model:this.model.slug, id:createdObject.id}});
                        }

			        }, SUBMIT_TIMEOUT)

			    }).catch(this.$api.errorHandler());
			},

			onChange(input)
			{
			    this.$emit('change', input);
			}
        }
    }
</script>