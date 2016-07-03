/**
 * Created by finnb on 7/2/16.
 */

var Game = {fps:5, width:1080, height:720};

var frames = 0;

Game.run = (function() {
    var loops = 0;
    var skipTicks = 1000 / Game.fps;
    //maxFrameSkip = 10,
    var nextGameTick = (new Date).getTime();
    //lastGameTick;

    return function() {
        loops = 0;

        frames += 1;
        Game.fps = 1 + Math.floor(Math.abs(60 * Math.sin(frames / 1000)));
        skipTicks = 1000 / Game.fps;
        //loops = 0 is the only one necessary if FPS does not fluctuate

        while ((new Date).getTime() > nextGameTick) {
            Game.update();
            nextGameTick += skipTicks;
            loops++;
        }

        if (!loops) {
            Game.draw((nextGameTick - (new Date).getTime()) / skipTicks);
        } else {
            Game.draw(0);
        }
    };
})();

Game.init = function() {
    this.canvas = document.getElementById("game");

    //Set Width and Height of canvas
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.context = this.canvas.getContext("2d");
}

var x = 100;
var y = 100;

Game.update = function() {
    x = 100 + 10 * randomInt(0, 5);
    y = 100 + 10 * randomInt(0, 5);


}

Game.draw = function() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.fillRect(x, y, 30, 30);
    this.context.fillText("Frame #: " + frames, 10, 10);
    this.context.fillText("FPS: " + this.fps, 10, 20);
    this.context.fillText("Note: FPS is not tailored to performance. It fluctuates as a test.", 10, 30);
}