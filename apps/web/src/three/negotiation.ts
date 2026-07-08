/**
 * Drives the "agents negotiating" effect: periodically ignites edges, which
 * then decay. Occasionally a burst lights several edges around one node so a
 * pulse appears to ripple through the graph.
 */
export class Negotiation {
  private timer = 0;
  private interval: number;
  private decay: number;

  constructor(interval = 0.55, decay = 1.6) {
    this.interval = interval;
    this.decay = decay;
  }

  update(dt: number, edgeIntensity: Float32Array, edges: Uint32Array) {
    // decay all
    for (let i = 0; i < edgeIntensity.length; i++) {
      const v = edgeIntensity[i] - this.decay * dt;
      edgeIntensity[i] = v < 0 ? 0 : v;
    }

    this.timer -= dt;
    if (this.timer > 0 || edgeIntensity.length === 0) return;
    this.timer = this.interval * (0.5 + Math.random());

    // ignite a random edge
    const seed = (Math.random() * edgeIntensity.length) | 0;
    edgeIntensity[seed] = 1;

    // sometimes ripple to edges sharing a node
    if (Math.random() < 0.5) {
      const a = edges[seed * 2];
      const b = edges[seed * 2 + 1];
      for (let e = 0; e < edgeIntensity.length; e++) {
        if (e === seed) continue;
        const ea = edges[e * 2];
        const eb = edges[e * 2 + 1];
        if (ea === a || eb === a || ea === b || eb === b) {
          if (Math.random() < 0.4) edgeIntensity[e] = Math.max(edgeIntensity[e], 0.7);
        }
      }
    }
  }
}
