const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

// localhost:8080

app.get('/', (req, res) => {
	fs.readFile('./data/todos.json', (err, data) => {
	  if (err) throw err
  
	  const todos = JSON.parse(data)
  
	  res.render('index', { todos: todos })
	})
  })

app.get('/create', (req, res) => {
	res.render('create')
})

// ADD //////////////////////////////////

app.post('/add', (req, res) => {
  const formData = req.body

  if (formData.todo.trim() == '') {
    fs.readFile('./data/todos.json', (err, data) => {
      if (err) throw err

      const todos = JSON.parse(data)

      res.render('create', { error: true, todos: todos })
    })
  } else {
    fs.readFile('./data/todos.json', (err, data) => {
      if (err) throw err

      const todos = JSON.parse(data)

      const todo = {
        id: id(),
        description: formData.todo,
        done: false
      }

      todos.push(todo)

      fs.writeFile('./data/todos.json', JSON.stringify(todos), (err) => {
        if (err) throw err

        fs.readFile('./data/todos.json', (err, data) => {
          if (err) throw err

          const todos = JSON.parse(data)

          res.render('create', { success: true, todos: todos })
        })
      })
    })
  }
})

//  DELETE ///////////////////////////////////

app.get('/:id/delete', (req, res) => {
	const id = req.params.id
  
	fs.readFile('./data/todos.json', (err, data) => {
	  if (err) throw err
  
	  const todos = JSON.parse(data)
  
	  const filterTodo = todos.filter(todo => todo.id != id)
  
	  fs.writeFile('./data/todos.json', JSON.stringify(filterTodo), (err) => {
		if (err) throw err
  
		res.render('create', { todos: filterTodo, deleted: true })
	  })
	})
  })
  
//   UPDATE /////////////////////////////////////

  app.get('/:id/update', (req, res) => {
	const id = req.params.id
  
	fs.readFile('./data/todos.json', (err, data) => {
	  if (err) throw err
	  
	  const todos = JSON.parse(data)
	  const todo = todos.filter(todo => todo.id == id)[0]
	  
	  const todoId = todos.indexOf(todo)
	  const splicTodo = todos.splice(todoId, 1)[0]
	  
	  splicTodo.done = true
	  
	  todos.push(splicTodo)
  
	  fs.writeFile('./data/todos.json', JSON.stringify(todos), (err) => {
		if (err) throw err
  
		res.render('create', { todos: todos })
	  })
	})
	  
  })

//   PORT ///////////////////////////////

app.listen(8080, err => {
	if (err) console.log(err)

	console.log('App is running...')
})

// ID GENERATOR ///////////////////////////

function id () {
	return '_' + Math.random().toString(36).substr(2, 9);
  };