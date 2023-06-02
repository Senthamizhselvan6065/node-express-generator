var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { dbUrl } = require("../Database/dbConfig");
mongoose.connect(dbUrl);
const { UserModel } = require("../Schemas/UserSchema");
const { hashPassword, hashCompare, createToken, validate, roleAdmin } = require("../Database/auth");


/* GET users listing. */
router.get("/", validate, roleAdmin, async (req, res, next) => {
  try {
    if (await UserModel.find()) {
      let getData = await UserModel.find();
      res.status(200).send({
        message: "User Data Fetch Successfully...!",
        getData,
      });
    } else {
      res.status(400).send({
        message: "User Data Not Found...!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error...!",
      error,
    });
  }
});

// POST Data
router.post("/signup", async (req, res) => {
  try {
    let postData = await UserModel.findOne({ email: req.body.email });
    if (!postData) {
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword
      let user = await UserModel.create(req.body);
      res.status(200).send({
        message: "User Data Signup Successfully...!",
        user,
      });
    } else {
      res.status(400).send({
        message: "User Data Already Exists...!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error...!",
      error,
    });
  }
});

// Update or Put Data
router.put("/:id", async (req, res) => {
  try {
    let putData = await UserModel.findOne({ _id: req.params.id });
    if (putData) {
      putData.name = req.body.name;
      putData.email = req.body.email;
      putData.password = req.body.password;
      let save = await putData.save();
      res.status(200).send({
        message: "User Data Update Successfully...!",
        save,
      });
    } else {
      res.status(400).send({
        message: "User Data Deos Not Exists...!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error...!",
      error,
    });
  }
});

// Get Specific Data By ID
router.get("/:id", async (req, res) => {
  try {
    let getData = await UserModel.findOne({ _id: req.params.id });
    if (getData) {
      res.status(200).send({
        message: "User Data Get Successsfully...!",
        getData,
      });
    } else {
      res.status(400).send({
        message: "User Data Deos Not Exists...!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error...!",
      error,
    });
  }
});


// Delete Data
router.delete("/:id", async (req, res) => {
  try {
    let deleteData = await UserModel.findOne({ _id: req.params.id });
    if (deleteData) {
      let deleteUser = await UserModel.deleteOne({_id: req.params.id})
      res.status(200).send({
        message: "User Data Delete Successsfully...!",
        deleteUser
      });
    } else {
      res.status(400).send({
        message: "User Data Deos Not Exists...!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error...!",
      error,
    });
  }
});


// Login Data
router.post("/login", async(req, res)=>{
     try {
        let loginData = await UserModel.findOne({email: req.body.email})
        if (loginData) {
            if(await hashCompare(req.body.password, loginData.password)){
              let token = await createToken({
                name: loginData.name,
                email: loginData.email,
                id: loginData._id,
                role: loginData.role
              })
              res.status(200).send({
                message: "User Data Login Successfully...!",
                loginData,
                token
              })
            }else{
              res.status(402).send({
                message: "Token Invalid...!",
              })
            }
        } else {
          res.status(400).send({
            message: "User Data Deos Not Exists...!",
          });
        }
     } catch (error) {
      res.status(500).send({
        message: "Internal Server Error...!",
        error,
      });
     }
}) 


module.exports = router;