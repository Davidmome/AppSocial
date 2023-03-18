const { Thought, User } = require("../models");

module.exports = {
  getThoughts(request, response) {
    Thought.find()
      .then((thoughts) => response.json(thoughts))
      .catch((error) => response.status(500).json(error));
  },

  getSingleThought(request, response) {
    Thought.findOne({ _id: request.params.id })
      .then((thought) =>
        !thought
          ? response
              .status(404)
              .json({ message: "No se encontro el pensamiento" })
          : response.json(thought)
      )
      .catch((error) => response.status(500).json(error));
  },

  addThought(request, response) {
    Thought.create(request.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: request.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? response.status(404).json({
              message:
                "Pensamiento creado pero no se encontro usuario con ese ID",
            })
          : response.json("se creo el pensamiento")
      )
      .catch((error) => {
        console.log(error);
        response.status(500).json(error);
      });
  },

  updateThought(request, response) {
    Thought.findOneAndUpdate(
      { _id: request.params.thoughtId },
      { $set: request.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? response
              .status(404)
              .json({ message: "No se encontro el pensamiento" })
          : response.json(thought)
      )
      .catch((error) => {
        console.log(error);
        response.status(500).json(error);
      });
  },

  deleteThought(request, response) {
    Thought.findOneAndRemove({ _id: request.params.thoughtId })
      .then((thought) =>
        !thought
          ? response
              .status(404)
              .json({ message: "No se encontro el pensamiento" })
          : User.findOneAndUpdate(
              { thoughts: request.params.thoughtId },
              { $pull: { thoughts: request.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? response.status(404).json({
              message: "Pensamiento creado pero no existe usuario con este id",
            })
          : response.json({ message: "Pensamiento borrado" })
      )
      .catch((error) => response.status(500).json(error));
  },

  addReaction(request, response) {
    Thought.findOneAndUpdate(
      { _id: request.params.thoughtId },
      { $addToSet: { reactions: request.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? response
              .status(404)
              .json({ message: "No se encontro pensamiento con este id" })
          : response.json(thought)
      )
      .catch((error) => response.status(500).json(error));
  },

  deleteReaction(request, response) {
    Thought.findOneAndUpdate(
      { _id: request.params.thoughtId },
      { $pull: { reactions: { reactionId: request.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? response
              .status(404)
              .json({ message: "No se encontro pensamiento con este Id" })
          : response.json(thought)
      )
      .catch((error) => response.status(500).json(error));
  },
};
