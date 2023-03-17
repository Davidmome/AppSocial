const { User, Thought } = require("../models");

module.exports = {
  getUsers(request, response) {
    User.find()
      .then((users) => response.json(users))
      .catch((error) => response.status(500).json(error));
  },
  getSingleUser(request, response) {
    User.findOne({ _id: request.params.userId })
      //que es?
      .select("-__v")
      .then((user) =>
        !user
          ? response
              .status(404)
              .json({ message: "No se encontro usuario con este id" })
          : response.json(user)
      )
      .catch((error) => response.status(500).json(error));
  },

  createUser(request, response) {
    User.create(request.body)
      .then((user) => response.json(user))
      .catch((error) => response.status(500).json(error));
  },
  deleteUser(request, response) {
    User.findOneAndDelete({ _id: request.params.userId })
      .then((user) =>
        !user
          ? response
              .status(404)
              .json({ message: "No se encontro usuario con este id" })
          : //{ _id: { $in: data.thoughts}
            Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => response.json({ message: "Usuario y pensamientos borrados" }))
      .catch((error) => response.status(500).json(error));
  },

  updateUser(request, response) {
    User.findOneAndUpdate(
      { _id: request.params.userId },
      { $set: request.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? response.status(404).json({ message: "No se encontro al usuario" })
          : response.json(user)
      )
      .catch((error) => {
        console.log(error);
        response.status(500).json(error);
      });
  },

  addFriend(request, response) {
    User.findOneAndUpdate(
      { _id: request.params.userId },
      // {$addToSet: {_id: request.params.userId}},
      { $addToSet: { friends: request.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? response
              .status(404)
              .json({ message: "No se encontro usuario con este id" })
          : response.json(user)
      )
      .catch((error) => response.status(500).json(error));
  },

  deleteFriend(request, response) {
    User.findOneAndUpdate(
      { _id: request.params.userId },
      //$in: [request.params.friendId]
      { $pull: { friends: { $in: [request.params.friendId] } } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? response
              .status(404)
              .json({ message: "No se encontro usuario con este id" })
          : response.json(user)
      )
      .catch((error) => response.status(500).json(error));
  },
};
