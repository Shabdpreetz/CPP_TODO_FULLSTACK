import { LiquidBackground } from "@/components/LiquidBackground";
import { LiquidGlassDefs } from "@/components/LiquidGlassDefs";
import { TodoApp } from "@/components/TodoApp";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
      <LiquidGlassDefs />
      <LiquidBackground />
      <TodoApp />
    </main>
  );
}
