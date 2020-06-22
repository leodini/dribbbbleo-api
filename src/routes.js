// const multer = require("multer");
const uploadConfig = require("./config/upload");
const routes = require("express-promise-router")();
const passport = require("passport");
require("./config/passport");

const { validateBody, schemas } = require("./middlewares/routeHelpers");

const UserController = require("./controllers/UserController");
const PostController = require("./controllers/PostController");
const CommentController = require("./controllers/CommentController");
const LikeController = require("./controllers/LikeController");

const passportLocal = passport.authenticate("local", { session: false });
const passportJwt = passport.authenticate("jwt", { session: false });

//user routes
routes.post("/signup", validateBody(schemas.authSchema), UserController.signUp);
routes.post("/signin", passportLocal, UserController.signIn);
routes.get("/user/:userId", UserController.index);
routes.put("/user", UserController.updateUser);
routes.post("/user/follow/:id", passportJwt, UserController.follow);

//like routes
routes.post("/like/post/:id", passportJwt, LikeController.likePost);
routes.post("/like/comment/:id", passportJwt, LikeController.likeComment);
routes.get("/like/count/:id", LikeController.index);

//comment routes
routes.post("/comment/:projectId", passportJwt, CommentController.create);
routes.get("/comment/:projectId", CommentController.index);
routes.put("/comment/update/:commentId", passportJwt, CommentController.update);

//post routes
routes.get("/posts", PostController.index);
routes.get("/posts/search", PostController.searchPost);
routes.get("/posts/:projectId", PostController.uniquePost);
routes.post("/posts", passportJwt, PostController.store);
routes.delete("/posts/:id", passportJwt, PostController.remove);

module.exports = routes;
