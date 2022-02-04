import { RingApi } from 'ring-client-api'
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand
} from '@aws-sdk/client-s3';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda'
// AWS.config.update({accessKeyId: 'akid', secretAccessKey: 'secret'});
const REGION = "ap-southeast-2";
// var player = require('play-sound')(opts = {})
//const { AWS } = awsPkg;
//var aws = new awsPkg();
import pkg from 'play-sound';
const { PlaySound } = pkg;
var func = new pkg("cdmp3");
import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

// TODO: get param from SSM when using PC for dogegit 
// import AWS from 'aws-sdk';
// import SSMParameterStore from 'ssm-parameter-store';
// //const SSMParameterStore = require('ssm-parameter-store');
// const parameters = new SSMParameterStore(new AWS.SSM(), {
//   //SomeParameter: 'TestParam',
//   // SomeNestedParameter: '/some/nested/parameter',
//   // NonExistentParameter: 'this_parameter_doesnt_exist_on_ssm'
// });
// paramVal = await parameters.get('TestParam');
// console.log("paramVal: " + paramVal);


// Set the parameters
const lambdaParams = {
  FunctionName: "security-app-analyse-face-test",
  InvocationType: "RequestResponse",
  LogType: "None",
  "Records": [
    {
      "eventVersion": "2.0",
      "eventSource": "aws:s3",
      "awsRegion": "ap-southeast-2",
      "eventTime": "1970-01-01T00:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "responseElements": {
        "x-amz-request-id": "EXAMPLE123456789",
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "testConfigRule",
        "bucket": {
          "name": "home-security-app-bucket-with-footage",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          },
          "arn": "arn:aws:s3:::home-security-app-bucket-with-footage"
        },
        "object": {
          "key": "61584014_2528509880516125_7956394471657046016_n.jpg",
          "size": 78.2,
          "eTag": "c18fa91f7132f011175a13e43d028b7d",
          "sequencer": "0A1B2C3D4E5F678901"
        }
      }
    }
  ]
};

// Create an Amazon Simple Storage Solutiou (Amazon S3) client service object.
const s3Client = new S3Client({ region: REGION });
const lambdaClient = new LambdaClient({ region: REGION });

const ringApi = new RingApi({
  refreshToken: process.env.RING_REFRESH_TOKEN,
  cameraDingsPollingSeconds: 2
  //locationIds: ['488e4800-fcde-4493-969b-d1a06f683102', '4bbed7a7-06df-4f18-b3af-291c89854d60']
});

// const S3Api = new S3Api();

const locations = await ringApi.getLocations()
const location = locations[0]
var cameras = location.cameras;
var chimes = location.chimes;
var chime = chimes[0]
console.log(`Using chime: ${chime.name}`)
// const playSound = new PlaySound({
// });

// pkg.play('SoundsToPlay/Doge10minMix.mp3',  { timeout: 300 }, function (err) {
//   if (err) console.log(err);
// }) 

// pkg({ player : "cmdmp3" })
// {
//   play('SoundsToPlay/Doge10minMix.mp3', { timeout: 300 }, function (err) {
//       if (err) console.log(err);
//     }); 
// };
// TODO: maybe put this in an async method and try awaoting it make the camera async foreach and maybe do a datetime stamp 
  // exec('afplay whatever.mp3', audioEndCallback)

startPlaySound(func);

const startScanning = async () => {

  cameras.forEach(async camera => {
    console.log("Awaiting motion");
    // when the door bell detects motion
    //if (camera.name == 'Doorbell Camera') {
      camera.startVideoOnDemand
    //on new motion detected
    camera.onNewDing.subscribe(async ding => {
      const event =
        ding.kind === 'motion'
          ? `Motion Detected at Camera: ${camera.name}`
          : ding.kind === 'ding'
            ? 'Doorbell pressed'
            : `Video started (${ding.kind})`
      console.log("Event value: " + event)

      // play sound when motion detected
      // TODO: use set timeout to delay 4s before playing again so it does not keep playing
      // or try using the audio.kill if possible after 4s
      // setTimeout(function(){
      //   console.log("Playing doge car after motion detected.")
      //   var playSound = func.play('SoundsToPlay/SuperCarDoge.mp3', { timeout: 4000 }, function (err) {
      //     if (err) console.log("An Error ocurred when playing sound: " + err);
      //   }); 
      //   }, 4000);
       await startPlaySound(func);

      // $ mplayer foo.mp3 
      // PlaySound.play('SoundsToPlay/Doge10minMix.mp3',  { timeout: 300 }, function (err) {
      //   if (err) console.log(err);
      // }) 
      // if object detected is within 5m of cam, set siren for 10 seconds.
      // camera.setSiren(true);
      //   let stopSiren = setTimeout(() => {
      //     camera.setSiren(false);
      //   }, 5000);
      //chime.playSound('motion');
      // save the image

      console.log(`Starting Video from ${camera.name} ...`);
      //camera.recordToFile(`recordings/${camera.name}-${ding.id}-Recording.mp4`, 30);
      console.log('Done recording video');
      // now image processing with lambda
      //processFootageLambda();

    });
  });
};

async function startPlaySound(func) {
  func.play('SoundsToPlay/SuperCarDoge9s.mp3', { timeout: 4000 }, function (err) {
    if (err) console.log("An Error ocurred when playing sound: " + err);
  }); 
}


function getFormattedDate() {
  var today = new Date();
  let seconds = String(today.getSeconds()).padStart(2, '0');
  let minutes = String(today.getMinutes()).padStart(2, '0');
  let hours = String(today.getHours()).padStart(2, '0');
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear()

  return `${dd}/${mm}/${yyyy}_${hours}_${minutes}_${seconds}`;
}

startScanning();

async function processFootageLambda() {
  // create InvokeCommand command
  const command = new InvokeCommand(lambdaParams);

  // invoke Lambda function
  try {
    const response = await lambdaClient.send(command);
    console.log(`Lambda Success Response: ${response}`);
  } catch (err) {
    console.err(`Lambda Failed Response: ${response}`);
  }
}