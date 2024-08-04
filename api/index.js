const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('./models/User.js')
const Place = require('./models/Place.js')
const Booking = require('./models/Booking.js')
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader');
const app = express();
const multer = require('multer');
const fs = require('fs')

const bcryptSalt = bcrypt.genSaltSync(10);

//A secret key used to sign the token. This key should be kept confidential and secure.
const jwtSecret = 'sdgdfklawsklafn';

//midware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads')); //image access


app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

//console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
  res.json('test ok11122333');
});

//24.45.238.229/32

//t4aDScJ1zVRzGF07

app.post("/register", async (req, res) => {
  const {name, email, password} = req.body;
  try{
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt)
    });
    res.json(userDoc);
  }catch(e){
    res.status(422).json(e);
  }
});

app.post('/login', async (req, res) => {
  const {email, password} = req.body;
  const userDoc = await User.findOne({
    email
  });
  if(userDoc){
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id,
        name: userDoc.name},
        jwtSecret,
        {},
        (err, token)=> {
          if(err){
            throw err;
          }else{
            res.cookie('token', token).json(userDoc);

            //if you want to run in different domain, you can add third parameter of cookie
          }
        }
      );
      
    }else{
      res.status(422).json('pass not ok');
    }
    
  }else{
    res.json('not found');
  }
});

app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  if(token){
    jwt.verify(token, jwtSecret, {}, (err, user) => {
      if(err){
        throw err;
      }
      //const {name, email, _id} = await User.findById(user.id);
      res.json(user);
    });

  }else{
    res.json(null);
  }
  
});

app.post('/logout', (req, res)=> {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) =>{
  const {link} = req.body;
  const newName = 'photo'+Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
    //dest: '../../uploads/' + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({dest: 'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  for(let i = 0; i < req.files.length; i ++){
    const {path, originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    //console.log(path);
    uploadedFiles.push(newPath.replace('uploads\\', ''));
    //console.log(uploadedFiles[i]);
  }
  res.json(uploadedFiles);
});

app.post('/places', async (req, res)=>{
  const {token} = req.cookies;
  const {
    title, 
    address, 
    addedPhotos, 
    description, 
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if(err){
      throw err;
    }
    
    const placeDoc = await Place.create({
      owner: user.id,
      title, 
      address, 
      photos: addedPhotos, 
      description, 
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    });
    res.json(placeDoc);
  });
});

app.get('/user-places', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    const {id} = user;
    res.json(await Place.find({owner: id}));
  });
});

app.get('/places/:id', async (req, res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});


app.put('/places', async (req, res)=>{
  const {token} = req.cookies;
  const {
    id,
    title, 
    address, 
    addedPhotos, 
    description, 
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;
  //const placeDoc = await Place.findById(id);
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if(err){
      throw err;
    }
    const placeDoc = await Place.findById(id);
    if(user.id === placeDoc.owner.toString()){
      placeDoc.set({
        title, 
        address, 
        photos: addedPhotos, 
        description, 
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
      });
      await placeDoc.save();
      res.json('ok');
    }
    
    
    //res.json(placeDoc);
  });
});


app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

function getUserDataFromReq(req){
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if(err) throw err;
      resolve(userData);
    });
  })
}


app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {place, checkIn, checkOut, price,
    numberOfGuests, name, phone} = req.body;
    Booking.create({
      place, checkIn, checkOut, price,
      numberOfGuests, name, phone,
      user: userData.id,
    }).then(doc=>{
      console.log(doc);
      res.json(doc);
    }).catch(err=>{
      throw err;
    });
});



app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({user:userData.id}).populate('place'));
})



app.listen(4000);