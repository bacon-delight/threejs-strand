uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D texture1;

attribute float random;
attribute float randomColor;
varying float vRandomColor;

float PI = 3.14159265359;

void main() {
	vUv = uv;
	vRandomColor = randomColor;
	vec4 mvPosition = modelViewMatrix*vec4(position, 1.);
	gl_PointSize = (20. * random) * (1. /- mvPosition.z);
	gl_Position = projectionMatrix * mvPosition;
}