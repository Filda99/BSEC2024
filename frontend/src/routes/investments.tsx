import { createFileRoute } from '@tanstack/react-router';

const Investments = () => {
  return <div className="border">Investments</div>;
};

export const Route = createFileRoute('/investments')({
  component: Investments,
});
