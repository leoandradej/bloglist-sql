const Blog = require("./blog");
const ReadingList = require("./reading_list");
const Session = require("./session");
const User = require("./user");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList, as: "readers" });

User.hasMany(Session);
Session.belongsTo(User);

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
};
