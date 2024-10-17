'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Filter() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const activeFilter = searchParams.get('capacity') ?? 'all';

  function handleClick(filter) {
    const params = new URLSearchParams(searchParams);
    params.set('capacity', filter);
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  }
  return (
    <div className="border border-primary-800 flex">
      <Button
        handleFilter={handleClick}
        filter={'all'}
        activeFilter={activeFilter}
      >
        All cabins
      </Button>
      <Button
        handleFilter={handleClick}
        filter={'small'}
        activeFilter={activeFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        handleFilter={handleClick}
        filter={'medium'}
        activeFilter={activeFilter}
      >
        4&mdash;7 guests
      </Button>
      <Button
        handleFilter={handleClick}
        filter={'large'}
        activeFilter={activeFilter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

export default Filter;

function Button({ children, handleFilter, filter, activeFilter }) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        activeFilter === filter ? 'bg-primary-700 text-primary-50' : ''
      } `}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}
