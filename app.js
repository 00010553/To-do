const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.render('index')
})

app.get('/create', (req, res) => {
	res.render('create')
})

app.post('/create', (req, res) => {
	const title = req.body.title
	const desc = req.body.desc

	if (title.trim() === '' && desc.trim() === '') {
		res.render('create', { error: true })
	} else {
		fs.readFile('./data/lists.json', (err, data) => {
		  if (err) throw err

		  const lists = JSON.parse(data)

		  lists.push({
			id: id (),
			title: title,
			description: desc,
		  })

		  fs.writeFile('./data/lists.json', JSON.stringify(lists), err => {
			if (err) throw err

			res.render('create', { success: true })
		  })
	   })
	}

})

app.get('/lists', (req, res) => {

	fs.readFile('./data/lists.json', (err, data) => {
		if (err) throw err

		const lists = JSON.parse(data)

		res.render('lists', { lists: lists })
	})
})

app.get('/lists/:id', (req, res) => {
	const id = req.params.id

	fs.readFile('./data/lists.json', (err, data) => {
		if (err) throw err

		const lists = JSON.parse(data)

		const list = lists.filter(list => list.id == id)[0]

		res.render('detail', {list: list})
	})
})

app.listen(8080, err => {
	if (err) console.log(err)

	console.log('App is running...')
})


function id () {
	return '_' + Math.random().toString(36).substr(2, 9);
  };