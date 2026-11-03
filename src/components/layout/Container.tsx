import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  className = '',
  as: Component = 'div',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Section({
  children,
  className = '',
  id,
  containerClassName = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
  [key: string]: unknown;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 lg:py-32 w-full ${className}`} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
