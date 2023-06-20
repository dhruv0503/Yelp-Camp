const User = require('../Models/users');

module.exports.registerForm =  (req,res) =>{
    res.render('users/register');
}

module.exports.register = async(req,res,next) =>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username})    ;
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err){
                return next(err);
            }
            req.flash('success', 'Registration Successful');
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }
}

module.exports.loginForm =  (req,res) =>{
    res.render('users/login')
}

module.exports.login =  (req,res) =>{
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout =  (req,res, next) =>{
    req.logout(function (err){
        if(err){
            return next(err);
        }
        req.flash('success', 'Logged Out');
        res.redirect('/campgrounds')
    })  
}