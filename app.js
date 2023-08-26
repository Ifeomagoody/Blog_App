require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')  //this helps to save cookie or session
const session = require('express-session');
const MongoStore = require('connect-mongo')


const connectDB = require('./server/config/db')

const app = express();
const PORT = 5000 || process.env.PORT;

//Connect to DB
connectDB();
app.use(express.urlencoded({ extended: true}))
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({       //this creates the cookie for us
    mongourl: process.env.MONGODB_URI
    }),
}))


app.use(express.static('public'));


//Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () =>{
    console.log(`App listening on port ${PORT}`);
})


//this is supposed to be in the index.ejs file before the a tag
 /* <% data.foreach(post => { %> 

 
<li>
    <a href="/post/<%- post_id %>">
        <span><%- post.title %> </span>
        <span class="article-list_date"><%- post.createdAt.toDateString() %></span>
    </a>
</li>

   <% }) %>

</ul>*/