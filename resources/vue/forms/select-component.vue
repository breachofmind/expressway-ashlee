<template>
	<div class="al-input-group row">
		<div class="al-input-label column">
			<label>Component</label>
		</div>
		<div class="al-input-field column">
			<select name="component" v-model="input.component">
				<option value="">Select...</option>
				<option :value="option.name" v-for="option in objects">
					{{option.label}}
				</option>
			</select>
		</div>
	</div>
</template>

<script>
	module.exports = {
		name: "SelectComponent",
        props:['options','input'],
		created() {
		    this.input.component = "";
		},
		computed: {
		    objects()
		    {
		        return this.$store.state.components;
		    }
		}
    }
</script>