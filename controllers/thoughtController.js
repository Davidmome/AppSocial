const { Thought, User } = require("../models");

module.exports = {
  async getThoughts(request, response) {
    try {
      let data = await Thought.find({});
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },

  async getSingleThought(request, response) {
    try {
      let data = await Thought.findById(request.params.id);
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },
  async addThought(request, response) {
    try {
      data = await Thought.create(request.body);

      if (data) {
        let result = await User.findByIdAndUpdate(
          { _id: request.body.userId },
          { $addToSet: { thoughts: data._id } },
          { new: true }
        );
        if (!result) {
          response.status(404).json({
            code: 404,
            message: "no se encontro el usuario",
            data: [],
          });
        } else {
          response.status(200).json(result);
        }
      } else {
        response.status(500).json({
          code: 500,
          message: "Ocurrio un error al asignar el pensamiento al usuario",
          data: [],
        });
      }
    } catch (error) {
      response.status(500).json(error);
    }
  },
  async updateThought(request, response) {
    try {
      data = await Thought.findOneAndUpdate(
        { _id: request.params.id },
        request.body,
        { new: true }
      );
      if (!data) {
        response.status(404).json({
          code: 404,
          message: "no se encontro el pensamiento",
          data: [],
        });
        return;
      }
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },
  async deleteThought(request, response) {
    try {
      let data = await Thought.findByIdAndDelete(request.params.id);
      if (!data) {
        response.status(404).json({
          code: 404,
          message: "no se encontro el pensamiento",
          data: [],
        });
        return;
      }
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },

  async addReaction(request, response) {
    try {
      let data = await Thought.findByIdAndUpdate(
        { _id: request.params.thoughtId },
        { $addToSet: { reactions: request.body } },
        { new: true }
      );
      if (!data) {
        response.status(404).json({
          code: 404,
          message: "no se encontro el pensamiento",
          data: [],
        });
      } else {
        response.status(200).json(data);
      }
    } catch (error) {
      response.status(500).json(error);
    }
  },

  async deleteReaction(request, response) {
    try {
      let data = await Thought.findByIdAndUpdate(
        { _id: request.params.thoughtId },
        { $pull: { reactions: { reactionId: request.params.reactionId } } },
        { new: true }
      );
      if (!data) {
        response.status(404).json({
          code: 404,
          message: "no se encontro el pensamiento",
          data: [],
        });
        return;
      }
      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  },
};
