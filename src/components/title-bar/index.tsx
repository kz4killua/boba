import { Logo } from "@/components/ui/logo";


export function TitleBar() {
  return (
    <header className="bg-background flex flex-row items-center p-3 gap-3 font-medium">
      <Logo size={20} /> 
      Boba
    </header>
  );
}