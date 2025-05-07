/* ORIGINAL: "Particle Banner" by Jane Doe – CC-BY 4.0
URL: https://openprocessing.org/sketch/123456
Remixed by <Ansel>, 2025-05-05
Purpose: animated hero background
*/

// Global variables for the animation
var nmobiles = 6000;    // Total number of particles to animate // CHANGE: added more particles
var mobiles = [];       // Array to store all particle objects
var noisescale;        // Controls the granularity of Perlin noise
var a1, a2, a3, a4, a5, amax;  // Parameters that affect noise patterns and movement
var bw = true;         // Boolean to toggle between black/white (true) or color (false) mode

// Initial setup function - runs once when sketch starts
function setup() {
  // Create canvas and attach to hero section
  const canvas = createCanvas(windowWidth, windowHeight * 0.6); // Make canvas 60% of window height
  canvas.parent('hero'); // Place canvas inside hero element
  
  background(0);        // Set black background
  noFill();            // Don't fill shapes, only draw outlines
  colorMode(HSB, 360, 255, 255, 255);  // Use HSB color mode for more control
  strokeWeight(.1);     // Set thin lines for particles
  reset();             // Initialize animation parameters
}

// Called whenever browser window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.6); // Keep canvas responsive
}

// Reinitialize animation with new random parameters
function reset() {
  noisescale = random(.08, .1);     // Set random noise scale between 0.08-0.1
  noiseDetail(int(random(1,5)));     // Set random noise complexity
  amax = random(5);                  // Maximum amplitude for noise
  
  // Set random amplitudes for different noise components
  a1 = random(1, amax);
  a2 = random(1, amax);
  a3 = random(1, amax);
  a4 = random(1, amax);
  a5 = 10;

  // Create array of particle objects
  for (var i = 0; i < nmobiles; i++) {
    mobiles[i] = new Mobile(i);
  }
}

// Main animation loop - runs continuously
function draw() {
  // Update and draw each particle
  for (var i = 0; i < nmobiles; i++) {
    mobiles[i].run();
  }
}

// Handle keyboard controls
function keyReleased() {
  if (key=="s" || key=="S") {
    // Save canvas as PNG with timestamp
    saveCanvas("POSTHELIOS_NOISE3_" + day() + "_" + month() + "_" + hour() + "_" + minute() + "_" + second() + ".png");
  }
  if (keyCode==32) reset();     // Spacebar - reset animation
  if (key=="r" || key=="R") setup();  // R key - complete restart
  if (key=="b" || key=="B") bw=!bw;   // B key - toggle color mode
}

// Particle object constructor
function Mobile(index) {
  this.index = index;
  // Initialize movement vectors
  this.velocity = createVector(200, 200, 200);      // Speed and direction
  this.acceleration = createVector(200, 200, 200);  // Change in velocity
  this.position0 = createVector(random(0, width), random(0, height), random(0, sin(height))); // Starting position
  this.position = this.position0.copy();            // Current position
  this.trans = random(50, 100);                     // Particle transparency
  
  // Calculate initial color using Perlin noise
  this.hu = (noise(a1*cos(PI*this.position.x*width), a1*sin(PI*this.position.y/height))*720)%random(360);  // Hue
  this.sat = noise(a2*sin(PI*this.position.x*width), a2*sin(PI*this.position.y/height))*255;               // Saturation
  this.bri = noise(a3*cos(PI*this.position.x/width), a3*cos(PI*this.position.y/height))*255;               // Brightness
}

// Main update method for particles
Mobile.prototype.run = function() {
  this.update();  // Update position
  this.display(); // Draw particle
};

// Update particle position using Perlin noise for organic movement
Mobile.prototype.update = function() {
  // Calculate new velocity using noise patterns
  this.velocity = createVector(
    1-2*noise(a4+a2*sin(TAU*this.position.x/width), a4+a2*sin(TAU*this.position.y/height)),
    1-2*noise(a2+a3*cos(TAU*this.position.x/width), a4+a3*cos(TAU*this.position.y/height))
  );
  
  this.velocity.mult(a5);       // Scale velocity by a5
  this.velocity.rotate(sin(100)*noise(a4+a3*sin(TAU*this.position.x/width))); // Add rotation
  this.position0 = this.position.copy();  // Store previous position
  this.position.add(this.velocity);       // Update current position
};

// Draw the particle and handle screen boundaries
Mobile.prototype.display = function() {
  // Set color based on mode
  if(bw) {
    stroke(255, this.trans);  // White with transparency in B&W mode
  } else {
    stroke((frameCount*1.8)%360, (millis()%360), (frameCount)%360, this.trans%255); // Rainbow colors in color mode
  }
  
  // Draw line from previous to current position
  line(this.position0.x, this.position0.y, this.position.x, this.position.y);
  
  // Reset particle if it moves off screen
  if (this.position.x > width || this.position.x < 0 || this.position.y > height || this.position.y < 0) {
    this.position0 = createVector(random(0, width), random(0, height), random(0, height*width));
    this.position = this.position0.copy();
  }
};