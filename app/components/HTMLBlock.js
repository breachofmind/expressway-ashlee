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
     * @param done {Function}
     * @param request {IncomingMessage}
     * @param data {Object}
     * @returns {String}
     */
    render(done,request,data)
    {
        var attr = {"id": data.id, "class": data.classes};
        if (request.user) {
            attr['data-ashlee'] = `${data.name}:${data.index.toString()}`;
            attr['contenteditable'] = true;
        }
        return done(this.element({
            text: data.content,
            attr: attr,
        }));
    }
}


module.exports = HTMLBlock;