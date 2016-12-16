<template>
	<div class="ashlee-icon">
		<svg><use :xlink:href="icon"></use></svg>
	</div>
</template>

<script>
	var TYPES = {
	    success: "action.check_circle",
        alert: "alert.error",
		warning: "alert.warning"
	}
	module.exports = {
	    name:"icon",
	    props: ['name','type'],
		computed: {
	        icon() {
                var staticUrl = '/cms/static';
                var name = this.type ? TYPES[this.type] : this.name;
		        var [file,icon] = name.split(".");

	            return `${staticUrl}/icons/${file.toLowerCase()}.svg#ic_${icon.toLowerCase()}_24px`;
	        }
		}
	}
</script>