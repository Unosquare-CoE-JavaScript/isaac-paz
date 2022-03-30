// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// New timers, tasks, operations are recorded from myFile running
myFile.runContents();

function shouldContinue() {
  // Check one: Any pending setTimeout, SetInterval, setImmediate?
  // Check two: Any pending OS tasks? (like server listening to port)
  // Check three: Any pending long running operations? (like fs module)
  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
}

//Entire body executes in on 'tick'
while (shouldContinue()) {
  // 1) Node looks at pendingTimers and sees if any functions are ready to be called (setTimeout, setIntervals)

  // 2) Node looks at pendingOsTasks and pendingOperations and calls the relevant callback

  // 3) Pause execution. Continue when...
  // -> a new pendingOSTasks is done
  // -> a new pendingOperations is done
  // -> a timer is about to complete

  // 4)Look at pendingTimers. Call any setImmediate

  // 5) Handle any 'close' events
}

// exit back to terminal
