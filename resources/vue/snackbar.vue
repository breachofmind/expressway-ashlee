<template>
	<transition name="snackbar">
		<div class="snackbar-wrapper" v-show="visible">
			<div class="snackbar-container" :class="classes">

				<div class="snackbar-message">
					<icon v-if="type" :type="type"></icon>
					<span>{{message}}</span>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	var Vue = require('vue');
	var SNACKBAR_VISIBLE_TIMEOUT = 5000; // 5 sec
	var ANIMATION_TIMEOUT = 500;
	var timer;

	module.exports = {
	    name: "snackbar",
	    data() {
	        return {
	            visible: false,
	            type: null,
		        message: ""
	        }
	    },

	    computed: {
	        classes() {
	            return [this.type];
	        }
	    },

		mounted()
		{
		    // Mount this component on each other component instance.
		    Vue.prototype.$snack = this;
		},

		methods: {

            /**
             * Open a new message.
             * @param message string
             * @param type string
             */
	        open(message,type) {
	            this.$emit('open');
	            this.type = type;
	            this.message = message;
	            this.visible = true;

	            if (timer) window.clearTimeout(timer);

	            timer = window.setTimeout(() => {
	                this.close();
	            },SNACKBAR_VISIBLE_TIMEOUT)
	        },

			alert(message)
			{
			    return this.open(message,'alert');
			},

            /**
             * Close the snackbar.
             * @returns void
             */
			close()
			{
			    this.$emit('close');
                this.visible = false;

                clearTimeout(timer);

                // Allow the animation to run before removing content.
			    timer = window.setTimeout(() => {
                    this.type = null;
                    this.message = null;
			    }, ANIMATION_TIMEOUT);
			}
		}
	}
</script>