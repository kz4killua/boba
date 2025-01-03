"use client";

import { Explorer } from "@/components/explorer";
import { useExplorer } from "@/providers/explorer-provider";
import { TitleBar } from "@/components/title-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { EditorTabs } from "@/components/editor-tabs";

export default function Page() {

  const { open } = useExplorer();

  return (
    <main className="flex flex-col h-screen w-screen divide-y">
      <TitleBar />
      <ResizablePanelGroup direction="horizontal" className="flex grow">
        {
          open && (<>
            <ResizablePanel className="flex grow" defaultSize={25}>
              <Explorer />
            </ResizablePanel>
            <ResizableHandle />
          </>)
        }
        <ResizablePanel defaultSize={75}>
          <EditorTabs />
          
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}