const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("static");
    eleventyConfig.addPassthroughCopy({
        "well_known": ".well-known"
    });

    eleventyConfig.addHandlebarsHelper("dateFormat", function (date) {
        return date.toDateString()
    })

    eleventyConfig.addPlugin(syntaxHighlight);

    return {
        dir: {
            input: "src",
            output: "dist",
            includes: "layouts",
            data: "data"
        },
        htmlTemplateEngine: "hbs"
    }
}