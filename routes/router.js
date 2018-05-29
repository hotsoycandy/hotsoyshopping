const fs     = require("fs");
const multer = require("multer");
const upload = multer({"dest" : "public/product/"});

module.exports = function(app, models){
    const Book    = models.Book;
    const User    = models.User;
    const BuyLog  = models.buyLog;
    const Product = models.Product;
    
    function render(req,res,page,options = []){
        var param  = {
            page : page,
            userinfo : req.session.userinfo
        }
        param = Object.assign(param,options);
        res.render("index.ejs",param);
    }
    
    function check_login(req,res){
        if(req.session.userinfo == undefined){
            res.redirect("/user/login?error=notlogined");
            return true;
        }
    }
    
    /* render main page */
    app.get("/",function(req, res){
        var keyword = req.query.keyword ? req.query.keyword : "";
        
        Product.find({"name" : new RegExp(keyword)},function(err,products){
            render(req,res,"view/home.ejs",{products : products, keyword : keyword});
        });
    });
    
    /* show login page */
    app.get("/user/login",function(req, res){
        if(req.session.userinfo) res.redirect("/");
        render(req,res,"user/login.ejs",{error : req.query.error});
    });
    
    /* login */
    app.post("/user/login",function(req, res){
        var email = req.body.userid;
        var password = req.body.userpw;
        
        User.find({ email : email, password : password },function(err, userinfo){
            if(err) res.status(500).send({error : "database failure"});
            if(userinfo.length != 0){
                //when login success
                req.session.userinfo = userinfo[0];
                res.redirect("/");
            }
            else{
                //when login failure
                res.redirect("/user/login?error=notfound");
            }
        });
    });
    
    /* register */
    app.get("/user/register",function(req, res){
        render(req,res,"user/register.ejs");
    });
    
    app.post("/user/register",function(req,res){
        var newUser = new User();
        newUser.email    = req.body.userid;
        newUser.password = req.body.userpw;
        newUser.name     = req.body.usernm;
        newUser.address  = req.body.userad;
        newUser.phone    = req.body.phone1 +"-"+ req.body.phone2 +"-"+ req.body.phone3;
        
        newUser.save(function(err){
            if(err) throw err;
        });
        res.redirect("/");
    });
    
    /* check id overlap */
    app.post("/user/overlap",function(req, res){
        var email = req.body.email;
        User.find({ email : email },function(err, userid){
            if(err) res.status(500).send({error : "database failure"});
            if(userid.length == 0) res.json({"overlap" : false});
            else res.json({"overlap" : true});
        });
    });
    
    /* logout */
    app.get("/user/logout",function(req, res){
        var backurl = req.header("Referer") || "/";
        
        req.session.userinfo = undefined;
        res.redirect(backurl);
    });
    
    /* register new product */
    app.get("/product/newProduct",function(req,res){
        render(req,res,"view/newProduct.ejs");
    });
    
    app.post("/product/newProduct", upload.single('productimage'),function(req,res){
        var newProduct = new Product();
        var image_url  = new Date().getTime();
        
        var filecode = req.file.originalname.split(".");
        filecode   = filecode[filecode.length-1];
        image_url = image_url+"."+filecode;
        
        var seller_id = req.session.userinfo._id;
        
        newProduct.name      = req.body.product_name;
        newProduct.price     = req.body.product_price;
        newProduct.category  = req.body.category;
        newProduct.seller_id = seller_id;
        newProduct.image_url = image_url;
        
        newProduct.save(function(err){
            if(err) throw err;
        });
        
        fs.rename(req.file.path,"public/product/"+image_url);
        res.redirect("/");
    });
    
    /* show product detail */
    app.get("/product/showProduct",function(req,res){
        var product_id = req.query.product;
        if(product_id == undefined || !product_id || product_id =="" ){res.redirect("/"); return;}
        Product.findById(product_id,function(err,product){
            if(product == undefined){ res.redirect("/"); return; }
            if(err) throw err;
            render(req,res,"view/showProduct.ejs",{product:product});
        });
    });
    
    app.post("/product/buyProduct",function(req,res){
        if(check_login(req,res)) return;
        var user = req.session.userinfo;
        
        var pid     = req.body.id;
        var bid     = user._id;
        var name    = req.body.name;
        var type    = req.body.type;
        var price   = req.body.price;
        var quntity = req.body.quntity;
        
        var buylog = new BuyLog();
        buylog.pid     = pid;
        buylog.bid     = bid
        buylog.name    = name;
        buylog.price   = price;
        buylog.status  = type;
        buylog.quntity = quntity;
        
        buylog.save(function(err){
            if(err) throw err;
        });
        
        res.redirect("/");
    });
    
    app.get("/user/information",function(req,res){
        if(check_login(req,res)) return;
        var userid = req.session.userinfo._id;
        BuyLog.find({bid : userid},function(err,data){
            if(err) throw err;
            render(req,res,"user/information.ejs",{buylogs : data});
        });
    });
    
    
    
    
    
    
    
    //get : show book list
    app.get("/api/books",function(req,res){
        Book.find(function(err, books){
            if(err) return res.status(500).send({error : "database failure"});
            res.json(books);
        });
    });
    
    //get : show book that chosen by id
    app.get("/api/books/:book_id",function(req,res){
        models.Book.findOne({_id: req.params.book_id},function(err,book){
            if(err)   return res.status(500).json({error : err});
            if(!book) return res.status(404).json({error : "book not found"});
            res.json(book);
        });
    });
    
    //get : show book that chosen by author name
    app.get("/api/books/author/:author",function(req,res){
        Book.find({author : req.params.author},function(err,books){
            if(err) return res.status(500).json({error : err});
            if(books.length === 0) return res.status(404).json({error : "book not found"});
            res.json(books);
        });
    });
    
    //post : insert new book
    app.post("/api/books",function(req,res){
        var book = new models.Book();
        book.title          = req.body.name;
        book.author         = req.body.author;
        book.published_date = new Date(req.body.published_date);
        
        book.save(function(err){
            if(err){
                console.error(err);
                res.json({result : 0});
                return 0;
            }
            res.json({result : 1});
        });
    });
    
    //put : modify book's data that chosen by id
    app.put("/api/books/:book_id",function(req,res){
        Book.findById( req.params.book_id , function(err, book){
            if(err)   return res.status(500).json({error : "database failure "});
            if(!book) return res.status(404).json({error : "book not found "});
            
            if(req.body.title)          book.title = req.body.title;
            if(req.body.author)         book.title = req.body.title;
            if(req.body.published_date) book.published_date = new Date(req.body.published_date);
            
            book.save(function(err){
                if(err) res.status(500).json({error : 'failed to update'});
                res.json({message : "book updated"});
            });
        });
    });
    
    //delete : delete book that chosen by id
    app.delete("/api/books/:book_id",function(req,res){
        Book.remove({ _id : req.params.book_id }, function(err, output){
            if(err) return res.status(500).json({ error : "database failure" });
            
            res.status(204).end();
        });
    });
}