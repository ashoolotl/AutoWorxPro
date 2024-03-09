exports.getLoginForm = (req, res, next) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getHomepage = (req, res, next) => {
    res.status(200).render('homepage');
};

exports.getDashboard = (req, res, next) => {
    res.status(200).render('dashboard', {
        title: 'Dashboard',
    });
};
