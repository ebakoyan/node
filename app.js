const express = require('express');
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const upload = require('express-fileupload');

const mongUri='mongodb+srv://admin:admin1234@cluster0.kf4jd.mongodb.net/Blogs?retryWrites=true&w=majority'
app = express()

mongoose.connect(mongUri,{useNewUrlParser:true,useUnifiedTopology:true})
    .then( result => app.listen(3000))
    .catch(err =>console.log(err));

app.set('view engine','ejs');


app.use("/blogs/",express.static('public'))
app.use(express.static('public'))



app.use(express.urlencoded({extended: true}));

app.use(upload())

app.get('/',(req,res)=>{
    Blog.find().sort({createdAt:-1})
    .then(result =>{
        res.render('index',{blogs:result})
    })
    .catch(err => console.log(err))
})
app.get('/blogs/:id',(req,res)=>{
    const id =req.params.id
    Blog.findById(id)
    .then(result =>{
        res.render('blogInfo',{blog:result})
    })
})
app.post('/blogs',(req,res)=>{
    blog = new Blog({
        title:`${req.body.title}`,
        body:`${req.body.body}`,
        imgSrc:`${req.files.imgSrc.name}`
    })
    
    blog.save()
    .then(()=>{res.redirect('/')})

    file=req.files.imgSrc;

    file.mv(`./public/${file.name}`,(err)=>console.log(err))
})
app.get('/create',(req,res)=>{
    res.render('createBlog')
})

app.get('/404',(req,res)=>{
    res.render('404a')
})

app.use((req,res)=>{
    res.redirect('404');
})


