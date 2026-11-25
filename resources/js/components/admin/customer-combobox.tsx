import { cn } from '@/lib/utils';
import { Combobox, Transition } from '@headlessui/react';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    purok?: string | null;
    meter_number?: string;
}

// Cap the number of suggestions shown so the dropdown stays fast and focused
// even when the system has hundreds or thousands of customers.
const MAX_SUGGESTIONS = 8;

function customerMatchesQuery(c: Customer, q: string): boolean {
    const first = c.first_name.toLowerCase();
    const last = c.last_name.toLowerCase();
    const meter = (c.meter_number ?? '').toLowerCase();
    const purok = (c.purok ?? '').toLowerCase();
    return (
        first.includes(q) ||
        last.includes(q) ||
        `${first} ${last}`.includes(q) ||
        `${last} ${first}`.includes(q) ||
        meter.includes(q) ||
        purok.includes(q)
    );
}

function customerRank(c: Customer, q: string): number {
    // Prefer customers whose name starts with the typed query.
    return c.first_name.toLowerCase().startsWith(q) || c.last_name.toLowerCase().startsWith(q) ? 0 : 1;
}

export default function CustomerCombobox({
    customers,
    value,
    onChange,
    nullable = true,
    withIcon = false,
    placeholder = 'Search by customer name',
}: {
    customers: Customer[];
    value: Customer | null;
    onChange: (customer: Customer | null) => void;
    nullable?: boolean;
    // Filter-style variant: renders a leading icon and colors the chevron to
    // match the other filter fields (create/edit forms keep the plain look).
    withIcon?: boolean;
    placeholder?: string;
}) {
    const [query, setQuery] = useState('');

    // Search only activates once the user types — never dumps the full list on
    // focus — and returns at most MAX_SUGGESTIONS best-matching customers.
    const matches = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return customers.filter((c) => customerMatchesQuery(c, q)).sort((a, b) => customerRank(a, q) - customerRank(b, q));
    }, [customers, query]);

    const filteredCustomers = matches.slice(0, MAX_SUGGESTIONS);
    const totalMatches = matches.length;

    const handleChange = (customer: Customer | null) => {
        // Reset the search box after every selection, like the original form.
        setQuery('');
        onChange(customer);
    };

    return (
        <Combobox value={value} onChange={handleChange} nullable={nullable}>
            {({ open }) => (
                <div className="relative">
                    {withIcon && (
                        <User aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-sky-700" />
                    )}
                    <Combobox.Input
                        id="customer-search"
                        onChange={(e) => setQuery(e.target.value)}
                        displayValue={(c: Customer | null) => (c ? `${c.first_name} ${c.last_name}` : '')}
                        placeholder={placeholder}
                        autoComplete="off"
                        className={cn(
                            'w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20',
                            withIcon ? 'pl-9' : 'pl-3.5',
                        )}
                    />
                    <Combobox.Button
                        aria-label="Toggle customer suggestions"
                        className={`absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 transition-colors ${withIcon ? 'text-slate-900' : 'text-slate-400 hover:text-sky-700'}`}
                    >
                        <ChevronsUpDown className="h-4 w-4" />
                    </Combobox.Button>

                    <Transition
                        show={open}
                        as="div"
                        className="absolute z-50 mt-2 w-full"
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                            {!query.trim() ? (
                                <div role="status" className="px-3.5 py-3 text-sm text-slate-400">
                                    Start typing to find a customer
                                </div>
                            ) : filteredCustomers.length === 0 ? (
                                <div role="status" className="px-3.5 py-3 text-sm text-slate-400">
                                    No customers found matching “{query.trim()}”.
                                </div>
                            ) : (
                                <>
                                    <Combobox.Options static className="max-h-64 overflow-auto py-1">
                                        {filteredCustomers.map((c) => (
                                            <Combobox.Option
                                                key={c.id}
                                                value={c}
                                                className={({ focus }) =>
                                                    cn(
                                                        'flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-sm select-none',
                                                        focus ? 'bg-sky-50' : '',
                                                    )
                                                }
                                            >
                                                {({ selected, focus }) => (
                                                    <>
                                                        <span
                                                            className={cn(
                                                                'truncate font-semibold',
                                                                selected ? 'text-sky-700' : focus ? 'text-sky-900' : 'text-slate-900',
                                                            )}
                                                        >
                                                            {c.first_name} {c.last_name}
                                                        </span>
                                                        {selected && <Check className="h-4 w-4 shrink-0 text-sky-700" />}
                                                    </>
                                                )}
                                            </Combobox.Option>
                                        ))}
                                    </Combobox.Options>
                                    {totalMatches > MAX_SUGGESTIONS && (
                                        <div className="border-t border-slate-100 px-3.5 py-2 text-[11px] text-slate-400">
                                            Showing {MAX_SUGGESTIONS} of {totalMatches} matches — keep typing to narrow results.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Transition>
                </div>
            )}
        </Combobox>
    );
}
