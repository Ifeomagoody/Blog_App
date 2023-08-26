const express = require('express');
const router = express.Router();
const Post = require('../models/Post')


//Routes
router.get('', async (req, res) => {
    try {
      const locals = {
        title: "Models Blog",
        description: "Simple Blog Created with Nodejs, Express & Mongodb...",
      };

      let perPage = 10;    // the number of blocks we want to display per page is 10
      let page = req.query.page || 1  //if the exact page number is not stated it should be a default 1

      const data = await Post.aggregate([ { $start: { createdAt: -1} } ]) //it takes the oldest data and places it at the top
      .skip(perPage * page - perPage) //this enables to skip page that are not wanted and this is done 10times
      .limit(perPage) //it does not go beyond 10
      .exec() //this executes the aggregrate

      const count = await Post.count()  //this function counts how many block posts that we have
      const nextPage = parseInt(page) + 1; //this helps to convert the number into an integer
      const hasNextPage = nextPage <= Math.ceil(count / perPage);

      res.render('index', {locals, data, current: page, nextPage: hasNextPage ? nextPage : null})  //it can have nextpage, or null




      //const data = await Post.find();
      //res.render("index", { locals, data });
    } catch (error) {
      console.log(error);
    }


    //res.render('index', { locals})
});





/*function insertPostData () {
    Post.insertMany([
        {
        title: "Building a Blog",
        body: "This is the body"
    },
    {
        title: "build real-time, eent-driven application in Node.js",
        body: "Socket.io: learn how to use Socket.io to build real-time, event-driven application in NodeJs"
    }
])
}

insertPostData();*/


/**
 * GET
 * Post: id
 */

  router.get('/post/:id', async (req, res) => {



try {
   let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog Created with Nodejs, Express & Mongodb...",
    };



    res.render('post', {locals, data});
} catch (error ) {
   console.log(error); 
}


    //res.render('index', { locals})
});


/**
 * post
 * Post: searchTerm
 */

router.post('/search', async (req, res) => {
   

      try {
        const locals = {
          title: "Search",
          description: "Simple Blog Created with Nodejs, Express & Mongodb...",
        };

        let searchTerm = req.body.searchTerm;
        //  console.log(searchTerm)
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g, "");

        const data = await Post.find({
          $or: [
            {
              title: { $regex: new RegExp(searchNoSpecialChar, '1') },
              body: { $regex: new RegExp(searchNoSpecialChar, '1') },
            },
          ],
        });

        //res.send(searchTerm);
        res.render("search", {
             data,
             locals
            
            });


      }catch (error){
        console.log(error);
      }


    })





router.get('/about', (req, res) => {
    res.render('about')
});



module.exports = router