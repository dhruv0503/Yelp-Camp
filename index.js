if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const expressError = require('./utils/expressError')
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const lPassport = require('passport-local');
const user = require('./Models/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const mongoStore = require('connect-mongo');
const dbUrl = process.env.DBURL || 'mongodb://127.0.0.1:27017/yelpCamp';
const secret = process.env.secret || 'Secret402';

const userRouter = require('./routes/users');
const campRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("Database Connected");
})

const store = mongoStore.create({
    mongoUrl : dbUrl,
    touchAfter : 24 * 3600,
    secret
})

store.on("error", (e) => {
    console.log("Store Error", e);
})

const sessionOptions = {
    store,
    name : 'Session',
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        // secure : true,
        expires : Date.now() + (1000*60*60*24*7),
        maxAge : 1000*60*60*24*7
    }
}

app.use(session(sessionOptions));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(mongoSanitize());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/diciztr9v/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new lPassport(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    if(!['/login', '/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req,res) =>{
    res.render('home');
})

app.use('/campgrounds', campRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', userRouter)


app.all('*', (req, res, next) =>{
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('camping/error', {err})  
})

app.listen(3000, () =>{
    console.log("Connected");
})