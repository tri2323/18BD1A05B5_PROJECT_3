const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/grocery', (err, database)=>{
	if(err) return console.log(err)
	db=database.db('grocery')
	app.listen(3000,()=>{
		console.log('Listening at port number 3000')
		
	})
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home page
app.get('/', (req,res)=>{
	db.collection('g1').find().toArray((err,result)=>{
		if(err) return console.log(err)
		res.render('homepage.ejs',{data:result})
	})
})

app.get('/salesdetails', (req,res)=>{
	db.collection('sales').find().toArray((err,result)=>{
		if(err) return console.log(err)
		res.render('salespage.ejs',{data:result})
	})
})

//add product page
app.get('/create', (req,res)=>{
	db.collection('g1').find().toArray((err,result)=>{
		if(err) return console.log(err)
		res.render('add.ejs',{data:result})
	})
})

app.get('/updatesales', (req,res)=>{
	db.collection('sales').find().toArray((err,result)=>{
		if(err) return console.log(err)
		res.render('updatesales.ejs',{data:result})
	})
})


//update stock page
app.get('/updatestock',(req,res)=>{
	db.collection('g1').find().toArray((err,result)=>{
		if(err) return console.log(err)
		res.render('update.ejs',{data:result})
	})
})

//delete page
app.get('/deleteproduct',(req,res)=>{
	db.collection('g1').find().toArray((err,result)=>{
		if(err) return console.log(err)
		res.render('delete.ejs',{data:result})
	})
})

//add new product to collection
app.post('/AddData',(req,res)=>{
	console.log(req.body)
	db.collection('g1').save(req.body,(err,result)=>{
		if(err) return console.log(err)
	console.log('New product added')
	res.redirect('/')
	})
})

app.post('/AddSales',(req,res)=>{
	db.collection('sales').save(req.body,(err,result)=>{
		if(err) return console.log(err)
	console.log('New sales detail added')
	res.redirect('/salesdetails')
	})
})

//update the stock
app.post('/update',(req,res)=>{

	db.collection('g1').find().toArray((err,result)=>{
		if(err) return console.log(err)
		for(var i=0;i<result.length;i++)
		{
			if(result[i].pid==toString(req.body.id))
			{
				s=result[i].quantity
				break
			}
		}	
		console.log(req.body.id)
		db.collection('g1').findOneAndUpdate({pid: toString(req.body.id)},{
			$set: {quantity: parseInt(s) + parseInt(req.body.quantity) }},{sort: {_id:-1}},
			(err,result)=>{
				if(err) return res.send(err)
				console.log(req.body.id+'stock updated')
				res.redirect('/')
		})
	})
})

//delete product
app.post('/delete',(req,res)=>{
	db.collection('g1').findOneAndDelete({pid:toString(req.body.pid)},(err,result)=>{
		if(err) return console.log(err)
		console.log('deleted')
		res.redirect('/')
	})
})