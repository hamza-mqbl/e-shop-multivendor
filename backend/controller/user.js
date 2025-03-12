const express = require("express");
const path = require("path");
const User = require("../model/user");
const { upload } = require("../multer");
const multer = require("multer");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/sendToken");
const cloudinary = require("cloudinary").v2;

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated } = require("../middleware/auth");
// Set up multer for handling multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create-user", upload.single("avatar"), async (req, res, next) => {
  // console.log("this is local testing")
  console.log("File received:", req.file); // Confirm the file is received

  try {
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    let avatarResult;
    if (req.file) {
      try {
        avatarResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "avatars",
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error); // Log any errors from Cloudinary
                return reject(new ErrorHandler(error.message, 500));
              }
              console.log("Cloudinary upload result:", result); // Log the Cloudinary result
              resolve(result);
            }
          );

          uploadStream.end(req.file.buffer); // End the stream with the file buffer
        });
      } catch (error) {
        return next(new ErrorHandler("Image upload failed", 500));
      }
    }

    const user = new User({
      name,
      email,
      password,
      avatar: {
        public_id: avatarResult.public_id,
        url: avatarResult.secure_url,
      },
    });

    await user.save();

    const activationToken = createActivationToken(user);
    const activationUrl = `http://13.60.95.182:8000/activation/${activationToken}`;

    // const activationUrl = `http://localhost:8000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler("Sending activation email failed", 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// Create activation token function
const createActivationToken = (user) => {
    // Extract only the fields needed for the JWT payload
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  return jwt.sign(payload, process.env.ACTIVATION_SECRET, {
    expiresIn: "1h",
  });
};

// Activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      // Add a console log to check the received activation_token
      // console.log("Received Activation Token: ", activation_token);

      // Verify the activation token
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      // Add a console log to check the decoded user data
      // console.log("Decoded User Data: ", newUser);

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar } = newUser;

      // Check if the user already exists in the database by their email
      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      // If the user doesn't exist, create a new user in the database
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });

      // Send a response with a JWT token or any other action you need
      sendToken(newUser, 201, res);
    } catch (err) {
      // Add a console log to check errors
      console.error("Error in activation endpoint: ", err);

      return next(new ErrorHandler(err.message, 500));
    }
  })
);

// login function
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    // console.log("🚀 ~ catchAsyncErrors ~ req:", req)
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      // const user = await User.findOne({ email }.select("+password"));
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn;t exists!", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information ", 400)
        );
      }
      sendToken(user, 201, res);
      console.log(
        "🚀 ~ file: user.js:136 ~ catchAsyncErrors ~ sendToken:",
        sendToken
      );
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user

router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
  console.log("🚀 ~ isAuthenticated:", isAuthenticated)

    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new ErrorHandler("user doesn't exists", 400));
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user info

router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("User not found", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information ", 400)
        );
      }
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// // update user avatar
// router.put(
//   "/update-avatar",
//   isAuthenticated,
//   upload.single("image"),
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const existUser = await User.findById(req.user.id);
//       const existAvatarPath = `uploads/${existUser.avatar}`;
//       // fs.unlinkSync(existAvatarPath);
//       const fileUrl = path.join(req.file.filename);
//       const user = await User.findByIdAndUpdate(req.user.id, {
//         avatar: fileUrl,
//       });
//       res.status(200).json({
//         success: true,
//         user,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("avatar"),
  catchAsyncErrors(async (req, res, next) => {
    console.log("File received:", req.file); // Confirm the file is received

    try {
      const existUser = await User.findById(req.user.id);

      let avatarResult;
      if (req.file) {
        try {
          // Upload the new avatar to Cloudinary
          avatarResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "avatars",
              },
              (error, result) => {
                if (error) {
                  console.error("Cloudinary upload error:", error);
                  return reject(new ErrorHandler(error.message, 500));
                }
                console.log("Cloudinary upload result:", result);
                resolve(result);
              }
            );

            uploadStream.end(req.file.buffer); // End the stream with the file buffer
          });

          // Optionally delete the old avatar from Cloudinary
          if (existUser.avatar.public_id) {
            await cloudinary.uploader.destroy(existUser.avatar.public_id);
          }
        } catch (error) {
          return next(new ErrorHandler("Image upload failed", 500));
        }
      }

      // Update the user's avatar with the new Cloudinary result
      existUser.avatar = {
        public_id: avatarResult.public_id,
        url: avatarResult.secure_url,
      };
      await existUser.save();

      res.status(200).json({
        success: true,
        user: existUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user address
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    console.log("req.body,,,,,,,,,,,,,,,,,,,,,", req.body);
    console.log("req.body id,,,,,,,,,,,,,,,,,,,,,", req.body._id);

    try {
      const user = await User.findById(req.user.id);
      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      console.log("🚀 ~ catchAsyncErrors ~ sameTypeAddress:", sameTypeAddress);
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} address already exist`)
        );
      }
      const existAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );
      if (existAddress) {
        Object.assign(existAddress, req.body);
      } else {
        // add the new address to the array
        user.addresses.push(req.body);
      }
      await user.save();
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delte user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      await User.updateOne(
        {
          _id: userId,
        },
        { $pull: { addresses: { _id: addressId } } }
      );
      const user = await User.findById(userId);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("+password");
      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );
      console.log(isPasswordMatched);
      if (!isPasswordMatched) {
        return next(new ErrorHandler("old password is incorrect!", 400));
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(
          new ErrorHandler("password doesn't matched with each other")
        );
      }
      user.password = req.body.newPassword;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
