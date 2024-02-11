import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

export function NewNoteCard() {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [content, setContent] = useState("");

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleContentChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    if (e.target.value === "") {
      setShouldShowOnBoarding(true);
    }
  }

  function handleSubmitNote(e) {
    e.preventDefault();
    console.log(content);
    toast.success("Nota criada com sucesso!");
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
          <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[720px] w-full h-[70vh] bg-slate-700 rounded-md flex flex-col outline-none">
            <Dialog.DialogClose className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 rounded-md hover:text-slate-100">
              <X className="w-5 h-5" />
            </Dialog.DialogClose>
            <form className="flex-1 flex flex-col" onSubmit={handleSubmitNote}>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nota
                </span>

                {shouldShowOnBoarding ? (
                  <p className="text-sm leading-6 text-slate-400">
                    Comece{" "}
                    <button className="font-medium text-lime-400 hover:underline hover:">
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
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota ?
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.DialogPortal>
    </Dialog.Root>
  );
}
