module.exports = function(app, models){
    var Book = models.Book;
    var User = models.User;
    
    //render main page
    app.get("/",function(req, res){
        res.render("index.ejs", { css : "index.css" } );
    });
    
    //login
    app.post("/user/login",function(req, res){
        var userid = req.body.userid;
        var userpw = req.body.userpw;
        
        User.find({ userid : userid },function(err, userid){
            if(err) res.status(500).send({error : "database failure"});
            if(userid.length != 0){
                //when login success
                req.session.userid = userid;
            }
            else{
                //when login failure
                res.redirect("/");
            }
        });
    });
    
    //register
    app.get("/user/register",function(req, res){
        res.render("register.ejs", { css : "register.css" } );
    });
    app.post("/user/register",function(req,res){
        
        var userid = req.body.userid;
        var userpw = req.body.userpw;
        var usernm = req.body.usernm;
        var userad = req.body.userad;
        var phone1 = req.body.phone1;
        var phone2 = req.body.phone2;
        var phone3 = req.body.phone3;
        
        /* upload to server */
        var newUser = new User();
        newUser.userad = userad;
        newUser.userid = userid;
        newUser.userpw = userpw;
        newUser.usernm = usernm;
        newUser.userph = phone1+"-"+phone2+"-"+phone3;
        
        newUser.save(function(err){
            if(err){
                console.error(err);
                res.json({result : 0});
            }
            res.redirect("/");
        });
    });
    
    /* check id overlap */
    app.post("/user/overlap",function(req, res){
        var userid = req.body.userid;
        User.find({ userid : userid },function(err, userid){
            if(err) res.status(500).send({error : "database failure"});
            if(userid.length == 0)
                res.json({"overlap" : true});
            else
                res.json({"overlap" : false});
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