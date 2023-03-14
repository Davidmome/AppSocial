const { User, Thought } = require("../models");

module.exports = {
  async getUsers(request, response) {
    try {
      let data = await User.find({});
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },
  async getSingleUser(request, response) {
    try {
      let data = await User.findById(request.params.userId);
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },
  async createUser(request, response) {
    try {
      data = await User.create(request.body);
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },
  async deleteUser(request, response) {
    try {
      let data = await User.findByIdAndDelete(request.params.userId);
      if (!data) {
        response
          .status(404)
          .json({ code: 404, message: "no se encontro el usuario", data: [] });
        return;
      } else {
        result = await Thought.deleteMany({ _id: { $in: data.thoughts } });
        response.status(200).json({
          code: 200,
          message: "Usuario y pensamientos eliminados",
          data: [],
        });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  },

  async updateUser(request, response) {
    try {
      data = await User.findOneAndUpdate(
        { _id: request.params.userId },
        request.body,
        { new: true }
      );
      if (!data) {
        response
          .status(404)
          .json({ code: 404, message: "no se encontro el usuario", data: [] });
        return;
      }
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },

  async addFriend(request, response) {
    try {
      let data = await User.findByIdAndUpdate(
        { _id: request.params.userId },
        { $addToSet: { friends: request.params.friendId } },
        { new: true }
      );
      if (!data) {
        response
          .status(404)
          .json({ code: 404, message: "no se encontro el usuario", data: [] });
        return;
      }
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },

  async deleteFriend(request, response) {
    try {
      data = await User.findByIdAndUpdate(
        { _id: request.params.userId },
        { $pull: { friends: { $in: [request.params.friendId] } } },
        { new: true }
      );
      if (!data) {
        response
          .status(404)
          .json({ code: 404, message: "no se encontro el usuario", data: [] });
        return;
      }
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },
};
