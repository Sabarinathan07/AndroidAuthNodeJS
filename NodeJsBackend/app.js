const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

app.use(express.json());

mongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
	if (err) {
		console.log(err);
		return;
	} else {
		const myDb = client.db('myDb');
		const myCollection = myDb.collection('myCollection');

		app.post('/signup', (req, res) => {
			const newUser = {
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
			};

			const query = { email: newUser.email };

			myCollection.findOne(query, (err, result) => {
				if (result == null) {
					myCollection.insertOne(newUser, (err, result) => {
						res.status(200).send('User created');
					});
				} else {
					res.status(400).send('User already exists');
				}
			});
		});
		app.post('/login', (req, res) => {
			const query = {
				email: req.body.email,
				password: req.body.password,
			};

			myCollection.findOne(query, (err, result) => {
				if (result == null) {
					res.status(404).send('User not found');
				} else {
					const ObjToSend = {
						name: result.name,
						email: result.email,
						password: result.password,
					};
					res.status(200).send(JSON.stringify(ObjToSend));
				}
			});
		});
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
