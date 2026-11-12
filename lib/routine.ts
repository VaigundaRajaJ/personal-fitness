export type ExerciseKind = "timed" | "reps" | "sets";

export type Stage =
  | "Warm-up"
  | "Main workout"
  | "Core"
  | "Hands & wrists"
  | "Cardio"
  | "Mobility"
  | "Cool-down";

export interface Exercise {
  name: string;
  kind: ExerciseKind;
  /** Only for timed exercises. */
  seconds?: number;
  /** Text shown for reps/sets exercises, e.g. "3 × 10–12". */
  target?: string;
  /** Only for sets exercises. Read from the start of `target`. */
  sets?: number;
  desc: string;
  stage: Stage;
}

export interface Workout {
  day: string;
  shortDay: string;
  title: string;
  focus: string;
  summary: string;
  main: Exercise[];
}

export const REST_SECONDS = 45;

const timed = (name: string, seconds: number, desc: string, stage: Stage): Exercise => ({
  name,
  kind: "timed",
  seconds,
  desc,
  stage,
});

const reps = (name: string, target: string, desc: string, stage: Stage): Exercise => ({
  name,
  kind: "reps",
  target,
  desc,
  stage,
});

const sets = (name: string, target: string, desc: string, stage: Stage): Exercise => ({
  name,
  kind: "sets",
  target,
  sets: Number.parseInt(target, 10) || 1,
  desc,
  stage,
});

export const WARM_UP: Exercise[] = [
  timed("March in Place", 60, "Raise your knees gently and swing your arms naturally.", "Warm-up"),
  timed("Easy Jumping Jacks / Step-jacks", 30, "Use low-impact step-jacks if jumping feels uncomfortable.", "Warm-up"),
  reps("Arm Swings", "20", "Swing your arms forward and back in a comfortable range.", "Warm-up"),
  reps("Shoulder Circles", "10 forward + 10 backward", "Make controlled circles without shrugging hard.", "Warm-up"),
  reps("Wrist Circles", "10 each direction", "Move gently through a comfortable range.", "Warm-up"),
  reps("Elbow Circles / Bends", "10", "Bend and straighten your elbows smoothly.", "Warm-up"),
  reps("Hip Circles", "10 each direction", "Keep your movement controlled.", "Warm-up"),
  reps("Knee Bends", "10", "Bend your knees slightly; stay comfortable.", "Warm-up"),
  reps("Ankle Circles", "10 each direction", "Circle each ankle slowly.", "Warm-up"),
  reps("Bodyweight Squats", "10", "Sit your hips back and stand with control.", "Warm-up"),
  reps("Reverse Lunges", "5 each leg", "Step back carefully; use a chair for support if needed.", "Warm-up"),
  reps("Calf Raises", "10", "Rise onto your toes, then lower slowly.", "Warm-up"),
  reps("Cat-Cow", "8", "Move your spine gently with your breath.", "Warm-up"),
  reps("Thoracic Rotations", "5 each side", "Rotate through your upper back without forcing.", "Warm-up"),
  reps("Chin Tucks", "8", "Draw your chin gently straight back.", "Warm-up"),
  reps("Gentle Neck Turns", "5 each side", "Turn only within a comfortable range.", "Warm-up"),
];

export const COOL_DOWN: Exercise[] = [
  timed("Easy Cooldown Walk", 150, "Walk slowly or march gently for 2–3 minutes.", "Cool-down"),
  timed("Wall Calf Stretch", 25, "Hold a gentle stretch on each side.", "Cool-down"),
  timed("Standing Quad Stretch", 25, "Hold each side; use a wall or chair for balance.", "Cool-down"),
  timed("Gentle Hamstring Stretch", 25, "Keep your back comfortable; do not bounce.", "Cool-down"),
  timed("Hip-flexor Stretch", 25, "Use a supported half-kneeling position if comfortable.", "Cool-down"),
  timed("Chest / Doorway Stretch", 25, "Open the chest gently without forcing the shoulders.", "Cool-down"),
  timed("Cross-body Shoulder Stretch", 25, "Hold each side gently.", "Cool-down"),
  timed("Upper-back Hug Stretch", 25, "Reach forward and gently round the upper back.", "Cool-down"),
  timed("Wrist Flexor Stretch", 20, "Keep the stretch light; stop if you feel pain.", "Cool-down"),
  timed("Wrist Extensor Stretch", 20, "Keep the stretch light; stop if you feel pain.", "Cool-down"),
  reps("Chin Tuck", "5", "Keep the movement small and controlled.", "Cool-down"),
  reps("Gentle Neck Turns", "3 each side", "Stay in a comfortable range; no aggressive stretching.", "Cool-down"),
];

