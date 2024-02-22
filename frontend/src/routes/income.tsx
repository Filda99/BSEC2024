import { createFileRoute } from '@tanstack/react-router';

const Income = () => {
  return <div>Income</div>;
};

export const Route = createFileRoute('/income')({
  component: () => Income,
});
