const xapi = require('xapi');

const PIN = "1986";

var log_in_out = 0;

function ifHidden(indication) {
  if (indication === "Hidden") {
    log_in_out = 0;
		xapi.command("UserInterface Extensions Panel Update", {PanelId: "login", Name: "Log In"});    
  } else {
    log_in_out = 1;
    xapi.command("UserInterface Extensions Panel Update", {PanelId: "login", Name: "Log Out"});    
  }
}

xapi.status.get('UserInterface Features Call Start').then(ifHidden);

function PromptInputPIN() {
	xapi.command("UserInterface Message TextInput Display", {
		Duration: 45
		, FeedbackId:'logInPin'
		, InputType: 'PIN'
		, KeyboardState:'Open'
		, Placeholder:'PIN'
		, SubmitText:'Submit PIN'
		, Title: 'Unlock'
		, Text: 'Please enter the PIN to unlock the endpoint'
		});	
}

xapi.event.on('UserInterface Message TextInput Response', (event) => {
	switch(event.FeedbackId){
        case 'logInPin':
          if (event.Text === PIN) {
            xapi.config.set("UserInterface Features HideAll", "False");
            xapi.command("UserInterface Extensions Panel Update", {PanelId: "login", Name: "Log Out"});
            log_in_out++;
          }
          else {
            xapi.command("UserInterface Message Alert Display", {Title: "Error", Text: "PIN is incorrect, Try again", Duration: 5});
          }
	break;
	}
});


xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    if(event.PanelId === 'login'){
		  if(log_in_out === 0 ) {
			  PromptInputPIN();
		  }
		  else {
			  xapi.config.set("UserInterface Features HideAll", "True");
			  xapi.command("UserInterface Extensions Panel Update", {PanelId: "login", Name: "Log In"});
			  log_in_out--;
		  }
    }
});