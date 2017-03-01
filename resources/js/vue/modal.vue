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
	var Action = require('../utils/modal-actions');
	var ANIMATION_TIMEOUT = 500;

	// Form names.
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

	    name: "Modal",

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

	        /**
	         * Return the buttons from the arguments or just the default button.
	         * @returns {Array}
	         */
	        buttons() {
	            return this.args.buttons || [Action.OK];
	        },

			/**
			 * Return the class names for the modal container.
			 * @returns {Object}
			 */
			classes() {
	            var out = {
	                loading: this.loading,
	            };
	            if (this.args.type) out[this.args.type] = true;
	            return out;
			},

			/**
			 * Return the component instance.
			 */
			$cmp() {
	            return this;
			}
		},

		/**
		 * Mount the component to the Vue instance.
		 */
		created()
		{
            Vue.prototype.$modal = this;
		},

		methods: {

            /**
             * Open the modal window.
             * @param args
             */
		    open(args) {
		        this.$emit('open');
		        this.visible = true;
		        this.args = args || {};
		    },

            /**
             * Close the modal window.
             * @param $event
             */
	        close($event) {
	            this.$emit('close', this.input);
	            this.reset();
	        },

            /**
             * Submit the modal window.
             * @param $event
             */
			submit($event) {
	            this.$emit('submit', this.input);
                this.reset();
			},

            /**
             * Open the modal window with an alert message.
             * @param message {String}
             * @returns {*}
             */
			alert(message) {
			    return this.open({title:"There was an error", message:message, type:"alert"});
			},

            /**
             * Open the modal window with remote content.
             * @param title {String}
             * @param url {String}
             * @returns {*}
             */
			remote(title, url)
			{
			    return this.open({
			        title: title,
				    body: require('../vue/remote.vue'),
				    options: {url:url}
			    });
			},

            /**
             * Open the modal with a form component.
             * @param type {String}
             * @param objectName {String}
             * @returns void
             */
			form(type,objectName)
			{
			    var object = this.$store.state.objects[objectName];
				this.open(FORMS[type] (object));
			},

            /**
             * Reset the modal window.
             * @returns void
             */
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