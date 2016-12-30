<template>
	<a :href="'mailto:'+value">{{value}}</a>
</template>

<script>
module.exports = {
    mixins: [require('./_mixin')],
    name: "emailInput",
}
</script>