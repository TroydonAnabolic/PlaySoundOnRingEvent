//require('dotenv').config()
import { RingApi } from 'ring-client-api'
// import { v4 as uuidv4 } from 'uuid';
// var AWS = require('aws-sdk');
const { Lambda } = require("@aws-sdk/client-lambda");
const { S3 } = require("@aws-sdk/client-s3");

// AWS.config.update({accessKeyId: 'akid', secretAccessKey: 'secret'});


const ringApi = new RingApi({
  refreshToken: 'eyJhbGciOiJIUzUxMiIsImprdSI6Ii9vYXV0aC9pbnRlcm5hbC9qd2tzIiwia2lkIjoiYzEyODEwMGIiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE2MjA0NjQ4MDUsInJlZnJlc2hfY2lkIjoicmluZ19vZmZpY2lhbF9hbmRyb2lkIiwicmVmcmVzaF9zY29wZXMiOlsiY2xpZW50Il0sInJlZnJlc2hfdXNlcl9pZCI6NTU4NjA1OTAsInJuZCI6IjZTck9sbnlkWFY5Yll3Iiwic2Vzc2lvbl9pZCI6ImYwN2VmNWZlLTBjZmYtNGZkNi04ZGIxLTQ2NGRhMGMwYTdhYiIsInR5cGUiOiJyZWZyZXNoLXRva2VuIn0.7dRdsaI1ZbIZpt8su9Aa7s3C9-BvdNW1RDdM9ypl_uTmDy-1AC-BSDxG7MkHZUf9kvqJ0mMIJCz8L-AKapyr9w',

  // The following are all optional. See below for details
  cameraDingsPollingSeconds: 2
  //locationIds: ['488e4800-fcde-4493-969b-d1a06f683102', '4bbed7a7-06df-4f18-b3af-291c89854d60']
});

// const locations = await ringApi.getLocations()

// const locations = 

const locations: RingCamera = async () => {
  return await ringApi.getLocations();
};

const location = locations[0];



var cameras = async () => { return location.cameras; }

var chimes = location.chimes;
var chime = chimes[0]
console.log(`Using chime: ${chime.name}`)

   chime.playSound('motion')

cameras.forEach(camera => {
  // when the door bell detects motion
  if (camera.name == 'Doorbell Camera') {
      //on new motion detected
    camera.onNewDing.subscribe(ding => {
    console.log(`Motion Detected at Camera: ${camera.name}`)
      // if object detected is within 5m of cam, set siren for 10 seconds.
        // camera.setSiren(true);

          // save the image
          console.log(`Starting Video from ${camera.name} ...`)
          camera.recordToFile(`recordings/${camera.name}-${ding.id}-Recording.mp4`, 30);
          console.log('Done recording video')
          // now image processing with lambda
          // var lambda = new AWS.Lambda();

          // var params = {
          //   FunctionName: 'imageProccessing', /* required */
          //   Payload: PAYLOAD_AS_A_STRING
          // };

          // lambda.invoke(params, function(err, data) {
          //   if (err) console.log(err, err.stack); // an error occurred
          //   else     console.log(data);           // successful response
          //   // if face is known..
          //   // door bell says welcome
          // });
    });
  }
  else if (camera.name == 'Front Look Left')
  {
      //on new motion detcted
    camera.onMotionStarted(motion => { // either on otion detected or motion started
    console.log(`Motion Detected at Camera: ${camera.name}`)

    // get event info
    let eventsResponse = camera.getEvents({
      limit: 1,
      kind: 'ding',
    })
    console.log(eventsResponse[0])
    console.log(`Event Id: ${eventsResponse[0].id}`) // if we can successfully get the correct event, and event id, then use it for naming the video

       // camera.setSiren(false);
          // save the image
          console.log(`Starting Video from ${camera.name} ...`)
          console.log(motion)
          camera.recordToFile(`recordings/${eventsResponse[0].id}-${camera.name}-Recording.mp4`, 30);
          console.log('Done recording video')
  })
}
});
