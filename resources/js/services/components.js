ashlee.components.add('HTMLBlock', function(Vue) {
    return {
        template: `
<div class="al-component__HTMLBlock">
    <editor v-model="options.content" lang="html" theme="chrome" width="100%" height="240" @init="init()"></editor>
</div>
`,
        components: {
            "editor": require('vue2-ace-editor')
        },
        created() {
            if (! this.options.content) this.options.content = "";
        },
        methods: {
            init()
            {
                require('brace/mode/html');
                require('brace/theme/chrome');
            }
        }
    }
});

ashlee.components.add('Resource', function(Vue) {
    return {
        template:`
<div class="al-component__Resource row">
    <div class="column small-12">
        <label>Resource</label>
        <select v-model="options.model">
            <option value="">Select...</option>
            <option v-for="option in objects" v-bind:value="option.value">
            {{ option.text }}
            </option>
        </select>
    </div>
    <div class="column small-12">
        <label>Filter/Resource ID</label>
        <input type="text" v-model="options.filter">
    </div>
</div> 
        `,
        created() {
            if (! this.options.model) this.options.model = "";
        },
        computed: {
            objects()
            {
                return this.$store.getters.objectArray.map(object => {
                    return {value: object.name, text:object.singular}
                }).sort((a,b) => {
                    return a.text.localeCompare(b.text);
                })
            }
        }
    }
})