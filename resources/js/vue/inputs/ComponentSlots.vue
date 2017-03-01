<template>
	<div v-if="editing" class="al-input-group row" :class="inputGroupClasses">
		<div class="al-input-label-full column small-12" v-if="! inline">
			<label :for="inputId">{{field.label}}</label>
		</div>
		<div class="al-input-component-slot-group column small-12">
			<div class="al-input-component-slot row" v-for="(slot,index) in value">
				<div class="al-input-label column">
					<component-slot-header :options="slot" :index="index" @delete="removeSlot(index)"></component-slot-header>
				</div>
				<div class="al-input-field column">
					<component :is="slot.component" :options="slot" :index="index"></component>
				</div>
			</div>

			<div class="al-input-actions text-center">
				<button class="button link has-icon" @click.prevent="addSlot()">
					<icon type="create"></icon>
					<span>Add Slot</span>
				</button>
			</div>
		</div>
	</div>

	<div v-else>
		<span>{{value.length}}</span>
	</div>
</template>

<script>
module.exports = {

    name: "ComponentSlotsInput",

    mixins: [require('./_mixin')],

	methods: {

        /**
         * Action when adding a component slot.
         * Opens a modal that allows user to select a component.
         * @returns void
         */
        addSlot()
        {
            var cmp = this;

			this.$modal.open({
			    title:"New Component Slot",
				body: require('../forms/select-component.vue'),
				buttons:[{
			        label:"Add",
					classes:"success",
					action($cmp,$event,input)
					{
					    if (input.component !== "") {
                            cmp.record[cmp.field.name].push({
                                component:input.component
                            });
					    }

                        cmp.$modal.close();
					}
				}]
			});
        },

        /**
         * Action for removing a slot.
         * @param index {Number}
         */
		removeSlot(index)
		{
		    this.record[this.field.name].splice(index,1);
		}
	},
}
</script>