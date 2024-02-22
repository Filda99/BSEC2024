import { createFileRoute } from '@tanstack/react-router';

const Expenses = () => {
  return <div>Expenses</div>;
};

export const Route = createFileRoute('/expenses')({
  component: Expenses,
});
