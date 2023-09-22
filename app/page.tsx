'use client';
import { useEffect } from 'react';
import { Metadata } from 'next';
import ECommerce from '@/components/Dashboard/E-commerce';

export const metadata: Metadata = {
  title: 'TailAdmin | Next.js E-commerce Dashboard Template',
  description: 'This is Home Blog page for TailAdmin Next.js',
  // other metadata
};

export default function Home() {
  useEffect(() => {
    console.log(localStorage.getItem('user'));
  }, []);
  return (
    <>
      <ECommerce />
    </>
  );
}
