let chatBox = document.querySelector("#chatBox");
let right = document.querySelector("#right");
var modal = $(".modal");
let all = document.querySelector(".all");
let main = document.querySelector(".main");
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '443'
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  // let userName = modal.find('.modal-body input');
  
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  let userName =$("#userName");
  // input value
  let text = $("#chat_message");
  // when press enter send message
  $('html').keydown(function (e) {
   
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('user' , userName.val() )
      socket.emit('message' ,text.val());
      // socket.emit(, text.val());
      
      text.val('');
    }
  });

  socket.on("displayName" , user =>{
    $("ul").append(`<li class="names"><b>${user}</b></li>`);
    scrollToBottom()
  })


  socket.on("createMessage", message  => {
    $("ul").append(`<li class="message">${message}</li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })
  // leave.addEventListener("click" , (userId) => {
    
  //   peers[userId].close();
    
  // })
  
  peers[userId] = call
  leave.addEventListener("click" , ()=>{
    leave.classList.toggle("hide");
    main.classList.toggle("hide");
    myPeer.destroy([myPeer.destroyed=true]);
   
    
  })

  
}

myPeer.on('destroy', ()=>{
  call.close();
  video.remove();
 
  myPeer.close();
  
  
})

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

function toggleChat(){
  chatBox.classList.toggle("hide");
  if(right.classList.contains("col-md-9")){
    right.classList.remove("col-md-9");
    right.classList.add("col-12");
  }
  else{
    right.classList.remove("col-12");
    right.classList.add("col-md-9");
    
  }
}

// let myModal = document.querySelector("#myModal");

// function showModal(){
// myModal.modal('show');
// }
$(document).ready(function(){
  $("#myModal").modal('show');
});

// $(window).load(function(){        
//   $('#myModal').modal('show');
//    }); 

var $temp = $("<input>");
// var $temp2 = $("<input>");
// var $temp3 = $("<input>");
var str1 = "You're invited to Buzziro Meeting! \n";
var str2 = "\nTap on the link or paste it in the browser to join: ";
// var $temp2 = "Join Now! Room Link:";
var $url = $(location).attr('href');
var userIcon = $(".fa-user-plus")
function invitePeople(){
  $("body").append($temp);
  // $("body").append($temp2);
  // $("body").append($temp3);
  // $temp2.val().select();
  // document.execCommand("copy");
  $temp.val(str1 +
  str2  + 
  $url).select();
  
  document.execCommand("copy");
  
  $temp.remove();
  // $temp2.remove();
  userIcon.toggleClass("stop");

}

$(function () {
  $('[data-toggle="popover"]').popover()
})

let leave = document.querySelector(".leave");


let intro=document.querySelector(".intro");
let launch = document.querySelector(".launch");
launch.addEventListener("click" , () => {
  intro.classList.toggle("hide");
  launch.classList.toggle("hide");
  main.classList.toggle("hide");
})