"use client";

import dynamic from 'next/dynamic';

import { Explorer } from "@/components/explorer";
import { useExplorer } from "@/providers/explorer-provider";
import { useNotebooks } from '@/providers/notebooks-provider';
import { TitleBar } from "@/components/title-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { EditorTabs } from "@/components/editor-tabs";

const EditorLoader = () => {
  // NOTE: If changing the width of the loader, update the animation keyframes in tailwind.config.ts
  return (
    <div className="px-3">
      <div className="relative w-full h-px overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-primary animate-editor-loader-slide"></div>
      </div>
    </div>
  );
}

// The editor (monaco) depends on the window object, so we need to load it dynamically
const Editor = dynamic(() => 
  import('@/components/editor').then(mod => mod.Editor), { 
    ssr: false, loading: EditorLoader
  }
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
        <ResizablePanel className="flex flex-col grow" defaultSize={75}>
          <EditorTabs />
          {
            active && <Editor />
          }
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}