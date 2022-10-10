const express = require ('express');

var cookieParser = require('cookie-parser');
var session = require('express-session');

const bot = require("./bot.js");

const bodyParser = require('body-parser');

//Mongo DB Set UP
const mongoose = require('mongoose');

const uri = "mongodb+srv://Alex:n83xoeu79Fvu2JIc@cluster0.dpdrriq.mongodb.net/?retryWrites=true&w=majority"; //Process ENV

mongoose.connect(uri);

//Schema
const postSchema = new mongoose.Schema({
    title: String,
    subtitle : String,
    date : String,
    argument : String,
    description : String,
    firstImage : String,
    user : String,
    pinned : Boolean,
    checkOut : Boolean
});

const userSchema = new mongoose.Schema({
    userName : String,
    psw : String
});

const post = mongoose.model('Post', postSchema);
const user = mongoose.model('User', userSchema);

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({secret: "ghfdjkgdhkqEWQE9Qjkl329490ASH<A!àfsdfkJjgxDIHk284329FHDS_DASDJW_Dsdfdmsa"}));

// Pages
app.get("/", async function(req, res){
    let latestPosts = post.collection.find({pinned : false, checkOut : false}).sort({_id:-1}).limit(7);
    let latestPostsArr = [];

    let allPosts = post.collection.find({pinned : false, checkOut : false});
    let allPostsArr = [];

    let pinned = post.collection.find({pinned : true, checkOut : false}).sort({_id:-1}).limit(2);
    let pinnedArr = [];

    let checkOut = post.collection.find({pinned : false, checkOut : true}).sort({_id:-1}).limit(5);
    let checkOutArr = [];

    await latestPosts.forEach(element => {
        latestPostsArr.push(element);
    });

    await allPosts.forEach(element => {
        allPostsArr.push(element);
    });

    await pinned.forEach(element => {
        pinnedArr.push(element);
    });

    await checkOut.forEach(element => {
        checkOutArr.push(element);
    });
    
    res.render("index", { 
        first : latestPostsArr[0],

        second : latestPostsArr[1],

        third : latestPostsArr[2], 

        fourth : latestPostsArr[3],

        fifth : latestPostsArr[4], 

        sixth : latestPostsArr[5], 

        seventh : latestPostsArr[6],

        eighth : checkOutArr[0], 

        nineth : checkOutArr[1], 

        tenth : checkOutArr[2], 

        eleventh : checkOutArr[3], 

        twelveth : checkOutArr[4], 
        
        b_first : pinnedArr[0], 

        b_second : pinnedArr[1], 

        random : allPostsArr[Math.floor(Math.random() * allPostsArr.length)]
    })

});

app.post("/search", async function(req, res){
    let allPosts = post.collection.find();
    let allSearchedArr = [];

    await allPosts.forEach(element =>{
        if(element.title.toLowerCase().includes(req.body.search.toLowerCase()) || element.subtitle.toLowerCase().includes(req.body.search.toLowerCase()) || element.description.toLowerCase().includes(req.body.search.toLowerCase()))
        {
            allSearchedArr.push(element);
        }
    });

    res.render("category", { 
        category : "Search",
        posts : allSearchedArr
    });
});

app.get("/club", async function(req, res){
    let allClubsPost = post.collection.find({ argument : "Clubs" }).sort({_id : -1});
    let allClubsPostArr = [];

    await allClubsPost.forEach(element =>{
        allClubsPostArr.push(element);
    });

    res.render("category", {
        category : "Clubs",
        posts : allClubsPostArr
    });
});

app.get("/this-week", async function(req, res){
    let allThisWeekPosts = post.collection.find({ argument : "ThisWeek" }).sort({_id : -1});
    let allThisWeekPostArr = [];

    await allThisWeekPosts.forEach(element =>{
        allThisWeekPostArr.push(element);
    });

    res.render("category", {
        category : "This Week",
        posts : allThisWeekPostArr
    });
});

app.get("/last-week", async function(req, res){
    let allLastWeekPosts = post.collection.find({ argument : "LastWeek" }).sort({_id : -1});
    let allLastWeekPostsArr = [];

    await allLastWeekPosts.forEach(element =>{
        allLastWeekPostsArr.push(element);
    });

    res.render("category", {
        category : "Last Week",
        posts : allLastWeekPostsArr
    });
});

app.get("/news-events", async function(req, res){
    let allNewsPost = post.collection.find({ argument : "News/Events" }).sort({_id : -1});
    let allNewsPostArr = [];

    await allNewsPost.forEach(element =>{
        allNewsPostArr.push(element);
    });

    res.render("category", {
        category : "News / Events",
        posts : allNewsPostArr
    });
});

app.get("/lunch", async function(req, res){
    let allLunchPost = post.collection.find({ argument : "Lunch" }).sort({_id : -1});
    let allLunchPostArr = [];

    await allLunchPost.forEach(element =>{
        allLunchPostArr.push(element);
    });

    res.render("category", {
        category : "Lunch",
        posts : allLunchPostArr
    });
});

