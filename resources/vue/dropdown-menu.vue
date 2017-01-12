<template>
	<div class="al-dropdown">
		<a href="javascript:;" class="al-dropdown__link" @click.stop="toggle()">
			<icon type="menu"></icon>
		</a>
		<div class="al-dropdown__container" v-show="opened">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	module.exports = {
	    name:"DropdownMenu",
		data() {
	        return {
	            opened: false
	        }
		},
		mounted()
		{
		    document.addEventListener('click', event => {
		        this.toggle(false);
		    })
		},
		methods: {
	        toggle(boolean) {
	            if (! arguments.length) boolean = ! this.opened;
	            this.opened = boolean;
	            this.$emit('toggle',boolean);
	        }
		}
	}
</script>