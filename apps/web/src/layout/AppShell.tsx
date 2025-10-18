import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <TopBar />
      <div style={{ display: "flex", minHeight: 0, flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 16, overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
