<template>
	<div class="al-form__new">
		<h1>{{model.name}}</h1>

		<label>name</label>
		<input type="text" v-model="input.test" @change="test()">
	</div>
</template>

<script>
	module.exports = {
		name: "formNew",
        props:['options','input'],

		computed: {
		    model() {
		        return this.options.model;
		    }
		},
        methods: {
			test() {
			    console.log(this.input.test);
			}
        }
    }
</script>