var _   = require('lodash');
var Model = require('expressway').Model;

const LABELS = {
    title: "Title",
    author:"Author",
    slug: "Slug",
    published_at: "Publish Date",
    publish: "Publish",
    contents:"Contents",
    excerpt: "Excerpt",
};

class Post extends Model
{
    constructor(app)
    {
        super(app);

        this.title   = 'title';
        this.expose  = true;
        this.icon    = 'communication.email';
        this.sort    = -1;
        this.key     = "published_at";
        this.managed = 'author';
    }

    /**
     * Create the role schema.
     * @param fields {FieldCollection}
     * @param types {Object}
     */
    schema(fields,types)
    {
        fields
            .slug()
            .timestamps()
            .add('title',        types.Title)
            .add('author',       types.User, 'display', {required:false})
            .add('excerpt',      types.Text, 'fillable','display')
            .add('contents',     types.Text)
            .add('publish',      types.Boolean, {default:false})
            .add('published_at', types.Timestamp)
            .labels(LABELS);
    }
}

module.exports = Post;