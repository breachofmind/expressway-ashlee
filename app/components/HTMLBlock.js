"use strict";

var Component = require('../Component');

class HTMLBlock extends Component
{
    constructor(app)
    {
        super(app);

        this.label = "HTML Block";
        this.tip = "A block of HTML markup";
    }

    /**
     * Render the component.
     * @param done Function
     * @param request IncomingMessage
     * @param response ServerResponse
     * @param next Function
     * @param data {Object}
     * @returns {String}
     */
    render(done,request,response,next,data)
    {
        return done(this.element({
            text: data.content,
            attr: {
                "id": data.id,
                "class":data.classes,
                "data-slot": data.templateId + ":" + data.index},
        }));
    }

    input()
    {
        return `
            {
                name:"HTMLBlockComponent",
                props:['options'],
                data: function() {
                    return {params: this.options};
                },
                template:\`
                	<div>
                        <label>Name</label>
                        <input type="text" v-model="params.name">
                        
                        <label>ID</label>
                        <input type="text" v-model="params.id">
                
                        <label>Classes</label>
                        <input type="text" v-model="params.classes">
                
                        <label>HTML</label>
                        <textarea name="html" v-model="params.content"></textarea>
                    </div>
                \`
            }
            `;
    }
}


module.exports = HTMLBlock;