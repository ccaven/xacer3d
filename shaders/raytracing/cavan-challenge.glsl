#version 300 es
precision highp float;

in vec2 v_position;

uniform vec3 u_camera;
uniform mat3 u_view;
uniform vec2 u_resolution;

out vec4 o_color;

const int MAX_STEPS = 100;
const float EPSILON = 0.0001;

const vec3 lightDir = normalize(vec3(2, -2, 1));

struct SignedDistance {
    float t;
    vec3 color;
};

SignedDistance SDF2D (vec2 p) {
    float t = sqrt(p.x * p.x + p.y * p.y) - 1.0;

    p -= 2.0;

    t = min(t, sqrt(p.x * p.x + p.y * p.y) - 0.1);

    p += vec2(1.0, 5.0);

    t = min(t, sqrt(p.x * p.x + p.y * p.y) - 0.5);

    vec3 col = vec3(p.x * 0.5, p.y * 0.5, 0.5);

    return SignedDistance(t, col);
}

SignedDistance SDF (vec3 p) {
    float x = sqrt(p.x * p.x + p.z * p.z);
    float y = p.y;
    return SDF2D(vec2(x, y));
}

vec3 getNormal (vec3 p) {
    const vec2 h = vec2(EPSILON * 0.5, 0.0);
    return normalize(vec3(
        SDF(p + h.xyy).t - SDF(p - h.xyy).t,
        SDF(p + h.yxy).t - SDF(p - h.yxy).t,
        SDF(p + h.yyx).t - SDF(p - h.yyx).t
    ));
}

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct RaymarchHit {
    float t;
    vec3 hit;
    vec3 normal;
    vec3 color;
};

RaymarchHit raymarch (Ray ray) {
    float t = 0.0;
    vec3 hit = ray.origin;
    vec3 normal = vec3(0.0);
    vec3 col = vec3(0.0);

    for (int iter = 0; iter < MAX_STEPS; iter ++) {
        SignedDistance distInfo = SDF(hit);
        hit += distInfo.t * ray.direction;
        if (distInfo.t < EPSILON) {
            col = distInfo.color;
            normal = getNormal(hit);
            break;
        }
    }

    return RaymarchHit(t, hit, normal, col);
}

void main () {
    vec3 origin = u_camera;

    vec3 direction = vec3(v_position * 2.0 - 1.0, 1.0);

    direction.xy *= u_resolution.xy / u_resolution.xx;

    direction = normalize(direction);

    Ray ray = Ray(origin, direction);

    RaymarchHit hitInfo = raymarch(ray);

    float diffuse = max(-dot(direction, hitInfo.normal), 0.0);

    o_color = vec4(diffuse, diffuse, diffuse, 1.0);
}