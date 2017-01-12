module.exports = {
    props:['definition','record','field','editing'],

    data() {
        return {}
    },
    computed: {
        /**
         * Return the unique input ID.
         * @returns {string}
         */
        inputId() {
            return "Input_"+this.definition.name+"_"+this.field.name;
        },
        inputClasses() {
            return ['al-input', 'al-input__'+this.field.typeName.toLowerCase() ];
        },
        inputGroupClasses() {
            return {
                "is-required" : this.field.required,
                "is-unique" : this.field.unique,
                "is-title" : this.isTitle,
            }
        },
        /**
         * Get the value of the field with the current record.
         * @returns {*}
         */
        value() {
            return this.record[this.field.name];
        },
        /**
         * Check if the current field name is the title field.
         * @returns {boolean}
         */
        isTitle() {
            return this.field.name === this.definition.title;
        },
        /**
         * Check if the editing mode is inline.
         * @returns {boolean}
         */
        inline() {
            return this.editing == 'inline';
        },
        /**
         * Return the unique link to the object.
         * @returns {string}
         */
        link()
        {
            return [this.definition.slug,this.record.id].join("/");
        },

    },
};