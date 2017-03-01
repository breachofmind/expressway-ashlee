require('../scss/ashlee.scss');

if (module.hot)
{
    module.hot.accept();

    document.querySelectorAll('link').forEach((el,i) =>
    {
        var now = "?t="+Date.now();
        if (el.href.indexOf("?t=") > -1) {
            return el.href = el.href.split("?t=")[0] +now;
        }
        el.href = el.href + now;
    })
}