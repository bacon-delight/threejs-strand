uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying float vRandomColor;

float PI = 3.14159265359;

void main() {
	float alpha = 1. - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(0.5)));
	alpha *= 0.5;

	vec3 finalColor = uColor1;
	if(vRandomColor > 0.33 && vRandomColor < 0.66) {
		finalColor = uColor2;
	}
	if(vRandomColor > 0.66) {
		finalColor = uColor3;
	}

	float gradient = smoothstep(0.4, 0.55, vUv.y);

	// gl_FragColor = vec4(finalColor, 1.);
	gl_FragColor = vec4(finalColor, alpha * gradient);
}