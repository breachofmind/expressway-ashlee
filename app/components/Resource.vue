<template>
	<div class="al-component__Resource row">
		<div class="column small-12">
			<label>Resource</label>
			<select v-model="options.model">
				<option value="">Select...</option>
				<option v-for="option in objects" :value="option.value">
					{{ option.text }}
				</option>
			</select>
		</div>
		<div class="column small-12">
			<label>Filter/Resource ID</label>
			<input type="text" v-model="options.filter">
		</div>
	</div>
</template>

<script>
	module.exports = {
	    name: "Resource",
	    props:['options','index'],
        created: function() {
            if (! this.options.model) this.options.model = "";
        },
        computed: {
            objects: function()
            {
                return this.$store.getters.objectArray.map(object => {
                    return {value: object.name, text:object.singular}
                }).sort((a,b) => {
                    return a.text.localeCompare(b.text);
                })
            }
        }
    }
</script>