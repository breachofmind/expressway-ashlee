<template>
	<div class="al-media-selector row">
		<div class="al-media-selector-left column small-12 medium-9">
			<div class="al-media-objects" v-if="!loading">
				<media-object v-for="media in records" :media="media" :selected="selected"></media-object>
			</div>
			<div v-else>
				<div class="al-loader"><div class="al-loader-object"></div></div>
			</div>
		</div>
		<div class="al-media-selector-right column small-12 medium-3">
			<div class="callout primary" v-if="selected.length">
				<p>
					<a href="javascript:;" @click="unselectAll" title="Unselect All"><icon type="close"></icon></a>
					<strong>{{selected.length}} </strong> selected.
				</p>
			</div>

			<div class="al-input-group">
				<label for="SizeSelector">Image Size</label>
				<select name="size" id="SizeSelector" v-model="size">
					<option value="original">Original</option>
					<option value="thumb">Thumbnail</option>
					<option value="medium">Medium</option>
					<option value="large">Large</option>
				</select>
			</div>


			<button @click="submit" :disabled="!selected.length" class="button success">Submit</button>
		</div>


	</div>
</template>

<script>
	module.exports = {
	    name:"MediaSelector",
		props:['options'],
		data() {
	        return {
	            loading: true,
	            records: [],
		        selected: [],
		        size: "original"
	        }
		},
		created() {
		    this.$parent.title = "Select Media";
			this.fetchData();
		},
		methods: {
	        fetchData()
	        {
	            this.loading = true;
                this.$api.resource('media').then(response => {
                    setTimeout(() => {
                        this.records = response.data;
                        this.loading = false;
                    },500);

                })
	        },
			unselectAll()
			{
			    this.selected = [];
			},
			submit()
			{
			    console.log(this.selected);
			},
		},
		components: {
            "media-object": require('./media-object.vue')
        }
	}
</script>