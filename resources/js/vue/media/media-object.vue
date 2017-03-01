<template>
	<a href="javascript:;" class="al-media-object" :class="{'is-selected':isSelected, 'is-loading':!image}" @click="onSelect">
		<div class="al-media-object-image">
			<img v-if="image" :src="image" :alt="media.title"/>
			<icon v-else type="loader" class="al-media-loader is-spinning"></icon>
		</div>
		<div class="al-media-overlay" v-if="media">
			<icon class="al-media-select" :name="iconToggleName"></icon>
			<div class="al-media-overlay-actions">

			</div>
		</div>
	</a>
</template>

<script>
	var MEDIA_LOAD_TIMEOUT = 200;

	module.exports = {
        name:"MediaObject",

        props: ['media','selected'],

		data() {
            return {
                image: null
            }
		},

        created()
        {
            preloadImage.call(this);
        },

        methods: {

            /**
             * User selects an item.
             * @returns {*}
             */
            onSelect()
            {
                var index = this.selected.indexOf(this.media);
                return index == -1 ? this.selected.push(this.media) : this.selected.splice(index,1);
            }
        },

        computed: {
            /**
             * Check if this item is selected.
             * @returns {boolean}
             */
            isSelected()
            {
                return this.selected.indexOf(this.media) > -1;
            },

            /**
             * If selected, change the icon being used.
             * @returns {string}
             */
	        iconToggleName()
	        {
	            return this.isSelected ? "toggle.check_box" : "toggle.check_box_outline_blank";
	        }
        }
    }

    /**
     * Preloads the image for the component.
     * @returns void
     */
    function preloadImage()
    {
        // Preload the image first.
        var preload = new Image();
        preload.src = this.media.$preview;
        preload.onload = (event) => {
            setTimeout(() => {
                this.image = this.media.$preview;
            },MEDIA_LOAD_TIMEOUT);
        };
        if (preload.complete) {
            this.image = this.media.$preview;
        }
    }
</script>
