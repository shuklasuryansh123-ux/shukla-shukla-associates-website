// High-end hero animation: particles and fadeup activation
(function(){
  // Particle effect for hero
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;
  let particles = [];
  const colors = ['#b6c7e6','#dbeafe','#f8fafc','#e3e6f3'];
  const num = Math.floor((w*h)/3500);
  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  function Particle(){
    this.x = Math.random()*w;
    this.y = Math.random()*h;
    this.radius = Math.random()*2.5+1.2;
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.vx = (Math.random()-0.5)*0.3;
    this.vy = (Math.random()-0.5)*0.3;
    this.alpha = Math.random()*0.5+0.5;
  }
  Particle.prototype.draw = function(){
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  };
  Particle.prototype.update = function(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x<0||this.x>w) this.vx*=-1;
    if(this.y<0||this.y>h) this.vy*=-1;
  };
  function init(){
    particles = [];
    for(let i=0;i<num;i++){
      particles.push(new Particle());
    }
  }
  function animate(){
    ctx.clearRect(0,0,w,h);
    for(let i=0;i<particles.length;i++){
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }
  init();
  animate();

  // Fadeup animation activation
  function activateFadeups(){
    document.querySelectorAll('.hero-section .fadeup').forEach((el,i)=>{
      setTimeout(()=>el.classList.add('active'),300+180*i);
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',activateFadeups);
  }else{
    activateFadeups();
  }
})();
