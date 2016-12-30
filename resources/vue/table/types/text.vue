<template>
	<div v-html="$value"></div>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "textInput",
}
</script>