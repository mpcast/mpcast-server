const MovieModel = think.mongoose('movie');
const ActorModel = think.mongoose('actor');

class Movie {
  constructor() {
    this.getMovie = async name => {
      const movies = await MovieModel.findOne({ name: new RegExp(name, 'i') })
        .sort({ _id: -1 })
        .exec();
      return movies;
    };

    this.getMovieById = async id => {
      const movie = await MovieModel.findOne({ _id: id }).exec();
      return movie;
    };

    this.addMovie = async data => {
      return MovieModel.findOneAndUpdate(data, data, { upsert: true }).exec();
    };
  }
}

class Actor {
  constructor() {
    this.getActor = async name => {
      const actor = await ActorModel.find({ name: new RegExp(name, 'i') })
        .sort({ _id: -1 })
        .exec();
      return actor;
    };

    this.getActorById = async id => {
      const actor = await ActorModel.findOne({ _id: id }).exec();
      return actor;
    };
  }
}

module.exports = { Movie, Actor };