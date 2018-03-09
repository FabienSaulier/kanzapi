import mongoose from 'mongoose'
import mongooseStringQuery from 'mongoose-string-query'
import timestamps from 'mongoose-timestamp'
import uniqueValidator from 'mongoose-unique-validator'
import Answer from './answer'
import _ from 'lodash'

const AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age_greater_12: {
    type: Boolean
  },
  age: {
    type: Number,
  },
  species: {
    type: String,
  },
})

//WARNING  HACK il faudrait vérifier que le sender est correctement auth par facebook.
// on peut faire un call /webhook avec des infos bidon et se faire passer un sender qu'on est pas.
const UserSchema = new mongoose.Schema({
  senderID: {
    type: String, // id facebook du sender
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  locale: {
    type: String,
  },
  gender: {
    type: String,
  },
  question_species: {
    type: String,
  },
  animals: {
    type: [AnimalSchema],
  },
  last_answer: { // id last answer returned to the user
    type: Answer.schema,
  },

})


UserSchema.statics.getUser = async function(senderID) {
  return await this.findOne({senderID: senderID})
}

UserSchema.statics.createUser = async function(senderID) {
  return await this.findOne({senderID: senderID})
}

UserSchema.statics.updateQuestionSpecies = async function(user, species) {
  await Users.update({_id: user._id}, {$set: {'question_species' : species}})
}

UserSchema.statics.setLastAnswer = async function(user, answer) {
  await Users.update({_id: user._id}, {$set: {'last_answer' : answer}})
}

UserSchema.plugin(timestamps)
UserSchema.plugin(mongooseStringQuery)
UserSchema.plugin(uniqueValidator) // for name but buggy when update

const Users = mongoose.models.users || mongoose.model('users', UserSchema)
module.exports = Users
