// The broken piano's pieces as real physical objects (matter-js). They fall with gravity, land on
// the project card images (anything marked [data-physics-solid]) or the bottom of the page, can be
// grabbed and thrown with the mouse or a finger (off the side of the page if you like), and on
// repair every one flies back to its spot from wherever it ended up.
//
// Pieces live in an overlay laid over the whole page (not the window), so they scroll with the
// page and stay on the cards they landed on. It sits inside the page's own layer, under the sticky
// navbar. The overlay clips at the page's sides, so a piece thrown off the edge is simply gone
// until the repair brings it back. Scrolling pushes on the pieces like inertia: start scrolling
// up fast (or stop suddenly after scrolling down) and they hop and bounce on the cards.

import {
  Bodies,
  Body,
  Composite,
  Constraint,
  Engine,
  Events,
  Sleeping,
} from "matter-js";

export type PieceSpec = {
  el: HTMLElement; // the piece's element (a copy of the key, possibly clipped to a fragment)
  original: HTMLElement; // the key it came from, hidden while the piano is broken
  w: number; // physics body size
  h: number;
  ox: number; // the point of `el` (in its own pixels) that sits at the body's center
  oy: number;
  delay: number; // ms before it lets go
};

type Piece = PieceSpec & {
  body: Body;
  released: boolean;
  lost: boolean; // thrown or fallen off the page
};

export type PhysicsWorld = {
  repair: (onDone: () => void) => void;
  destroy: () => void;
};

const between = (min: number, max: number) => min + Math.random() * (max - min);
const docPoint = (clientX: number, clientY: number) => ({
  x: clientX + window.scrollX,
  y: clientY + window.scrollY,
});
// Where the center of a piece sits when the piano is whole, in page coordinates (the piano may
// be drawn at `scale` times its base size).
const homeOf = (p: PieceSpec, scale: number) => {
  const r = p.original.getBoundingClientRect();
  return {
    x: r.left + window.scrollX + p.ox * scale,
    y: r.top + window.scrollY + p.oy * scale,
  };
};

// The simulation steps in small fixed slices (120 per second) whatever the screen's refresh
// rate, so motion is smooth and runs at the same speed everywhere.
const STEP = 1000 / 120;
const MAX_THROW = 36; // px per 60th of a second: a hard fling, but not a rocket
const AIR = 0.014;
const AIR_WHILE_HELD = 0.08; // a held piece steadies instead of spinning wildly

