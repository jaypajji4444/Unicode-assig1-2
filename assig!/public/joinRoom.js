//* Join room 
//* send History
const joinRoom=(roomName)=>{
  nsSocket.emit("joinRoom",roomName,(numberOfMember)=>{
      //  Updating room member and total number of room members
    document.querySelector(".curr-room-num-users").innerHTML=`${numberOfMember}<span class="glyphicon glyphicon-user"></span>`;
  })
  nsSocket.on("historyMsg",(historyData)=>{
    console.log(historyData);
    const msgUl=document.querySelector("#messages");
    msgUl.innerHTML="";
    
    historyData.forEach(data=>{
      msgUl.innerHTML += `
      <li>
      <div class="user-image">
          <img src="${data.avatar}"/>
      </div>
      <div class="user-message">
          <div class="user-name-time"><b>${data.username}</b><span >${data.time}</span></div>
          <div class="message-text">${data.msg}</div>
      </div>
  </li>`;
  
    })
  
    msgUl.scrollTo(0,msgUl.scrollHeight);
    
  })
  
    nsSocket.on("updateClientNumber",(number)=>{
      document.querySelector(".curr-room-num-users").innerHTML=`${number}<span class="glyphicon glyphicon-user"></span>`;
      document.querySelector(".curr-room-text").innerHTML=`${roomName}`;
    })
  
  
    // Searching for messages by word in it
    let search=document.querySelector("#search-box");
    search.addEventListener("input",(e)=>{
    
      const messageArray=Array.from(document.getElementsByClassName("message-text"));
      messageArray.forEach(message=>{
      
       if(message.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase())==-1){ // converting actual and searched txt to lower case and matching
         // no Match 
         message.style.display="none";
       }
       else{
          message.style.display="block"
       }
      })
    })
  }