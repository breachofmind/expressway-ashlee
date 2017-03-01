<template>
	<div class="al-icon">
		<svg><use :xlink:href="icon"></use></svg>
	</div>
</template>

<script>
	var TYPES = {
	    success: "action.check_circle",
        alert:   "alert.error",
		warning: "alert.warning",
		create:  "content.add_box",
		help:    "action.help",
		logout:  "action.exit_to_app",
		search:  "action.search",
		loader:  "navigation.more_horiz",
		menu:    "navigation.more_horiz",
		link:    "content.link",
		delete:  "action.delete",
		save:    "content.save",
		close:   "navigation.close"
	};
	module.exports = {
	    name:"icon",
	    props: ['name','type'],
		computed: {
	        icon() {
                //var staticUrl = '/cms/static';
                var name = this.type ? TYPES[this.type] : this.name;
		        var [file,icon] = name.split(".");

	            return `static/icons/${file.toLowerCase()}.svg#ic_${icon.toLowerCase()}_24px`;
	        }
		}
	}
</script>