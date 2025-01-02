"use client";

import { Explorer } from "@/components/explorer";
import { useExplorer } from "@/components/explorer/providers";
import { TitleBar } from "@/components/title-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function Page() {

  const { open } = useExplorer();

  return (
    <main className="flex flex-col h-screen w-screen divide-y">
      <TitleBar />
      <ResizablePanelGroup direction="horizontal" className="grow">
        {
          open && (<>
            <ResizablePanel defaultSize={25}>
              <Explorer />
            </ResizablePanel>
            <ResizableHandle />
          </>)
        }
        <ResizablePanel defaultSize={75}>

        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}