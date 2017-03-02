<template>
	<th class="data-table-th" :class="classes">
		<a href="javascript:;" @click="sorting()">{{field.label}}</a>
	</th>
</template>

<script>
	module.exports = {

	    name:"CMSTableHeading",

		props:['field','column','definition'],

		computed: {
            isSorting() {
	            return this.$parent.searchParams.sort.hasOwnProperty(this.field.name);
            },
			classes() {
                return {
                    "is-sorting": this.isSorting,
	                "is-sorting-asc" : this.direction == 1,
	                "is-sorting-desc" : this.direction == -1,
	                ["is-type-"+this.field.typeName]: true
                }
			},
			direction() {
                if (! this.isSorting) return 0;
                return this.$parent.searchParams.sort[this.field.name];
			}
		},
		methods: {
	        sorting()
	        {
	            var direction = this.direction == -1 || this.direction == 0 ? 1 : -1;
	            this.$parent.searchParams.sort = {[this.field.name]: direction};
	            this.$emit('sort', this.field, this.direction);
	        }
		}
	}
</script>