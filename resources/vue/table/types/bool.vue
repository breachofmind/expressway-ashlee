<template>
	<div>{{displayValue}}</div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "boolInput",
	computed: {
        displayValue() {
            return this.value ? "True" : "False"
        }
	}
}
</script>