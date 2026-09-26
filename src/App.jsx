import { useState , useEffect , useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  FlaskConical,
  MessageCircle,
  Mic,
  Pill,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
  Volume2,
} from "lucide-react";

import heroImage from "./assets/care-recall-hero.png";

const DEMO_TRANSCRIPT = `
Doctor: Your blood pressure is slightly high.
Please take Amlodipine once every morning after breakfast
for 30 days.

Please get a blood test this Friday at 10 AM.

I'd also like you to come back for a follow-up
on October 10 at 11:30 AM.

Patient: Okay doctor, I'll do that.
`;

const DEMO_CARE_PLAN = {
  medications: [
    {
      name: "Amlodipine",
      instructions: "Once every morning after breakfast",
      duration: "30 days",
    },
  ],

  tests: [
    {
      name: "Blood test",
      date: "Friday",
      time: "10:00 AM",
    },
  ],

  appointments: [
    {
      description: "Follow-up consultation",
      date: "October 10",
      time: "11:30 AM",
    },
  ],

  instructions: [],
};

const API_URL = import.meta.env.VITE_API_URL || "";


// ============================================================
// APP
// ============================================================

function App() {
  const [view, setView] = useState(() => {
    return window.history.state?.view || "landing";
  });

  useEffect(() => {
    if (!window.history.state?.view) {
      window.history.replaceState(
        { view: "landing" },
        "",
        "#landing"
      );
    }
  }, []);

  const navigate = (nextView) => {
    window.history.pushState(
      { view: nextView },
      "",
      `#${nextView}`
    );

    setView(nextView);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const previousView = event.state?.view || "landing";

      setView(previousView);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  switch (view) {
    case "doctor":
      return <DoctorDashboard onNavigate={navigate} />;

    case "consultation":
      return (
        <Consultation
          onBack={() => navigate("doctor")}
          onContinue={() => navigate("care-plan")}
        />
      );

    case "care-plan":
      return (
        <PatientHome
          onNavigate={navigate}
        />
      );

    case "patient":
      return <PatientDashboard onNavigate={navigate} />;

    case "ask":
      return <AskCareRecall onBack={() => navigate("patient")} />;

    default:
      return <Landing onNavigate={navigate} />;
  }
}


// ============================================================
// SHARED LAYOUT
// ============================================================

function Page({ children }) {
  return (
    <div className="min-h-screen bg-[#FAFCFB] text-[#26342D]">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        {children}
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[#EAF0EC] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#2F7D5A] text-white">
            <Sparkles size={16} />
          </div>

          <span className="text-sm font-bold tracking-[-0.02em]">
            CareRecall
          </span>
        </div>

        <div className="hidden items-center gap-2 text-xs text-[#819089] sm:flex">
          <ShieldCheck size={14} />
          Your care, remembered.
        </div>
      </div>
    </header>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mb-8 flex items-center gap-2 text-sm font-medium text-[#718078] transition hover:text-[#2F7D5A]"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-[10px] font-bold tracking-[0.18em] text-[#629078]">
        {eyebrow}
      </p>

      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#26342D] sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-[#748078] sm:text-[15px]">
        {description}
      </p>
    </div>
  );
}


// ============================================================
// LANDING / HERO
// ============================================================

function Landing({ onNavigate }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#FAFCFB] text-[#26342D]">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
            {/* LEFT */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DDEBE3] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#4D8066] shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#65A07E]" />
                AI-powered care companion
              </div>

              <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[68px]">
                Your doctor's
                <br />
                instructions,
                <br />
                <span className="text-[#2F7D5A]">remembered.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-[#718078] sm:text-lg">
                CareRecall turns a doctor's consultation into a personal AI
                care assistant that patients can ask, hear, and rely on.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => onNavigate("doctor")}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#2F7D5A] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(47,125,90,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#286D4F]"
                >
                  <UserRound size={17} />
                  I'm a Doctor
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  onClick={() => onNavigate("patient")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#DCE7E1] bg-white px-6 py-3.5 text-sm font-semibold text-[#456354] transition duration-300 hover:-translate-y-0.5 hover:border-[#BDD3C6] hover:bg-[#F8FBF9]"
                >
                  <MessageCircle size={17} />
                  I'm a Patient
                </button>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#89948E]">
                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#5C9875]" />
                  Doctor verified
                </span>

                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#5C9875]" />
                  Voice enabled
                </span>

                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#5C9875]" />
                  English · Hindi · Punjabi
                </span>
              </div>
            </div>

            {/* RIGHT — HERO ILLUSTRATION */}
            <div className="relative mx-auto w-full max-w-[500px] lg:ml-auto">
              <div className="absolute -inset-5 rounded-[40px] bg-[#EAF5EE] opacity-60 blur-3xl" />

              {/* RIGHT — HERO ILLUSTRATION */}
              <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
                {/* soft background glow */}
                <div className="absolute -inset-8 rounded-full bg-[#E8F5ED] opacity-70 blur-3xl" />

                <div className="relative">
                  <img
                    src={heroImage}
                    alt="CareRecall doctor and patient illustration"
                    className="relative z-10 w-full object-contain drop-shadow-[0_25px_35px_rgba(35,60,47,0.10)]"
                  />

                  {/* floating AI card */}
                  <div className="absolute bottom-6 left-4 z-20 rounded-2xl border border-[#E3ECE6] bg-white/95 px-4 py-3 shadow-[0_12px_30px_rgba(35,60,47,0.10)] backdrop-blur-sm sm:left-0">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#EDF7F1] text-[#2F7D5A]">
                        <MessageCircle size={17} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-[#26342D]">
                          Ask CareRecall
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#7B8780]">
                          Your consultation, remembered.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIMPLE VALUE STRIP */}
        <section className="border-y border-[#EAF0EC] bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-[#EAF0EC] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
            <ValueItem
              icon={<Mic size={18} />}
              title="Doctor records"
              text="Capture the consultation once."
            />

            <ValueItem
              icon={<Sparkles size={18} />}
              title="CareRecall remembers"
              text="Turn it into a verified care plan."
            />

            <ValueItem
              icon={<MessageCircle size={18} />}
              title="Patient asks"
              text="Get answers whenever needed."
            />
          </div>
        </section>

        {/* BOTTOM MESSAGE */}
        <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <p className="text-[11px] font-bold tracking-[0.18em] text-[#6B957E]">
            REMEMBER · ASK · UNDERSTAND
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            The consultation ends.
            <br />
            <span className="text-[#2F7D5A]">
              The care doesn't.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#78847E]">
            Your doctor explains it once. CareRecall helps patients remember
            it, understand it, and act on it later.
          </p>
        </section>
      </main>
    </div>
  );
}

function ValueItem({ icon, title, text }) {
  return (
    <div className="flex items-center gap-4 px-2 py-6 sm:px-7 sm:py-7">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EDF7F1] text-[#2F7D5A]">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-[#87918B]">{text}</p>
      </div>
    </div>
  );
}


// ============================================================
// DOCTOR DASHBOARD
// ============================================================

function DoctorDashboard({ onNavigate }) {
  return (
    <Page>
      <PageHeading
        eyebrow="DOCTOR"
        title="Turn your consultation into care."
        description="Record a patient consultation and let CareRecall turn your instructions into a verified, patient-ready care plan."
      />

      <button
        onClick={() => onNavigate("consultation")}
        className="group relative w-full overflow-hidden rounded-[28px] border border-[#DCE8E1] bg-white p-7 text-left shadow-[0_15px_45px_rgba(35,60,47,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#BCD4C6] hover:shadow-[0_22px_55px_rgba(35,60,47,0.08)] sm:p-10"
      >
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#EDF7F1] opacity-60 blur-3xl" />

        <div className="relative">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EDF7F1] text-[#2F7D5A]">
            <Mic size={25} />
          </div>

          <h2 className="mt-7 text-2xl font-semibold tracking-[-0.03em]">
            New consultation
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-[#748078]">
            Record your consultation live or upload an existing recording.
            CareRecall will transcribe it and prepare a patient-ready care
            plan.
          </p>

          <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-[#2F7D5A]">
            Start consultation
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </button>

      <div className="mt-10">
        <p className="text-[10px] font-bold tracking-[0.16em] text-[#7A9687]">
          RECENT CONSULTATIONS
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[#E3EBE6] bg-white">
          <RecentConsultation name="Priya" time="Today" />
          <RecentConsultation name="Rahul" time="Yesterday" />
        </div>
      </div>
    </Page>
  );
}

function RecentConsultation({ name, time }) {
  return (
    <div className="flex items-center justify-between border-b border-[#EDF1EF] px-5 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[#EDF7F1] text-[#4F8068]">
          <UserRound size={16} />
        </div>

        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="mt-0.5 text-xs text-[#8A948F]">
            Consultation
          </p>
        </div>
      </div>

      <span className="text-xs text-[#9AA49F]">{time}</span>
    </div>
  );
}


// ============================================================
// CONSULTATION
// ============================================================

function Consultation({ onBack, onContinue }) {
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ---------------------------------------------------------
  // START RECORDING
  // ---------------------------------------------------------

  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const file = new File(
          [blob],
          "consultation.webm",
          {
            type: "audio/webm",
          }
        );

        setAudioFile(file);
        setAudioUrl(URL.createObjectURL(blob));

        stream
          .getTracks()
          .forEach((track) => track.stop());
      };

      recorder.start();

      setRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);

      alert(
        "Microphone access was denied. Please allow microphone access and try again."
      );
    }
  };

  // ---------------------------------------------------------
  // STOP RECORDING
  // ---------------------------------------------------------

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);
  };

  // ---------------------------------------------------------
  // UPLOAD AUDIO
  // ---------------------------------------------------------

  const handleUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setAudioFile(file);

    const url = URL.createObjectURL(file);

    setAudioUrl(url);
  };

  // ---------------------------------------------------------
  // PROCESS CONSULTATION
  // ---------------------------------------------------------

  const processConsultation = async () => {
    if (!audioFile) return;

    try {
      setProcessing(true);

      // STEP 1
      setStatus("Transcribing consultation...");

      const formData = new FormData();

      formData.append("audio", audioFile);

      const transcriptionResponse = await fetch(
        `${API_URL}/api/transcribe`,
        {
          method: "POST",
          body: formData,
        }
      );

      const transcriptionData =
        await transcriptionResponse.json();

      if (!transcriptionResponse.ok) {
        throw new Error(
          transcriptionData.error ||
            "Transcription failed."
        );
      }

      const transcript =
        transcriptionData.transcript;

      console.log(
        "TRANSCRIPT:",
        transcript
      );

      // STEP 2
      setStatus(
        "Understanding consultation..."
      );

      const carePlanResponse = await fetch(
        `${API_URL}/api/extract-care-plan`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            transcript,
          }),
        }
      );

      const carePlanData =
        await carePlanResponse.json();

      if (!carePlanResponse.ok) {
        throw new Error(
          carePlanData.error ||
            "Care plan extraction failed."
        );
      }

      console.log(
        "CARE PLAN:",
        carePlanData
      );

      // -----------------------------------------------------
      // SAVE FOR NEXT SCREEN
      // -----------------------------------------------------

      localStorage.setItem(
        "careRecallTranscript",
        transcript
      );

      localStorage.setItem(
        "careRecallCarePlan",
        JSON.stringify(carePlanData)
      );

      setStatus("Care plan ready.");

      // Small delay so user sees success state
      setTimeout(() => {
        onContinue();
      }, 400);

    } catch (error) {
      console.error(
        "Processing error:",
        error
      );

      setStatus("");

      alert(
        error.message ||
          "Something went wrong while processing the consultation."
      );
    } finally {
      setProcessing(false);
    }
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <Page>
      <BackButton onClick={onBack} />

      <PageHeading
        eyebrow="STEP 01 · DOCTOR"
        title="Add your consultation."
        description="Record your consultation live or upload an existing recording."
      />

      {!processing ? (
        <>
          {/* RECORD / UPLOAD */}

          <div className="grid gap-4 sm:grid-cols-2">

            {/* RECORD */}

            <button
              onClick={
                recording
                  ? stopRecording
                  : startRecording
              }
              className={`group rounded-[24px] border bg-white p-7 text-left transition-all duration-300 sm:p-8 ${
                recording
                  ? "border-[#DDAAAA] shadow-[0_15px_40px_rgba(150,70,70,0.06)]"
                  : "border-[#E2EAE6] hover:-translate-y-1 hover:border-[#C9DAD1] hover:shadow-[0_15px_40px_rgba(35,60,47,0.06)]"
              }`}
            >
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl ${
                  recording
                    ? "bg-[#FFF0F0] text-[#B45D5D]"
                    : "bg-[#EDF7F1] text-[#2F7D5A]"
                }`}
              >
                <Mic size={25} />
              </div>

              <h2 className="mt-7 text-lg font-semibold">
                {recording
                  ? "Recording..."
                  : "Record live"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7B8780]">
                {recording
                  ? "Tap to stop recording."
                  : "Record the doctor–patient conversation directly."}
              </p>

              <div className="mt-7 text-xs font-semibold text-[#4E856A]">
                {recording
                  ? "Stop recording"
                  : "Start recording →"}
              </div>
            </button>

            {/* UPLOAD */}

            <label className="group cursor-pointer rounded-[24px] border border-[#E2EAE6] bg-white p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#C9DAD1] hover:shadow-[0_15px_40px_rgba(35,60,47,0.06)] sm:p-8">

              <input
                type="file"
                accept="audio/*"
                onChange={handleUpload}
                className="hidden"
              />

              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F1F6F3] text-[#527C68]">
                <Upload size={25} />
              </div>

              <h2 className="mt-7 text-lg font-semibold">
                Upload recording
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7B8780]">
                Use an existing consultation recording.
              </p>

              <div className="mt-7 text-xs font-semibold text-[#4E856A]">
                MP3 · WAV · M4A · WEBM
              </div>
            </label>
          </div>

          {/* { DEMO } */}

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E5ECE8]" />

            <span className="text-xs text-[#9AA59F]">
              OR
            </span>

            <div className="h-px flex-1 bg-[#E5ECE8]" />
          </div>

          <button
            onClick={() => {
              localStorage.setItem(
                "careRecallTranscript",
                DEMO_TRANSCRIPT
              );

              localStorage.setItem(
                "careRecallCarePlan",
                JSON.stringify(DEMO_CARE_PLAN)
              );

              onContinue();
            }}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9E6DE] bg-[#F8FBF9] py-3.5 text-sm font-semibold text-[#397458] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F1F8F4]"
          >
            <Sparkles
              size={17}
              className="transition-transform duration-300 group-hover:rotate-12"
            />

            Try Demo Consultation
          </button>

          <p className="mt-2 text-center text-[11px] text-[#9AA59F]">
            Use a sample consultation without using API credits.
          </p>


          {/* AUDIO PREVIEW */}

          {audioFile && (
            <div className="mt-6 rounded-2xl border border-[#E2EAE6] bg-white p-5">

              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">

                  <p className="text-sm font-semibold">
                    Consultation recording
                  </p>

                  <p className="mt-1 truncate text-xs text-[#89948E]">
                    {audioFile.name}
                  </p>

                </div>

                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#EDF7F1]">
                  <Check
                    size={16}
                    className="text-[#4D936E]"
                  />
                </div>

              </div>

              {audioUrl && (
                <audio
                  controls
                  src={audioUrl}
                  className="mt-4 w-full"
                />
              )}
            </div>
          )}

          {/* CREATE CARE PLAN */}

          {audioFile && (
            <button
              onClick={processConsultation}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F7D5A] py-3.5 text-sm font-semibold text-white transition hover:bg-[#286D4F]"
            >
              Create care plan
              <ArrowRight size={16} />
            </button>
          )}
        </>
      ) : (
        /* PROCESSING */

        <div className="rounded-[28px] border border-[#E2EAE6] bg-white p-10 text-center shadow-[0_15px_45px_rgba(35,60,47,0.04)]">

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#EDF7F1] text-[#2F7D5A]">
            <Sparkles
              size={27}
              className="animate-pulse"
            />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            {status}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7B8780]">
            CareRecall is turning the consultation
            into a patient-ready care plan.
          </p>

          <div className="mx-auto mt-7 h-1.5 max-w-xs overflow-hidden rounded-full bg-[#EAF0EC]">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-[#5C9875]" />
          </div>

        </div>
      )}

      {/* TRUST MESSAGE */}

      <div className="mt-8 rounded-2xl border border-[#E4ECE7] bg-[#F8FBF9] p-5">
        <div className="flex gap-3">

          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[#5B9274]"
          />

          <p className="text-xs leading-5 text-[#718078]">
            CareRecall extracts information from the
            consultation. The doctor reviews and approves
            the care plan before it becomes available to
            the patient.
          </p>

        </div>
      </div>
    </Page>
  );
}


// ============================================================
// CARE PLAN
// ============================================================

function PatientHome({ onNavigate }) {
  const [carePlan, setCarePlan] = useState({
    medications: [],
    tests: [],
    appointments: [],
    instructions: [],
  });

  const [reminders, setReminders] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("careRecallReminders")
        ) || {}
      );
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem(
        "careRecallCarePlan"
      );

      if (storedPlan) {
        setCarePlan(JSON.parse(storedPlan));
      }
    } catch (error) {
      console.error(
        "Failed to load care plan:",
        error
      );
    }
  }, []);

  const setReminder = async (
    id,
    title,
    details
  ) => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      if (Notification.permission === "denied") {
        alert(
          "Please allow notifications in your browser settings."
        );
        return;
      }
    }

    const time = prompt(
      `When should CareRecall remind you about "${title}"?\n\nEnter time in 24-hour format, e.g. 20:00`
    );

    if (!time) return;

    const [hours, minutes] = time
      .split(":")
      .map(Number);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      alert(
        "Please enter a valid time like 20:00."
      );
      return;
    }

    const now = new Date();

    const reminderTime = new Date();
    reminderTime.setHours(
      hours,
      minutes,
      0,
      0
    );

    if (reminderTime <= now) {
      reminderTime.setDate(
        reminderTime.getDate() + 1
      );
    }

    const reminder = {
      id,
      title,
      details,
      time: reminderTime.getTime(),
    };

    const updated = {
      ...reminders,
      [id]: reminder,
    };

    setReminders(updated);

    localStorage.setItem(
      "careRecallReminders",
      JSON.stringify(updated)
    );

    const delay =
      reminderTime.getTime() - Date.now();

    setTimeout(() => {
      if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(
          "CareRecall Reminder",
          {
            body: `${title}: ${details}`,
          }
        );
      }

      setReminders((current) => {
        const copy = { ...current };

        delete copy[id];

        localStorage.setItem(
          "careRecallReminders",
          JSON.stringify(copy)
        );

        return copy;
      });
    }, delay);

    alert(
      `Reminder set for ${reminderTime.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`
    );
  };

  const reminderButton = (
    id,
    title,
    details
  ) => (
    <button
      type="button"
      onClick={() =>
        setReminder(
          id,
          title,
          details
        )
      }
      className={`mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
        reminders[id]
          ? "bg-[#EDF7F1] text-[#2F7D5A]"
          : "bg-[#2F7D5A] text-white hover:bg-[#286D4F]"
      }`}
    >
      {reminders[id]
        ? "Reminder set ✓"
        : "🔔 Remind me"}
    </button>
  );

  const hasMedication =
    carePlan.medications?.length > 0;

  const hasTests =
    carePlan.tests?.length > 0;

  const hasAppointments =
    carePlan.appointments?.length > 0;

  return (
    <Page>
      <PageHeading
        eyebrow="YOUR CARE"
        title="Your care, remembered."
        description="Here are the instructions your doctor asked you to remember."
      />

      <div className="space-y-4">

        {/* MEDICATIONS */}

        {hasMedication &&
          carePlan.medications.map(
            (medicine, index) => (
              <div
                key={`medicine-${index}`}
                className="rounded-[22px] border border-[#E2EAE6] bg-white p-5 shadow-[0_10px_30px_rgba(35,60,47,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(35,60,47,0.05)] sm:p-6"
              >
                <div className="flex gap-4">

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#EDF7F1] text-[#2F7D5A]">
                    <Pill size={21} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] font-semibold tracking-[0.18em] text-[#6C947F]">
                      MEDICATION
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-[#17231D]">
                      {medicine.name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#718078]">
                      {medicine.instructions}
                    </p>

                    {medicine.duration && (
                      <p className="mt-1 text-xs text-[#9AA59F]">
                        {medicine.duration}
                      </p>
                    )}

                    {reminderButton(
                      `med-${index}`,
                      medicine.name,
                      medicine.instructions
                    )}

                  </div>
                </div>
              </div>
            )
          )}

        {/* TESTS */}

        {hasTests &&
          carePlan.tests.map(
            (test, index) => (
              <div
                key={`test-${index}`}
                className="rounded-[22px] border border-[#E2EAE6] bg-white p-5 shadow-[0_10px_30px_rgba(35,60,47,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(35,60,47,0.05)] sm:p-6"
              >
                <div className="flex gap-4">

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F1F6F3] text-[#527C68]">
                    <FlaskConical size={21} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] font-semibold tracking-[0.18em] text-[#6C947F]">
                      TEST
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      {test.name}
                    </h2>

                    <p className="mt-2 text-sm text-[#718078]">
                      {[test.date, test.time]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    {reminderButton(
                      `test-${index}`,
                      test.name,
                      `${test.date || ""} ${
                        test.time || ""
                      }`.trim()
                    )}

                  </div>
                </div>
              </div>
            )
          )}

        {/* APPOINTMENTS */}

        {hasAppointments &&
          carePlan.appointments.map(
            (appointment, index) => (
              <div
                key={`appointment-${index}`}
                className="rounded-[22px] border border-[#E2EAE6] bg-white p-5 shadow-[0_10px_30px_rgba(35,60,47,0.025)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(35,60,47,0.05)] sm:p-6"
              >
                <div className="flex gap-4">

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F1F6F3] text-[#527C68]">
                    <CalendarDays size={21} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] font-semibold tracking-[0.18em] text-[#6C947F]">
                      FOLLOW-UP
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      {appointment.description}
                    </h2>

                    <p className="mt-2 text-sm text-[#718078]">
                      {[
                        appointment.date,
                        appointment.time,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>

                    {reminderButton(
                      `appointment-${index}`,
                      appointment.description,
                      `${appointment.date || ""} ${
                        appointment.time || ""
                      }`.trim()
                    )}

                  </div>
                </div>
              </div>
            )
          )}

      </div>

      {/* ASK CARE RECALL */}

      <button
        type="button"
        onClick={() =>
          onNavigate("ask")
        }
        className="group mt-8 w-full rounded-[24px] border border-[#DCEAE2] bg-[#F3F9F5] p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EDF7F1] hover:shadow-[0_15px_35px_rgba(35,60,47,0.06)] sm:p-6"
      >
        <div className="flex items-center gap-4">

          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#2F7D5A] shadow-sm">
            <MessageCircle size={21} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#6C947F]">
              HAVE A QUESTION?
            </p>

            <h2 className="mt-1 text-base font-semibold">
              Ask CareRecall
            </h2>

            <p className="mt-1 text-sm text-[#718078]">
              Ask what your doctor said about your care.
            </p>

          </div>

          <ArrowRight
            size={19}
            className="shrink-0 text-[#4C8B6B] transition-transform duration-300 group-hover:translate-x-1"
          />

        </div>
      </button>

      {/* TRUST */}

      <div className="mt-6 flex items-start gap-2 px-1 text-xs leading-5 text-[#8A958F]">
        <ShieldCheck
          size={15}
          className="mt-0.5 shrink-0 text-[#6A987F]"
        />

        Answers are based on your doctor's consultation.
      </div>

    </Page>
  );
}

function PlanItem({ icon, label, title, detail }) {
  return (
    <div className="flex gap-4 border-b border-[#EDF1EF] p-5 last:border-0 sm:p-6">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EDF7F1] text-[#2F7D5A]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold tracking-[0.16em] text-[#789688]">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#7E8983]">
          {detail}
        </p>
      </div>

      <button className="ml-auto self-center text-xs font-semibold text-[#5D806D]">
        Edit
      </button>
    </div>
  );
}


// ============================================================
// PATIENT DASHBOARD
// ============================================================

function PatientDashboard({ onNavigate }) {
  const [carePlan, setCarePlan] = useState({
    medications: [],
    tests: [],
    appointments: [],
  });

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem(
        "careRecallCarePlan"
      );

      if (storedPlan) {
        setCarePlan(JSON.parse(storedPlan));
      }
    } catch (error) {
      console.error("Failed to load care plan:", error);
    }
  }, []);

  return (
    <Page>
      <PageHeading
        eyebrow="YOUR CARE"
        title="Your doctor's instructions, remembered."
        description="Ask CareRecall about your consultation whenever you need it."
      />

      {/* ASK HERO */}
      <button
        onClick={() => onNavigate("ask")}
        className="group relative w-full overflow-hidden rounded-[26px] bg-[#2F7D5A] p-6 text-left text-white shadow-[0_15px_40px_rgba(47,125,90,0.15)] transition hover:-translate-y-1 hover:bg-[#286D4F] sm:p-8"
      >
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={17} />

              <span className="text-[10px] font-bold tracking-[0.16em] text-white/70">
                CARE RECALL
              </span>
            </div>

            <h2 className="mt-4 text-xl font-semibold sm:text-2xl">
              Ask about your consultation
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/70">
              Ask what your doctor said, when to take your medicine, or what
              you need to do next.
            </p>
          </div>

          <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15 sm:grid">
            <ArrowRight size={21} />
          </div>
        </div>
      </button>

      {/* CARE */}
      <div className="mt-10">
        <p className="text-[10px] font-bold tracking-[0.16em] text-[#7A9687]">
          YOUR CARE PLAN
        </p>

        <div className="mt-4 space-y-3">

          {/* MEDICATIONS */}
          {carePlan.medications?.map((medicine, index) => {
            const detail = [
              medicine.instructions,
              medicine.frequency,
              medicine.duration,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <CareItem
                key={`medicine-${index}`}
                icon={<Pill size={19} />}
                title={
                  medicine.dosage
                    ? `${medicine.name} ${medicine.dosage}`
                    : medicine.name
                }
                detail={detail}
                time={medicine.time}
              />
            );
          })}

          {/* TESTS */}
          {carePlan.tests?.map((test, index) => (
            <CareItem
              key={`test-${index}`}
              icon={<FlaskConical size={19} />}
              title={test.name || "Medical test"}
              detail={[test.date, test.time]
                .filter(Boolean)
                .join(" · ")}
            />
          ))}

          {/* APPOINTMENTS */}
          {carePlan.appointments?.map((appointment, index) => (
            <CareItem
              key={`appointment-${index}`}
              icon={<CalendarDays size={19} />}
              title={
                appointment.description ||
                "Doctor follow-up"
              }
              detail={[
                appointment.date,
                appointment.time,
              ]
                .filter(Boolean)
                .join(" · ")}
            />
          ))}

          {/* EMPTY STATE */}
          {!carePlan.medications?.length &&
            !carePlan.tests?.length &&
            !carePlan.appointments?.length && (
              <div className="rounded-2xl border border-dashed border-[#DCE7E1] bg-[#FBFDFC] p-6 text-center">
                <p className="text-sm font-medium text-[#536159]">
                  No care instructions found.
                </p>

                <p className="mt-1 text-xs text-[#89948E]">
                  Your approved consultation will appear here.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* LANGUAGE */}
      <div className="mt-10 rounded-2xl border border-[#E3EBE6] bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">
              Preferred language
            </p>

            <p className="mt-1 text-xs text-[#89948E]">
              CareRecall can respond in your language.
            </p>
          </div>

          <select className="rounded-xl border border-[#DCE7E1] bg-white px-3 py-2 text-xs font-semibold text-[#536159] outline-none">
            <option>English</option>
            <option>हिंदी</option>
            <option>ਪੰਜਾਬੀ</option>
          </select>
        </div>
      </div>
    </Page>
  );
}

function CareItem({ icon, title, detail, time }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#E3EBE6] bg-white p-5">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EDF7F1] text-[#2F7D5A]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#7F8B84]">
          {detail}
        </p>
      </div>

      {time && (
        <span className="shrink-0 text-xs font-semibold text-[#5C7567]">
          {time}
        </span>
      )}
    </div>
  );
}




// ============================================================
// ASK CARE RECALL
// ============================================================

function AskCareRecall({ onBack }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");

  const [ragReady, setRagReady] = useState(false);
  const [ragLoading, setRagLoading] = useState(true);

  // -------------------------------------------------------
  // BUILD RAG FROM CURRENT CONSULTATION
  // -------------------------------------------------------

  useEffect(() => {
    const buildRAG = async () => {
      try {
        const transcript =
          localStorage.getItem("careRecallTranscript");

        const storedCarePlan =
          localStorage.getItem("careRecallCarePlan");

        const carePlan = storedCarePlan
          ? JSON.parse(storedCarePlan)
          : null;

        if (!transcript) {
          console.error("No consultation transcript found.");
          setRagLoading(false);
          return;
        }

        const response = await fetch(
          `${API_URL}/api/build-rag`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              transcript,
              care_plan: carePlan,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to build RAG"
          );
        }

        setRagReady(true);

      } catch (error) {
        console.error("RAG ERROR:", error);
      } finally {
        setRagLoading(false);
      }
    };

    buildRAG();
  }, []);

  // -------------------------------------------------------
  // ASK CARE RECALL
  // -------------------------------------------------------

  const askQuestion = async (text = question) => {
    const finalQuestion = text.trim();

    if (!finalQuestion || !ragReady) return;

    setQuestion(finalQuestion);
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        `${API_URL}/api/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: finalQuestion,
            language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get answer"
        );
      }

      setAnswer(data.answer);

    } catch (error) {
      console.error("ASK ERROR:", error);

      setAnswer(
        "Sorry, I couldn't process your question right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <BackButton onClick={onBack} />

      <PageHeading
        eyebrow="CARE RECALL"
        title="Ask about your consultation."
        description="Ask what your doctor said in simple, clear language."
      />

      {/* RAG STATUS */}

      {ragLoading && (
        <div className="mb-6 rounded-2xl border border-[#E2EAE6] bg-[#F7FBF8] p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#2F7D5A]" />

            <p className="text-sm text-[#718078]">
              Preparing your consultation...
            </p>
          </div>
        </div>
      )}

      {/* LANGUAGE */}

      <div className="mb-6 flex justify-end">
        <select
          value={language}
          onChange={(e) =>
            setLanguage(e.target.value)
          }
          className="rounded-xl border border-[#DCE7E1] bg-white px-3 py-2 text-xs font-semibold text-[#536159] outline-none"
        >
          <option value="English">
            English
          </option>

          <option value="Hindi">
            हिंदी
          </option>

          <option value="Punjabi">
            ਪੰਜਾਬੀ
          </option>
        </select>
      </div>

      {/* QUESTION */}

      <div className="rounded-[24px] border border-[#E2EAE6] bg-white p-4 shadow-[0_12px_35px_rgba(35,60,47,0.035)]">

        <textarea
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              askQuestion();
            }
          }}
          placeholder={
            ragReady
              ? "Ask something about your consultation..."
              : "Preparing your consultation..."
          }
          disabled={!ragReady}
          rows={3}
          className="w-full resize-none bg-transparent text-sm leading-6 text-[#25332B] outline-none placeholder:text-[#A0AAA5] disabled:cursor-not-allowed"
        />

        <div className="mt-3 flex justify-end">
          <button
            onClick={() => askQuestion()}
            disabled={
              loading ||
              !ragReady ||
              !question.trim()
            }
            className="rounded-xl bg-[#2F7D5A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#286D4F] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading
              ? "Thinking..."
              : "Ask CareRecall"}
          </button>
        </div>
      </div>

      {/* SUGGESTIONS */}

      {!answer &&
        !loading &&
        ragReady && (
          <div className="mt-8">

            <p className="mb-3 text-[10px] font-bold tracking-[0.16em] text-[#7A9687]">
              TRY ASKING
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "What did my doctor ask me to do?",
                "When should I take my medicine?",
                "Do I need any tests?",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    askQuestion(item)
                  }
                  className="rounded-full border border-[#DCE7E1] bg-white px-4 py-2.5 text-xs text-[#536159] transition hover:border-[#AFCDBD] hover:bg-[#F5FAF7]"
                >
                  {item}
                </button>
              ))}
            </div>

          </div>
        )}

      {/* LOADING */}

      {loading && (
        <div className="mt-8 rounded-[24px] bg-[#F3F9F5] p-6">

          <div className="flex items-center gap-3">

            <div className="h-2 w-2 animate-pulse rounded-full bg-[#2F7D5A]" />

            <p className="text-sm text-[#718078]">
              Looking through your consultation...
            </p>

          </div>

        </div>
      )}

      {/* ANSWER */}

      {answer && !loading && (
        <div className="mt-8 rounded-[24px] border border-[#DCEAE2] bg-[#F3F9F5] p-6">

          <div className="flex items-center gap-2">

            <Sparkles
              size={16}
              className="text-[#2F7D5A]"
            />

            <span className="text-[10px] font-bold tracking-[0.16em] text-[#6C947F]">
              CARE RECALL
            </span>

          </div>

          <p className="mt-4 text-[15px] leading-7 text-[#26342C]">
            {answer}
          </p>

          <div className="mt-5 flex items-center gap-2 border-t border-[#DCEAE2] pt-4 text-xs text-[#7A8A81]">

            <ShieldCheck
              size={14}
              className="text-[#5C9875]"
            />

            Based on your doctor's consultation

          </div>

        </div>
      )}

    </Page>
  );
}


export default App;