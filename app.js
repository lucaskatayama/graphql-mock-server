var fs = require("fs");

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors');


var marked = require("marked");
var highlightjs = require("highlight.js");
require("./lib/graphql.js");

var graphqlHTTP = require("express-graphql");
const { makeExecutableSchema } = require("graphql-tools");
const glue = require("schemaglue");

const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang
    ? highlightjs.highlight(language, code).value
    : code;
  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

marked.setOptions({
  renderer,
});

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname, "public")));

const { schema, resolver } = glue("graphql");
const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver,
});

app.use("/howto", (req, res) => {
  var path = __dirname + "/markdown/howto.md";
  var file = fs.readFileSync(path, "utf8");
  res.render("howto", { content: marked(file.toString()) });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: executableSchema,
    graphiql: "/graphiql",
  }),
);

app.use("*", (req, res) => {
  res.redirect("/howto");
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
});

module.exports = app;