const strengthA = (friday: boolean): Exercise[] => [
  sets("Bodyweight Squat", friday ? "3 × 12" : "3 × 10–12", "Lower with control, then stand by pressing through your feet.", "Main workout"),
  sets("Incline / Wall Push-up", "3 × 8–12", "Keep your body in a straight line and lower with control.", "Main workout"),
  sets("Glute Bridge", friday ? "3 × 15" : "3 × 12–15", "Lift your hips by squeezing your glutes; avoid arching your back.", "Main workout"),
  sets("Reverse Lunge", friday ? "3 × 8 each leg" : "2 × 8 each leg", "Step back and lower only as far as comfortable.", "Main workout"),
  sets("Calf Raise", friday ? "3 × 15–20" : "2 × 15–20", "Rise slowly and lower with control.", "Main workout"),
  sets("Bird Dog", friday ? "2 × 10 each side" : "2 × 8 each side", "Extend opposite arm and leg while keeping your trunk steady.", "Core"),
  timed("Plank", friday ? 35 : 30, "Keep your body aligned; stop before your form breaks.", "Core"),
  reps("Fist → Open Hand", "20", "Open your fingers fully, then make a relaxed fist.", "Hands & wrists"),
  reps("Finger Spread", "15", "Spread your fingers comfortably, then relax.", "Hands & wrists"),
  reps("Wrist Flexion / Extension", "10 each", "Move wrists up and down gently.", "Hands & wrists"),
  reps("Wrist Circles", "10 each direction", "Make small, controlled circles.", "Hands & wrists"),
  timed("Brisk Walk", friday ? 900 : 600, "Walk briskly at a pace where you can still speak in sentences.", "Cardio"),
];

const strengthB: Exercise[] = [
  sets("Split Squat", "2 × 8 each leg", "Use a chair or wall for balance; keep the range comfortable.", "Main workout"),
  sets("Push-up Variation", "3 × 8–12", "Choose wall, incline, knee or regular push-ups.", "Main workout"),
  sets("Hip Hinge / Good Morning", "3 × 10", "Push hips back with a neutral, comfortable spine.", "Main workout"),
  timed("Wall Sit", 30, "Slide down only as far as comfortable; keep breathing.", "Main workout"),
  sets("Calf Raise", "3 × 15", "Rise and lower slowly.", "Main workout"),
  sets("Dead Bug", "3 × 8 each side", "Keep your trunk steady as opposite arm and leg move.", "Core"),
  timed("Side Plank", 20, "Hold each side; use a knee-supported version if needed.", "Core"),
  timed("Single-leg Stand", 25, "Balance near a wall or chair; practice each leg.", "Main workout"),
  timed("Easy Walk", 600, "Walk at an easy, relaxed pace.", "Cardio"),
];

