'use strict';
var sendRideEmail = function(rides, email, callback){
  const nodemailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.email,
          pass: process.env.email_password
      }
  });

  var runningText = "Hey,\nHere are the current wait times for Disneyland.\n";
  var htmlArray = ["Hey,","<br>","<p>Here are the current wait times for Disneyland.</p>","<br>"];

  for(var i = 0; i < rides.length; i++){
  	var current_ride = rides[i];

  	var string_to_add = current_ride.waitTime + " minuets for " + current_ride.name + ".\n";
  	runningText += string_to_add;

  	var html_string = "<strong>" + current_ride.waitTime + "</strong> minuets for <strong>" + current_ride.name + "</strong>.<br>";
  	htmlArray.push(html_string);

  }

  runningText += "\n\nThank You for using Disneyland Wait times."

  htmlArray.push("<br>Thank You for using Disneyland Wait times.</body></html>")

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"even more magic wait times" <'+process.env.email+'>', // sender address
      to: email, // list of receivers
      subject: 'Disneyland Wait Times', // Subject line
      text: runningText, // plain text body
      html: htmlArray.join("")
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          callback(error);
          return;
      }
      callback(null, info);
  });
}

var emailer = module.exports = {};
emailer.sendRideEmail = sendRideEmail;