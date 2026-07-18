import React from 'react';

export function SectionShell({ id, title, children }) {
  return (
    <section
      id={id}
      className="w-full py-10 sm:py-14 scroll-mt-24"
      aria-label={title}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

