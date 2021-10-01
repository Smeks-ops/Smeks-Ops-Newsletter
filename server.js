const express = require('express')
const path = require('path')
const consola = require('consola')
const bodyParser = require('body-parser')
const fetch = require('node-fetch');


const app = express()

//Middleware
app.use(bodyParser.urlencoded({ extended: true }))

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body

  //Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html')
    return
  }

  //Construct request data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const postData = JSON.stringify(data)

  fetch('https://us5.api.mailchimp.com/3.0/lists/ffc1f57609', {
    method: 'POST',
    headers: {
      Authorization: 'auth dedf564c1c7ea1a758334d7b0f1fb8f8-us5'
    },
    body: postData
  })

    .then(res.statusCode === 200 ?
      res.redirect('/success.html') :
      res.redirect('/fail.html'))
    .catch(err => console.log(err))

})

const PORT = process.env.PORT || 7000


app.listen(PORT, consola.success(`Server running on ${PORT}`))