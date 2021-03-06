module.exports = [
    require('expressway-dev'),
    require('expressway-rest'),
    require('expressway/src/providers'),
    require('expressway/src/middleware'),
    require('../app/providers/AshleeCoreProvider'),
    require('../app/providers/GraphicsProvider'),
    require('../app/providers/CustomObjectProvider'),
    require('../app/providers/AshleePoliciesProvider'),
    require('../app/models'),
    require('../app/middlewares/AshleeFrontend'),
    require('../app/middlewares/AshleeNotFound'),
    require('../app/controllers/CMSIndexController'),
    require('../app/controllers/TemplateController'),
];