<template>
	<div class="al-layout__body al-view__edit">

		<layout-body-header :title="model.plural" :icon="model.icon" :to="'/'+model.slug">
			<template slot="actions">
				<a href="javascript:;" class="button link has-icon" @click="$modal.form('new',model.slug)">
					<icon type="create"></icon>
					<span>New</span>
				</a>
				<a href="javascript:;" class="button success has-icon loader" :class="{loading:saving}" :disabled="saving" @click="save()">
					<icon type="loader"></icon>
					<span>Save</span>
				</a>
			</template>
			<template slot="breadcrumbs">

				<icon name="navigation.arrow_back"></icon>

				<div class="al-breadcrumb">
					<input type="text" v-model="record[model.title]">
				</div>
			</template>
		</layout-body-header>


		<layout-page-container>

			<div class="al-layout__page has-card-shadow" v-if="! loading">
				<edit-form :input="record" :options="{model:model}"></edit-form>
			</div>
			<div v-else class="al-layout__body is-loading">
				<div class="al-loader"><div class="al-loader-object"></div></div>
			</div>
		</layout-page-container>

	</div>

</template>

<script>
	var UPDATE_TIMEOUT = 600;
	var LOAD_TIMEOUT = 300;

	module.exports = {
		name:"EditView",
		data() {
		    return {
		        loading: true,
		        record: false,
			    saving: false,
		    }
		},
		created()
		{
			this.fetchData();

		    // Listen for a Ctrl-S event.
            document.addEventListener('keydown', (event) => {
                if (event.which == 19 || (event.which == 115 && event.ctrlKey) || (event.which == 83 && event.metaKey)) {
                    event.preventDefault();
					this.save();
                }
            })
		},
		watch: {
		    "$route": function() {
		        this.fetchData();
		    }
		},
        computed: {
	        model() {
	            return this.$store.state.objects[this.$route.params.model];
	        },
	        link() {
	            return "/"+[this.model.slug,this.record.id].join("/");
	        }
        },
		methods: {
            /**
             * Save the form.
             */
		    save()
		    {
		        if (this.saving) return;

		        this.saving = true;

		        setTimeout(() => {
                    this.$api.put([this.model.slug, this.record.id], this.getFieldValues()).then(response =>
                    {
                        this.$snack.success('Updated!');

                    }).catch(this.$api.errorHandler()).then(() => {
                        this.saving = false;
                    });
		        }, UPDATE_TIMEOUT)

		    },
		    getFieldValues()
		    {
		        var out = {};
		        this.model.getFields('fillable').forEach(field => {
		            out[field.name] = this.record[field.name];
		        });
		        return out;
		    },

		    fetchData()
		    {
                this.loading = true;
                this.$api.resource(this.$route.params.model, this.$route.params.id).then(response => {
                    setTimeout(() => {
                        this.record = response.data;
                        this.loading = false;
                    },LOAD_TIMEOUT)
                });
		    }
		},
		components: {
		    'edit-form' : require('../forms/edit.vue')
		}
	}
</script>