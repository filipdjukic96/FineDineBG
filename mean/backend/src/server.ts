import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';


const app = express();


//za brisanje slike
const fs = require('fs')


//za upload fajlova
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const mimetypeImage = file.mimetype.split('/')[1];
        //console.log("Mimetype slike:" + mimetypeImage);
        let error = null;
        if (mimetypeImage != 'png' && mimetypeImage != 'jpg' && mimetypeImage != 'jpeg') {
            error = new Error("Neispravan format slike!");
        }
        cb(error, "../../mean/frontend/src/assets/img");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = file.mimetype.split('/')[1];
        cb(null, name + "." + ext)
    }
});



app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/baza_diplomski');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('mongo open');
})

const router = express.Router();


//importi za modele

import User from './models/user';
import user from './models/user';
import Restaurant from './models/restaurant';
import Menu from './models/menu';
import Review from './models/review'
import { ReviewItem } from './models/reviewitem';

import { fstat } from 'fs';
import UserFavorites from './models/userfavorites';
import { FavoriteItem } from './models/favoriteitem';
import { ReservationItem } from './models/reservationitem';
import RestaurantReservations from './models/restaurantreservations';
import UserReservations from './models/userreservations';
import restaurant from './models/restaurant';




const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

//checkAuth dodati kao autorizaciju tj middleware poslije post( ili get( a prije (req,res) => ...





///////////////////////////////////////////////////////////////////////////////////////
////////////////// LOGIN - REGISTRACIJA - PROMJENA SIFRE  ////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////



router.route('/login').post(
    (req, res) => {
        let username = req.body.username;
        let type = req.body.type;
        let profilePicture;

        User.findOne({ username: username, type: type })
            .then(user => {
                if (!user) {
                    return res.status(200).json({
                        message: "User not found"
                    });
                }

                profilePicture = user.profilePicture;
                //console.log(user);
                return bcrypt.compare(req.body.password, user.password)

            })
            .then(result => {
                //console.log(result);
                if (!result) {
                    return res.status(200).json({
                        message: "Password incorrect"
                    });
                }

                const token = jwt.sign({ username: user.username, type: user.type }, "secret_password_for_token_validation", { expiresIn: "1h" });
                //console.log(token);
                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    message: "Auth complete",
                    type: type,
                    profilePicture: profilePicture

                });
            })
            .catch(err => {
                return res.status(404).json({
                    message: "Auth failed"
                });
            });


    });


router.route('/register').post(multer({ storage: storage }).single("image"), (req, res) => {

    const data = {
        username: req.body.username,
        favorites: new Array<FavoriteItem>()
    }
    let userFavorites = new UserFavorites(data);

    const data2 = {
        username: req.body.username,
        reservations: new Array<ReservationItem>()
    }
    let userReservations = new UserReservations(data2);


    //console.log("File name: "+req.file.filename);

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            let user = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                password: hash,
                type: req.body.type,
                contactPhone: req.body.contactPhone,
                email: req.body.email,
                municipality: req.body.municipality,
                address: req.body.address,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                profilePicture: req.file.filename
            });
            user.save().
                then(result => {
                    userFavorites.save()
                        .then(resultUF => {
                            userReservations.save()
                                .then(resultUR => {
                                    res.status(200).json({
                                        message: "User created",
                                        result: result
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    });
                                })
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        })
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});


router.route('/findUser/:username').get((req, res) => {
    let username = req.params.username;

    User.findOne({ 'username': username },
        (err, user) => {
            //console.log(user);
            if (err) console.log(err);
            else res.status(200).json(user);
        })
});


router.route('/passwordChange').post(
    (req, res) => {

        let username = req.body.username;
        let password = req.body.password;
        let newPassword = req.body.newPassword;

        User.findOne({ username: username })
            .then(user => {

                if (!user) {
                    return res.status(200).json({
                        message: "User not found"
                    })
                }
                //console.log(user);

                bcrypt.compare(password, user.password, (err, same) => {

                    if (!same) {
                        return res.status(200).json({
                            message: "Old password incorrect"
                        })
                    }

                    bcrypt.hash(newPassword, 10)
                        .then(hash => {

                            User.update({ username: username }, { $set: { password: hash } },
                                (err, response) => {
                                    //console.log(response);
                                    if (err) console.log(err);
                                    else res.status(200).json({
                                        message: "Password changed"
                                    });
                                })
                        })

                })

            })

    }
);


