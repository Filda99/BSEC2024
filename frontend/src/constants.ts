import { SelectItem } from './components/Select';

export const INCOME_TYPE_OPTIONS: SelectItem[] = [
  { id: 0, name: 'Salary' },
  { id: 1, name: 'Gift' },
  { id: 2, name: 'Other' },
];

export const INVESTMENT_TYPE_OPTIONS: SelectItem[] = [
  { id: 0, name: 'Stocks' },
  { id: 1, name: 'Bonds' },
  { id: 2, name: 'ETFS' },
  { id: 3, name: 'Crypto' },
];

export const EXPENSE_TYPE_OPTIONS: SelectItem[] = [
  { id: 0, name: 'Food' },
  { id: 1, name: 'Hobbies' },
  { id: 2, name: 'Rent' },
  { id: 3, name: 'Bitches and alcohol' },
  { id: 4, name: 'Other' },
];

export const FREQUENCY_OPTIONS: SelectItem[] = [
  { id: 0, name: 'Daily' },
  { id: 1, name: 'Weekly' },
  { id: 2, name: 'Monthly' },
  { id: 3, name: 'Yearly' },
];

export const ONE_TIME_OPTIONS: SelectItem[] = [
  { id: 0, name: 'Periodically' },
  { id: 1, name: 'One time' },
];