export function startPhysics(
  specs: PieceSpec[],
  {
    onImpact,
    scale = 1,
  }: {
    onImpact?: (strength: number) => void;
    scale?: number;
  } = {},
): PhysicsWorld {
  const engine = Engine.create({
    enableSleeping: true,
    gravity: { x: 0, y: 1.1 },
  });
  // More solver passes: stacked pieces settle cleanly instead of jittering.
  engine.positionIterations = 10;
  engine.velocityIterations = 8;
  const world = engine.world;

  // A soft knock when pieces hit something, louder for harder hits (at most one every 45ms).
  let lastKnock = 0;
  Events.on(engine, "collisionStart", (event) => {
    if (!onImpact) return;
    let hardest = 0;
    for (const { bodyA, bodyB } of event.pairs) {
      const speed = Math.hypot(
        bodyA.velocity.x - bodyB.velocity.x,
        bodyA.velocity.y - bodyB.velocity.y,
      );
      hardest = Math.max(hardest, speed);
    }
    const now = performance.now();
    if (hardest > 2.5 && now - lastKnock > 45) {
      lastKnock = now;
      onImpact(Math.min(1, (hardest - 2.5) / 12));
    }
  });

  // Overlay covering the whole page; clips at the sides and bottom.
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, {
    position: "absolute",
    left: "0",
    top: "0",
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "45",
  });
  const sizeLayer = () => {
    layer.style.width = `${document.documentElement.clientWidth}px`;
    layer.style.height = `${document.documentElement.scrollHeight}px`;
  };
  sizeLayer();
  // Inside the page's root (which clips its sides and holds the navbar above), lined up with the
  // top-left of the document.
  const host =
    document.querySelector<HTMLElement>(".home-page") ?? document.body;
  const hostBox = host.getBoundingClientRect();
  layer.style.left = `${-(hostBox.left + window.scrollX)}px`;
  layer.style.top = `${-(hostBox.top + window.scrollY)}px`;
  host.appendChild(layer);

  // Solid things the pieces can land on: the project card images, and a floor at the very bottom.
  let solids: Body[] = [];
  const buildSolids = () => {
    Composite.remove(world, solids);
    const rects = [
      ...document.querySelectorAll<HTMLElement>("[data-physics-solid]"),
    ].map((el) => el.getBoundingClientRect());
    const pageW = document.documentElement.clientWidth;
    const pageH = document.documentElement.scrollHeight;
    solids = [
      ...rects.map((r) =>
        Bodies.rectangle(
          r.left + window.scrollX + r.width / 2,
          r.top + window.scrollY + r.height / 2,
          r.width,
          r.height,
          {
            isStatic: true,
            friction: 0.8,
            chamfer: { radius: 12 },
          },
        ),
      ),
      Bodies.rectangle(pageW / 2, pageH + 30, pageW * 3, 60, {
        isStatic: true,
        friction: 0.9,
      }),
    ];
    Composite.add(world, solids);
  };
  buildSolids();

  const pieces: Piece[] = specs.map((spec) => {
    const home = homeOf(spec, scale);
    const body = Bodies.rectangle(
      home.x,
      home.y,
      spec.w * scale,
      spec.h * scale,
      {
        friction: 0.55,
        frictionStatic: 1,
        frictionAir: AIR,
        restitution: 0.08,
        slop: 0.02,
        density: 0.0016,
        chamfer: { radius: 2 },
        sleepThreshold: 60,
      },
    );
    // Held in place until it lets go. (Pinned after creation, so releasing it restores its mass;
    // a body created already static would stay weightless.)
    Body.setStatic(body, true);
    Object.assign(spec.el.style, {
      position: "absolute",
      left: "0",
      top: "0",
      margin: "0",
      transformOrigin: `${spec.ox}px ${spec.oy}px`,
      willChange: "transform",
      pointerEvents: "auto",
      cursor: "grab",
      touchAction: "none",
    });
    layer.appendChild(spec.el);
    Composite.add(world, body);
    return { ...spec, body, released: false, lost: false };
  });
  for (const p of pieces) p.original.style.visibility = "hidden";

  const place = (p: Piece, x: number, y: number, angle: number) => {
    p.el.style.transform = `translate(${(x - p.ox).toFixed(2)}px, ${(y - p.oy).toFixed(2)}px) rotate(${angle.toFixed(4)}rad) scale(${scale})`;
  };
  for (const p of pieces) place(p, p.body.position.x, p.body.position.y, 0);

  // Each piece lets go at its own moment, with a small nudge so nothing falls perfectly straight.
  const homes = pieces.map((p) => p.body.position.x);
  const burstCenter =
    homes.reduce((a, b) => a + b, 0) / Math.max(1, homes.length);
  const burstHalfWidth = Math.max(
    1,
    ...homes.map((x) => Math.abs(x - burstCenter)),
  );
  const release = (p: Piece) => {
    if (p.released) return;
    p.released = true;
    Body.setStatic(p.body, false);
    // Bursts outward from the piano's middle, so most pieces land on the cards to either side
    // rather than dropping through the gap between them.
    const out = (p.body.position.x - burstCenter) / burstHalfWidth;
    Body.setVelocity(p.body, {
      x: out * between(1.6, 3.2) + between(-0.5, 0.5),
      y: between(-1.8, -0.3),
    });
    Body.setAngularVelocity(p.body, between(-0.05, 0.05));
    wake();
  };
  const timers = pieces.map((p) =>
    window.setTimeout(() => release(p), p.delay),
  );

  // Simulation loop: runs while anything is moving or being dragged, then rests.
  let frame = 0;
  let running = false;
  let drag: { piece: Piece; constraint: Constraint; pointerId: number } | null =
    null;
  // Scroll inertia: how fast the page was scrolling on the previous frame.
  let lastScrollY = window.scrollY;
  let scrollSpeed = 0;
  let lastTime = 0;
  let pending = 0; // time not yet simulated
  const tick = (now: number) => {
    const dt = lastTime ? Math.min(50, now - lastTime) : 1000 / 60;
    lastTime = now;
    const scrollY = window.scrollY;
    const speed = (scrollY - lastScrollY) * (1000 / 60 / dt); // per 60th of a second
    const change = speed - scrollSpeed; // how sharply the scrolling sped up or slowed down
    lastScrollY = scrollY;
    scrollSpeed = speed;
    if (Math.abs(change) > 1) {
      const kick = Math.max(-6, Math.min(6, change * 0.3));
      for (const p of pieces) {
        if (!p.released || p.lost || drag?.piece === p) continue;
        Sleeping.set(p.body, false);
        Body.setVelocity(p.body, {
          x: p.body.velocity.x + between(-0.4, 0.4),
          y: p.body.velocity.y + kick,
        });
        Body.setAngularVelocity(
          p.body,
          p.body.angularVelocity + between(-0.02, 0.02) * Math.abs(kick) * 0.1,
        );
      }
    }
    pending += dt;
    while (pending >= STEP) {
      Engine.update(engine, STEP);
      pending -= STEP;
    }
    const w = document.documentElement.clientWidth;
    const h = document.documentElement.scrollHeight;
    let active = !!drag || speed !== 0 || pieces.some((p) => !p.released);
    for (const p of pieces) {
      if (p.lost) continue;
      const { x, y } = p.body.position;
      place(p, x, y, p.body.angle);
      if (y > h + 400 || x < -400 || x > w + 400) {
        p.lost = true;
        Composite.remove(world, p.body);
        continue;
      }
      if (p.released && !p.body.isSleeping) active = true;
    }
    if (active) frame = requestAnimationFrame(tick);
    else running = false;
  };
  const wake = () => {
    if (running) return;
    running = true;
    lastTime = 0;
    pending = 0;
    frame = requestAnimationFrame(tick);
  };
  wake();

  // Grab and throw: a soft spring pulls the piece toward the pointer; letting go keeps its speed.
  const onDown = (p: Piece) => (e: PointerEvent) => {
    if (drag || p.lost) return;
    e.preventDefault();
    p.el.setPointerCapture(e.pointerId);
    release(p);
    const point = docPoint(e.clientX, e.clientY);
    const constraint = Constraint.create({
      pointA: point,
      bodyB: p.body,
      pointB: {
        x: point.x - p.body.position.x,
        y: point.y - p.body.position.y,
      },
      length: 0.01,
      stiffness: 0.2,
      damping: 0.08,
    });
    Composite.add(world, constraint);
    Sleeping.set(p.body, false);
    p.body.frictionAir = AIR_WHILE_HELD;
    drag = { piece: p, constraint, pointerId: e.pointerId };
    p.el.style.cursor = "grabbing";
    wake();
  };
  const onMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    drag.constraint.pointA = docPoint(e.clientX, e.clientY);
  };
  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    Composite.remove(world, drag.constraint);
    const { body } = drag.piece;
    body.frictionAir = AIR;
    // Let go with the speed it had, within reason.
    const speed = Math.hypot(body.velocity.x, body.velocity.y);
    if (speed > MAX_THROW)
      Body.setVelocity(body, {
        x: (body.velocity.x / speed) * MAX_THROW,
        y: (body.velocity.y / speed) * MAX_THROW,
      });
    Body.setAngularVelocity(
      body,
      Math.max(-0.3, Math.min(0.3, body.angularVelocity)),
    );
    drag.piece.el.style.cursor = "grab";
    drag = null;
  };
  const downHandlers = pieces.map((p) => {
    const handler = onDown(p);
    p.el.addEventListener("pointerdown", handler);
    p.el.addEventListener("pointermove", onMove);
    p.el.addEventListener("pointerup", onUp);
    p.el.addEventListener("pointercancel", onUp);
    return handler;
  });

  // Keep the colliders lined up with the cards if the layout changes.
  let resizeTimer = 0;
  const onResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      sizeLayer();
      buildSolids();
      for (const p of pieces) if (!p.lost) Sleeping.set(p.body, false);
      wake();
    }, 150);
  };
  window.addEventListener("resize", onResize);
  // Keep simulating while the page scrolls, so the pieces feel it.
  const onScroll = () => wake();
  window.addEventListener("scroll", onScroll, { passive: true });

  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(frame);
    running = false;
    timers.forEach((t) => window.clearTimeout(t));
    window.clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", onScroll);
    pieces.forEach((p, i) => {
      p.el.removeEventListener("pointerdown", downHandlers[i]);
      p.original.style.visibility = "";
    });
    layer.remove();
    Composite.clear(world, false);
    Engine.clear(engine);
  };

  // Repair: every piece flies home from wherever it is (on a card, at the bottom of the page, or
  // off the edge), unspinning on the way, goes a hair past its spot and settles; then the whole
  // keys take their place again.
  const repair = (onDone: () => void) => {
    cancelAnimationFrame(frame);
    running = false;
    timers.forEach((t) => window.clearTimeout(t));
    if (drag) {
      Composite.remove(world, drag.constraint);
      drag = null;
    }
    const order = [...pieces].sort(
      (a, b) => homeOf(a, scale).x - homeOf(b, scale).x,
    );
    const anims = order.map((p, i) => {
      p.el.style.pointerEvents = "none";
      const { x, y } = p.body.position;
      // Take the shortest way back around, however many times it has spun.
      const angle =
        ((((p.body.angle + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) %
          (2 * Math.PI)) -
        Math.PI;
      const home = homeOf(p, scale);
      const at = (px: number, py: number, a: number) =>
        `translate(${(px - p.ox).toFixed(2)}px, ${(py - p.oy).toFixed(2)}px) rotate(${a.toFixed(4)}rad) scale(${scale})`;
      return p.el.animate(
        [
          {
            transform: at(x, y, angle),
            easing: "cubic-bezier(0.3, 0, 0.2, 1)",
          },
          {
            transform: at(home.x, home.y - 5, 0),
            offset: 0.82,
            easing: "ease-in-out",
          },
          { transform: at(home.x, home.y, 0) },
        ],
        {
          duration: between(950, 1150),
          delay: i * 28 + between(0, 90),
          fill: "forwards",
        },
      );
    });
    void Promise.all(anims.map((a) => a.finished)).then(
      () => {
        destroy();
        onDone();
      },
      () => destroy(),
    );
  };

  return { repair, destroy };
}
