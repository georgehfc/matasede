// Mata-Sede: the swirling water behind the home page hero ("mar" = sea).
// Adapted from the 21st.dev Shader Builder "Flow field" (ocean swirl): one WebGL canvas, no libraries.
// MSmar(canvas) starts it; returns false when WebGL isn't available so the page can fall back.
// Colours: edit MAR_CORES (deep to light), as RGB 0–255.
(function () {
  var MAR_CORES = [[5, 15, 56], [14, 42, 154], [36, 87, 245], [90, 210, 244]]; // --abismo, --azul-profundo, --azul, --agua
  var SPEED = .55, SCALE = 1.08, INTENSITY = .51, CONTRAST = .93, GRAIN = .08, SEED = 3267;

  var VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  var FRAG = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "uniform vec3 u_c0,u_c1,u_c2,u_c3; uniform vec2 u_res; uniform float u_time,u_scale,u_int,u_contrast,u_grain,u_seed;",
    "float h21(vec2 p){p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);}",
    "float grain(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}",
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);",
    "  return mix(mix(h21(i),h21(i+vec2(1.,0.)),u.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),u.x),u.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(17.,9.2);a*=.5;}return v;}",
    "vec3 pal(float x){x=clamp(x,0.,1.)*3.;",
    "  vec3 c=mix(u_c0,u_c1,smoothstep(0.,1.,clamp(x,0.,1.)));",
    "  c=mix(c,u_c2,smoothstep(0.,1.,clamp(x-1.,0.,1.)));",
    "  return mix(c,u_c3,smoothstep(0.,1.,clamp(x-2.,0.,1.)));}",
    "void main(){",
    "  vec2 p=(gl_FragCoord.xy-.5*u_res)/min(u_res.x,u_res.y)*u_scale;",
    "  float a=fbm(p*2.+mod(u_seed,31.))*6.2831;",
    "  float v=fbm(p*3.+vec2(cos(a),sin(a))*(u_int*2.)+u_time*.12);",
    "  vec3 col=(pal(v)-.5)*u_contrast+.5;",
    "  col+=(grain(gl_FragCoord.xy)-.5)*u_grain;",
    "  gl_FragColor=vec4(clamp(col,0.,1.),1.);",
    "}"
  ].join("\n");

  window.MSmar = function (canvas) {
    var gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) return false;
    function compile(t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = function (n) { return gl.getUniformLocation(prog, n); };
    MAR_CORES.forEach(function (c, i) { gl.uniform3f(U("u_c" + i), c[0] / 255, c[1] / 255, c[2] / 255); });
    gl.uniform1f(U("u_scale"), SCALE); gl.uniform1f(U("u_int"), INTENSITY);
    gl.uniform1f(U("u_contrast"), CONTRAST); gl.uniform1f(U("u_grain"), GRAIN); gl.uniform1f(U("u_seed"), SEED);
    var uRes = U("u_res"), uTime = U("u_time");

    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var inView = true, raf = 0, t0 = performance.now();
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2), r = canvas.getBoundingClientRect();
      var w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
      var k = Math.min(1, Math.sqrt(1200000 / (w * h))); // cap the work at about 1.2 million pixels
      w = Math.round(w * k); h = Math.round(h * k);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    }
    function render(now) {
      raf = 0; size();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, still ? 4 : (now - t0) / 1000 * SPEED);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still && inView && !document.hidden) raf = requestAnimationFrame(render);
    }
    function wake() { if (!raf) raf = requestAnimationFrame(render); }
    window.addEventListener("resize", wake);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });
    if (window.IntersectionObserver) new IntersectionObserver(function (e) { inView = e[0].isIntersecting; if (inView) wake(); }).observe(canvas);
    wake();
    return true;
  };
})();
