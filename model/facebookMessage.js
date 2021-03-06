import Answers from './answer'

const HOME_MENU_PARLER_VETO_ID = '5a68b6777fb4053ae8ee546a'

export default class FacebookMessage {

  constructor(answer, recipientId) {

    // these are attributes name awaited by facebook
    this.quick_replies = []
    this.recipientId = recipientId
    this.message = {}

    this.populateQRWithChildren(answer)
    this.populateQRWithSiblings(answer)
    if(this.hasVetButton(answer)){
      this.populateQRWithVetButton()
      this.incrementVetButtonAnswerDisplayCount()
    }

    this.populateQRWithHomeButton()

    this.addQuickReplies()
  }

  getMessage() {
    this.messageData =  { recipient: { id: this.recipientId }, message: this.message }
    return this.messageData
  }

  populateQRWithChildren(answer){
    if (answer.children) {
      answer.children.forEach((child) => {
        const payload = { id: child._id }
        this.quick_replies.push({
          content_type: 'text',
          title: child.label,
          payload: JSON.stringify(payload),
        })
      })
    }
  }

  populateQRWithSiblings(answer){
    if (answer.siblings && answer.siblings.length > 0) {
      const payload = {}
      payload.siblings = []
      answer.children.forEach((child) => {
        payload.siblings.push({ label: child.label, _id: child._id })
      })
      answer.siblings.forEach((sibling) => {
        payload.siblings.push({ label: sibling.label, _id: sibling._id })
      })
      this.quick_replies.push({
        content_type: 'text',
        title: '➕',
        payload: JSON.stringify(payload),
      })
    }
  }

  populateQRWithHomeButton(){
    const HOME_MENU_LAPIN_ID = '5a4f45d5ae8a73002c23e682'
    this.quick_replies.push({
      content_type: 'text',
      title: '🏠',
      payload: JSON.stringify({ id: HOME_MENU_LAPIN_ID }),
    })
  }

  hasVetButton(answer) {
    return answer.displayVetButton
  }

  populateQRWithVetButton(){
    this.quick_replies.push({
      content_type: 'text',
      title: 'Contacter véto 👩‍⚕️',
      payload: JSON.stringify({ id: HOME_MENU_PARLER_VETO_ID }),
    })
  }

  incrementVetButtonAnswerDisplayCount(){
    Answers.update({_id: HOME_MENU_PARLER_VETO_ID}, { $inc: { displayButtonCount: 1} } )
    .then(
      (result) => {
        //ok
      },
      (error) => {
        logger.error(error)
      },
    )
  }

  addQuickReplies(){
    this.message.quick_replies = this.quick_replies
  }


}