//--------------------------------------------------------------------------------------------------------



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////                ZA ADMINA                   ////////////////////
///////////////////////////////////////////////////////////////////////////////////////

router.route('/addRestaurant').post(checkAuth, (req, res) => {

    //console.log("req body");
    //console.log(req.body);

    //console.log("restaurant");

    let restaurant = new Restaurant(req.body);

    const data = {
        restaurantKey: req.body.key,
        numberOfReserved: 0,
        reservations: new Array<ReservationItem>()
    }

    let restaurantReservation = new RestaurantReservations(data);

    const reviewData = {
        restaurantKey: req.body.key,
        sumGrades: 0,
        totalGrades: 0,
        reviews: new Array<ReviewItem>()
    }
    let review = new Review(reviewData);


    //console.log(restaurant);

    restaurant.save()
        .then(rest => {

            //console.log("SUCCESS");


            //restoran dodat, dodaje se njegov objekat u Reviews
            review.save()
                .then(restReview => {
                    restaurantReservation.save()
                        .then(restRes => {
                            res.status(200).json({
                                message: "Success"
                            });
                        })
                        .catch(err => {
                            console.log("ERROR RESERVATIONS");
                            console.log(err);
                            res.status(200).json({
                                message: "Failure"
                            });
                        })

                })
                .catch(err => {
                    console.log("ERROR REVIEW");
                    console.log(err);
                    res.status(200).json({
                        message: "Failure"
                    });
                })


        })
        .catch(err => {
            console.log("ERROR ADD RESTAURANT");
            console.log(err);
            //console.log("ERROR2");

            res.status(200).json({
                message: "Failure"
            });
        })

})

router.route('/addMenu').post(checkAuth, (req, res) => {

    //console.log("req body");
    //console.log(req.body);

    //console.log("restaurant");
    //console.log("Usao u add menu");
    let menu = new Menu(req.body);

    //console.log("Menu");
    //console.log(menu);

    menu.save()
        .then(men => {
            //console.log("SUCCESS");
            console.log("Add menu success");
            res.status(200).json({
                message: "Success"
            });
        })
        .catch(err => {
            console.log("ERROR ADD MENU");
            console.log(err);
            //console.log("ERROR2");
            //console.log("Add menu error");
            console.log(err);
            res.status(200).json({
                message: "Failure"
            });
        })

})



router.route('/addRestaurantImages').post(checkAuth, multer({ storage: storage }).array("image"), (req, res) => {


    //console.log("File name: "+req.file.filename);
    //console.log(req.files);
    //console.log("LENGTH");
    //console.log(req.files.length);
    const picturesArray = new Array<String>();

    //pakovanje ostalih slika
    for (let i = 2; i < req.files.length; i++) {
        picturesArray[i - 2] = req.files[i].filename;
    }

    let mainPictureName = req.files[0].filename;
    let coverPictureName = req.files[1].filename;

    Restaurant.update({ name: req.body.restaurant },
        { $set: { mainPicture: mainPictureName, coverPicture: coverPictureName, pictures: picturesArray } },
        (err, response) => {
            if (err) {
                res.status(200).json({
                    message: "Failure"
                });
            }
            else {
                res.status(200).json({
                    message: "Success"
                });
            }
        })


});


router.route('/restaurantInfo/:restaurantKey').get(checkAuth, (req, res) => {

    let restaurantKey = req.params.restaurantKey;

    Restaurant.findOne({ key: restaurantKey })
        .then(restaurant => {

            Menu.findOne({ restaurantKey: restaurantKey })
                .then(menu => {

                    Review.findOne({ restaurantKey: restaurantKey })
                        .then(review => {


                            res.status(200).json({
                                restaurant: restaurant,
                                menu: menu,
                                review: review
                            })

                        })

                })

        })


})

