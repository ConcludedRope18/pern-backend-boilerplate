const myDataSource = require("../config/database");
const categoryRepo = myDataSource.getRepository("Category");

const categoryResolver = {
  Query: {
    getCategories: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      /*return await categoryRepo.find({
        where: [{ user: { id: user.id } }, { user: { id: null}}],
        relations: ["user"],
      });*/                    
      return await categoryRepo
    .createQueryBuilder("category")
    .leftJoinAndSelect("category.user", "user")
    .where("user.id = :userId", { userId: user.id })
    .orWhere("category.user IS NULL")
    .getMany();
    },
  },

  Mutation: {
    createCategory: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const category = categoryRepo.create({
        name: input.name,
        user: input.global ? null : { id: user.id },
      });

      return await categoryRepo.save(category);
    },

    updateCategory: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const existing = await categoryRepo.findOne({
        where: { id: input.id, user: { id: user.id } },
      });

      if (!existing) throw new Error("Category not found");
      if (input.name !== undefined) existing.name = input.name;

      return await categoryRepo.save(existing);
    },

    deleteCategory: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const result = await categoryRepo.delete({ id, user: { id: user.id } });
      return result.affected === 1;
    },
  },
};

module.exports = categoryResolver;
