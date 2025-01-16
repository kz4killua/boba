"use client";

import dynamic from 'next/dynamic';

import { Explorer } from "@/components/explorer";
import { useExplorer } from "@/providers/explorer-provider";
import { useNotebooks } from '@/providers/notebooks-provider';
import { TitleBar } from "@/components/title-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { EditorTabs } from "@/components/editor-tabs";

// The editor (monaco) depends on the window object, so we need to load it dynamically
const Editor = dynamic(() => 
  import('@/components/editor').then(mod => mod.Editor), { ssr: false }
);

export default function Page() {

  const { open } = useExplorer();
  const { active } = useNotebooks();

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
          {active && <Editor />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}