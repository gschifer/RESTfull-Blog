var	bodyParser = require("body-parser"),
	//esse method override eh pra fakear o put ali dai sla tem q usa pra essa parada
methodOverride   = require("method-override"),
mongoose         = require("mongoose"),
express          = require("express"),
expressSanitizer = require("express-sanitizer"),
app              = express();

//APP CONFIG
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/blog_app', { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
// vai poder ter acesso a pasta public e usar o app.css criado na stylesheets



//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
// Blog.create({
// 	title: "Prigles",
// 	image: "https://lirp-cdn.multiscreensite.com/md/unsplash/dms3rep/multi/opt/photo-1457410129867-5999af49daf7-640w.jpg",
// 	body: "Great cat",
// })

app.get("/", function(req, res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
// 	se der brete so trocar o blogContent pra blogs e em baixo tb o blog pra blogs
	Blog.find({}, function(err, blogContent){
		if(err){
			console.log(err);
		} else {
			res.render("index", {blog:blogContent});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//esse req.body.blog vai puxar todos eles de uma vez n precisa dai fazer req.body.image, title, body q nem o outro
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, blogFounded){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog:blogFounded});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, blogFounded){
		if(err){
			console.log("/blogs");
		} else {
			res.render("edit", {blog:blogFounded});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs");
		}
	})
});

app.listen(3000, function(){
	console.log("server is running.")
});