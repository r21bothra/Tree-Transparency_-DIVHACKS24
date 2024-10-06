import GuardedPage from "@/components/GuardedPage";
import Header from "@/components/Header";

export default function Dashboard() {
  return (
    <GuardedPage>
      <Header title={"Dashboard"} />
    </GuardedPage>
  );
}
