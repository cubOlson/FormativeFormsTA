const express = require('express');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const csrf = require('csurf');
const morgan = require('morgan');

const app = express();

const csrfProtection = csrf({ cookie: true });

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');

const users = [
	{
		id: 1,
		firstName: 'Jill',
		lastName: 'Jack',
		email: 'jill.jack@gmail.com'
	}
];

app.get('/', (req, res) => {
	res.render('index', { title: 'Formative Forms', users });
});

/* GET create form. */
app.get('/create', csrfProtection, (req, res, next) => {
	res.render('create-form', {
		title: 'Create a user',
		messages: [],
		csrfToken: req.csrfToken()
	});
});

app.post('/create', csrfProtection, (req, res, next) => {
	const { firstName, lastName, email, password, confirmedPassword } = req.body;
	const errors = [];

	if (!firstName) {
		errors.push('Please provide a first name.');
	}

	if (!lastName) {
		errors.push('Please provide a last name.');
	}

	if (!email) {
		errors.push('Please provide an email.');
	}

	if (!password) {
		errors.push('Please provide a password.');
	}

	if (password && password !== confirmedPassword) {
		errors.push('The provided values for the password and password confirmation fields did not match.');
	}

	if (errors.length) {
		res.render('create-form', {
			firstName,
			lastName,
			email,
			errors, 
			csrfToken: req.csrfToken()
		})
	}

	const newUser = {
		firstName, lastName, email
	}

	users.push(newUser);
	res.redirect('/');
});

app.get('/create-interesting', csrfProtection, (req, res, next) => {
	res.render('create-interesting', {
		title: 'Create an interesting user',
		messages: [],
		csrfToken: req.csrfToken()
	});
});

app.post('/create-interesting', csrfProtection, (req, res, next) => {
	const { firstName, lastName, email, age, favoriteBeatle, iceCream, password, confirmedPassword } = req.body;
	const errors = [];

	if (!firstName) {
		errors.push('Please provide a first name.');
	}

	if (!lastName) {
		errors.push('Please provide a last name.');
	}

	if (!email) {
		errors.push('Please provide an email.');
	}

	if (!age) {
		errors.push('Please provide your age.');
	}

	if (!favoriteBeatle) {
		errors.push('Please provide a Beatle. No Ringo.');
	}

	if (!password) {
		errors.push('Please provide a password.');
	}

	if (password && password !== confirmedPassword) {
		errors.push('The provided values for the password and password confirmation fields did not match.');
	}

	if (errors.length) {
		res.render('create-interesting', {
			firstName,
			lastName,
			email,
			iceCream,
			favoriteBeatle,
			age,
			errors, 
			csrfToken: req.csrfToken()
		})
	}

	const newUser = {
		firstName, lastName, email, iceCream: iceCream === 'on', favoriteBeatle, age
	};

	users.push(newUser);
	res.redirect('/');
});

const port = 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