router.route('/changeRestaurantInfo').post(checkAuth, (req, res) => {

    let key = req.body.key;

    Restaurant.findOneAndUpdate({ key: key },
        {
            $set: {
                name: req.body.name,
                address: req.body.address,
                municipality: req.body.municipality,
                workHoursWorkdays: req.body.workHoursWorkdays,
                workHoursSaturday: req.body.workHoursSaturday,
                workHoursSunday: req.body.workHoursSunday,
                cuisine: req.body.cuisine,
                dressCode: req.body.dressCode,
                paymentOptions: req.body.paymentOptions,
                additional: req.body.additional,
                website: req.body.website,
                contactPhone: req.body.contactPhone,
                category: req.body.category,
                capacity: req.body.capacity,
                description: req.body.description,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
        }, {
            new: true
        },
        (err, response) => {
            //console.log("Response")
            //console.log(response);
            if (err) {
                res.status(200).json({
                    message: "Failure",
                    restaurant: null
                })
            } else {
                res.status(200).json({
                    message: "Success",
                    restaurant: response
                })
            }
        })

})



router.route('/changeRestaurantMenu').post(checkAuth, (req, res) => {


    //console.log("req body");
    //console.log(req.body);

    Menu.replaceOne({ restaurantKey: req.body.restaurantKey },
        req.body,
        (err, result) => {
            if (err) {
                res.status(200).json({
                    message: "Failure"
                })
            } else {
                res.status(200).json({
                    message: "Success"
                })
            }
        })

})



router.route('/changeCoverImage').post(checkAuth, multer({ storage: storage }).single("image"), (req, res) => {

    res.status(200).json({
        message: "Success"
    })

});

router.route('/changeMainImage').post(checkAuth, multer({ storage: storage }).single("image"), (req, res) => {

    res.status(200).json({
        message: "Success"
    })

});

//dodavanje slika restoranu
router.route('/addMoreImages').post(checkAuth, multer({ storage: storage }).array("image"), (req, res) => {


    const picturesArray = new Array<String>();
    let restaurantKey = req.body.restaurantKey;

    //pakovanje slika tj imena u niz
    for (let i = 0; i < req.files.length; i++) {
        picturesArray[i] = req.files[i].filename;
    }


    //dodavanje nizu pictures u restoranu
    Restaurant.update({ key: restaurantKey },
        { $push: { pictures: picturesArray } },
        (err, result) => {
            if (err) {
                res.status(200).json({
                    message: "Failure"
                })
            } else {
                res.status(200).json({
                    message: "Success"
                })
            }
        })
});


router.route('/deleteImage').post(checkAuth, (req, res) => {

    let restaurantKey = req.body.restaurantKey;
    let imageName = req.body.imageName;

    let imagePath = "../../mean/frontend/src/assets/img/" + imageName;
    //brisanje fajla iz direktorijuma
    fs.unlinkSync(imagePath);

    Restaurant.update({ key: restaurantKey },
        { $pull: { pictures: imageName } },
        (err, result) => {
            if (err) {
                res.status(200).json({
                    message: "Failure"
                })
            } else {
                res.status(200).json({
                    message: "Success"
                })
            }
        })

})


router.route('/deleteReview').post(checkAuth, (req, res) => {

    let restaurantKey = req.body.restaurantKey;
    let username = req.body.username;
    let grade = req.body.grade;
    let comment = req.body.comment;
    let dateTime = new Date(req.body.dateTime);

    //console.log(req.body);

    Review.update({ restaurantKey: restaurantKey },
        {
            $pull: { reviews: { username: username, grade: grade, comment: comment, dateTime: dateTime } },
            $inc: { sumGrades: -req.body.grade, totalGrades: -1 }
        })
        .then(res1 => {

            Restaurant.update({ key: restaurantKey },
                { $inc: { sumGrades: -req.body.grade, totalGrades: -1 } })
                .then(res2 => {
                    res.status(200).json({
                        message: "Success"
                    })
                })
                .catch(err => {
                    console.log(err);
                    return res.status(200).json({
                        message: "Failure"
                    })
                })

        })
        .catch(err => {
            console.log(err);
            return res.status(200).json({
                message: "Failure"
            })
        })

})


router.route('/restaurants').get(checkAuth, (req, res) => {

    Restaurant.find({})
    .then(restaurants => {
        res.status(200).json({
            restaurants: restaurants,
            message: "Success"
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(200).json({
            message: "Failure"
        })
    })

})



router.route('/restaurants/:searchInput').get(checkAuth, (req, res) => {

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const searchInput = req.params.searchInput;
    const restaurantQuery = Restaurant.find({ name: { $regex: searchInput, $options: 'i' } });


    let fetchedRestaurants;
    let countRestaurants;

    if (pageSize && currentPage) {
        //ako su postavljeni query parametri
        restaurantQuery
            .skip(pageSize * (currentPage - 1)) //koliko preskacemo dokumenata
            .limit(pageSize); //koliko ogranicavamo upit, koliko nam vraca dokumenata
    }

    Restaurant.count({ name: { $regex: searchInput, $options: 'i' } })
        .then(count => {

            countRestaurants = count;

            restaurantQuery
                .then(documents => {
                    fetchedRestaurants = documents;

                    res.status(200).json({
                        message: "Restaurants fetched successfully",
                        restaurants: fetchedRestaurants,
                        maxRestaurants: countRestaurants
                    })

                })
        })


})






///////////////////////////////////////////////////////////////////////////////////////
//////////////////////                ZA KORISNIKA                   //////////////////
///////////////////////////////////////////////////////////////////////////////////////




router.route('/restaurantData/:restaurantKey').get(checkAuth, (req, res) => {

    let restaurantKey = req.params.restaurantKey;

    Restaurant.findOne({ key: restaurantKey })
        .then(restaurant => {

            Menu.findOne({ restaurantKey: restaurantKey })
                .then(menu => {

                    Review.findOne({ restaurantKey: restaurantKey })
                        .then(review => {
                            RestaurantReservations.findOne({ restaurantKey: restaurantKey })
                                .then(restaurantReservations => {

                                    res.status(200).json({
                                        restaurant: restaurant,
                                        menu: menu,
                                        review: review,
                                        restaurantReservations: restaurantReservations
                                    })

                                })

                        })

                })

        })


})




router.route('/addReview').post(checkAuth, (req, res) => {

    const currentDateUTC = new Date();
    var offset = (currentDateUTC.getTimezoneOffset() / 60) * -1;
    const currentDateLocal = new Date(currentDateUTC.getTime() + offset);

    //console.log(currentDateLocal);
    //console.log("off: " + currentDateUTC.getTimezoneOffset());
    req.body.review.dateTime = currentDateLocal;

    const review = req.body.review;

    let restaurantKey = req.body.restaurantKey;


    Review.update({ restaurantKey: restaurantKey }, {
        $inc: { sumGrades: review.grade, totalGrades: 1 },
        $push: { reviews: review }
    })
    .then(res1 => {

            Restaurant.update({ key: restaurantKey },
                { $inc: { sumGrades: review.grade, totalGrades: 1 } })
                .then(res2 => {

                    res.status(200).json({
                        message: "Review added",
                    })

                })
                .catch(err => {
                    console.log("error update restaurant");
                    console.log(err);
                   return res.status(200).json({
                        message: "Review add failure",
                    })
                })

        })
    .catch(err => {
        console.log("error update review");
            console.log(err);
           return res.status(200).json({
                message: "Review add failure",
            })
        })


})



router.route('/getFavorites/:username').get((req, res) => {
    UserFavorites.findOne({ username: req.params.username }, (err, uFavs) => {
        if (err) console.log(err);
        else {
            res.json({
                userFavorites: uFavs
            });
        }
    })
})


router.route('/getReservations/:username').get((req, res) => {
    UserReservations.findOne({ username: req.params.username }, (err, uRes) => {
        if (err) console.log(err);
        else {

            //console.log("fetched reservations");
            //console.log(uRes);

            res.json({
                userReservations: uRes
            });
        }
    })
})



router.route('/addFavorite').post(checkAuth, (req, res) => {

    const data = {
        restaurantName: req.body.restaurantName,
        restaurantKey: req.body.restaurantKey,
        restaurantAddress: req.body.restaurantAddress,
        restaurantWebsite: req.body.restaurantWebsite,
        dateTime: new Date()
    }

    UserFavorites.updateOne({ username: req.body.username },
        { $push: { favorites: data } },
        (err, response) => {
            //console.log(response);
            if (err) console.log(err);
            else res.status(200).json({
                message: "Favorite added"
            });
        })

})

router.route('/deleteFavorite').post(checkAuth, (req, res) => {

    UserFavorites.updateOne({ username: req.body.username },
        { $pull: { favorites: { restaurantName: req.body.restaurantName, restaurantKey: req.body.restaurantKey } } },
        (err, response) => {
            //console.log(response);
            if (err) console.log(err);
            else res.status(200).json({
                message: "Favorite deleted"
            });
        })

})


router.route('/addReservation').post(checkAuth, (req, res) => {


    console.log("datetime from frontend");
    console.log(req.body.dateTime);

    let dateTime = new Date(req.body.dateTime);
    req.body.dateTime = dateTime;

    console.log("transformed datetime");
    console.log(req.body.dateTime);

    UserReservations.updateOne({ username: req.body.username },
        { $push: { reservations: req.body } })
        .then(result => {
            RestaurantReservations.updateOne({ restaurantKey: req.body.restaurantKey },
                { $push: { reservations: req.body }, $inc: { numberOfReserved: req.body.numberOfPeople } })
                .then(result2 => {
                    res.status(200).json({
                        message: "Reservation added",
                    })
                })
                .catch(err => {
                    return res.status(404).json({
                        message: "Reservation not added"
                    });
                });
        })

})


router.route('/deleteReservation').post(checkAuth, (req, res) => {

    let dateTime = new Date(req.body.dateTime);
    req.body.dateTime = dateTime;

    UserReservations.updateOne({ username: req.body.username },
        { $pull: { reservations: { restaurantName: req.body.restaurantName, restaurantKey: req.body.restaurantKey, dateTime: req.body.dateTime, username: req.body.username } } })
        .then(result => {
            RestaurantReservations.updateOne({ restaurantKey: req.body.restaurantKey },
                { $pull: { reservations: { restaurantName: req.body.restaurantName, restaurantKey: req.body.restaurantKey, dateTime: req.body.dateTime, username: req.body.username } }, $inc: { numberOfReserved: -req.body.numberOfPeople } })
                .then(result2 => {
                    res.status(200).json({
                        message: "Reservation removed",
                    })
                })
                .catch(err => {
                    return res.status(404).json({
                        message: "Reservation not removed"
                    });
                });
        })

})


router.route('/allRestaurants').get((req, res) => {
    Restaurant.find({})
    .then(restaurants => {
        res.status(200).json({
            restaurants: restaurants,
            message: "Success"
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(200).json({
            message: "Failure"
        })
    })
})



router.route('/updateUserInfo').post((req, res) => {
    console.log("update info");
    User.updateOne({ username: req.body.username },
        { $set: {firstname: req.body.firstname,
            lastname: req.body.lastname,
            contactPhone: req.body.contactPhone,
            email: req.body.email,
            municipality: req.body.municipality,
            address: req.body.address, 
            latitude: req.body.latitude, 
            longitude: req.body.longitude } },
        (err, response) => {
            //console.log(response);
            if (err) console.log(err);
            else res.status(200).json({
                message: "Info updated"
            });
        })


})


router.route('/changeProfilePicture').post(checkAuth, multer({ storage: storage }).single("image"), (req, res) => {

    res.status(200).json({
        message: "Success, profile picture changed"
    })

});


///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////



app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Acces-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));