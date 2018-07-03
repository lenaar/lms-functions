function isInScope (msg) {
    var affArray = msg.affiliation
    const result = affArray && (affArray.includes('employee') || affArray.includes('student') || affArray.includes('member'))
    if (!result) {
      //context.log('\nUser is not an employee and not a student, out of the affilication scope. User ' + msg.username + ' ' + msg.kthid + ' with affiliation ' + msg.affiliation)
    }
    return result
  }
  
  function convertToCanvasUser (msg) {
  
    if (msg.username && (msg.given_name || msg.family_name) && msg.kthid) {
      let user = {
        pseudonym: {
          unique_id: `${msg.username}@kth.se`, // CSVs analogi av 'login_id'
          sis_user_id: msg.kthid // CSVs analogi av 'user_id' needed for enrollments
        },
        user: {
          'name': `${msg.given_name} ${msg.family_name}`,
          'email': msg.primary_email, // must be when 'updating' user
          'sortable_name': `${msg.family_name}, ${msg.given_name}`,
          'short_name': null // a fix to make sure that display name is updated
        },
        communication_channel: { // must be when 'creating' user
          type: 'email',
          address: msg.primary_email,
          skip_confirmation: true
        }
      }
      return user
    } else {
      //log.info('\nIncomplete fields to create user in canvas, skipping. Probably,it is missing a name(given_name, family_name) or a username or kth_id.....', msg)
    }
  }

module.exports = function(context, msg) {

    if (msg.ugClass==='user') {
        const user = convertToCanvasUser(msg)
        context.log('JavaScript ServiceBus topic trigger function processed message:', msg)
        if (isInScope(msg) && user) {
            context.log("RIGHT USER", user)
            //await createOrUpdate(user)
        }
    }
    else context.log('Message is not user type but other...')
    context.done()
}