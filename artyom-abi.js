const artyom = new Artyom();

// Add a single command
var commandHello = {
  indexes:["hello","good morning","hey"], // These spoken words will trigger the execution of the command
  action:function(){ // Action to be executed when a index match with spoken word
      artyom.say("Hey buddy ! How are you today?");
  }
};

artyom.addCommands(commandHello);