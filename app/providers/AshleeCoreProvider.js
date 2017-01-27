var Provider = require('expressway').Provider
var path = require('path');

class AshleeCoreProvider extends Provider
{
    constructor(app,paths,locale)
    {
        super(app);

        this.order = 1;

        // Add the component service.
        app.service('components', app.load(require('../services/ComponentService')));

        // Create some useful paths.
        paths.add('cms_root', path.resolve(__dirname,"../.."));
        paths.add('cms_resources', paths.cms_root('resources'));
        paths.add('cms_views', paths.cms_root('resources/views'));
        paths.add('cms_public', paths.cms_root('public'));

        locale.addDirectory(paths.cms_resources('locale'));
    }
}

module.exports = AshleeCoreProvider;