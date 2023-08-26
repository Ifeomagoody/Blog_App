const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');   //this helps with the cookies on the website

const adminLayout = "../views/layout/admin";
const jwtSecret =process.env.JWT_SECRET;



/**
 * 
 *   Check - Login 
 */

const authMiddleWare = (req, res, next) => {
  const token = req.cookies.token;


  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    req.userId = decoded.userId
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}

  





/**
 * GET
 *   Admin - Login page
 */


  router.get('/admin', async (req, res) => {
try {
  const locals = {
    title: "Admin",
    description: "Simple Blog Created with Nodejs, Express & Mongodb...",
  };

 // const data = await Post.find();
  res.render("admin/index", { locals, layout: adminLayout });
} catch (error) {
  console.log(error);
}
    });



    /**
 * POST
 *   Admin - Check Login page
 */

     router.post("/admin", async (req, res) => {
       try {
        const { username, password } = req.body;
         
        const user = await User.findOne( { username });

        if(user){
          return res.status(401).json( { message: 'Invalid Credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
             return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign( { userId: user_id}, jwtSecret )//save a token to thecookie
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/dashboard');


       } catch (error) {
         console.log(error);
       }
     });


        /**
 * POST
 *   Admin - Check Login page
 */

     router.get("/dashboard", authMiddleWare, async (req, res) => {

      try {

      const locals = {
        title: "Dashboard",
        description: "Simple Blog Created with Nodejs, Express & Mongodb...",
      };



        const data = await Post.find();
            res.render("admin/dashboard", {
            locals,
            data, 
            layout: adminLayout
            });
      } catch (error) {
        
      }
     });





           /**
 * GET
 *   Admin - Create New Post
 */


router.get("/add-post", authMiddleWare, async (req, res) => {   //middleware checks if a user is logged in
  try {
    const locals = {
      title: "Add-Post",
      description: "Simple Blog Created with Nodejs, Express & Mongodb...",
    };

    const data = await Post.find();
    res.render("admin/add-post", {
      locals,
      data,
      layout: adminLayout
    });
  } catch (error) {
    console.log(error)
  }
});




           /**
 * POST
 *   Admin - Create New Post
 */


router.post("/add-post", authMiddleWare, async (req, res) => {   //middleware checks if a user is logged in
  try {
try {
  const newPost = new Post({
    title: req.body.title,
    body: req.body.body,
  });

  await Post.create(newPost)
  res.redirect("/dashboard");

} catch (error) {
  console.log(error)
}


   
  } catch (error) {
    console.log(error)
  }
});




     /*router.post("/admin", async (req, res) => {
       try {
        const { username, password } = req.body;
        //console.log(req.body)



        if (req.body.username === 'admin' && req.body.password === 'password') {
          res.send('You are logged in!');
        } else {
          res.send('Wrong username or password')
        }

         // const data = await Post.find();
         //res.render("admin/index", { locals, layout: adminLayout });
         res.redirect('/admin')


       } catch (error) {
         console.log(error);
       }
     });*/




    /**
 * POST
 *   Admin - Register
 */

     router.post("/register", async (req, res) => {
       try {
         const { username, password } = req.body;
         const hashedPassword = await bcrypt.hash(password, 10);


       try {
        const user = await User.create({ username, password:hashedPassword });  //this takes in the user's encrypted password
        res.status(201).json({ message: 'User Created', user});       //then sends a 201 code showing that the password was successful
       } catch (error) {
        if(error.code === 11000) {
          res.status(409).json({ message: 'User already in use'});
        }
        res.status(500).json({ message: 'internal server error'})
        
       }



         
       } catch (error) {
         console.log(error);
       }
     });









module.exports = router;