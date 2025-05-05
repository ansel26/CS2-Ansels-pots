// Global variables for the animation
var nmobiles=4000;  // Number of particles/mobile objects
var mobiles=[];     // Array to store mobile objects
var noisescale;    // Scale factor for Perlin noise
var a1, a2, a3, a4, a5, amax;  // Animation parameters for noise and movement
var bw=true;       // Toggle for black/white or color mode

// Initial setup function - runs once when the sketch starts
function setup() {
  createCanvas(800, 800);  // Create an 800x800 pixel canvas
  background(0);          // Set background to black
  noFill();              // Don't fill shapes
  colorMode(HSB, 360, 255, 255, 255);  // Use HSB color mode
  strokeWeight(.1);      // Set line thickness
  reset();              // Initialize the animation
}

// Reset function - reinitializes animation parameters
function reset() {
  noisescale=random(.08, .1);  // Set random noise scale
  noiseDetail(int(random(1,5)));  // Set noise detail level
  amax=random(5);              // Maximum amplitude for noise
  // Set random amplitudes for different noise components
  a1=random(1, amax);
  a2=random(1, amax);
  a3=random(1, amax);
  a4=random(1, amax);
  a5=10;
  // Create new mobile objects
  for (var i = 0; i < nmobiles; i++) {
    mobiles[i] = new Mobile(i);
  }
}

// Draw function - runs continuously to create animation
function draw() {
  //noiseSeed(millis()*.00004);
  for (var i = 0; i < nmobiles; i++) {
    mobiles[i].run();
  }
}

// Handle keyboard input for various controls
function keyReleased() {
  // 'S' key - save canvas as PNG with timestamp
  if (key=="s" || key=="S")saveCanvas("POSTHELIOS_NOISE3_" + day() + "_" + month() + "_" + hour() + "_" + minute() + "_" + second() + ".png");
 
  if (keyCode==32) reset();     // Spacebar - reset animation
  if(key=="r" || key=="R")setup();  // 'R' key - complete restart
  if(key=="b" || key=="B")bw=!bw;   // 'B' key - toggle color mode
}

// Mobile object constructor - creates individual particles
function Mobile(index) {
  this.index=index;
  // Initialize vectors for movement
  this.velocity=createVector(200, 200, 200);
  this.acceleration=createVector(200, 200, 200);
  this.position0=createVector(random(0, width), random(0, height), random(0, sin(height)));
  this.position=this.position0.copy();
  this.trans=random(50, 100);  // Transparency value
  
  // Calculate initial color values using Perlin noise
  this.hu=(noise(a1*cos(PI*this.position.x*width), a1*sin(PI*this.position.y/height))*720)%random(360);
  this.sat=noise(a2*sin(PI*this.position.x*width), a2*sin(PI*this.position.y/height))*255;
  this.bri=noise(a3*cos(PI*this.position.x/width), a3*cos(PI*this.position.y/height))*255;
}

// Main update method for mobile objects
Mobile.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position using Perlin noise for organic movement
Mobile.prototype.update = function() {
  // Calculate new velocity using complex noise patterns
  this.velocity=createVector( 1-2*noise(a4+a2*sin(TAU*this.position.x/width), 
                                      a4+a2*sin(TAU*this.position.y/height)), 
                            1-2*noise(a2+a3*cos(TAU*this.position.x/width), 
                                    a4+a3*cos(TAU*this.position.y/height)));
  
  this.velocity.mult(a5);  // Scale velocity
  this.velocity.rotate(sin(100)*noise(a4+a3*sin(TAU*this.position.x/width)));  // Add rotation
  this.position0=this.position.copy();  // Store previous position
  this.position.add(this.velocity);    // Update position
};

// Method to display the particle and handle boundaries
Mobile.prototype.display = function() {
  // Set stroke color based on mode (black/white or color)
  if(bw)stroke(255,this.trans); else stroke((frameCount*1.8)%360, (millis()%360), (frameCount)%360, this.trans%255);
  
  // Draw line from previous to current position
  line(this.position0.x, this.position0.y, this.position.x, this.position.y);
  
  // Reset position if particle moves outside canvas boundaries
  if (this.position.x>width || this.position.x<0||this.position.y>height||this.position.y<0) {
    this.position0=createVector(random(0, width), random(0, height),random(0, height*width));
    this.position=this.position0.copy();
  }
};