app.get("/weather", async function(req, res){
    let allWeatherPosts = post.collection.find({ argument : "Weather" }).sort({_id : -1});
    let allWeatherPostsArr = [];

    await allWeatherPosts.forEach(element =>{
        allWeatherPostsArr.push(element);
    });

    res.render("category", {
        category : "Weather",
        posts : allWeatherPostsArr
    });
});


app.get("/promos", async function(req, res){
    let allPromosPost = post.collection.find({ argument : "Promos" }).sort({_id : -1});
    let allPromosPostArr = [];

    await allPromosPost.forEach(element =>{
        allPromosPostArr.push(element);
    });

    res.render("category", {
        category : "Promos",
        posts : allPromosPostArr
    });
});

// Admin
app.get("/admin",async function(req, res){
    if (!(req.session.usr))
    {
        res.render("admin-login");
    }

    else
    {
        let currentUser = await user.collection.findOne({userName : req.session.usr, psw : req.session.psw});

        let userPost = await post.collection.find({ user : currentUser.userName}).sort({_id : -1});
        let posts = [];

        await userPost.forEach(element => {
            posts.push(element);
        });

        res.render("admin", {
            user : currentUser,
            posts : posts
        });
    }
});

app.post("/admin", async function(req,res){
    let userLogin = await user.collection.findOne({userName : req.body.usr, psw : req.body.psw});

    if(userLogin)
    {
        req.session.usr = req.body.usr;
        req.session.psw = req.body.psw;

        let currentUser = await user.collection.findOne({userName : req.session.usr, psw : req.session.psw});

        let userPost = await post.collection.find({ user : currentUser.userName}).sort({_id : -1});
        let posts = [];

        await userPost.forEach(element => {
            posts.push(element);
        });
        
        res.render("admin", {
            user : currentUser,
            posts : posts
        });
    } 
    else   
        res.send("admin-login");
});

app.get("/post", function(req,res){
    res.render("add-post");
})

app.post("/post", async function(req, res){
    var pinned_;
    var checkOut_;

    if(req.body.pinned == "on")
        pinned_ = true;
    else
        pinned_ = false;

    if(req.body.checkOut == "on")
        checkOut_ = true;
    else
        checkOut_ = false;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
        
    today = dd + '/' + mm + '/' + yyyy;

    post.collection.insertOne({ title: req.body.title,
                                subtitle : req.body.subtitle,
                                argument : req.body.category,
                                date : today,
                                description : req.body.description,
                                firstImage : req.body.image,
                                pinned : pinned_,
                                checkOut : checkOut_,
                                user : req.session.usr});

    //Load Posts
    console.log("\nLoading all posts...");
    await LoadPosts();
    console.log("Loaded all the posts");

    //Discord
    switch(req.body.category)
    {
        case "News":
            bot.Post("1028666015996985375", `https://localhost8080/news/`, req.body.title, req.body.subtitle, req.body.description);
            break;
    }

    //Render
    let latestPosts = post.collection.find({pinned : false, checkOut : false}).sort({_id:-1}).limit(7);
    let latestPostsArr = [];

    let allPosts = post.collection.find({pinned : false, pinned : false, checkOut : false});
    let allPostsArr = [];

    let pinned = post.collection.find({pinned : true, checkOut : false}).sort({_id:-1}).limit(2);
    let pinnedArr = [];

    let checkOut = post.collection.find({pinned : false, checkOut : true}).sort({_id:-1}).limit(2);
    let checkOutArr = [];

    await latestPosts.forEach(element => {
        latestPostsArr.push(element);
    });

    await allPosts.forEach(element => {
        allPostsArr.push(element);
    });

    await pinned.forEach(element => {
        pinnedArr.push(element);
    });

    await checkOut.forEach(element => {
        checkOutArr.push(element);
    });

    res.render("index", { 
        first : latestPostsArr[0],

        second : latestPostsArr[1],

        third : latestPostsArr[2], 

        fourth : latestPostsArr[3],

        fifth : latestPostsArr[4], 

        sixth : latestPostsArr[5], 

        seventh : latestPostsArr[6],

        eighth : checkOutArr[7], 

        nineth : checkOutArr[8], 

        tenth : checkOutArr[9], 

        eleventh : checkOutArr[10], 

        twelveth : checkOutArr[11], 
        
        b_first : pinnedArr[0], 

        b_second : pinnedArr[1], 

        random : allPostsArr[Math.floor(Math.random() * allPostsArr.length)]
    })

});

