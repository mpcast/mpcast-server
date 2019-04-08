/* eslint-disable no-return-await */
const resolverMap = {
  Query: {
    fieldList (groupId) {
      const fieldModel = think.model('fields')
      // return fieldModel
      return async groupId => {
        const fields = await fieldModel.findByGroupId(groupId)
        return fields
        // const movies = await fieldModel.findOne({ name: new RegExp(name, 'i') })
        //   .sort({ _id: -1 })
        //   .exec();
        // return movies;
      };
    }
  }
};

module.exports = resolverMap
