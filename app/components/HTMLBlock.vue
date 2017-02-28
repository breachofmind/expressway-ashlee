<template>
	<div class="al-component__HTMLBlock">
		<editor v-model="options.content" lang="html" theme="chrome" width="100%" height="240" @init="init()"></editor>
	</div>
</template>

<script>
	module.exports = {
        name: "HTMLBlock",
        props:['options','index'],
        components: {
            "editor": require('vue2-ace-editor')
        },
        created: function() {
            if (! this.options.content) this.options.content = "";
        },
        methods: {
            init: function()
            {
                require('brace/mode/html');
                require('brace/theme/chrome');
            }
        }
    }
</script>