const LINK = (cmp) => {
    return `<a href='${cmp.link}'>${cmp.value}</a>`;
}

var transforms = {
    "media.file_name": LINK,
    "user.email": LINK,
}

function getTransform($cmp) {
    return transforms[$cmp.definition.model+"."+$cmp.field.name];
}

module.exports = {
    props:['definition','record','field'],
    computed: {
        value() {
            return this.record[this.field.name];
        },
        $value() {
            var fn = getTransform(this);
            return fn ? fn(this) : this.value;
        },
        isTitle() {
            return this.field.name === this.definition.title;
        },
        link()
        {
            return ["#",this.definition.model,this.record.id].join("/");
        }
    }
};