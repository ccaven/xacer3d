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

void addCircle (inout float t, vec2 p, vec2 center, float radius) {
    t = min(t, length(p - center) - radius);
}

void addBox (inout float t, vec2 p, vec2 c, vec2 b, vec4 r) {
    p -= c;
    r.xy = (p.x>0.0)?r.xy : r.zw;
    r.x  = (p.y>0.0)?r.x  : r.y;
    vec2 q = abs(p)-b+r.x;
    t = min(t,min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r.x);
}

SignedDistance SDF2D (vec2 p) {

    float t = 9999.0;

    addCircle(t, p, vec2(5, 1), 1.0);

    addCircle(t, p, vec2(3, 0), 0.5);

    addCircle(t, p, vec2(8, -2), 0.2);

    addCircle(t, p, vec2(1, -3), 0.1);

    addCircle(t, p, vec2(5, -9), 1.0);

    addCircle(t, p, vec2(3, -10), 0.5);

    addCircle(t, p, vec2(8, -12), 0.2);

    addCircle(t, p, vec2(1, -13), 0.1);

    addBox(t, p, vec2(5, -7), vec2(0.1, 1), vec4(0, 0, 0, 0));

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