export const WORKOUTS: Workout[] = [
  {
    day: "Monday",
    shortDay: "Mon",
    title: "Full Body Strength A",
    focus: "Strength",
    summary: "Strength · Core · Hands & wrists · Cardio",
    main: strengthA(false),
  },
  {
    day: "Tuesday",
    shortDay: "Tue",
    title: "Stamina + Mobility",
    focus: "Cardio",
    summary: "Brisk walking · Mobility · Core · Neck",
    main: [
      timed("Brisk Walk", 2100, "Walk briskly; breathe harder but still speak in sentences.", "Cardio"),
      reps("Cat-Cow", "8", "Move gently with your breath.", "Mobility"),
      reps("Thoracic Rotation", "8 each side", "Rotate through your upper back.", "Mobility"),
      reps("Hip Circles", "10 each", "Make controlled circles.", "Mobility"),
      reps("Ankle Rocks", "10 each", "Move your knee forward over your foot gently.", "Mobility"),
      reps("Shoulder Wall Slides", "10", "Slide arms up and down a wall without forcing.", "Mobility"),
      sets("Dead Bug", "2 × 8 each side", "Keep your trunk steady.", "Core"),
      sets("Chin Tucks", "2 × 8", "Move gently; avoid straining.", "Mobility"),
      reps("Gentle Neck Rotation", "5 each side", "Turn within a comfortable range.", "Mobility"),
      reps("Gentle Side Bend", "5 each side", "Keep the movement small and easy.", "Mobility"),
    ],
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    title: "Full Body Strength B",
    focus: "Strength",
    summary: "Strength · Core · Balance · Easy cardio",
    main: strengthB,
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    title: "Recovery + Joint Mobility",
    focus: "Recovery",
    summary: "Comfortable walk · Joint mobility · Optional core",
    main: [
      timed("Comfortable Walk", 1500, "Keep this walk relaxed and easy.", "Cardio"),
      reps("Shoulder Circles", "10", "Move gently.", "Mobility"),
      reps("Wrist Circles", "10", "Move gently in both directions.", "Mobility"),
      reps("Elbow Bends", "10", "Bend and straighten smoothly.", "Mobility"),
      reps("Hip Circles", "10", "Keep the movement comfortable.", "Mobility"),
      reps("Knee Bends", "10", "Use a small, comfortable range.", "Mobility"),
      reps("Ankle Circles", "10", "Move slowly.", "Mobility"),
      reps("Cat-Cow", "8", "Move with your breath.", "Mobility"),
      reps("Thoracic Rotation", "8 each side", "Rotate gently.", "Mobility"),
      timed("Supported Squat Hold", 20, "Hold a supported, comfortable squat position.", "Mobility"),
      sets("Bird Dog (Optional)", "2 × 8 each side", "Skip if you prefer a full recovery day.", "Core"),
    ],
  },
  {
    day: "Friday",
    shortDay: "Fri",
    title: "Full Body Strength A",
    focus: "Strength",
    summary: "Strength · Core · Hands & wrists · Cardio",
    main: strengthA(true),
  },
  {
    day: "Saturday",
    shortDay: "Sat",
    title: "Stamina Day",
    focus: "Cardio",
    summary: "One moderate cardio activity · Optional core",
    main: [
      timed(
        "Choose Your Cardio",
        2400,
        "Brisk walking, cycling, swimming, hiking, easy jogging or a sport. Start with 25–30 minutes if you are building up.",
        "Cardio",
      ),
      sets("Dead Bug (Optional)", "2 × 8 each side", "Move slowly and keep your trunk steady.", "Core"),
      sets("Bird Dog (Optional)", "2 × 8 each side", "Keep your trunk steady.", "Core"),
      timed("Easy Walk", 300, "Finish with five minutes of easy walking.", "Cardio"),
    ],
  },
  {
    day: "Sunday",
    shortDay: "Sun",
    title: "Recovery / Reset",
    focus: "Recovery",
    summary: "Relaxed walk · Full-body mobility · Gentle balance",
    main: [
      timed("Relaxed Walk", 1500, "Walk at a comfortable, conversational pace.", "Cardio"),
      reps("Cat-Cow", "8", "Move gently with your breath.", "Mobility"),
      reps("Shoulder Circles", "10", "Move smoothly.", "Mobility"),
      reps("Wall Slides", "10", "Slide arms against a wall comfortably.", "Mobility"),
      reps("Thoracic Rotations", "8 each side", "Rotate gently.", "Mobility"),
      reps("Hip Circles", "10 each", "Move comfortably.", "Mobility"),
      reps("Ankle Circles", "10 each", "Move slowly.", "Mobility"),
      timed("Single-leg Stand", 20, "Stand near a support; practice each leg.", "Mobility"),
      timed("Plank (Optional)", 20, "Keep this light; skip if you need more recovery.", "Core"),
    ],
  },
];

/** Full session order: warm-up, main part, cool-down. */
export function buildSession(workout: Workout): Exercise[] {
  return [...WARM_UP, ...workout.main, ...COOL_DOWN];
}

/** Rough time guess: reps ~30s, each set ~40s, plus rest between sets. */
export function estimateMinutes(items: Exercise[]): number {
  const seconds = items.reduce((total, item) => {
    if (item.kind === "timed") return total + (item.seconds ?? 0);
    if (item.kind === "sets") {
      const setCount = item.sets ?? 1;
      return total + setCount * 40 + (setCount - 1) * REST_SECONDS;
    }
    return total + 30;
  }, 0);
  return Math.round(seconds / 60);
}
