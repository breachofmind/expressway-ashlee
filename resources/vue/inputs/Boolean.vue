<template>
	<div>{{displayValue}}</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "BooleanInput",
	computed: {
        displayValue() {
            return this.value ? "True" : "False"
        }
	}
}
</script>