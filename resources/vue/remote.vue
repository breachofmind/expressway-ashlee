<template>
	<div class="remote-content" :class="{'is-loading': loading}">
		<div v-if="loading" class="loading-icon">
			<icon name="navigation.more_horiz" class="loading"></icon>
		</div>
		<div v-else v-html="content"></div>
	</div>
</template>

<script>
	var $http = require('axios');
    var ANIMATION_TIMEOUT = 500;

	module.exports = {
		name: "remote",
        props:['options','input'],

        data() {
            return {
                loading: true,
                content: "",
            }
        },
        mounted() {
            this.getContent();
        },
        methods: {
            getContent()
            {
                this.loading = true;
                $http.get(this.options.url).then(response =>
                {
                    setTimeout(() =>
                    {
                        this.loading = false;
                        this.content = response.data;
                    }, ANIMATION_TIMEOUT);
                });
            }
        }
    }
</script>