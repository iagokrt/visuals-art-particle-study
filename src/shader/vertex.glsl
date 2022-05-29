uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D u_texture;
uniform float u_distortion;
float PI = 3.141592653589793238;


// curl noise variation
//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

// vec3 mod289(vec3 x) {
//     return x - floor(x * (1.0 / 289.0)) * 289.0;
// }

// vec2 mod289(vec2 x) {
//     return x - floor(x * (1.0 / 289.0)) * 289.0;
// }

// vec3 permute(vec3 x) {
//     return mod289(((x*34.0)+1.0)*x);
// }

// float noise(vec2 v)
// {
//     const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
//                       0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
//                      -0.577350269189626,  // -1.0 + 2.0 * C.x
//                       0.024390243902439); // 1.0 / 41.0
//     // First corner
//     vec2 i  = floor(v + dot(v, C.yy) );
//     vec2 x0 = v -   i + dot(i, C.xx);

//     // Other corners
//     vec2 i1;
//     //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
//     //i1.y = 1.0 - i1.x;
//     i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
//     // x0 = x0 - 0.0 + 0.0 * C.xx ;
//     // x1 = x0 - i1 + 1.0 * C.xx ;
//     // x2 = x0 - 1.0 + 2.0 * C.xx ;
//     vec4 x12 = x0.xyxy + C.xxzz;
//     x12.xy -= i1;

//     // Permutations
//     i = mod289(i); // Avoid truncation effects in permutation
//     vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
//         + i.x + vec3(0.0, i1.x, 1.0 ));

//     vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
//     m = m*m ;
//     m = m*m ;

//     // Gradients: 41 points uniformly over a line, mapped onto a diamond.
//     // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

//     vec3 x = 2.0 * fract(p * C.www) - 1.0;
//     vec3 h = abs(x) - 0.5;
//     vec3 ox = floor(x + 0.5);
//     vec3 a0 = x - ox;

//     // Normalise gradients implicitly by scaling m
//     // Approximation of: m *= inversesqrt( a0*a0 + h*h );
//     m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

//     // Compute final noise value at P
//     vec3 g;
//     g.x  = a0.x  * x0.x  + h.x  * x0.y;
//     g.yz = a0.yz * x12.xz + h.yz * x12.yw;
//     return 130.0 * dot(m, g);
// }

// vec3 curl(float	x,	float	y,	float	z)
// {

//     float	eps	= 1., eps2 = 2. * eps;
//     float	n1,	n2,	a,	b;

//     x += time * .05;
//     y += time * .05;
//     z += time * .05;

//     vec3	curl = vec3(0.);

//     n1	=	noise(vec2( x,	y	+	eps ));
//     n2	=	noise(vec2( x,	y	-	eps ));
//     a	=	(n1	-	n2)/eps2;

//     n1	=	noise(vec2( x,	z	+	eps));
//     n2	=	noise(vec2( x,	z	-	eps));
//     b	=	(n1	-	n2)/eps2;

//     curl.x	=	a	-	b;

//     n1	=	noise(vec2( y,	z	+	eps));
//     n2	=	noise(vec2( y,	z	-	eps));
//     a	=	(n1	-	n2)/eps2;

//     n1	=	noise(vec2( x	+	eps,	z));
//     n2	=	noise(vec2( x	+	eps,	z));
//     b	=	(n1	-	n2)/eps2;

//     curl.y	=	a	-	b;

//     n1	=	noise(vec2( x	+	eps,	y));
//     n2	=	noise(vec2( x	-	eps,	y));
//     a	=	(n1	-	n2)/eps2;

//     n1	=	noise(vec2(  y	+	eps,	z));
//     n2	=	noise(vec2(  y	-	eps,	z));
//     b	=	(n1	-	n2)/eps2;

//     curl.z	=	a	-	b;

//     return	curl;
// }

vec4 permute(vec4 x){return mod(x*x*34.+x,289.);}
float snoise(vec3 v){
  const vec2 C = 1./vec2(6,3);
  const vec4 D = vec4(0,.5,1,2);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1. - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.x;
  vec3 x2 = x0 - i2 + C.y;
  vec3 x3 = x0 - D.yyy;
  i = mod(i,289.);
  vec4 p = permute( permute( permute(
	  i.z + vec4(0., i1.z, i2.z, 1.))
	+ i.y + vec4(0., i1.y, i2.y, 1.))
	+ i.x + vec4(0., i1.x, i2.x, 1.));
  vec3 ns = .142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49. * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = floor(j - 7. * x_ ) *ns.x + ns.yyyy;
  vec4 h = 1. - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 sh = -step(h, vec4(0));
  vec4 a0 = b0.xzyw + (floor(b0)*2.+ 1.).xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + (floor(b1)*2.+ 1.).xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.);
  return .5 + 12. * dot( m * m * m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3) ) );
}

vec3 snoiseVec3( vec3 x ){
  return vec3(  snoise(vec3( x )*2.-1.),
								snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ))*2.-1.,
								snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 )*2.-1.)
	);
}

vec3 curlNoise( vec3 p ){
  const float e = .1;
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}

void main() {
    vUv = uv;

    vec3 distortion = vec3(position) * curlNoise(vec3(
      position.x*0.004 - time*0.009,
      position.y*0.002 + time*0.002, 
      0.
    ));

    vec3 finalPosition = position + distortion;

    vec4 mvPosition = modelViewMatrix * vec4( finalPosition, 1. );
    gl_PointSize = 1.;
    gl_Position = projectionMatrix * mvPosition;
}