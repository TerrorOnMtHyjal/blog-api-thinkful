const EXPRESS = require('express');
const BODYPARSER = require('body-parser');
const APP = EXPRESS();
const JSONPARSER = BODYPARSER.json();

const {BlogPosts} = require('./models');

BlogPosts.create('How to make an express app.', 'Learn express and make it.', 'Jared Mohney');
BlogPosts.create('Is Rey a Palpatine or a Kenobi?', 'She better be a damn Palpatine!', 'Jared Mohney');
BlogPosts.create('10 easy ways to hate yourself.', 'Make 10 poor choices.', 'Jared Mohney');

//get all existing blog posts as json
APP.get('/blog', (req, res) => {
  res.json(BlogPosts.get());
});

//add a new blog post
APP.post('/blog', JSONPARSER, (req, res) => {
  const REQUIREDFIELDS = ['title', 'content', 'author'];
  
  for(let i=0; i < REQUIREDFIELDS.length; i++){
    const FIELD = REQUIREDFIELDS[i];
    if(!(FIELD in req.body)){
      const MESSAGE = `Hey buddy, you're missing ${FIELD}!`;
      console.error(MESSAGE);
      return res.status(400).send(MESSAGE);
    }
  }

  const NEWPOST = BlogPosts.create({title: req.body.title, content: req.body.content, author: req.body.author});
  res.status(201).json(NEWPOST);
});

//update a post
APP.put('/blog/:id', JSONPARSER, (req, res) => {
  const REQUIREDFIELDS = ['title', 'content', 'author', 'id'];
  
  for(let i=0; i < REQUIREDFIELDS.length; i++){
    const FIELD = REQUIREDFIELDS[i];
    if(!(FIELD in req.body)){
      const MESSAGE = `Hey buddy, you're missing ${FIELD}!`;
      console.error(MESSAGE);
      return res.status(400).send(MESSAGE);
    }
  }

  if(req.params.id !== req.body.id){
    const MESSAGE = `${req.params.id} doesn't match ${req.body.id}, dummy!`;
    console.error(MESSAGE);
    return res.status(400).send(MESSAGE);
  }

  const UPDATEDPOST = BlogPosts.update({title: req.body.title, content: req.body.content, author: req.body.author, id: req.params.id});
  res.status(200).json(UPDATEDPOST);
});

//delete a post
APP.delete('/blog/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.id}\``);
  res.status(204).end();
});



APP.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});