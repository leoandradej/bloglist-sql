module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addConstraint("reading_lists", {
      fields: ["user_id", "blog_id"],
      type: "unique",
      name: "unique_user_blog_reading_list",
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint(
      "reading_lists",
      "unique_user_blog_reading_list",
    );
  },
};
