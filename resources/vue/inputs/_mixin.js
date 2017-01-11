module.exports = {
    props:['definition','record','field','editing'],

    data() {
        return {
            validationRules: []
        }
    },
    created() {
        if (this.field.required) this.validationRules.push('required');
        if (this.$parent.formFields) {
            this.$parent.formFields.push(this);
        }
    },
    computed: {
        inputId() {
            return "Input_"+this.definition.name+"_"+this.field.name;
        },
        value() {
            return this.record[this.field.name];
        },
        isTitle() {
            return this.field.name === this.definition.title;
        },
        link()
        {
            return [this.definition.slug,this.record.id].join("/");
        },
        rules() {
            return this.validationRules.join("|");
        }
    },
};