import { useParams } from "react-router";

// Placeholder markup: replaced by Sanity-driven project content in the content phase.
export default function Project() {
  const { slug } = useParams();

  return (
    <main className="p-8">
      <h1 className="text-2xl">Project: {slug}</h1>
    </main>
  );
}
