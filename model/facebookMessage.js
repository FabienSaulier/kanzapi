import logger from '../lib/logger'

export default class FacebookMessage{

  get(){
    return this.messageData
  }

  constructor(answer, recipientId){

    // construction des quickReplies
    let quick_replies = [];
    if(answer.children){
      answer.children.forEach(function(child){
        quick_replies.push({
          "content_type":"text",
          "title": child.label,
          "payload": child._id
        })
      })
    }


    // construction du message
    let message = {}

    if(quick_replies.length == 0){
      message.text = answer.text
    } else{
      message.text = answer.text
      message.quick_replies = quick_replies
    }

    this.messageData = {'recipient': {id: recipientId}, 'message':message}
  }

}
