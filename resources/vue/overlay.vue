<template>
	<transition name="overlay">
		<div class="al-overlay-wrapper" v-show="visible">
			<header class="al-overlay-header">
				<h3>{{title}}</h3>
				<a href="javascript:;" @click="close" title="Close" class="button link al-overlay-close"><icon type="close"></icon></a>
			</header>
			<div class="al-overlay-body" v-if="body">
				<component :is="body"></component>
			</div>
		</div>
	</transition>

</template>

<script>
	module.exports = {
		data() {
	        return {
	            title: "Overlay",
                visible: false,
	            loading: false,
		        body: 'media-selector',
	        }
		},
		methods: {
		    close() {
		        this.visible = false;
		    }
		},
		components: {
		    'media-selector' : require('./media/media-selector.vue')
		}
	}
</script>