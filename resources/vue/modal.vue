<template>
	<transition name="modal">
		<div class="modal-mask" v-show="visible">
			<div class="modal-wrapper" @click.self="close($event)">
				<div class="modal-container" :class="classes">
					<a href="javascript:;" class="modal-close-button" @click="close($event)">
						<icon name="navigation.close"></icon>
					</a>
					<header class="modal-header" v-if="args.title">
						<h3>
							<icon v-if="args.icon" :name="args.icon"></icon>
							<span>{{args.title}}</span>
						</h3>
					</header>

					<div class="modal-body">
						<p v-if="args.message">{{args.message}}</p>
						<div v-if="args.body">
							<component :is="args.body" :input="input" :options="args.options"></component>
						</div>

					</div>

					<footer class="modal-footer" v-if="buttons.length">
						<div class="button-group align-right">
							<button v-for="button in buttons" @click.prevent="button.action($cmp,$event,input)" class="button" :class="button.classes">
								{{button.label}}
							</button>
						</div>
					</footer>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	var Vue = require('vue');
	var Action = require('../js/utils/modal-actions');
	var ANIMATION_TIMEOUT = 500;
	var FORMS = {
	    "new" : function(object) {
	        return {
                icon: "content.add_box",
                title:"New "+object.singular,
                body:require('./forms/create.vue'),
                options:{model:object},
                buttons: []
            }
	    }
	};

	module.exports = {
		data() {
	        return {
                visible: false,
	            loading: false,
		        options: {},
		        args: {},
	            input: {}
	        }
		},
		computed: {
	        buttons() {
	            return this.args.buttons || [Action.OK];
	        },
			classes() {
	            var out = {
	                loading: this.loading,
	            };
	            if (this.args.type) out[this.args.type] = true;
	            return out;
			},
			$cmp() {
	            return this;
			}
		},

		mounted()
		{
            Vue.prototype.$modal = this;
		},

		methods: {
		    open(args) {
		        this.$emit('open');
		        this.visible = true;
		        this.args = args || {};
		    },
	        close($event) {
	            this.$emit('close', this.input);
	            this.reset();
	        },
			submit($event) {
	            this.$emit('submit', this.input);
                this.reset();
			},
			alert(message) {
			    return this.open({title:"There was an error", message:message, type:"alert"});
			},
			remote(title, url)
			{
			    return this.open({
			        title: title,
				    body: require('../vue/remote.vue'),
				    options: {url:url}
			    });
			},
			form(type,objectName)
			{
			    var object = this.$store.state.objects[objectName];
				this.open(FORMS[type] (object));
			},
			reset()
			{
                this.visible = false;
	            // Allow the animation to run before resetting.
	            window.setTimeout(() => {
	                this.input = {};
	                this.args = {};
	            },ANIMATION_TIMEOUT)
			}
		},
	}
</script>