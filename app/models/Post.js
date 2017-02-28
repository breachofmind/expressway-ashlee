var _   = require('lodash');
var Model = require('expressway').Model;

const LABELS = {
    title: "Title",
    author:"Author",
    slug: "Slug",
    publish: "Publish",
    content:"Content",
    excerpt: "Excerpt",
    published_at: "Publish Date",
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
        this.managed = "author";
        this.link    = "/posts/{slug}";
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
            .add('content',      types.Text, 'fillable')
            .add('publish',      types.Boolean, {default:false}, 'fillable')
            .add('published_at', types.Timestamp, 'fillable', 'display')
            .labels(LABELS);
    }
}

module.exports = Post;