// Posts
async function LoadPosts()
{
    let allPosts = await post.find();

    let clubs = [];
    let thisWeek = [];
    let lastWeek = [];
    let lunch = [];
    let weather = [];
    let newsEvents = [];
    let promos = [];

    await allPosts.forEach(element =>{
        switch(element.argument)
        {
            case "Clubs":
                clubs.push(element);

            case "This Week":
                thisWeek.push(element);
  
            case "Last Week":
                lastWeek.push(element);

            case "Lunch":
                lunch.push(element);

            case "Weather":
                weather.push(element);

            case "News and Events":
                newsEvents.push(element);

            case "Promos":
                promos.push(element);
        }
    });

    //App.Get
    await clubs.forEach(post =>{
        app.get(`/clubs/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

    await thisWeek.forEach(post =>{
        app.get(`/this-week/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

    await lastWeek.forEach(post =>{
        app.get(`/last-week/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

    await lunch.forEach(post =>{
        app.get(`/lunch/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

    await weather.forEach(post =>{
        app.get(`/myps/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

    await lunch.forEach(post =>{
        app.get(`/lunch/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

}

// Have a lot of work to do here
async function LoadAllPostsAdmin()
{
    let allPosts = await post.find();

    let clubs = [];
    let thisWeek = [];
    let lastWeek = [];
    let lunch = [];
    let weather = [];
    let newsEvents = [];
    let promos = [];

    await allPosts.forEach(element =>{
        switch(element.argument)
        {
            case "Clubs":
                clubs.push(element);

            case "This Week":
                thisWeek.push(element);
  
            case "Last Week":
                lastWeek.push(element);

            case "Lunch":
                lunch.push(element);

            case "Weather":
                weather.push(element);

            case "News and Events":
                newsEvents.push(element);

            case "Promos":
                promos.push(element);
        }
    });

    //App.Get
    await clubs.forEach(post =>{
        app.get(`/clubs/${post._id}/edit`, function(req, res){
            res.render("edit", {post : post});
        });

        app.post(`/clubs/${post._id}/remove`, function(req, res){
            res.render("/admin");
        });
    });

    await thisWeek.forEach(post =>{
        app.get(`/this-week/${post._id}/edit`, async function(req, res){
            if (req.session.userName && req.session.psw)
            {
                res.render("edit", {post : post});
            }

            else
            {
                let latestPosts = post.collection.find({pinned : false, checkOut : false}).sort({_id:-1}).limit(7);
                let latestPostsArr = [];
            
                let allPosts = post.collection.find({pinned : false, checkOut : false});
                let allPostsArr = [];
            
                let pinned = post.collection.find({pinned : true, checkOut : false}).sort({_id:-1}).limit(2);
                let pinnedArr = [];
            
                let checkOut = post.collection.find({pinned : false, checkOut : true}).sort({_id:-1}).limit(5);
                let checkOutArr = [];
            
                await latestPosts.forEach(element => {
                    latestPostsArr.push(element);
                });
            
                await allPosts.forEach(element => {
                    allPostsArr.push(element);
                });
            
                await pinned.forEach(element => {
                    pinnedArr.push(element);
                });
            
                await checkOut.forEach(element => {
                    checkOutArr.push(element);
                });
                
                res.render("index", { 
                    first : latestPostsArr[0],
            
                    second : latestPostsArr[1],
            
                    third : latestPostsArr[2], 
            
                    fourth : latestPostsArr[3],
            
                    fifth : latestPostsArr[4], 
            
                    sixth : latestPostsArr[5], 
            
                    seventh : latestPostsArr[6],
            
                    eighth : checkOutArr[0], 
            
                    nineth : checkOutArr[1], 
            
                    tenth : checkOutArr[2], 
            
                    eleventh : checkOutArr[3], 
            
                    twelveth : checkOutArr[4], 
                    
                    b_first : pinnedArr[0], 
            
                    b_second : pinnedArr[1], 
            
                    random : allPostsArr[Math.floor(Math.random() * allPostsArr.length)]
                })
            }
        });

        app.post(`/this-week/${post._id}/edit`, function(req, res){

            res.render("/admin");
        });
    });

    await lastWeek.forEach(post =>{
        app.get(`/last-week/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

    await lunch.forEach(post =>{
        app.get(`/lunch/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

    await weather.forEach(post =>{
        app.get(`/myps/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });

    await lunch.forEach(post =>{
        app.get(`/lunch/${post._id}`, function(req, res){
            res.render("single-post", {post : post});
        });
    });
}

// Users
async function LoadUsers()
{
    let allUsers = await user.collection.find();
    let allUsersArr = [];

    await allUsers.forEach(element =>{
        allUsersArr.push(element);
    });

    await allUsersArr.forEach(element =>{
        app.get(`/users/${element.userName}`, async function(req, res){
            let allUserPosts = post.collection.find({ user : element.userName }).sort({_id : -1});
            let allUserPostsArr = [];

            await allUserPosts.forEach(element =>{
                allUserPostsArr.push(element);
            });

            res.render("user", {
                category : `User | ${element.userName}`,
                posts : allUserPostsArr
    });
        });
    });
}

app.listen(port=process.env.PORT || 3000,async function(){
    console.log("\nServer is running on port 8080");

    console.log("\nLoading all posts...");
    await LoadPosts();
    console.log("Loaded all the posts");

    console.log("\nLoading all users...");
    await LoadUsers();
    console.log("Loaded all the users");

    console.log("\nStarting the bot...");
    //await bot.Run();
    console.log("Bot is running");
});