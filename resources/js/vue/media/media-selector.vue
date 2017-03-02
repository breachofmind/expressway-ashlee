<template>
	<div class="al-media-selector row">
		<div class="al-media-selector-left column small-12 medium-9">
			<div class="al-media-objects" v-if="!loading">
				<media-object v-for="media in records" :media="media" :selected="selected"></media-object>
			</div>
			<div v-else>
				<loader></loader>
			</div>

			<footer class="al-media-selector-callout" v-if="selected.length">
				<a href="javascript:;" @click="unselectAll" title="Unselect All"><icon type="close"></icon></a>
				<strong>{{selected.length}} </strong> selected.
			</footer>
		</div>
		<div class="al-media-selector-right column small-12 medium-3">

			<div class="al-input-group">
				<label for="SizeSelector">Image Size</label>
				<select name="size" id="SizeSelector" v-model="size">
					<option value="original">Original</option>
					<option value="thumb">Thumbnail</option>
					<option value="medium">Medium</option>
					<option value="large">Large</option>
				</select>

				<div v-if="selectedItem">
					<label>URL</label>
					<input type="text" readonly :value="selectedItem.sizes[size]">

					<label>Caption</label>
					<textarea v-model="selectedItem.caption" placeholder="Caption" @change="updateRecord(selectedItem,'caption')"></textarea>

					<label>Alternate Text</label>
					<input type="text" v-model="selectedItem.alt_text" placeholder="Alt Text" @change="updateRecord(selectedItem,'alt_text')">
				</div>
			</div>

			<div class="al-media-selector-submit">
				<button @click="submit" :disabled="!selected.length" class="button success">Submit</button>
			</div>

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
		        size: "original",
	        }
		},
		created() {
		    this.$parent.title = "Select Media";
			this.fetchData();
		},
		computed: {
	        selectedItem()
	        {
	            return this.selected.length == 1 ? this.selected[0] : null;
	        }
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
			updateRecord(record,property)
			{
			    this.$api.put(['media',record.id], {[property] : record[property]}).then(response => {
			        this.$snack.success(response.data.message);
			    });
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