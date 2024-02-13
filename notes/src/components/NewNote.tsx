import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [content, setContent] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    if (e.target.value === "") {
      setShouldShowOnBoarding(true);
    }
  }

  function handleSaveNote() {
    if (content === "") {
      return;
    }
    onNoteCreated(content);
    setContent("");
    setShouldShowOnBoarding(true);
    toast.success("Nota criada com sucesso!");
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta a API de gravação!");
      return;
    }

    setIsRecording(true);
    setShouldShowOnBoarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    let previousTranscription = "";

    speechRecognition.onresult = (e) => {
      let transcription = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcription += e.results[i][0].transcript;
      }

      // Verifica se há uma alteração no conteúdo antes de atualizar
      if (transcription.trim() !== previousTranscription.trim()) {
        setContent(transcription);
        previousTranscription = transcription;
      }
    };

    speechRecognition.onerror = (e) => {
      console.error(e);
    };
    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);
    if (speechRecognition != null) {
      speechRecognition.stop();
    }
  }
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="rounded-md flex
      flex-col text-left bg-slate-700 p-5 gap-y-3  outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 "
      >
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>

        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.DialogPortal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50">
          <Dialog.Content className="fixed overflow-hidden inset-0  md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[720px] w-full md:h-[70vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
            <Dialog.DialogClose className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 md:rounded-md hover:text-slate-100">
              <X className="md:w-5 md:h-5" />
            </Dialog.DialogClose>
            <form className="flex-1 flex flex-col">
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>

                {shouldShowOnBoarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                    Comece{" "}
                    <button
                      className="font-medium text-lime-400 hover:underline hover:"
                      type="button"
                      onClick={handleStartRecording}
                    >
                      gravando uma nota
                    </button>{" "}
                    em áudio ou se preferir{" "}
                    <button
                      onClick={handleStartEditor}
                      className="font-medium text-lime-400 hover:underline hover:"
                    >
                      utilize apenas texto.
                    </button>{" "}
                  </p>
                ) : (
                  <textarea
                    autoFocus
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    onChange={handleContentChange}
                    value={content}
                  />
                )}
              </div>
              {isRecording ? (
                <button
                  type="button"
                  className="w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 flex items-center justify-center gap-2 "
                  onClick={handleStopRecording}
                >
                  <div className="size-3 bg-red-500 rounded-full animate-pulse" />
                  Gravando!(Clique p/ interromper)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                >
                  Salvar nota ?
                </button>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.DialogPortal>
    </Dialog.Root>
  );
}
