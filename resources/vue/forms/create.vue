<template>
	<form class="al-form__new" method="POST">

		<component
				:is="'Input'+field.typeName"
				:record="input" :field="field"
				:definition="model"
				:editing="true"
				@change="dirty=true"
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
		        return this.model.getFields('fillable');
			},
		},
        methods: {
			submit($event)
			{
			    this.submitting = true;
			    this.$api.post(this.model.slug, this.input).then(response => {
			        setTimeout(() => {
                        this.$snack.success(this.model.singular+" created.");
                        this.$modal.close();
                        this.submitting = false;
                        this.$store.commit('formSaved', {
                            model: this.model,
	                        input: this.input
                        });
                        this.$store.commit('tableUpdate', this.model.slug);

			        }, SUBMIT_TIMEOUT)

			    }).catch(this.$api.errorHandler());
			}
        }
    }
</script>